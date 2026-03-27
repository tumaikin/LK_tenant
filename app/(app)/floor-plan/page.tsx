"use client";

import { useMemo, useState } from "react";

type RoomStatus = "occupied" | "vacant" | "service" | "expiring";

type Room = {
  id: string;
  code: string;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  area: number;
  status: RoomStatus;
  tenant?: string;
  leaseUntil?: string;
  purpose: string;
  note: string;
};

const rooms: Room[] = [
  { id: "r101", code: "101", title: "Офис 101", x: 40, y: 42, width: 150, height: 92, area: 48, status: "occupied", tenant: "ООО Альфа Тех", leaseUntil: "31.12.2026", purpose: "Офис", note: "Действующий договор аренды, 8 рабочих мест." },
  { id: "r102", code: "102", title: "Офис 102", x: 208, y: 42, width: 132, height: 92, area: 36, status: "vacant", purpose: "Офис", note: "Свободно для показа потенциальным арендаторам." },
  { id: "r103", code: "103", title: "Переговорная", x: 358, y: 42, width: 132, height: 92, area: 34, status: "service", purpose: "Общее помещение", note: "Служебная переговорная для арендаторов этажа." },
  { id: "r104", code: "104", title: "Офис 104", x: 508, y: 42, width: 150, height: 92, area: 46, status: "expiring", tenant: "ИП Север Логистик", leaseUntil: "30.06.2026", purpose: "Офис", note: "Договор заканчивается в ближайшие 3 месяца." },
  { id: "r105", code: "105", title: "Офис 105", x: 676, y: 42, width: 148, height: 92, area: 44, status: "occupied", tenant: "ООО Форвард Групп", leaseUntil: "31.01.2027", purpose: "Офис", note: "Используется как клиентский офис и архив." },
  { id: "r106", code: "106", title: "Офис 106", x: 40, y: 316, width: 160, height: 94, area: 52, status: "vacant", purpose: "Офис", note: "Свободный блок с отдельным входом из коридора." },
  { id: "r107", code: "107", title: "Кухня / lounge", x: 218, y: 316, width: 142, height: 94, area: 32, status: "service", purpose: "Общее помещение", note: "Общая кухня и зона ожидания этажа." },
  { id: "r108", code: "108", title: "Офис 108", x: 378, y: 316, width: 148, height: 94, area: 42, status: "occupied", tenant: "ООО Альфа Тех", leaseUntil: "31.12.2026", purpose: "Офис", note: "Дополнительный open space в составе аренды." },
  { id: "r109", code: "109", title: "Офис 109", x: 544, y: 316, width: 136, height: 94, area: 38, status: "occupied", tenant: "ООО Сити Медиа", leaseUntil: "31.08.2026", purpose: "Офис", note: "Компактный офис на 6 рабочих мест." },
  { id: "r110", code: "110", title: "Офис 110", x: 698, y: 316, width: 126, height: 94, area: 30, status: "vacant", purpose: "Офис", note: "Небольшой свободный кабинет под малую команду." }
];

const statusMeta: Record<RoomStatus, { label: string; color: string; fill: string }> = {
  occupied: { label: "В аренде", color: "#2370d9", fill: "#dcecff" },
  vacant: { label: "Свободно", color: "#2f9b64", fill: "#dff7ea" },
  service: { label: "Служебное", color: "#76879a", fill: "#edf2f7" },
  expiring: { label: "Скоро освобождается", color: "#d08a17", fill: "#fff0d7" }
};

