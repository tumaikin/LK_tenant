"use client";

import { useAppState } from "@/components/providers/app-provider";
import { formatDateTime } from "@/lib/format";

export default function NotificationsPage() {
  const { currentUser, getNotifications } = useAppState();

  if (!currentUser) {
    return null;
  }

  const notifications = getNotifications();

  return (
    <section className="surface registry-panel">
      <div className="table-toolbar">
        <div className="table-toolbar-main">
          <strong>Уведомления</strong>
          <span>Количество уведомлений: {notifications.length}</span>
        </div>
      </div>
      <section className="card-grid registry-cards">
        {notifications.map((notification) => (
          <article key={notification.id} className="list-card registry-card">
            <p className="eyebrow">
              {notification.category} · {notification.tenant.name}
            </p>
            <h3>{notification.title}</h3>
            <p>{notification.body}</p>
            <span>{formatDateTime(notification.createdAt)}</span>
          </article>
        ))}
      </section>
    </section>
  );
}
