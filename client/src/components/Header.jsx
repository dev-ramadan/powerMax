import React from "react";
import "./Header.css";

export default function Header({ cartCount = 0, onCartClick }) {
  const categories = [
    { label: "الرئيسية", href: "#home" },
    { label: "أدوات المطبخ", href: "#kitchen" },
    { label: "الأجهزة المنزلية", href: "#appliances" },
    { label: "تجهيزات العروسة", href: "#bridal" },
    { label: "العروض", href: "#offers", highlight: true },
  ];

  return (
    <header className="pm-header" dir="rtl">
      <div className="pm-header__main">
        <a className="pm-header__logo" href="#home" aria-label="POWER MAX الرئيسية">
          <img
            src="/logo.png"
            alt="POWER MAX - The Best in Home World"
          />
        </a>

        <form
          className="pm-header__search"
          role="search"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const query = formData.get("search")?.toString().trim();

            if (query) {
              window.location.hash = `search=${encodeURIComponent(query)}`;
            }
          }}
        >
          <input
            type="search"
            name="search"
            placeholder="بتدور على إيه؟"
            aria-label="ابحث عن المنتجات"
          />
          <button type="submit" aria-label="بحث">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
          </button>
        </form>

        <button
          className="pm-header__cart"
          type="button"
          onClick={onCartClick}
          aria-label={`سلة المشتريات، ${cartCount} منتجات`}
        >
          <span className="pm-header__cart-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 1.9-1.5L21 8H6" />
              <circle cx="10" cy="20" r="1.3" />
              <circle cx="18" cy="20" r="1.3" />
            </svg>
            {cartCount > 0 && (
              <span className="pm-header__cart-count">{cartCount}</span>
            )}
          </span>
          <span className="pm-header__cart-label">السلة</span>
        </button>
      </div>

      <nav className="pm-header__nav" aria-label="القائمة الرئيسية">
        {categories.map((category) => (
          <a
            key={category.href}
            href={category.href}
            className={category.highlight ? "is-highlighted" : ""}
          >
            {category.label}
          </a>
        ))}
      </nav>
    </header>
  );
}