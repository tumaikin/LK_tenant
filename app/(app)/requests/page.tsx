"use client";

import Link from "next/link";

import { RequestTable } from "@/components/requests/request-table";
import { useAppState } from "@/components/providers/app-provider";

export default function RequestsPage() {
  const { getVisibleRequests } = useAppState();
  const requests = getVisibleRequests();

  return (
    <RequestTable
      requests={requests}
      hrefBuilder={(id) => `/requests/card?id=${id}`}
      title="Технические обращения"
      action={
        <Link className="button-link" href="/requests/new">
          Создать обращение
        </Link>
      }
    />
  );
}
