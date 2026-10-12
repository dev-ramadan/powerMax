import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton({ phoneNumber = '01022467259', message = 'مرحباً، أود الاستفسار عن منتجات POWER MAX' }) {
  const url = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 1500,
        backgroundColor: '#25D366',
        color: '#ffffff',
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 20px rgba(37, 211, 102, 0.4)',
        cursor: 'pointer',
        textDecoration: 'none',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
      title="تواصل معنا عبر واتساب"
      aria-label="تواصل معنا عبر واتساب"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <MessageCircle size={30} />
    </a>
  );
}
