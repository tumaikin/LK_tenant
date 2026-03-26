import Link from "next/link";
import { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { PRIORITY_LABELS, STATUS_META } from "@/lib/constants";
import { formatDateTime } from "@/lib/format";
import { RequestRow } from "@/lib/types";

type RequestTableProps = {
  requests: RequestRow[];
  hrefBuilder: (requestId: string) => string;
  title?: string;
  action?: ReactNode;
  showMeta?: boolean;
  countLabel?: string;
};

export function RequestTable({
  requests,
  hrefBuilder,
  title = "Технические обращения",
  action,
  showMeta = true,
  countLabel = "Количество заявок:"
}: RequestTableProps) {
  return (
    <div className="surface table-wrap">
      <div className="table-toolbar">
        {showMeta ? (
          <div className="table-toolbar-main">
            <strong>{title}</strong>
            <span>
              {countLabel} {requests.length}
            </span>
          </div>
        ) : (
          <div />
        )}
        {action ? <div className="table-toolbar-actions">{action}</div> : null}
      </div>
      <div className="registry-table">
        <table>
          <thead>
            <tr>
              <th>Номер</th>
              <th>Тема</th>
              <th>Арендатор</th>
              <th>Статус</th>
              <th>Приоритет</th>
              <th>Исполнитель</th>
              <th>Обновлено</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <Link href={hrefBuilder(request.id)}>{request.number}</Link>
                </td>
                <td>{request.title}</td>
                <td>{request.tenant.name}</td>
                <td>
                  <Badge tone={STATUS_META[request.status].tone}>{STATUS_META[request.status].label}</Badge>
                </td>
                <td>{PRIORITY_LABELS[request.priority]}</td>
                <td>{request.executor?.name ?? "Не назначен"}</td>
                <td>{formatDateTime(request.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
