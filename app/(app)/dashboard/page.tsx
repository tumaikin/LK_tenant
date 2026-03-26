"use client";

import Link from "next/link";

import { RequestTable } from "@/components/requests/request-table";
import { StatCard } from "@/components/ui/stat-card";
import { useAppState } from "@/components/providers/app-provider";
import { UserRole } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/format";

export default function DashboardPage() {
  const { currentUser, getVisibleRequests, getContracts, getBilling, getNotifications } = useAppState();

  if (!currentUser) {
    return null;
  }

  const requests = getVisibleRequests();
  const contracts = getContracts().slice(0, 2);
  const billing = getBilling().slice(0, 3);
  const notifications = getNotifications().slice(0, 3);
  const totalDebt = billing.reduce((sum, item) => sum + (item.amount - item.paidAmount), 0);
  const inProgress = requests.filter((item) => ["NEW", "ACCEPTED", "IN_PROGRESS", "WAITING_FOR_TENANT"].includes(item.status)).length;

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Обзор</h2>
          <p>Краткий срез по текущим обращениям, договорам и платёжной дисциплине.</p>
        </div>
        <div className="page-actions">
          <Link className="button-link" href="/requests/new">
            Новая заявка
          </Link>
          {currentUser.role === UserRole.ADMIN ? (
            <Link className="ghost-button" href="/staff/email-import">
              Импорт из email
            </Link>
          ) : null}
        </div>
      </div>

      <section className="grid-4">
        <StatCard label="Всего обращений" value={String(requests.length)} hint="Реестр заявок по текущему контексту" href="/requests" />
        <StatCard label="Активные" value={String(inProgress)} hint="Новые, принятые и находящиеся в работе" href="/requests" />
        <StatCard label="Задолженность" value={formatCurrency(totalDebt)} hint="Остаток по видимым начислениям" href="/billing" />
        <StatCard label="Непрочитанные" value={String(notifications.filter((item) => !item.isRead).length)} hint="Уведомления, требующие внимания" href="/notifications" />
      </section>

      <section className="dashboard-stack">
        <div className="surface info-card">
          <h3>Последние обращения</h3>
          <RequestTable
            requests={requests.slice(0, 5)}
            hrefBuilder={(id) => (currentUser.role === UserRole.ADMIN ? `/staff/requests/card?id=${id}` : `/requests/card?id=${id}`)}
            showMeta={false}
          />
        </div>

        <div className="surface info-card">
          <h3>Договоры и финансы</h3>
          <div className="dashboard-finance-grid">
            <div className="mini-list">
              {contracts.map((contract) => (
                <article key={contract.id}>
                  <strong>{contract.number}</strong>
                  <p>{contract.title}</p>
                  <span>Срок: {formatDate(contract.startDate)} - {formatDate(contract.endDate)}</span>
                  <span>Помещение: {contract.tenant.office}</span>
                  <span>Площадь: {contract.areaSqm} м2</span>
                  <span>Статус: {contract.status}</span>
                  <span>Платёж: {formatCurrency(contract.monthlyFee)} в месяц</span>
                  <span>Обеспечительный платёж: {formatCurrency(contract.deposit)}</span>
                </article>
              ))}
            </div>
            <div className="mini-list">
              {billing.map((item) => (
                <article key={item.id}>
                  <strong>
                    {item.period} · {item.chargeType}
                  </strong>
                  <p>{item.status}</p>
                  <span>{formatCurrency(item.amount - item.paidAmount)} к доплате</span>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
