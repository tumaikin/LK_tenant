import { RequestPriority, RequestStatus, UserRole } from "@/lib/types";

export const ROLE_LABELS: Record<UserRole, string> = {
  TENANT: "Арендатор",
  ADMIN: "Админ"
};

export const STATUS_META: Record<
  RequestStatus,
  { label: string; tone: "neutral" | "info" | "warning" | "success" | "danger" }
> = {
  NEW: { label: "Новая", tone: "neutral" },
  ACCEPTED: { label: "Принята", tone: "info" },
  IN_PROGRESS: { label: "В работе", tone: "warning" },
  WAITING_FOR_TENANT: { label: "Ожидает арендатора", tone: "warning" },
  COMPLETED: { label: "Выполнена", tone: "success" },
  CLOSED: { label: "Закрыта", tone: "neutral" },
  CANCELLED: { label: "Отменена", tone: "danger" }
};

export const PRIORITY_LABELS: Record<RequestPriority, string> = {
  LOW: "Низкий",
  MEDIUM: "Средний",
  HIGH: "Высокий",
  CRITICAL: "Критический"
};

export const REQUEST_STATUS_OPTIONS = Object.entries(STATUS_META).map(([value, meta]) => ({
  value: value as RequestStatus,
  label: meta.label
}));

export const REQUEST_PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
  value: value as RequestPriority,
  label
}));

export const APP_NAV = [
  { href: "/dashboard", label: "Дашборд" },
  { href: "/requests", label: "Обращения" },
  { href: "/contracts", label: "Договоры" },
  { href: "/billing", label: "Платежи" },
  { href: "/notifications", label: "Уведомления" },
  { href: "/services", label: "Допуслуги" }
];

export const STAFF_NAV = [
  { href: "/staff/requests", label: "Заявки staff" },
  { href: "/staff/email-import", label: "Импорт из email" },
  { href: "/floor-plan", label: "Схема этажа" },
  { href: "/crm-funnel", label: "CRM воронка" }
];
