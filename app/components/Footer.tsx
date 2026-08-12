import React from 'react';

export default function Footer() {
  return (
    <footer style={{ 
      backgroundColor: '#0b0f19', 
      padding: '30px 20px', 
      textAlign: 'center', 
      borderTop: '1px solid #1e293b',
      width: '100%'
    }}>
      <a 
        href="/shop"
        style={{ 
          color: '#00a8ff', 
          textDecoration: 'none', 
          fontFamily: 'sans-serif', 
          fontSize: '16px', 
          fontWeight: 'bold',
          letterSpacing: '0.5px'
        }}
      >
        Visit Our Shop
      </a>
    </footer>
  );
}
