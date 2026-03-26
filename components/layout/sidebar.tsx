"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { APP_NAV, STAFF_NAV } from "@/lib/constants";
import { UserRole } from "@/lib/types";

type SidebarProps = {
  role: UserRole;
};

function isActive(pathname: string, href: string) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar surface">
      <div className="brand-block">
        <p className="eyebrow">Навигация</p>
        <h1>Кабинет арендатора</h1>
      </div>

      <div className="nav-section">
        <p className="eyebrow">Разделы</p>
        <nav className="nav-block">
          {APP_NAV.map((item) => (
            <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? "nav-link active" : "nav-link"}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {role === UserRole.ADMIN ? (
        <div className="nav-section">
          <p className="eyebrow">Рабочее место</p>
          <nav className="nav-block">
            {STAFF_NAV.map((item) => (
              <Link key={item.href} href={item.href} className={isActive(pathname, item.href) ? "nav-link active" : "nav-link"}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </aside>
  );
}
