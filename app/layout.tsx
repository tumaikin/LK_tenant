import type { Metadata } from "next";
import "./globals.css";

import { AppProvider } from "@/components/providers/app-provider";

export const metadata: Metadata = {
  title: "VIS Tenant Portal",
  description: "Личный кабинет арендатора с техническими обращениями"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
