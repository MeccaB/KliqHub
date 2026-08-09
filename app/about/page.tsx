import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const displayFont = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'] });
const bodyFont = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });
const monoFont = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: 'About — Kliqhub',
  description: 'Trust intelligence APIs for fintech, email service providers, and digital marketplaces.',
};

interface BenefitRow {
  benefit: string;
  impact: string;
}

const BENEFIT_ROWS: BenefitRow[] = [
  {
    benefit: 'Single-Call Trust Scoring',
    impact: 'Score an email, domain, phone number, or image in one API call, no separate integrations per signal type.',
  },
  {
    benefit: 'Real Security Signal, Not Guesswork',
    impact: 'Built on VirusTotal\u2019s security vendor network, Have I Been Pwned\u2019s breach database, and Google Vision\u2019s web-matching, so every score traces back to a verifiable source.',
  },
  {
    benefit: 'Transparent Point-Deduction Engine',
    impact: 'No black box. Every score comes with the exact list of flags that raised or lowered it.',
  },
  {
    benefit: 'ESP & Fintech Native',
    impact: 'Built for onboarding flows, transaction checks, and marketplace trust signals from day one.',
  },
  {
    benefit: 'Cached for Speed',
    impact: 'Repeat lookups return instantly from cache instead of re-querying external APIs every time.',
  },
];

export default function AboutPage() {
  return (
    <main className={`${bodyFont.className} min-h-screen w-full`} style={{ background: '#0B0F14', color: '#E6EDF3' }}>
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#232D3A 1px, transparent 1px), linear-gradient(90deg, #232D3A 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto flex max-w-3xl flex-col px-6 pb-24 pt-16 sm:pt-24">
        
          href="/"
          className={monoFont.className}
          style={{ fontSize: '0.78rem', color: '#8B98A5', marginBottom: '2.5rem', textDecoration: 'none' }}
        >
          ← Back to the trust scanner
        </a>

        <div className="mb-4 flex w-fit items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: '#232D3A' }}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#22D3EE', boxShadow: '0 0 8px #22D3EE' }} />
          <span className={monoFont.className} style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#8B98A5' }}>
            TRUST INTELLIGENCE APIS
          </span>
        </div>

        <h1 className={displayFont.className} style={{ fontSize: '2.4rem', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
          Verify Faster, Risk Less, Scale Safely
        </h1>

        <p className={displayFont.className} style={{ fontSize: '1.15rem', fontWeight: 500, color: '#22D3EE', marginTop: '1rem' }}>
          The trust layer for fintech, email service providers, and digital marketplaces.
        </p>

        <p style={{ fontSize: '1rem', color: '#8B98A5', marginTop: '1.5rem', lineHeight: 1.7, maxWidth: '38rem' }}>
          In a world of synthetic IDs, cross-border fraud, and web3 rug pulls, trust is the new infrastructure.
          Kliqhub delivers real-time trust intelligence via a simple REST API, so your platform can check users,
          catch scams, and stop fraud before it hits your P&amp;L. No rip-and-replace. Plug in trust where you
          already onboard, verify, or transact.
        </p>

        <div className="mt-14">
          <h2 className={displayFont.className} style={{ fontSize: '1.3rem', fontWeight: 600, marginBottom: '1.5rem' }}>
            Why businesses choose Kliqhub
          </h2>

          <div className="flex flex-col gap-3">
            {BENEFIT_ROWS.map((row) => (
              <div
                key={row.benefit}
                className="rounded-xl border p-5"
                style={{ borderColor: '#232D3A', background: 'linear-gradient(180deg, #121820 0%, #0F141B 100%)' }}
              >
                <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#E6EDF3' }}>{row.benefit}</p>
                <p style={{ fontSize: '0.85rem', color: '#8B98A5', marginTop: '0.4rem', lineHeight: 1.6 }}>{row.impact}</p>
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-14 rounded-2xl border p-8 text-center"
          style={{ borderColor: '#232D3A', background: 'linear-gradient(180deg, #121820 0%, #0F141B 100%)' }}
        >
          <h2 className={displayFont.className} style={{ fontSize: '1.2rem', fontWeight: 600 }}>
            Building with Kliqhub
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#8B98A5', marginTop: '0.6rem', maxWidth: '30rem', marginLeft: 'auto', marginRight: 'auto' }}>
            For platform, fintech, and marketplace integrations, reach out and we&apos;ll walk through your use
            case.
          </p>
          
            href="mailto:hello@kliqhub.com"
            className={displayFont.className}
            style={{
              display: 'inline-block',
              marginTop: '1.25rem',
              background: '#22D3EE',
              color: '#0B0F14',
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
