
import React from "react";
import { Truck, ShieldCheck, BadgePercent, Headset } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "توصيل لحد باب البيت",
    description: "استلم طلبك بكل سهولة",
  },
  {
    icon: ShieldCheck,
    title: "جودة تقدر تثق فيها",
    description: "منتجات مختارة بعناية",
  },
  {
    icon: BadgePercent,
    title: "عروض وأسعار مميزة",
    description: "قيمة أكبر مقابل فلوسك",
  },
  {
    icon: Headset,
    title: "دعم ومساعدة",
    description: "إحنا معاك وقت ما تحتاجنا",
  },
];

export default function Benefits() {
  return (
    <section className="benefits" aria-label="مميزات POWER MAX">
      {benefits.map(({ icon: Icon, title, description }) => (
        <div className="benefit-item" key={title}>
          <div className="benefit-icon">
            <Icon size={23} />
          </div>

          <div className="benefit-copy">
            <h3>{title}</h3>
            <p>{description}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
