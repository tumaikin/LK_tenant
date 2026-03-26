"use client";

import { useRef } from "react";

import { useAppState } from "@/components/providers/app-provider";

type TopbarProps = {
  userName: string;
  tenantName?: string | null;
  title?: string | null;
};

export function Topbar({ userName, tenantName, title }: TopbarProps) {
  const settingsRef = useRef<HTMLDetailsElement>(null);
  const { logout } = useAppState();

  return (
    <div className="topbar topbar-inline">
      <div className="topbar-inline-main">
        <span className="topbar-inline-label">Пользователь:</span>
        <strong>{userName}</strong>
        <span className="topbar-inline-meta">{title ? `${title}${tenantName ? `, ${tenantName}` : ""}` : tenantName}</span>
      </div>

      <div className="topbar-inline-actions">
        <details className="settings-popover" ref={settingsRef}>
          <summary className="topbar-inline-exit">Настройки</summary>
          <div className="settings-panel surface">
            <div className="settings-panel-head">
              <strong>Настройки профиля</strong>
              <span>Форма-заглушка</span>
            </div>

            <label>
              Отображаемое имя
              <input value={userName} readOnly />
            </label>

            <label>
              Роль
              <input value={title ?? "Пользователь"} readOnly />
            </label>

            <label>
              Организация
              <input value={tenantName ?? "Не указана"} readOnly />
            </label>

            <label className="settings-check">
              <input checked disabled type="checkbox" readOnly />
              <span>Получать уведомления по email</span>
            </label>

            <label className="settings-check">
              <input disabled type="checkbox" readOnly />
              <span>Компактный режим интерфейса</span>
            </label>

            <button
              className="settings-disabled"
              type="button"
              onClick={() => {
                if (settingsRef.current) {
                  settingsRef.current.open = false;
                }
              }}
            >
              Сохранить
            </button>
          </div>
        </details>

        <button className="topbar-inline-exit" type="button" onClick={logout}>
          Выйти
        </button>
      </div>
    </div>
  );
}
