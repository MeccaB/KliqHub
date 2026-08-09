import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kliqhub — Trust Layer',
  description:
    'Calculate a real-time Trust Score for any email, domain, phone number, or image using free security intelligence APIs.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
