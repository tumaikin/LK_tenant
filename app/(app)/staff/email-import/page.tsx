"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { useAppState } from "@/components/providers/app-provider";
import { PRIORITY_LABELS } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";

export default function EmailImportPage() {
  const router = useRouter();
  const { currentUser, store, importEmail, getExecutors } = useAppState();

  useEffect(() => {
    if (currentUser && currentUser.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  const emails = [...store.mockEmailImports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((item) => ({
      ...item,
      tenant: store.tenants.find((tenant) => tenant.id === item.tenantId)!,
      importedBy: item.importedById ? store.users.find((user) => user.id === item.importedById) ?? null : null
    }));
  const executors = getExecutors();

  return (
    <>
      <PageHeader
        eyebrow="Email"
        title="Сценарий обращения из email"
        description="Показывает, как входящее письмо может превратиться в заявку без реальной интеграции с почтой."
        actions={
          <button className="ghost-button" type="button" onClick={() => router.push("/staff/requests")}>
            К очереди заявок
          </button>
        }
      />
      <section className="card-grid">
        {emails.map((item) => (
          <article key={item.id} className="surface mail-card">
            <p className="eyebrow">{item.tenant.name}</p>
            <strong>{item.subject}</strong>
            <span>От: {item.fromEmail}</span>
            <p>{item.body}</p>
            <div className="status-line">
              <span className="badge badge-warning">{PRIORITY_LABELS[item.priority]}</span>
              <span className="badge badge-info">{item.category}</span>
              <span className="badge badge-neutral">{item.location}</span>
            </div>
            <small>{formatDateTime(item.createdAt)}</small>

            {item.importedAt ? (
              <div className="hint-box">
                Уже импортировано {formatDateTime(item.importedAt)}
                {item.requestId ? (
                  <>
                    {" "}· <Link href={`/staff/requests/card?id=${item.requestId}`}>Открыть заявку</Link>
                  </>
                ) : null}
              </div>
            ) : (
              <form
                className="stack-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  const requestId = importEmail(item.id, String(formData.get("executorId") ?? "") || undefined);
                  if (requestId) {
                    router.push(`/staff/requests/card?id=${requestId}`);
                  }
                }}
              >
                <label>
                  Назначить исполнителя сразу
                  <select name="executorId" defaultValue="">
                    <option value="">Пока не назначать</option>
                    {executors.map((executor) => (
                      <option key={executor.id} value={executor.id}>
                        {executor.name}
                      </option>
                    ))}
                  </select>
                </label>
                <button type="submit">Импортировать в заявку</button>
              </form>
            )}
          </article>
        ))}
      </section>
    </>
  );
}
