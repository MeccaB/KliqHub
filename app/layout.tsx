import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Kliqhub — Know Who You're Really Dealing With",
  description:
    'Check any email, domain, phone number, or image in seconds. Kliqhub scores real security risk using live threat intelligence, so you know who and what you can actually trust online.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: "Kliqhub — Know Who You're Really Dealing With",
    description:
      'Check any email, domain, phone number, or image in seconds. Kliqhub scores real security risk using live threat intelligence, so you know who and what you can actually trust online.',
    url: 'https://www.kliqhub.com',
    siteName: 'Kliqhub',
    images: [
      {
        url: 'https://www.kliqhub.com/logo.png',
        width: 1024,
        height: 1024,
        alt: 'Kliqhub logo',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: "Kliqhub — Know Who You're Really Dealing With",
    description:
      'Check any email, domain, phone number, or image in seconds. Kliqhub scores real security risk using live threat intelligence, so you know who and what you can actually trust online.',
    images: ['https://www.kliqhub.com/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
