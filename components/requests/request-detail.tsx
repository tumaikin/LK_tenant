"use client";

import { FormEvent, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useAppState } from "@/components/providers/app-provider";
import { PRIORITY_LABELS, REQUEST_STATUS_OPTIONS, STATUS_META } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { DetailedRequest } from "@/lib/types";

type RequestDetailProps = {
  request: DetailedRequest;
  isAdmin?: boolean;
};

export function RequestDetail({ request, isAdmin = false }: RequestDetailProps) {
  const { addComment, assignExecutor, changeStatus, getExecutors } = useAppState();
  const executors = getExecutors();
  const [comment, setComment] = useState("");
  const [statusComment, setStatusComment] = useState("");

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addComment(request.id, comment);
    setComment("");
  }

  return (
    <div className="detail-grid detail-grid-compact">
      <section className="surface detail-main">
        <div className="detail-head">
          <div>
            <p className="eyebrow">{request.number}</p>
            <h3>{request.title}</h3>
            <p>{request.description}</p>
          </div>
          <div className="detail-head-side">
            <span className="eyebrow">Текущий статус</span>
            <Badge tone={STATUS_META[request.status].tone}>{STATUS_META[request.status].label}</Badge>
          </div>
        </div>

        <div className="kv-grid kv-grid-compact">
          <div className="kv-item">
            <span>Арендатор</span>
            <strong>{request.tenant.name}</strong>
          </div>
          <div className="kv-item">
            <span>Локация</span>
            <strong>{request.location}</strong>
          </div>
          <div className="kv-item">
            <span>Категория</span>
            <strong>{request.category}</strong>
          </div>
          <div className="kv-item">
            <span>Приоритет</span>
            <strong>{PRIORITY_LABELS[request.priority]}</strong>
          </div>
          <div className="kv-item">
            <span>Источник</span>
            <strong>{request.source}</strong>
          </div>
          <div className="kv-item">
            <span>Исполнитель</span>
            <strong>{request.executor?.name ?? "Не назначен"}</strong>
          </div>
          <div className="kv-item">
            <span>Создано</span>
            <strong>{formatDateTime(request.createdAt)}</strong>
          </div>
          <div className="kv-item">
            <span>Автор</span>
            <strong>{request.createdBy.name}</strong>
          </div>
        </div>

        {request.emailSubject ? (
          <div className="callout">
            <p className="eyebrow">Email</p>
            <strong>{request.emailSubject}</strong>
            <p>От: {request.emailFrom}</p>
          </div>
        ) : null}

        <section className="subsection">
          <h4>Комментарии</h4>
          <div className="comment-list">
            {request.comments.map((item) => (
              <article key={item.id} className="comment-card">
                <div className="comment-meta">
                  <strong>{item.author.name}</strong>
                  <span>{formatDateTime(item.createdAt)}</span>
                </div>
                <p>{item.body}</p>
              </article>
            ))}
          </div>

          <form className="stack-form comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              name="body"
              rows={4}
              placeholder="Добавить комментарий"
              required
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            <button type="submit">Оставить комментарий</button>
          </form>
        </section>
      </section>

      <aside className="detail-side">
        {isAdmin ? (
          <section className="surface panel-form">
            <h4>Назначение исполнителя</h4>
            <form
              className="stack-form"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const executorId = String(formData.get("executorId") ?? "");
                if (executorId) {
                  assignExecutor(request.id, executorId);
                }
              }}
            >
              <select name="executorId" defaultValue={request.executorId ?? ""} required>
                <option value="" disabled>
                  Выберите исполнителя
                </option>
                {executors.map((executor) => (
                  <option key={executor.id} value={executor.id}>
                    {executor.name} ({executor.title ?? "сотрудник"})
                  </option>
                ))}
              </select>
              <button type="submit">Назначить</button>
            </form>
          </section>
        ) : null}

        {isAdmin ? (
          <section className="surface panel-form">
            <h4>Смена статуса</h4>
            <form
              className="stack-form"
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                changeStatus(request.id, String(formData.get("status")) as any, statusComment);
                setStatusComment("");
              }}
            >
              <select name="status" defaultValue={request.status} required>
                {REQUEST_STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <textarea
                name="comment"
                rows={3}
                placeholder="Комментарий к смене статуса"
                value={statusComment}
                onChange={(event) => setStatusComment(event.target.value)}
              />
              <button type="submit">Обновить статус</button>
            </form>
          </section>
        ) : null}

        <section className="surface history-panel">
          <h4>История</h4>
          <div className="timeline">
            {request.history.map((entry) => (
              <article key={entry.id} className="timeline-item">
                <strong>{entry.actor.name}</strong>
                <p>{entry.comment ?? entry.action}</p>
                <span>{formatDateTime(entry.createdAt)}</span>
              </article>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
