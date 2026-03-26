"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { useAppState } from "@/components/providers/app-provider";

export default function AppLayout({ children }: Readonly<{ children: ReactNode }>) {
  const router = useRouter();
  const { ready, currentUser } = useAppState();

  useEffect(() => {
    if (ready && !currentUser) {
      router.replace("/login");
    }
  }, [currentUser, ready, router]);

  if (!ready || !currentUser) {
    return null;
  }

  return (
    <main className="shell">
      <Sidebar role={currentUser.role} />
      <div className="content">
        <Topbar userName={currentUser.name} title={currentUser.title} tenantName={currentUser.tenant?.name} />
        {children}
      </div>
    </main>
  );
}
