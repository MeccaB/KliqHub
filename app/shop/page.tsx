'use client';

import React, { useEffect } from 'react';

export default function ShopRedirectPage() {
  useEffect(() => {
    // Automatically forwards to your store after 3 seconds
    const redirectTimer = setTimeout(() => {
      window.location.href = "https://etsy.com"; // <-- REPLACE WITH YOUR LIVE STORE URL
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
      <style>{`
        @keyframes pulse-glow {
          from { opacity: 0.7; text-shadow: 0 0 5px #00d2ff, 0 0 10px #00d2ff; }
          to { opacity: 1; text-shadow: 0 0 10px #00d2ff, 0 0 20px #00a8ff, 0 0 40px #00a8ff; }
        }
      `}</style>
      
      <div style={{ textAlign: 'center' }}>
        {/* Grabs the image you already have saved in your public folder */}
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
          animation: 'pulse-glow 1.5s infinite alternate'
        }}>
          Taking you to our shop...
        </div>
        
        <a 
          href="https://etsy.com" // <-- REPLACE WITH YOUR LIVE STORE URL
          style={{ marginTop: '30px', display: 'inline-block', color: '#00a8ff', textDecoration: 'none', fontSize: '14px', opacity: 0.8 }}
        >
          Click here if you aren't redirected
        </a>
      </div>
    </div>
  );
}
