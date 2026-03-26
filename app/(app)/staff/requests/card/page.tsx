"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { RequestDetail } from "@/components/requests/request-detail";
import { useAppState } from "@/components/providers/app-provider";

export default function StaffRequestCardPage() {
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

    if (currentUser.role !== "ADMIN") {
      router.replace("/dashboard");
      return;
    }

    if (!request) {
      router.replace("/staff/requests");
    }
  }, [currentUser, request, requestId, router]);

  if (!currentUser || currentUser.role !== "ADMIN" || !requestId || !request) {
    return null;
  }

  return <RequestDetail isAdmin request={request} />;
}
