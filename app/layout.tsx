import React from 'react';
import Footer from './components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* Body is a column flex container that always fills the viewport */}
      <body
        style={{
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          // Consider placing a safe default background here so empty children don't expose a broken screen
          background: '#000000',
        }}
      >
        {/* Main grows to fill available space so footer stays anchored to bottom */}
        <main style={{ flex: 1, width: '100%' }}>
          {/* Ensure an inner wrapper enforces at least viewport height for empty pages */}
          <div style={{ minHeight: '100vh', width: '100%' }}>
            {children}
          </div>
        </main>

        {/* Site footer component */}
        <Footer />
      </body>
    </html>
  );
}
