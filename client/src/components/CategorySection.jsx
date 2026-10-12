
import React from "react";
import {
  CookingPot,
  Utensils,
  Coffee,
  Refrigerator,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const categoryIcons = [
  CookingPot,
  Utensils,
  Coffee,
  Refrigerator,
  Sparkles,
];

export default function CategorySection({
  categories = [],
  selectedCategory,
  onSelectCategory,
}) {
  return (
    <section className="categories-section" id="categories">
      <div className="section-heading">
        <div>
          <span className="section-kicker">تسوق حسب احتياجك</span>
          <h2>اكتشف أقسامنا</h2>
          <p>كل اللي محتاجه لبيتك هتلاقيه هنا</p>
        </div>

        <a href="#products" className="text-link">
          كل المنتجات <ArrowLeft size={16} />
        </a>
      </div>

      <div className="category-grid">
        {categories.map((category, index) => {
          const Icon = categoryIcons[index % categoryIcons.length];

          // يدعم الأقسام المكتوبة كنص أو ككائن
          const name =
            typeof category === "string"
              ? category
              : category.name;

          const isSelected = selectedCategory === name;

          return (
            <button
              type="button"
              className={`category-card ${isSelected ? "active" : ""}`}
              key={name}
              onClick={() => onSelectCategory(name)}
              aria-pressed={isSelected}
            >
              <span className="category-icon">
                <Icon size={28} />
              </span>

              <span className="category-name">{name}</span>

              <span className="category-arrow">
                <ArrowLeft size={16} />
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
