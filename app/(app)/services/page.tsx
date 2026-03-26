"use client";

import { PageHeader } from "@/components/layout/page-header";
import { useAppState } from "@/components/providers/app-provider";
import { formatCurrency } from "@/lib/format";

export default function ServicesPage() {
  const { getServices } = useAppState();
  const services = getServices();

  return (
    <>
      <PageHeader title="Дополнительные услуги" description="Каталог доступных дополнительных услуг для арендатора." />
      <section className="card-grid">
        {services.map((service) => (
          <article key={service.id} className="surface list-card">
            <p className="eyebrow">{service.unit}</p>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <strong>{service.price === 0 ? "Бесплатно" : formatCurrency(service.price)}</strong>
          </article>
        ))}
      </section>
    </>
  );
}
