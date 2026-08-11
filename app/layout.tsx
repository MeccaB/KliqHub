import React from 'react';
import Footer from './components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) { 
  return ( 
    <html lang="en"> 
      <body style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        
        {/* Main Content Area */}
        <main style={{ flex: 1 }}>
          {children}
        </main>
        
        {/* Site footer component */}
        <Footer />

      </body> 
    </html> 
  );
}
