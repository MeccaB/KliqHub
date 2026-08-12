'use client';

import React from 'react';

const SHOP_URL = 'https://etsy.com';

export default function ShopPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        color: '#E6EDF3',
        width: '100%',
        fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        padding: '3rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '720px', width: '100%' }}>
        <img
          src="/merch.png"
          alt="Kliqhub merchandise preview"
          style={{ maxWidth: '420px', width: '100%', height: 'auto', margin: '0 auto 24px', borderRadius: '12px' }}
        />

        <h1 style={{ fontSize: '1.75rem', margin: '0 0 8px', fontWeight: 700 }}>Kliqhub Merch</h1>
        <p style={{ color: '#8B98A5', margin: '0 0 18px' }}>
          Browse our curated merch — shirts, stickers, and more. Click below to visit our shop.
        </p>

        <a
          href={SHOP_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: '#1F51FF',
            color: '#fff',
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 700,
          }}
        >
          Open Shop
        </a>
      </div>
    </main>
  );
}
