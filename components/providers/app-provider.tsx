"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";

import {
  createRequestNumber,
  DEFAULT_PRIORITY,
  DEFAULT_STATUS,
  getActiveServices,
  getExecutors,
  getRequestById,
  getUserWithTenant,
  getVisibleBilling,
  getVisibleContracts,
  getVisibleNotifications,
  getVisibleRequests,
  loadPersistedStore,
  loadSessionUserId,
  makeEntityId,
  makeRequestId,
  nowIso,
  savePersistedStore,
  saveSessionUserId,
  seedStore
} from "@/lib/demo-store";
import { DemoStore, RequestPriority, RequestStatus, UserRole } from "@/lib/types";

type LoginPayload = {
  email: string;
  password: string;
};

type CreateRequestPayload = {
  tenantId?: string;
  title: string;
  category: string;
  location: string;
  description: string;
  priority: RequestPriority;
  source?: string;
};

type AppContextValue = {
  ready: boolean;
  store: DemoStore;
  currentUser: ReturnType<typeof getUserWithTenant>;
  login: (payload: LoginPayload) => boolean;
  logout: () => void;
  createRequest: (payload: CreateRequestPayload) => string | null;
  addComment: (requestId: string, body: string) => void;
  assignExecutor: (requestId: string, executorId: string) => void;
  changeStatus: (requestId: string, status: RequestStatus, comment: string) => void;
  importEmail: (emailImportId: string, executorId?: string) => string | null;
  getRequest: (id: string) => ReturnType<typeof getRequestById>;
  getVisibleRequests: () => ReturnType<typeof getVisibleRequests>;
  getContracts: () => ReturnType<typeof getVisibleContracts>;
  getBilling: () => ReturnType<typeof getVisibleBilling>;
  getNotifications: () => ReturnType<typeof getVisibleNotifications>;
  getServices: () => ReturnType<typeof getActiveServices>;
  getExecutors: () => ReturnType<typeof getExecutors>;
  downloadContract: (contractId: string) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<DemoStore>(seedStore);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setStore(loadPersistedStore());
    setCurrentUserId(loadSessionUserId());
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) {
      savePersistedStore(store);
    }
  }, [ready, store]);

  useEffect(() => {
    if (ready) {
      saveSessionUserId(currentUserId);
    }
  }, [ready, currentUserId]);

  const currentUser = useMemo(() => getUserWithTenant(store, currentUserId), [store, currentUserId]);

  const value = useMemo<AppContextValue>(() => {
    function login({ email, password }: LoginPayload) {
      const user = store.users.find((item) => item.email === email && item.password === password);
      if (!user) {
        return false;
      }

      setCurrentUserId(user.id);
      return true;
    }

    function logout() {
      setCurrentUserId(null);
    }

    function createRequest(payload: CreateRequestPayload) {
      if (!currentUser) {
        return null;
      }

      const createdAt = nowIso();
      const requestId = makeRequestId();
      const tenantId = currentUser.role === UserRole.ADMIN ? payload.tenantId ?? currentUser.tenantId : currentUser.tenantId;

      if (!tenantId) {
        return null;
      }

      const request = {
        id: requestId,
        number: createRequestNumber(store),
        tenantId,
        createdById: currentUser.id,
        executorId: null,
        title: payload.title,
        description: payload.description,
        location: payload.location,
        category: payload.category,
        priority: payload.priority ?? DEFAULT_PRIORITY,
        status: DEFAULT_STATUS,
        source: payload.source ?? (currentUser.role === UserRole.ADMIN ? "reception" : "portal"),
        emailFrom: null,
        emailSubject: null,
        createdAt,
        updatedAt: createdAt
      };

      const history = {
        id: makeEntityId("history"),
        requestId,
        actorId: currentUser.id,
        action: currentUser.role === UserRole.ADMIN ? "created_for_tenant" : "created",
        fromStatus: null,
        toStatus: RequestStatus.NEW,
        comment:
          currentUser.role === UserRole.ADMIN
            ? "Создано сотрудником ресепшн от имени арендатора."
            : "Заявка создана через портал арендатора.",
        createdAt
      };

      setStore((prev) => ({
        ...prev,
        serviceRequests: [...prev.serviceRequests, request],
        requestHistory: [...prev.requestHistory, history]
      }));

      return requestId;
    }

    function addComment(requestId: string, body: string) {
      if (!currentUser || !body.trim()) {
        return;
      }

      const createdAt = nowIso();
      const text = body.trim();
      setStore((prev) => ({
        ...prev,
        requestComments: [
          ...prev.requestComments,
          {
            id: makeEntityId("comment"),
            requestId,
            authorId: currentUser.id,
            body: text,
            createdAt
          }
        ],
        requestHistory: [
          ...prev.requestHistory,
          {
            id: makeEntityId("history"),
            requestId,
            actorId: currentUser.id,
            action: "comment_added",
            fromStatus: null,
            toStatus: null,
            comment: text,
            createdAt
          }
        ],
        serviceRequests: prev.serviceRequests.map((item) =>
          item.id === requestId ? { ...item, updatedAt: createdAt } : item
        )
      }));
    }

    function assignExecutor(requestId: string, executorId: string) {
      if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        return;
      }

      const createdAt = nowIso();
      const executor = store.users.find((item) => item.id === executorId);
      setStore((prev) => ({
        ...prev,
        serviceRequests: prev.serviceRequests.map((item) =>
          item.id === requestId ? { ...item, executorId, updatedAt: createdAt } : item
        ),
        requestHistory: [
          ...prev.requestHistory,
          {
            id: makeEntityId("history"),
            requestId,
            actorId: currentUser.id,
            action: "assigned",
            fromStatus: null,
            toStatus: null,
            comment: executor ? `Назначен исполнитель: ${executor.name}.` : "Исполнитель назначен.",
            createdAt
          }
        ]
      }));
    }

    function changeStatus(requestId: string, status: RequestStatus, comment: string) {
      if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        return;
      }

      const existing = store.serviceRequests.find((item) => item.id === requestId);
      if (!existing || existing.status === status) {
        return;
      }

      const createdAt = nowIso();
      setStore((prev) => ({
        ...prev,
        serviceRequests: prev.serviceRequests.map((item) =>
          item.id === requestId ? { ...item, status, updatedAt: createdAt } : item
        ),
        requestHistory: [
          ...prev.requestHistory,
          {
            id: makeEntityId("history"),
            requestId,
            actorId: currentUser.id,
            action: "status_changed",
            fromStatus: existing.status,
            toStatus: status,
            comment: comment.trim() || "Статус обновлён.",
            createdAt
          }
        ]
      }));
    }

    function importEmail(emailImportId: string, executorId?: string) {
      if (!currentUser || currentUser.role !== UserRole.ADMIN) {
        return null;
      }

      const emailItem = store.mockEmailImports.find((item) => item.id === emailImportId);
      if (!emailItem || emailItem.requestId) {
        return emailItem?.requestId ?? null;
      }

      const createdAt = nowIso();
      const requestId = makeRequestId();
      const request = {
        id: requestId,
        number: createRequestNumber(store),
        tenantId: emailItem.tenantId,
        createdById: currentUser.id,
        executorId: executorId || null,
        title: emailItem.suggestedTitle,
        description: emailItem.body,
        location: emailItem.location,
        category: emailItem.category,
        priority: emailItem.priority,
        status: executorId ? RequestStatus.ACCEPTED : RequestStatus.NEW,
        source: "email",
        emailFrom: emailItem.fromEmail,
        emailSubject: emailItem.subject,
        createdAt,
        updatedAt: createdAt
      };

      setStore((prev) => ({
        ...prev,
        serviceRequests: [...prev.serviceRequests, request],
        mockEmailImports: prev.mockEmailImports.map((item) =>
          item.id === emailImportId
            ? {
                ...item,
                importedAt: createdAt,
                importedById: currentUser.id,
                requestId
              }
            : item
        ),
        requestHistory: [
          ...prev.requestHistory,
          {
            id: makeEntityId("history"),
            requestId,
            actorId: currentUser.id,
            action: "imported_from_email",
            fromStatus: null,
            toStatus: request.status,
            comment: "Заявка создана из входящего email.",
            createdAt
          }
        ]
      }));

      return requestId;
    }

    function getRequest(id: string) {
      return getRequestById(store, id);
    }

    function getRequestsList() {
      return currentUser ? getVisibleRequests(store, currentUser) : [];
    }

    function getContractsList() {
      return currentUser ? getVisibleContracts(store, currentUser) : [];
    }

    function getBillingList() {
      return currentUser ? getVisibleBilling(store, currentUser) : [];
    }

    function getNotificationsList() {
      return currentUser ? getVisibleNotifications(store, currentUser) : [];
    }

    function getServicesList() {
      return getActiveServices(store);
    }

    function getExecutorsList() {
      return getExecutors(store);
    }

    function downloadContract(contractId: string) {
      const contract = store.contracts.find((item) => item.id === contractId);
      if (!contract) {
        return;
      }

      const tenant = store.tenants.find((item) => item.id === contract.tenantId);
      if (!tenant) {
        return;
      }

      const content = `
<html>
  <head><meta charset="utf-8"></head>
  <body>
    <h1>Договор ${contract.number}</h1>
    <p><strong>Наименование:</strong> ${contract.title}</p>
    <p><strong>Арендатор:</strong> ${tenant.name}</p>
    <p><strong>Помещение:</strong> ${tenant.office}</p>
    <p><strong>Этаж:</strong> ${tenant.floor}</p>
    <p><strong>Срок:</strong> ${contract.startDate} - ${contract.endDate}</p>
    <p><strong>Площадь:</strong> ${contract.areaSqm} м2</p>
    <p><strong>Ежемесячный платёж:</strong> ${contract.monthlyFee}</p>
    <p><strong>Обеспечительный платёж:</strong> ${contract.deposit}</p>
    <p><strong>Статус:</strong> ${contract.status}</p>
  </body>
</html>`.trim();

      const blob = new Blob([content], { type: "application/msword;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `contract-${contract.number}.doc`;
      link.click();
      URL.revokeObjectURL(url);
    }

    return {
      ready,
      store,
      currentUser,
      login,
      logout,
      createRequest,
      addComment,
      assignExecutor,
      changeStatus,
      importEmail,
      getRequest,
      getVisibleRequests: getRequestsList,
      getContracts: getContractsList,
      getBilling: getBillingList,
      getNotifications: getNotificationsList,
      getServices: getServicesList,
      getExecutors: getExecutorsList,
      downloadContract
    };
  }, [currentUser, ready, store]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within AppProvider");
  }
  return context;
}
