"use client";

import { useAppState } from "@/components/providers/app-provider";
import { formatCurrency, formatDate } from "@/lib/format";

export default function BillingPage() {
  const { currentUser, getBilling } = useAppState();

  if (!currentUser) {
    return null;
  }

  const billing = getBilling();
  const balance = billing.reduce((sum, item) => sum + (item.paidAmount - item.amount), 0);

  return (
    <section className="billing-stack">
      <div className="surface billing-total">
        <strong>{balance >= 0 ? "Переплата" : "Задолженность"}</strong>
        <span>{formatCurrency(Math.abs(balance))}</span>
      </div>
      <section className="surface table-wrap">
        <div className="table-toolbar">
          <div className="table-toolbar-main">
            <strong>Платежи и задолженность</strong>
            <span>Количество начислений: {billing.length}</span>
          </div>
        </div>
        <div className="registry-table">
          <table>
            <thead>
              <tr>
                <th>Период</th>
                <th>Начисление</th>
                <th>Арендатор</th>
                <th>Сумма</th>
                <th>Оплачено</th>
                <th>Остаток</th>
                <th>Срок</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              {billing.map((item) => (
                <tr key={item.id}>
                  <td>{item.period}</td>
                  <td>{item.chargeType}</td>
                  <td>{item.tenant.name}</td>
                  <td>{formatCurrency(item.amount)}</td>
                  <td>{formatCurrency(item.paidAmount)}</td>
                  <td>{formatCurrency(item.amount - item.paidAmount)}</td>
                  <td>{formatDate(item.dueDate)}</td>
                  <td>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </section>
  );
}
