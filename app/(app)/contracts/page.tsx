"use client";

import { useAppState } from "@/components/providers/app-provider";
import { formatCurrency, formatDate } from "@/lib/format";

export default function ContractsPage() {
  const { currentUser, getContracts, downloadContract } = useAppState();

  if (!currentUser) {
    return null;
  }

  const contracts = getContracts();

  return (
    <>
      <div className="page-header">
        <div>
          <h2>Договоры</h2>
          <p>Актуальные договоры аренды и связанные параметры.</p>
        </div>
      </div>
      <section className="card-grid">
        {contracts.map((contract) => (
          <article key={contract.id} className="surface list-card">
            <p className="eyebrow">{contract.number}</p>
            <h3>{contract.title}</h3>
            <div className="contract-summary">
              <p>Арендатор: {contract.tenant.name}</p>
              <p>Помещение: {contract.tenant.office}</p>
              <p>Этаж: {contract.tenant.floor}</p>
              <p>Срок действия: {formatDate(contract.startDate)} - {formatDate(contract.endDate)}</p>
              <p>Площадь: {contract.areaSqm} м2</p>
              <p>Статус: {contract.status}</p>
              <p>Ежемесячный платёж: {formatCurrency(contract.monthlyFee)}</p>
              <p>Обеспечительный платёж: {formatCurrency(contract.deposit)}</p>
              <p>Контактный email: {contract.tenant.contactEmail}</p>
              <p>Контактный телефон: {contract.tenant.contactPhone}</p>
              <p>Код арендатора: {contract.tenant.code}</p>
              <p>Дата начала: {formatDate(contract.startDate)}</p>
              <p>Дата окончания: {formatDate(contract.endDate)}</p>
            </div>
            <div className="contract-actions">
              <details className="contract-renew">
                <summary className="ghost-button">Продлить</summary>
                <div className="surface contract-renew-panel">
                  <label>
                    Новая дата окончания
                    <input defaultValue="2026-12-31" readOnly />
                  </label>
                  <label>
                    Новая ставка
                    <input defaultValue={String(contract.monthlyFee)} readOnly />
                  </label>
                  <label>
                    Комментарий
                    <textarea defaultValue="Запрос продления сформирован для демонстрации интерфейса." readOnly rows={3} />
                  </label>
                  <button type="button">Сохранить</button>
                </div>
              </details>
              <button className="button-link" type="button" onClick={() => downloadContract(contract.id)}>
                Скачать
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
