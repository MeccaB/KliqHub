import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About KliqHub',
  description: 'Trust intelligence APIs for fintech, email service providers, and digital marketplaces.',
};

export default function AboutPage() {
  return (
    <main style={{ background: '#000000', color: '#E6EDF3', minHeight: '100vh', width: '100%', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '40rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '0.8rem', color: '#8B98A5', textDecoration: 'none' }}>
          ← Back to the trust scanner
        </a>
        
        <img src="/logo.png" alt="Kliqhub logo" style={{ width: '64px', height: '64px', borderRadius: '14px', marginTop: '2rem', marginBottom: '1.5rem' }} />
        
        <h1 style={{ fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>
          About KliqHub
        </h1>

        <p style={{ fontSize: '1rem', color: '#8B98A5', marginTop: '1.5rem', lineHeight: 1.8 }}>
          KliqHub is a free trust-layer scanner. Drop in an email, domain, phone number, or image, and get back a real-time Trust Score built from live security signal, not guesswork.
        </p>

        <p style={{ fontSize: '1rem', color: '#8B98A5', marginTop: '1.25rem', lineHeight: 1.8 }}>
          We built KliqHub because verifying who and what you're dealing with online shouldn't require a dozen different tools. One check, one score, one clear answer.
        </p>

        <p style={{ fontSize: '0.9rem', color: '#8B98A5', marginTop: '2.5rem' }}>
          Questions or partnership inquiries:{' '}
          <a href="mailto:hello@kliqhub.com" style={{ color: '#1F51FF' }}>
            hello@kliqhub.com
          </a>
        </p>

           {/* --- Social Links Section --- */}
        <div style={{ marginTop: '2.5rem', borderTop: '1px solid #21262D', paddingTop: '1.5rem' }}>
          <p style={{ fontSize: '0.85rem', color: '#8B98A5', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem' }}>
            Follow our ecosystem
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
            
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" style={{ color: '#8B98A5', transition: 'color 0.2s' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com/KLIQHUB" target="_blank" rel="noopener noreferrer" aria-label="Facebook" style={{ color: '#8B98A5', transition: 'color 0.2s' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/kliqhub/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ color: '#8B98A5', transition: 'color 0.2s' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>

            {/* TikTok */}
            <a href="https://www.tiktok.com/@kliqhub" target="_blank" rel="noopener noreferrer" aria-label="TikTok" style={{ color: '#8B98A5', transition: 'color 0.2s' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
              </svg>
            </a>

            {/* X (Twitter) */}
            <a href="https://x.com/Kliq_Hub" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)" style={{ color: '#8B98A5', transition: 'color 0.2s' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
