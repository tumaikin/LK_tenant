export const UserRole = {
  TENANT: "TENANT",
  ADMIN: "ADMIN"
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export const RequestStatus = {
  NEW: "NEW",
  ACCEPTED: "ACCEPTED",
  IN_PROGRESS: "IN_PROGRESS",
  WAITING_FOR_TENANT: "WAITING_FOR_TENANT",
  COMPLETED: "COMPLETED",
  CLOSED: "CLOSED",
  CANCELLED: "CANCELLED"
} as const;

export type RequestStatus = (typeof RequestStatus)[keyof typeof RequestStatus];

export const RequestPriority = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL"
} as const;

export type RequestPriority = (typeof RequestPriority)[keyof typeof RequestPriority];

export type Tenant = {
  id: string;
  code: string;
  name: string;
  office: string;
  floor: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
};

export type User = {
  id: string;
  email: string;
  password: string;
  name: string;
  role: UserRole;
  title: string | null;
  tenantId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Contract = {
  id: string;
  tenantId: string;
  number: string;
  title: string;
  startDate: string;
  endDate: string;
  areaSqm: number;
  status: string;
  monthlyFee: number;
  deposit: number;
  createdAt: string;
  updatedAt: string;
};

export type BillingRecord = {
  id: string;
  tenantId: string;
  period: string;
  chargeType: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type Notification = {
  id: string;
  tenantId: string;
  title: string;
  body: string;
  category: string;
  isRead: boolean;
  createdAt: string;
};

export type ServiceItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  unit: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ServiceRequest = {
  id: string;
  number: string;
  tenantId: string;
  createdById: string;
  executorId: string | null;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: RequestPriority;
  status: RequestStatus;
  source: string;
  emailFrom: string | null;
  emailSubject: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RequestComment = {
  id: string;
  requestId: string;
  authorId: string;
  body: string;
  createdAt: string;
};

export type RequestHistory = {
  id: string;
  requestId: string;
  actorId: string;
  action: string;
  fromStatus: RequestStatus | null;
  toStatus: RequestStatus | null;
  comment: string | null;
  createdAt: string;
};

export type MockEmailImport = {
  id: string;
  tenantId: string;
  fromEmail: string;
  subject: string;
  body: string;
  suggestedTitle: string;
  location: string;
  category: string;
  priority: RequestPriority;
  importedAt: string | null;
  importedById: string | null;
  requestId: string | null;
  createdAt: string;
};

export type DemoStore = {
  tenants: Tenant[];
  users: User[];
  contracts: Contract[];
  billingRecords: BillingRecord[];
  notifications: Notification[];
  serviceItems: ServiceItem[];
  serviceRequests: ServiceRequest[];
  requestComments: RequestComment[];
  requestHistory: RequestHistory[];
  mockEmailImports: MockEmailImport[];
};

export type UserWithTenant = User & {
  tenant: Tenant | null;
};

export type RequestRow = ServiceRequest & {
  tenant: Tenant;
  createdBy: User;
  executor: User | null;
};

export type DetailedRequest = RequestRow & {
  comments: Array<{
    id: string;
    body: string;
    createdAt: string;
    author: User;
  }>;
  history: Array<{
    id: string;
    action: string;
    comment: string | null;
    createdAt: string;
    fromStatus: RequestStatus | null;
    toStatus: RequestStatus | null;
    actor: User;
  }>;
};
