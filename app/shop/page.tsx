'use client';

import React, { useEffect } from 'react';

export default function ShopRedirectPage() {
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      // FORWARD DESTINATION URL (Replace with your actual store link)
      window.location.href = "https://etsy.com"; 
    }, 3000);

    return () => clearTimeout(redirectTimer);
  }, []);

  return (
    <div style={{
      margin: 0,
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#0b0f19',
      fontFamily: 'sans-serif',
      overflow: 'hidden'
    }}>
      <div style={{ textAlign: 'center' }}>
        {/* Targets your 'KH merch.png' asset inside your repository */}
        <img 
          src="/KH merch.png" 
          alt="KliqHub Logo" 
          style={{ maxWidth: '240px', height: 'auto', marginBottom: '30px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }} 
        />
        
        <div style={{
          fontSize: '24px',
          color: '#fff',
          fontWeight: 'bold',
          letterSpacing: '1px',
          textShadow: '0 0 10px #00d2ff, 0 0 20px #00a8ff'
        }}>
          Taking you to our shop...
        </div>
        
        <a 
          href="https://etsy.com" 
          style={{ marginTop: '30px', display: 'inline-block', color: '#00a8ff', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}
        >
          Click here if you aren't redirected
        </a>
      </div>
    </div>
  );
}
