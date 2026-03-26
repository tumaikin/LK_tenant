"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { useAppState } from "@/components/providers/app-provider";
import { REQUEST_PRIORITY_OPTIONS } from "@/lib/constants";
import { RequestPriority, UserRole } from "@/lib/types";

export default function NewRequestPage() {
  const router = useRouter();
  const { currentUser, store, createRequest } = useAppState();

  if (!currentUser) {
    return null;
  }

  const role = currentUser.role;
  const tenants = role === UserRole.ADMIN ? [...store.tenants].sort((a, b) => a.name.localeCompare(b.name, "ru")) : [];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const id = createRequest({
      tenantId: String(formData.get("tenantId") ?? ""),
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      location: String(formData.get("location") ?? ""),
      description: String(formData.get("description") ?? ""),
      priority: String(formData.get("priority") ?? "MEDIUM") as RequestPriority,
      source: role === UserRole.ADMIN ? "reception" : "portal"
    });

    if (id) {
      router.push(role === UserRole.ADMIN ? `/staff/requests/card?id=${id}` : `/requests/card?id=${id}`);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Новая заявка"
        title="Новая заявка"
        description="Форма создания обращения арендатора. В staff-режиме можно оформить заявку от имени арендатора."
      />

      <section className="surface info-card">
        <form className="stack-form" onSubmit={handleSubmit}>
          {role === UserRole.ADMIN ? (
            <label>
              Арендатор
              <select name="tenantId" required defaultValue={tenants[0]?.id ?? ""}>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <div className="grid-2">
            <label>
              Тема
              <input name="title" placeholder="Например: Не работает кондиционер" required />
            </label>
            <label>
              Категория
              <input name="category" placeholder="Климат, электрика, доступ" required />
            </label>
          </div>

          <div className="grid-2">
            <label>
              Локация
              <input name="location" placeholder="Офис 314, open space" required />
            </label>
            <label>
              Приоритет
              <select name="priority" defaultValue="MEDIUM">
                {REQUEST_PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Описание
            <textarea name="description" rows={6} placeholder="Опишите проблему и контекст" required />
          </label>

          <button type="submit">{role === UserRole.ADMIN ? "Создать от имени арендатора" : "Отправить обращение"}</button>
        </form>
      </section>
    </>
  );
}
