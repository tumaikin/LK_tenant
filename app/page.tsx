"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAppState } from "@/components/providers/app-provider";

export default function HomePage() {
  const router = useRouter();
  const { ready, currentUser } = useAppState();

  useEffect(() => {
    if (!ready) {
      return;
    }

    router.replace(currentUser ? "/dashboard" : "/login");
  }, [currentUser, ready, router]);

  return null;
}
