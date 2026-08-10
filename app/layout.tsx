export default function RootLayout({ children }: { children: React.ReactNode }) { 
  return ( 
    <html lang="en"> 
      <body>
        {children}
        
        {/* GLOBAL SHOP FOOTER */}
        <footer style={{ backgroundColor: '#0b0f19', padding: '30px 20px', textAlign: 'center', borderTop: '1px solid #1e293b' }}>
          <a href="/shop" style={{ color: '#00a8ff', textDecoration: 'none', fontFamily: 'sans-serif', fontSize: '16px', textShadow: '0 0 8px rgba(0,210,255,0.3)' }}>
            Visit Our Shop
          </a>
        </footer>
      </body> 
    </html> 
  );
}
