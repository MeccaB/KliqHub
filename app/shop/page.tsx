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
        <p style={{ color: '#8B98A5', fontSize: '1rem', lineHeight: 1.6 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus
          diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed
          augue semper porta. Mauris massa.
        </p>
      </div>
    </div>
  );
}
