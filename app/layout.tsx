import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) { 
  return ( 
    <html lang="en"> 
      <body style={{ margin: 0, padding: 0 }}>
        {children}
        
        {/* GLOBAL SHOP FOOTER */}
        <footer style={{ backgroundColor: '#0b0f19', padding: '30px 20px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
          <a href="/shop" style={{ color: '#00a8ff', textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '16px', fontWeight: 'bold' }}>
            Visit Our Shop
          </a>
        </footer>
      </body> 
    </html> 
  );
}
