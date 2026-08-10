import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kliqhub — Know Who You're Really Dealing With',
  description:
    'Calculate a real-time Trust Score for any email, domain, phone number, or image using free security intelligence APIs.',
  icons: {
    icon: '/logo.png',
  },
  openGraph: {
    title: 'Kliqhub — Trust Layer',
    description:
      'Calculate a real-time Trust Score for any email, domain, phone number, or image using free security intelligence APIs.',
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
    title: 'Kliqhub — Trust Layer',
    description:
      'Calculate a real-time Trust Score for any email, domain, phone number, or image using free security intelligence APIs.',
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