export default function FloorPlanPage() {
  const [filter, setFilter] = useState<RoomStatus | "all">("all");
  const [selectedId, setSelectedId] = useState<string>(rooms[0].id);

  const visibleRooms = useMemo(
    () => rooms.filter((room) => (filter === "all" ? true : room.status === filter)),
    [filter]
  );
  const selectedRoom = rooms.find((room) => room.id === selectedId) ?? rooms[0];
  const occupiedCount = rooms.filter((room) => room.status === "occupied").length;
  const vacantCount = rooms.filter((room) => room.status === "vacant").length;

  return (
    <section className="floor-plan-page">
      <div className="page-header">
        <div>
          <h2>Схема этажа</h2>
          <p>Интерактивная схема помещений с индикацией аренды и свободных площадей.</p>
        </div>
      </div>

      <section className="grid-4 floor-plan-stats">
        <article className="surface stat-card">
          <span className="stat-label">Этаж</span>
          <strong>3</strong>
          <p className="stat-hint">Офисный блок А</p>
        </article>
        <article className="surface stat-card">
          <span className="stat-label">В аренде</span>
          <strong>{occupiedCount}</strong>
          <p className="stat-hint">Помещения с действующим договором</p>
        </article>
        <article className="surface stat-card">
          <span className="stat-label">Свободно</span>
          <strong>{vacantCount}</strong>
          <p className="stat-hint">Готово к показу и сдаче</p>
        </article>
        <article className="surface stat-card">
          <span className="stat-label">Площадь</span>
          <strong>402 м2</strong>
          <p className="stat-hint">Суммарная площадь этажа</p>
        </article>
      </section>

      <div className="floor-plan-layout">
        <section className="surface floor-plan-board">
          <div className="floor-plan-toolbar">
            <div className="floor-plan-legend">
              {Object.entries(statusMeta).map(([status, meta]) => (
                <button
                  key={status}
                  className={filter === status ? "floor-filter active" : "floor-filter"}
                  type="button"
                  onClick={() => setFilter(status as RoomStatus)}
                >
                  <span className="floor-filter-dot" style={{ background: meta.color }} />
                  {meta.label}
                </button>
              ))}
              <button className={filter === "all" ? "floor-filter active" : "floor-filter"} type="button" onClick={() => setFilter("all")}>
                Все помещения
              </button>
            </div>
            <div className="floor-plan-caption">Кликните по помещению, чтобы открыть карточку справа</div>
          </div>

          <div className="floor-plan-canvas">
            <svg viewBox="0 0 870 460" className="floor-svg" role="img" aria-label="Схема этажа">
              <rect x="20" y="20" width="810" height="390" rx="24" className="floor-outline" />
              <rect x="40" y="165" width="784" height="122" rx="18" className="floor-corridor" />
              <text x="432" y="234" textAnchor="middle" className="floor-corridor-text">
                Коридор / общая зона
              </text>

              {visibleRooms.map((room) => {
                const meta = statusMeta[room.status];
                const selected = selectedId === room.id;

                return (
                  <g key={room.id} className="floor-room-group" onClick={() => setSelectedId(room.id)}>
                    <rect
                      x={room.x}
                      y={room.y}
                      width={room.width}
                      height={room.height}
                      rx="14"
                      className={selected ? "floor-room selected" : "floor-room"}
                      style={{ fill: meta.fill, stroke: meta.color }}
                    />
                    <text x={room.x + 16} y={room.y + 28} className="floor-room-code">
                      {room.code}
                    </text>
                    <text x={room.x + 16} y={room.y + 50} className="floor-room-title">
                      {room.title}
                    </text>
                    <text x={room.x + 16} y={room.y + room.height - 16} className="floor-room-meta">
                      {room.area} м2
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </section>

        <aside className="surface floor-room-card">
          <div className="floor-room-card-head">
            <div>
              <p className="eyebrow">Помещение {selectedRoom.code}</p>
              <h3>{selectedRoom.title}</h3>
            </div>
            <span className="badge" style={{ background: statusMeta[selectedRoom.status].fill, color: statusMeta[selectedRoom.status].color, borderColor: statusMeta[selectedRoom.status].color }}>
              {statusMeta[selectedRoom.status].label}
            </span>
          </div>

          <div className="floor-room-grid">
            <div className="kv-item">
              <span>Площадь</span>
              <strong>{selectedRoom.area} м2</strong>
            </div>
            <div className="kv-item">
              <span>Назначение</span>
              <strong>{selectedRoom.purpose}</strong>
            </div>
            <div className="kv-item">
              <span>Статус</span>
              <strong>{statusMeta[selectedRoom.status].label}</strong>
            </div>
            <div className="kv-item">
              <span>Арендатор</span>
              <strong>{selectedRoom.tenant ?? "Свободно"}</strong>
            </div>
            <div className="kv-item">
              <span>Срок договора</span>
              <strong>{selectedRoom.leaseUntil ?? "Нет действующего договора"}</strong>
            </div>
            <div className="kv-item">
              <span>Этаж / блок</span>
              <strong>3 этаж, блок А</strong>
            </div>
          </div>

          <div className="callout floor-room-note">
            <p className="eyebrow">Комментарий</p>
            <strong>{selectedRoom.note}</strong>
          </div>

          <div className="floor-mini-list">
            <strong>На этом этаже</strong>
            <ul>
              <li>Свободные помещения подсвечены зелёным</li>
              <li>Помещения в аренде подсвечены синим</li>
              <li>Скоро освобождающиеся помещения отмечены тёплым цветом</li>
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
}
