'use client';

import React from 'react';

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
        <img
          src="/merch.png"
          alt="KliqHub merch preview"
          style={{ maxWidth: '880px', width: '100%', height: 'auto', marginBottom: '24px', borderRadius: '12px' }}
        />

        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: '#E6EDF3' }}>KliqHub Merch</h2>
        h2>KliqHub Official Merch</h2>
<p>Shop premium Proof of Trust apparel and gear that lets you wear the mission of safer online interactions. Every piece supports the KliqHub community and our Zero Trust Oracle technology.</p>
<ul>
  <li>Proof of Trust Hoodies with Trust Score badge</li>
  <li>Zero Trust Oracle T-Shirts</li>
  <li>Community Consensus Caps</li>
  <li>Anti-Scam Stickers & Laptop Decals</li>
  <li>Limited-Edition PeerSale Crewnecks</li>
</ul>
      </div>
    </div>
  );
}
