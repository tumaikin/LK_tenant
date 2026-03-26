"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RequestDetail } from "@/components/requests/request-detail";
import { useAppState } from "@/components/providers/app-provider";

export default function RequestCardPage() {
  const router = useRouter();
  const { currentUser, getRequest } = useAppState();
  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    setRequestId(new URLSearchParams(window.location.search).get("id") ?? "");
  }, []);

  const request = getRequest(requestId);

  useEffect(() => {
    if (!currentUser || !requestId) {
      return;
    }

    if (!request || (currentUser.role === "TENANT" && request.tenantId !== currentUser.tenantId)) {
      router.replace("/requests");
    }
  }, [currentUser, request, requestId, router]);

  if (!currentUser || !requestId || !request) {
    return null;
  }

  return <RequestDetail request={request} />;
}
