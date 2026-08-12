'use client';

import React from 'react';

const SHOP_URL = '#';

export default function ShopPage() {
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
        color: '#E6EDF3',
        padding: '3rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '880px' }}>
        {/* Hero image: add the provided merch image to the repo as /kliqhub-merch.png */}
        <img
          src="/kliqhub-merch.png"
          alt="KliqHub merch preview"
          onError={(e) => {
            // fallback to existing merch.png if the new image isn't available
            // @ts-ignore DOM types in Next.js server components
            const target = e.currentTarget as HTMLImageElement;
            if (target && target.src.indexOf('/kliqhub-merch.png') !== -1) {
              target.src = '/merch.png';
            }
          }}
          style={{
            maxWidth: '880px',
            width: '100%',
            height: 'auto',
            marginBottom: '24px',
            borderRadius: '12px',
          }}
        />

        <h2
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: '#E6EDF3',
          }}
        >
          KliqHub Official Merch
        </h2>

        <p
          style={{
            fontSize: '1rem',
            lineHeight: 1.6,
            marginBottom: '1.5rem',
            color: '#E6EDF3',
            opacity: 0.9,
          }}
        >
          Shop premium Proof of Trust apparel and gear that lets you wear the
          mission of safer online interactions. Every piece supports the
          KliqHub community and our Zero Trust Oracle technology.
        </p>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            textAlign: 'left',
            display: 'inline-block',
          }}
        >
          <li style={{ marginBottom: '0.6rem' }}>
            • Proof of Trust Hoodies with Trust Score badge
          </li>
          <li style={{ marginBottom: '0.6rem' }}>
            • Zero Trust Oracle T-Shirts
          </li>
          <li style={{ marginBottom: '0.6rem' }}>
            • Community Consensus Caps
          </li>
          <li style={{ marginBottom: '0.6rem' }}>
            • Limited edition KliqHub Varsity Jackets
          </li>
        </ul>

        <div style={{ marginTop: '1.75rem' }}>
          <a
            href={SHOP_URL}
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg,#1F51FF,#00D4FF)',
              color: '#fff',
              padding: '10px 18px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: 700,
            }}
          >
            Visit the shop
          </a>
        </div>

        <p style={{ marginTop: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
          Can&apos;t see the shop? <a href={SHOP_URL} style={{ color: '#1F51FF' }}>Click here</a> or check back soon — new drops coming regularly.
        </p>

      </div>
    </div>
  );
}
