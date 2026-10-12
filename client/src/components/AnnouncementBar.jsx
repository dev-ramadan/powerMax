
import React from "react";
import { Sparkles } from "lucide-react";
import "./AnnouncementBar.css"
export default function AnnouncementBar() {
  return (
    <div className="announcement">
      <Sparkles size={16} aria-hidden="true" />
      <p>
        كل تفاصيل بيتك في مكان واحد — اكتشف عروض POWER MAX
      </p>
    </div>
  );
}
