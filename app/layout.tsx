import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) { 
  return ( 
    <html lang="en"> 
      <body style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Main Content Area */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
        
        {/* Clean, Simple Footer Link */}
        <footer style={{ backgroundColor: '#0b0f19', padding: '20px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
          <a 
            href="https://etsy.com" 
            target="_blank" 
            rel="noopener noreferrer" 
            style={{ color: '#00a8ff', textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '15px', fontWeight: 'bold' }}
          >
            Visit Our Shop
          </a>
        </footer>

      </body> 
    </html> 
  );
}
