import seedData from "@/data/demo-db.json";
import {
  DemoStore,
  DetailedRequest,
  RequestPriority,
  RequestStatus,
  ServiceRequest,
  UserRole,
  UserWithTenant
} from "@/lib/types";

const STATE_KEY = "lk-tenant-pages-store";
const SESSION_KEY = "lk-tenant-pages-session";

export const seedStore = seedData as DemoStore;

export function loadPersistedStore() {
  if (typeof window === "undefined") {
    return seedStore;
  }

  const raw = window.localStorage.getItem(STATE_KEY);
  if (!raw) {
    return seedStore;
  }

  try {
    return JSON.parse(raw) as DemoStore;
  } catch {
    return seedStore;
  }
}

export function savePersistedStore(store: DemoStore) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(store));
  }
}

export function loadSessionUserId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(SESSION_KEY);
}

export function saveSessionUserId(userId: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (userId) {
    window.localStorage.setItem(SESSION_KEY, userId);
  } else {
    window.localStorage.removeItem(SESSION_KEY);
  }
}

export function getUserWithTenant(store: DemoStore, userId: string | null) {
  if (!userId) {
    return null;
  }

  const user = store.users.find((item) => item.id === userId);
  if (!user) {
    return null;
  }

  return {
    ...user,
    tenant: user.tenantId ? store.tenants.find((item) => item.id === user.tenantId) ?? null : null
  } satisfies UserWithTenant;
}

export function getVisibleRequests(store: DemoStore, user: UserWithTenant) {
  const items = store.serviceRequests
    .filter((item) => (user.role === UserRole.TENANT ? item.tenantId === user.tenantId : true))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return items.map((item) => withRequestRelations(store, item));
}

export function getRequestById(store: DemoStore, id: string) {
  const request = store.serviceRequests.find((item) => item.id === id);
  return request ? withRequestRelations(store, request) : null;
}

export function getVisibleContracts(store: DemoStore, user: UserWithTenant) {
  return store.contracts
    .filter((item) => (user.role === UserRole.TENANT ? item.tenantId === user.tenantId : true))
    .map((item) => ({
      ...item,
      tenant: store.tenants.find((tenant) => tenant.id === item.tenantId)!
    }));
}

export function getVisibleBilling(store: DemoStore, user: UserWithTenant) {
  return store.billingRecords
    .filter((item) => (user.role === UserRole.TENANT ? item.tenantId === user.tenantId : true))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .map((item) => ({
      ...item,
      tenant: store.tenants.find((tenant) => tenant.id === item.tenantId)!
    }));
}

export function getVisibleNotifications(store: DemoStore, user: UserWithTenant) {
  return store.notifications
    .filter((item) => (user.role === UserRole.TENANT ? item.tenantId === user.tenantId : true))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((item) => ({
      ...item,
      tenant: store.tenants.find((tenant) => tenant.id === item.tenantId)!
    }));
}

export function getExecutors(store: DemoStore) {
  return store.users.filter((item) => item.role === UserRole.ADMIN).sort((a, b) => a.name.localeCompare(b.name, "ru"));
}

export function getActiveServices(store: DemoStore) {
  return [...store.serviceItems].filter((item) => item.isActive).sort((a, b) => a.title.localeCompare(b.title, "ru"));
}

function withRequestRelations(store: DemoStore, request: ServiceRequest) {
  return {
    ...request,
    tenant: store.tenants.find((item) => item.id === request.tenantId)!,
    createdBy: store.users.find((item) => item.id === request.createdById)!,
    executor: request.executorId ? store.users.find((item) => item.id === request.executorId) ?? null : null,
    comments: store.requestComments
      .filter((item) => item.requestId === request.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((item) => ({
        ...item,
        author: store.users.find((user) => user.id === item.authorId)!
      })),
    history: store.requestHistory
      .filter((item) => item.requestId === request.id)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      .map((item) => ({
        ...item,
        actor: store.users.find((user) => user.id === item.actorId)!
      }))
  } satisfies DetailedRequest;
}

export function createRequestNumber(store: DemoStore) {
  const nextIndex = store.serviceRequests.length + 1;
  return `REQ-2026-${String(nextIndex).padStart(3, "0")}`;
}

export function makeRequestId() {
  return `request_${Math.random().toString(36).slice(2, 10)}`;
}

export function makeEntityId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export const DEFAULT_PRIORITY = RequestPriority.MEDIUM;
export const DEFAULT_STATUS = RequestStatus.NEW;
