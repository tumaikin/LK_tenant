"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { PageHeader } from "@/components/layout/page-header";
import { RequestTable } from "@/components/requests/request-table";
import { useAppState } from "@/components/providers/app-provider";

export default function StaffRequestsPage() {
  const router = useRouter();
  const { currentUser, getVisibleRequests } = useAppState();

  useEffect(() => {
    if (currentUser && currentUser.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [currentUser, router]);

  if (!currentUser || currentUser.role !== "ADMIN") {
    return null;
  }

  const requests = getVisibleRequests();

  return (
    <>
      <PageHeader
        eyebrow="Рабочее место"
        title="Заявки для staff"
        description="Очередь обращений для админа и ресепшн: создание от имени арендатора, назначение и контроль статусов."
        actions={
          <>
            <Link className="button-link" href="/requests/new">
              Создать от имени арендатора
            </Link>
            <Link className="ghost-button" href="/staff/email-import">
              Импорт из email
            </Link>
          </>
        }
      />
      <RequestTable requests={requests} hrefBuilder={(id) => `/staff/requests/card?id=${id}`} />
    </>
  );
}
