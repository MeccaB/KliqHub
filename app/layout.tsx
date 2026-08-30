import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PwaRegister } from '@/components/PwaRegister';

export const metadata: Metadata = {
  title: 'My Two Cents | Real opinions. Better choices.',
  description: 'A community-powered guide to local businesses.',
  manifest: '/manifest.json',
};
export const viewport: Viewport = { themeColor: '#f97316' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><PwaRegister />{children}</body></html>;
}
