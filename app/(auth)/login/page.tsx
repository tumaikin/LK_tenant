"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAppState } from "@/components/providers/app-provider";

export default function LoginPage() {
  const router = useRouter();
  const { ready, currentUser, login } = useAppState();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (ready && currentUser) {
      router.replace("/dashboard");
    }
  }, [currentUser, ready, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const ok = login({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    });

    if (!ok) {
      setError(true);
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <div className="auth-shell">
      <div className="auth-card surface">
        <section className="auth-hero">
          <p className="eyebrow">Личный кабинет</p>
          <h1>Личный кабинет арендатора</h1>
          <p>
            Технические обращения, договоры, начисления, уведомления и регистрация заявок сотрудником ресепшн от имени арендатора.
          </p>
          <div className="auth-system-list">
            <div>
              <span>Модуль</span>
              <strong>Технические обращения</strong>
            </div>
            <div>
              <span>Роли</span>
              <strong>Арендатор, админ</strong>
            </div>
            <div>
              <span>Каналы</span>
              <strong>Портал, ресепшн, email</strong>
            </div>
          </div>
        </section>

        <section className="auth-form">
          <p className="eyebrow">Авторизация</p>
          <h2>Вход в систему</h2>
          <p>Введите email и пароль для входа.</p>
          {error ? <div className="hint-box">Не удалось войти. Проверьте email и пароль.</div> : null}

          <form onSubmit={handleSubmit}>
            <label>
              Email
              <input defaultValue="tenant@demo.local" name="email" type="email" required />
            </label>
            <label>
              Пароль
              <input defaultValue="demo123" name="password" type="password" required />
            </label>
            <button type="submit">Войти</button>
          </form>

          <div className="auth-demo-panel">
            <strong>Учетные записи</strong>
            <div className="auth-demo-grid">
              <span>Арендатор</span>
              <code>tenant@demo.local</code>
              <span>Админ</span>
              <code>admin@demo.local</code>
              <span>Ресепшн</span>
              <code>reception@demo.local</code>
            </div>
            <Link href="/dashboard">Если сессия уже создана, перейти в дашборд</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
