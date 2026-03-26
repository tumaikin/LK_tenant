import { PrismaClient, RequestPriority, RequestStatus, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.requestComment.deleteMany();
  await prisma.requestHistory.deleteMany();
  await prisma.serviceRequest.deleteMany();
  await prisma.mockEmailImport.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.billingRecord.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.serviceItem.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const alpha = await prisma.tenant.create({
    data: {
      code: "TEN-001",
      name: "ООО Альфа Тех",
      office: "Блок A, офис 314",
      floor: "3 этаж",
      contactEmail: "office@alfatech.demo",
      contactPhone: "+7 (846) 200-11-22"
    }
  });

  const beta = await prisma.tenant.create({
    data: {
      code: "TEN-002",
      name: "ИП Бета Логистик",
      office: "Блок C, офис 118",
      floor: "1 этаж",
      contactEmail: "hello@beta.demo",
      contactPhone: "+7 (846) 200-33-44"
    }
  });

  const tenantUser = await prisma.user.create({
    data: {
      email: "tenant@demo.local",
      password: "demo123",
      name: "Анна Смирнова",
      role: UserRole.TENANT,
      title: "Офис-менеджер",
      tenantId: alpha.id
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@demo.local",
      password: "demo123",
      name: "Мария Волкова",
      role: UserRole.ADMIN,
      title: "Администратор БЦ"
    }
  });

  const receptionUser = await prisma.user.create({
    data: {
      email: "reception@demo.local",
      password: "demo123",
      name: "Илья Орлов",
      role: UserRole.ADMIN,
      title: "Ресепшн"
    }
  });

  const engineerUser = await prisma.user.create({
    data: {
      email: "engineer@demo.local",
      password: "demo123",
      name: "Сергей Карпов",
      role: UserRole.ADMIN,
      title: "Технический специалист"
    }
  });

  await prisma.contract.createMany({
    data: [
      {
        tenantId: alpha.id,
        number: "A-314/2025",
        title: "Договор аренды офиса 314",
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-12-31"),
        areaSqm: 128.4,
        status: "Действует",
        monthlyFee: 245000,
        deposit: 245000
      },
      {
        tenantId: beta.id,
        number: "C-118/2025",
        title: "Договор аренды офиса 118",
        startDate: new Date("2025-02-01"),
        endDate: new Date("2026-01-31"),
        areaSqm: 72.1,
        status: "Действует",
        monthlyFee: 118000,
        deposit: 118000
      }
    ]
  });

  await prisma.billingRecord.createMany({
    data: [
      {
        tenantId: alpha.id,
        period: "Март 2026",
        chargeType: "Аренда",
        amount: 245000,
        paidAmount: 245000,
        dueDate: new Date("2026-03-10"),
        status: "Оплачено"
      },
      {
        tenantId: alpha.id,
        period: "Март 2026",
        chargeType: "Коммунальные услуги",
        amount: 48200,
        paidAmount: 28000,
        dueDate: new Date("2026-03-20"),
        status: "Частично оплачено"
      },
      {
        tenantId: alpha.id,
        period: "Апрель 2026",
        chargeType: "Аренда",
        amount: 245000,
        paidAmount: 0,
        dueDate: new Date("2026-04-10"),
        status: "Ожидает оплаты"
      }
    ]
  });

  await prisma.notification.createMany({
    data: [
      {
        tenantId: alpha.id,
        title: "Плановые работы по вентиляции",
        body: "29 марта с 08:00 до 10:00 будут проводиться профилактические работы на 3 этаже.",
        category: "Эксплуатация"
      },
      {
        tenantId: alpha.id,
        title: "Выставлен счёт за апрель",
        body: "Счёт по аренде и эксплуатационным услугам доступен в разделе платежей.",
        category: "Финансы",
        isRead: true
      },
      {
        tenantId: alpha.id,
        title: "Новый пропуск для сотрудника",
        body: "Заявка на пропуск согласована, карточку можно забрать на ресепшн.",
        category: "Сервис"
      }
    ]
  });

  await prisma.serviceItem.createMany({
    data: [
      {
        title: "Дополнительная уборка",
        description: "Разовая уборка кабинета или переговорной вне базового графика.",
        price: 2500,
        unit: "за заявку"
      },
      {
        title: "Пропуск для гостя",
        description: "Оформление временного гостевого пропуска на день.",
        price: 0,
        unit: "за пропуск"
      },
      {
        title: "Аренда переговорной",
        description: "Часовая аренда переговорной с доступом к экрану и кофе-поинту.",
        price: 1800,
        unit: "за час"
      }
    ]
  });

  const request1 = await prisma.serviceRequest.create({
    data: {
      number: "REQ-2026-001",
      tenantId: alpha.id,
      createdById: tenantUser.id,
      executorId: engineerUser.id,
      title: "Не работает кондиционер в кабинете директора",
      description: "После 11:00 кондиционер перестал охлаждать, температура в кабинете поднялась до 27 градусов.",
      location: "Офис 314, кабинет директора",
      category: "Климат",
      priority: RequestPriority.HIGH,
      status: RequestStatus.IN_PROGRESS
    }
  });

  const request2 = await prisma.serviceRequest.create({
    data: {
      number: "REQ-2026-002",
      tenantId: alpha.id,
      createdById: receptionUser.id,
      executorId: adminUser.id,
      title: "Замена перегоревшей лампы в open space",
      description: "Сотрудник ресепшн оформил обращение по звонку арендатора.",
      location: "Офис 314, open space",
      category: "Электрика",
      priority: RequestPriority.MEDIUM,
      status: RequestStatus.ACCEPTED,
      source: "reception"
    }
  });

  await prisma.requestComment.createMany({
    data: [
      {
        requestId: request1.id,
        authorId: tenantUser.id,
        body: "Проблема появилась после утреннего включения системы."
      },
      {
        requestId: request1.id,
        authorId: engineerUser.id,
        body: "Проверяю внутренний блок и управляющий модуль, ориентир по решению до 15:00."
      },
      {
        requestId: request2.id,
        authorId: adminUser.id,
        body: "Заявка принята, электрик выйдет на этаж после 14:00."
      }
    ]
  });

  await prisma.requestHistory.createMany({
    data: [
      {
        requestId: request1.id,
        actorId: tenantUser.id,
        action: "created",
        toStatus: RequestStatus.NEW,
        comment: "Заявка создана через портал арендатора."
      },
      {
        requestId: request1.id,
        actorId: adminUser.id,
        action: "assigned",
        comment: "Назначен исполнитель: Сергей Карпов."
      },
      {
        requestId: request1.id,
        actorId: adminUser.id,
        action: "status_changed",
        fromStatus: RequestStatus.NEW,
        toStatus: RequestStatus.IN_PROGRESS,
        comment: "Переведена в работу."
      },
      {
        requestId: request2.id,
        actorId: receptionUser.id,
        action: "created_for_tenant",
        toStatus: RequestStatus.NEW,
        comment: "Создано сотрудником ресепшн от имени арендатора."
      },
      {
        requestId: request2.id,
        actorId: adminUser.id,
        action: "status_changed",
        fromStatus: RequestStatus.NEW,
        toStatus: RequestStatus.ACCEPTED,
        comment: "Заявка принята в обработку."
      }
    ]
  });

  await prisma.mockEmailImport.createMany({
    data: [
      {
        tenantId: alpha.id,
        fromEmail: "office@alfatech.demo",
        subject: "Перестал работать считыватель на входе",
        body: "Добрый день. Входной считыватель в офис 314 не принимает карты сотрудников. Просим проверить сегодня.",
        suggestedTitle: "Не работает считыватель доступа в офис 314",
        location: "Офис 314, входная группа",
        category: "СКУД",
        priority: RequestPriority.HIGH
      },
      {
        tenantId: beta.id,
        fromEmail: "hello@beta.demo",
        subject: "Шумит фанкойл в переговорной",
        body: "В переговорной на 1 этаже появился сильный шум от фанкойла. Нужна диагностика.",
        suggestedTitle: "Шум фанкойла в переговорной",
        location: "Офис 118, переговорная",
        category: "Климат",
        priority: RequestPriority.MEDIUM
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
