import Link from "next/link";

type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
  href?: string;
};

export function StatCard({ label, value, hint, href }: StatCardProps) {
  const content = (
    <>
      <span className="stat-label">{label}</span>
      <strong>{value}</strong>
      {hint ? <p className="stat-hint">{hint}</p> : null}
    </>
  );

  if (href) {
    return (
      <Link className="surface stat-card stat-card-link" href={href}>
        {content}
      </Link>
    );
  }

  return (
    <div className="surface stat-card">
      {content}
    </div>
  );
}
