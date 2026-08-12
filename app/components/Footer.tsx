import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#0b0f19',
        padding: '30px 20px',
        textAlign: 'center',
        borderTop: '1px solid #1e293b',
        width: '100%',
      }}
    >
      <nav style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontFamily: 'sans-serif', fontSize: '14px', color: '#5A6472' }}>© 2026 Kliqhub</span>

        <Link
          href="/about"
          style={{
            color: '#8B98A5',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            padding: '6px 8px',
          }}
        >
          About
        </Link>

        <Link
          href="/shop"
          style={{
            color: '#00a8ff',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
            fontSize: '16px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
            padding: '6px 8px',
          }}
        >
          Visit Our Shop
        </Link>

        <Link
          href="/shop"
          style={{
            color: '#8B98A5',
            textDecoration: 'none',
            fontFamily: 'sans-serif',
            fontSize: '14px',
            padding: '6px 8px',
            opacity: 0.95,
          }}
        >
          Shop
        </Link>
      </nav>
    </footer>
  );
}
