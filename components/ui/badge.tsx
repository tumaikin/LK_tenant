import clsx from "clsx";
import { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  tone?: "neutral" | "info" | "warning" | "success" | "danger";
};

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  neutral: "badge badge-neutral",
  info: "badge badge-info",
  warning: "badge badge-warning",
  success: "badge badge-success",
  danger: "badge badge-danger"
};

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  return <span className={clsx(tones[tone])}>{children}</span>;
}
