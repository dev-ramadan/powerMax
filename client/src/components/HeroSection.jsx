
import React from "react";
import { ArrowLeft } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="hero" id="home">
      <div className="hero-copy">
        <span className="eyebrow">
          <span />
          بيتك يستاهل الأفضل من POWER MAX
        </span>

        <h1>
          كل اللي محتاجه
          <br />
          لبيتك <em>في مكان واحد</em>
        </h1>

        <p>
          من أدوات المطبخ لاحتياجات البيت اليومية،
          اختار منتجات عملية وجودة تعتمد عليها،
          بأسعار تناسبك من POWER MAX.
        </p>

        <div className="hero-actions">
          <a className="primary-btn" href="#products">
            اكتشف المنتجات
            <ArrowLeft size={18} />
          </a>

          <a className="text-link" href="#bundles">
            تجهيزات العروسة
          </a>
        </div>

        <div className="hero-note">
          <span className="avatars">✿　✦　❋</span>
          <span>اختيارات عملية لكل بيت</span>
        </div>
      </div>

      <div className="hero-art">
        <div className="hero-photo">
          <img
            src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=85"
            alt="مطبخ أنيق ومجهز"
          />
        </div>

        <div className="floating-note">
          <span className="note-icon">✦</span>
          <span>
            <b>بيتك على ذوقك</b>
            <small>تفاصيل صغيرة بتفرق</small>
          </span>
        </div>

        <div className="hero-stamp">
          HOME
          <br />
          <span>♥</span>
          <br />
          LOVE
        </div>
      </div>
    </section>
  );
}
