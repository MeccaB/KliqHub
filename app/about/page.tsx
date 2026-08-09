import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Kliqhub',
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
          About Kliqhub
        </h1>

        {/*
          Edit the text below any time — this is the only part of the file you need to touch.
          Everything above and below this comment is just layout and styling.
        */}
        <p style={{ fontSize: '1rem', color: '#8B98A5', marginTop: '1.5rem', lineHeight: 1.8 }}>
          Kliqhub is a free trust-layer scanner. Drop in an email, domain, phone number, or image, and get back
          a real-time Trust Score built from live security signal, not guesswork.
        </p>

        <p style={{ fontSize: '1rem', color: '#8B98A5', marginTop: '1.25rem', lineHeight: 1.8 }}>
          We built Kliqhub because verifying who and what you're dealing with online shouldn't require a dozen
          different tools. One check, one score, one clear answer.
        </p>

        <p style={{ fontSize: '0.9rem', color: '#8B98A5', marginTop: '2.5rem' }}>
          Questions or partnership inquiries:{' '}
          <a href="mailto:hello@kliqhub.com" style={{ color: '#1F51FF' }}>
            hello@kliqhub.com
          </a>
        </p>
      </div>
    </main>
  );
}
