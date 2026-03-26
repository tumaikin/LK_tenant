"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";

import { RequestDetail } from "@/components/requests/request-detail";
import { useAppState } from "@/components/providers/app-provider";

export default function StaffRequestCardPage() {
  const router = useRouter();
  const { currentUser, getRequest } = useAppState();
  const id = useMemo(() => (typeof window === "undefined" ? "" : new URLSearchParams(window.location.search).get("id") ?? ""), []);
  const request = getRequest(id);

  useEffect(() => {
    if (currentUser && currentUser.role !== "ADMIN") {
      router.replace("/dashboard");
    }
    if (currentUser?.role === "ADMIN" && !request) {
      router.replace("/staff/requests");
    }
  }, [currentUser, request, router]);

  if (!currentUser || currentUser.role !== "ADMIN" || !request) {
    return null;
  }

  return <RequestDetail isAdmin request={request} />;
}
