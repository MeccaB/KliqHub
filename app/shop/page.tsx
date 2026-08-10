'use client';

import { useEffect } from 'react';

const SHOP_URL = '#';

export default function ShopRedirectPage() {
  useEffect(() => {
    if (SHOP_URL === '#') return;
    const redirectTimer = setTimeout(() => {
      window.location.href = SHOP_URL;
    }, 3000);
    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <div
      style={{
        margin: 0,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000000',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <img
          src="/merch.png"
          alt="Kliqhub merchandise preview"
          style={{ maxWidth: '320px', width: '100%', height: 'auto', marginBottom: '30px', borderRadius: '12px' }}
        />

        <div
          style={{
            fontSize: '22px',
            color: '#fff',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textShadow: '0 0 10px #1F51FF, 0 0 20px #1F51FF',
          }}
        >
          Taking you to our shop...
        </div>

        <a href={SHOP_URL} style={{ marginTop: '30px', display: 'inline-block', color: '#1F51FF', textDecoration: 'none', fontSize: '14px', opacity: 0.85 }}>Click here if you aren&apos;t redirected</a>
      </div>
    </div>
  );
}
