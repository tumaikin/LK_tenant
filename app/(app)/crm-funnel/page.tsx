"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppState } from "@/components/providers/app-provider";
import { formatCurrency } from "@/lib/format";

type DealStage = {
  id: string;
  title: string;
  color: string;
  deals: Array<{
    id: string;
    company: string;
    room: string;
    amount: number;
    manager: string;
    probability: number;
    note: string;
  }>;
};

const stages: DealStage[] = [
  {
    id: "lead",
    title: "Новый лид",
    color: "#5a8dee",
    deals: [
      {
        id: "deal-1",
        company: "ООО Неон Девелопмент",
        room: "Блок А, 106",
        amount: 380000,
        manager: "Мария Волкова",
        probability: 20,
        note: "Первичный интерес к помещению после просмотра сайта БЦ."
      },
      {
        id: "deal-2",
        company: "ИП Городские сервисы",
        room: "Блок А, 110",
        amount: 145000,
        manager: "Илья Орлов",
        probability: 15,
        note: "Запросил КП и план помещения на 3 этаж."
      }
    ]
  },
  {
    id: "qualification",
    title: "Квалификация",
    color: "#3aa0ff",
    deals: [
      {
        id: "deal-3",
        company: "ООО Прайм Консалт",
        room: "Блок А, 102",
        amount: 260000,
        manager: "Мария Волкова",
        probability: 40,
        note: "Подтверждён бюджет и согласован состав команды арендатора."
      }
    ]
  },
  {
    id: "proposal",
    title: "Коммерческое предложение",
    color: "#19b5a5",
    deals: [
      {
        id: "deal-4",
        company: "ООО Сфера Медиа",
        room: "Блок А, 106 + 110",
        amount: 520000,
        manager: "Илья Орлов",
        probability: 60,
        note: "Отправлено КП с 2 вариантами конфигурации офиса."
      }
    ]
  },
  {
    id: "negotiation",
    title: "Переговоры",
    color: "#f5a623",
    deals: [
      {
        id: "deal-5",
        company: "АО Вертикаль Телеком",
        room: "Блок А, 104",
        amount: 410000,
        manager: "Мария Волкова",
        probability: 75,
        note: "Согласовывают условия парковки и индексацию на второй год."
      },
      {
        id: "deal-6",
        company: "ООО Точка Аналитики",
        room: "Блок А, 102",
        amount: 245000,
        manager: "Илья Орлов",
        probability: 70,
        note: "Назначена финальная встреча с ЛПР на следующей неделе."
      }
    ]
  },
  {
    id: "contract",
    title: "Договор",
    color: "#8f66d9",
    deals: [
      {
        id: "deal-7",
        company: "ООО ФинПлатформа",
        room: "Блок C, 210",
        amount: 610000,
        manager: "Мария Волкова",
        probability: 90,
        note: "Договор на согласовании у юристов арендатора."
      }
    ]
  },
  {
    id: "won",
    title: "Успешно реализовано",
    color: "#2eb872",
    deals: [
      {
        id: "deal-8",
        company: "ООО Альфа Тех",
        room: "Блок А, 314 + 108",
        amount: 845000,
        manager: "Мария Волкова",
        probability: 100,
        note: "Подписан договор и выставлен первый счёт."
      }
    ]
  }
];

export default function CrmFunnelPage() {
  const router = useRouter();
  const { currentUser } = useAppState();

  useEffect(() => {
    if (currentUser && currentUser.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  const totalDeals = stages.reduce((sum, stage) => sum + stage.deals.length, 0);
  const totalAmount = stages.reduce((sum, stage) => sum + stage.deals.reduce((acc, deal) => acc + deal.amount, 0), 0);
  const activeAmount = stages
    .filter((stage) => stage.id !== "won")
    .reduce((sum, stage) => sum + stage.deals.reduce((acc, deal) => acc + deal.amount, 0), 0);

  return (
    <section className="crm-page">
      <div className="page-header">
        <div>
          <h2>CRM воронка</h2>
          <p>Mock-экран продаж по аренде помещений в стиле CRM Bitrix.</p>
        </div>
      </div>

      <section className="grid-4 crm-stats">
        <article className="surface stat-card">
          <span className="stat-label">Сделок в работе</span>
          <strong>{totalDeals}</strong>
          <p className="stat-hint">Все активные и закрытые возможности</p>
        </article>
        <article className="surface stat-card">
          <span className="stat-label">Общий объём</span>
          <strong>{formatCurrency(totalAmount)}</strong>
          <p className="stat-hint">Сумма по всей воронке</p>
        </article>
        <article className="surface stat-card">
          <span className="stat-label">Активный пайплайн</span>
          <strong>{formatCurrency(activeAmount)}</strong>
          <p className="stat-hint">Без успешно реализованных сделок</p>
        </article>
        <article className="surface stat-card">
          <span className="stat-label">Конверсия</span>
          <strong>18%</strong>
          <p className="stat-hint">Из лида в подписанный договор</p>
        </article>
      </section>

      <section className="surface crm-board">
        <div className="crm-board-head">
          <strong>Воронка аренды помещений</strong>
          <span>{totalDeals} сделок</span>
        </div>
        <div className="crm-columns">
          {stages.map((stage) => {
            const stageAmount = stage.deals.reduce((sum, deal) => sum + deal.amount, 0);

            return (
              <article key={stage.id} className="crm-column">
                <div className="crm-column-head" style={{ borderTopColor: stage.color }}>
                  <strong>{stage.title}</strong>
                  <span>{stage.deals.length} шт.</span>
                  <small>{formatCurrency(stageAmount)}</small>
                </div>
                <div className="crm-card-list">
                  {stage.deals.map((deal) => (
                    <div key={deal.id} className="crm-card">
                      <div className="crm-card-head">
                        <strong>{deal.company}</strong>
                        <span>{deal.room}</span>
                      </div>
                      <div className="crm-card-meta">
                        <span>{formatCurrency(deal.amount)}</span>
                        <span>Вероятность: {deal.probability}%</span>
                      </div>
                      <p>{deal.note}</p>
                      <div className="crm-card-footer">
                        <span>{deal.manager}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </section>
  );
}
