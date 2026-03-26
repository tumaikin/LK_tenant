"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { RequestDetail } from "@/components/requests/request-detail";
import { useAppState } from "@/components/providers/app-provider";

export default function RequestCardPage() {
  const router = useRouter();
  const { currentUser, getRequest } = useAppState();
  const id = useMemo(() => (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("id") ?? ""), []);
  const request = getRequest(id);

  useEffect(() => {
    if (currentUser && (!request || (currentUser.role === "TENANT" && request.tenantId !== currentUser.tenantId))) {
      router.replace("/requests");
    }
  }, [currentUser, request, router]);

  if (!currentUser || !request) {
    return null;
  }

  return <RequestDetail request={request} />;
}
