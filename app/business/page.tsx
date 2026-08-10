import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'KliqHub for Business',
  description: 'The trust layer for fintech, email service providers, and digital marketplaces.',
};

interface BenefitRow {
  benefit: string;
  impact: string;
}

const BENEFIT_ROWS: BenefitRow[] = [
  {
    benefit: '1-Click Transaction Verification',
    impact: 'Score any user with a single API call, built directly into your existing checkout or onboarding flow.',
  },
  {
    benefit: 'Crowdsourced Scam Intel',
    impact: 'Access a growing, real-time database of known scams, phishing domains, and fraudulent actors.',
  },
  {
    benefit: 'AI + Human Vetted Signals',
    impact: 'Machine learning combined with verified reporting, so signal quality improves as the network grows.',
  },
  {
    benefit: 'ESP & Fintech Native',
    impact: 'Built for onboarding flows, transaction checks, and marketplace trust signals from day one.',
  },
  {
    benefit: 'Privacy-First by Design',
    impact: 'Encrypted payloads and GDPR/CCPA-conscious handling, with zero-knowledge proofs on our roadmap for privacy-preserving verification.',
  },
];

export default function BusinessPage() {
  return (
    <main style={{ background: '#000000', color: '#E6EDF3', minHeight: '100vh', width: '100%', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div style={{ maxWidth: '42rem', margin: '0 auto', padding: '4rem 1.5rem' }}>
        <a href="/" style={{ fontSize: '0.8rem', color: '#8B98A5', textDecoration: 'none' }}>
          ← Back to the trust scanner
        </a>

        <div style={{ marginTop: '1.5rem', marginBottom: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #232D3A', borderRadius: '999px', padding: '0.25rem 0.75rem' }}>
          <span style={{ height: '6px', width: '6px', borderRadius: '999px', background: '#1F51FF' }} />
          <span style={{ fontSize: '0.7rem', letterSpacing: '0.12em', color: '#8B98A5' }}>TRUST INTELLIGENCE APIS</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15, margin: 0 }}>
          Verify Faster, Risk Less, Scale Safely
        </h1>

        <p style={{ fontSize: '1.05rem', fontWeight: 500, color: '#1F51FF', marginTop: '1rem' }}>
          The trust layer for fintech, email service providers, and digital marketplaces.
        </p>

        <p style={{ fontSize: '1rem', color: '#8B98A5', marginTop: '1.5rem', lineHeight: 1.7 }}>
          In a world of synthetic IDs, cross-border fraud, and web3 rug pulls, trust is the new infrastructure.
          Kliqhub delivers real-time trust intelligence via simple REST APIs, so your platform can verify users,
          detect scams, and prevent fraud before it hits your P&amp;L. No rip-and-replace, just plug in trust.
        </p>

        <h2 style={{ fontSize: '1.3rem', fontWeight: 600, marginTop: '3rem', marginBottom: '1.5rem' }}>
          Why Businesses Choose KliqHub
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {BENEFIT_ROWS.map((row) => (
            <div key={row.benefit} style={{ border: '1px solid #232D3A', borderRadius: '0.75rem', padding: '1.25rem', background: '#0A0A0F' }}>
              <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#E6EDF3', margin: 0 }}>{row.benefit}</p>
              <p style={{ fontSize: '0.85rem', color: '#8B98A5', marginTop: '0.4rem', lineHeight: 1.6 }}>{row.impact}</p>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3.5rem', border: '1px solid #232D3A', borderRadius: '1rem', padding: '2rem', textAlign: 'center', background: '#0A0A0F' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 600, margin: 0 }}>Building with KliqHub</h2>
          <p style={{ fontSize: '0.9rem', color: '#8B98A5', marginTop: '0.6rem', maxWidth: '30rem', marginLeft: 'auto', marginRight: 'auto' }}>
            For platform, fintech, and marketplace integrations, reach out and we&apos;ll walk through your use case.
          </p>
          <a
            href="mailto:hello@kliqhub.com"
            style={{
              display: 'inline-block',
              marginTop: '1.25rem',
              background: '#1F51FF',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.9rem',
              padding: '0.75rem 1.75rem',
              borderRadius: '0.75rem',
              textDecoration: 'none',
            }}
          >
            Get in touch
          </a>
        </div>
      </div>
    </main>
  );
}
