import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Star, Zap, WifiOff } from 'lucide-react';

/**
 * PWAInstallPrompt
 * Shows a beautiful bottom-sheet install prompt for PWA.
 * Respects the browser's beforeinstallprompt event and shows
 * after a short delay. Dismissed state is stored in localStorage.
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Don't show if user already dismissed or installed
    const dismissed = localStorage.getItem('pwa_prompt_dismissed');
    const alreadyInstalled = window.matchMedia('(display-mode: standalone)').matches
      || window.navigator.standalone === true;

    if (dismissed || alreadyInstalled) return;

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after a short delay so the page settles
      setTimeout(() => setShowPrompt(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detect when app is installed
    window.addEventListener('appinstalled', () => {
      setInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        setInstalled(true);
      }
      setDeferredPrompt(null);
    } finally {
      setInstalling(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa_prompt_dismissed', '1');
  };

  if (!showPrompt) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleDismiss}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9998,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 0.3s ease'
        }}
      />

      {/* Bottom Sheet */}
      <div
        dir="rtl"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: 'linear-gradient(160deg, #0f0f14 0%, #1a1a24 100%)',
          borderRadius: '28px 28px 0 0',
          padding: '28px 24px 36px',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.08)',
          animation: 'slideUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
          maxWidth: '520px',
          margin: '0 auto',
        }}
      >
        {/* Handle bar */}
        <div style={{
          width: '40px',
          height: '4px',
          borderRadius: '2px',
          background: 'rgba(255,255,255,0.2)',
          margin: '0 auto 20px',
        }} />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '34px',
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#a0a0b0',
          }}
        >
          <X size={16} />
        </button>

        {/* App Icon + Name Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '18px',
            overflow: 'hidden',
            border: '2px solid rgba(242,13,22,0.4)',
            boxShadow: '0 0 20px rgba(242,13,22,0.3)',
            flexShrink: 0,
          }}>
            <img src="/logo.png" alt="POWER MAX" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>
              POWER MAX
            </div>
            <div style={{ fontSize: '13px', color: '#a0a0b0', fontWeight: 500 }}>
              متجر أدوات المنزل والعروسة
            </div>
            {/* Stars */}
            <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" />
              ))}
              <span style={{ fontSize: '12px', color: '#747474', marginRight: '4px' }}>4.9</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '24px'
        }}>
          {[
            { icon: <Zap size={18} color="#fbbf24" />, label: 'سريع جداً' },
            { icon: <WifiOff size={18} color="#34d399" />, label: 'يعمل أوفلاين' },
            { icon: <Smartphone size={18} color="#60a5fa" />, label: 'تجربة تطبيق' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '14px',
                padding: '12px 8px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              {icon}
              <span style={{ fontSize: '11px', color: '#d0d0e0', fontWeight: 600 }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Description */}
        <p style={{
          fontSize: '14px',
          color: '#9090a8',
          lineHeight: '1.7',
          marginBottom: '24px',
          textAlign: 'center',
        }}>
          ثبّت تطبيق <strong style={{ color: '#ffffff' }}>POWER MAX</strong> على شاشتك الرئيسية للوصول السريع وتجربة تسوق أفضل بدون إنترنت!
        </p>

        {/* Install Button */}
        <button
          onClick={handleInstall}
          disabled={installing}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '16px',
            border: 'none',
            background: installing
              ? 'rgba(242,13,22,0.5)'
              : 'linear-gradient(135deg, #f20d16 0%, #c20010 100%)',
            color: '#ffffff',
            fontSize: '16px',
            fontWeight: 800,
            cursor: installing ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 6px 25px rgba(242,13,22,0.4)',
            transition: 'transform 0.1s, box-shadow 0.1s',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          <Download size={20} />
          <span>{installing ? 'جاري التثبيت...' : 'تثبيت التطبيق مجاناً'}</span>
        </button>

        {/* Skip */}
        <button
          onClick={handleDismiss}
          style={{
            width: '100%',
            marginTop: '12px',
            padding: '12px',
            background: 'none',
            border: 'none',
            color: '#606070',
            fontSize: '13px',
            cursor: 'pointer',
            fontWeight: 600,
          }}
        >
          لاحقاً
        </button>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </>
  );
}
