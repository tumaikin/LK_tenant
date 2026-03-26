# Прототип ЛК арендатора

## Стек

- Next.js 15 + App Router
- TypeScript
- Prisma schema + seed
- Runtime mock-store на локальном JSON-файле
- Mock auth на cookie-сессии
- Серверные route handlers для API

## Структура проекта

```text
app/
  (auth)/login
  (app)/
    dashboard
    requests
    contracts
    billing
    notifications
    services
    staff/requests
    staff/email-import
  api/
    login
    me
    requests
    tenants
    contracts
    billing
    notifications
components/
  layout/
  requests/
  ui/
lib/
  auth.ts
  db.ts
  constants.ts
  format.ts
  queries.ts
  validation.ts
data/
  demo-db.json
prisma/
  schema.prisma
  seed.ts
```

## Основные сущности

- `User`: пользователь системы с ролью `tenant` или `admin`
- `Tenant`: карточка арендатора/компании
- `Contract`: договор арендатора
- `BillingRecord`: начисления, оплаты, задолженность
- `Notification`: уведомления в ЛК
- `ServiceItem`: дополнительные услуги
- `ServiceRequest`: техническое обращение
- `RequestComment`: комментарии по заявке
- `RequestHistory`: история действий и смен статусов
- `MockEmailImport`: mock-сценарий импортированной заявки из email

## Роли

- `tenant`: видит только свои данные и может создавать обращения
- `admin`: управляет всеми заявками, назначает исполнителя, меняет статус, может создавать заявку от имени арендатора

## Статусы заявок

- `new` → `Новая`
- `accepted` → `Принята`
- `in_progress` → `В работе`
- `waiting_for_tenant` → `Ожидает арендатора`
- `completed` → `Выполнена`
- `closed` → `Закрыта`
- `cancelled` → `Отменена`

## API

- `POST /api/login` — вход по demo-аккаунту
- `GET /api/me` — текущий пользователь
- `GET /api/requests` — список обращений
- `POST /api/requests` — создание обращения
- `GET /api/requests/:id` — карточка обращения
- `PATCH /api/requests/:id` — обновление полей обращения
- `POST /api/requests/:id/assign` — назначение исполнителя
- `POST /api/requests/:id/status` — смена статуса
- `POST /api/requests/:id/comments` — добавить комментарий
- `GET /api/tenants` — список арендаторов
- `GET /api/contracts` — список договоров
- `GET /api/billing` — платежи и задолженность
- `GET /api/notifications` — уведомления
- `POST /api/mock/email-import` — mock-импорт обращения из email
