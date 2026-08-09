'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';

const displayFont = Space_Grotesk({ subsets: ['latin'], weight: ['500', '600', '700'] });
const bodyFont = Inter({ subsets: ['latin'], weight: ['400', '500', '600'] });
const monoFont = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500', '600'] });

type TabType = 'email' | 'domain' | 'phone' | 'image';
type FlagSeverity = 'positive' | 'warning' | 'critical';

interface Flag {
  severity: FlagSeverity;
  label: string;
  detail: string;
}

interface TrustResult {
  type: TabType;
  value: string;
  hash?: string;
  score: number;
  flags: Flag[];
  source: 'cache' | 'live';
  checkedAt: string;
}

interface ScoreBand {
  min: number;
  max: number;
  color: string;
  glow: string;
  label: string;
}

const SCORE_BANDS: ScoreBand[] = [
  { min: 0, max: 29, color: '#EF4444', glow: 'rgba(239,68,68,0.35)', label: 'Critical' },
  { min: 30, max: 49, color: '#FB923C', glow: 'rgba(251,146,60,0.35)', label: 'Poor' },
  { min: 50, max: 69, color: '#F5C044', glow: 'rgba(245,192,68,0.35)', label: 'Fair' },
  { min: 70, max: 89, color: '#34D399', glow: 'rgba(52,211,153,0.35)', label: 'Good' },
  { min: 90, max: 100, color: '#22D3EE', glow: 'rgba(34,211,238,0.35)', label: 'Excellent' },
];

const GAUGE_START_ANGLE = -120;
const GAUGE_END_ANGLE = 120;
const GAUGE_SWEEP = GAUGE_END_ANGLE - GAUGE_START_ANGLE;

function getBandForScore(score: number): ScoreBand {
  return SCORE_BANDS.find((band) => score >= band.min && score <= band.max) ?? SCORE_BANDS[0];
}

function scoreToAngle(score: number): number {
  return GAUGE_START_ANGLE + (score / 100) * GAUGE_SWEEP;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(angleRad),
    y: cy + radius * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`;
}

async function hashFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const bytes = Array.from(new Uint8Array(digest));
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 12.5l2.4 2.4L16 9.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 4.5l9 15.5H3l9-15.5z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 10v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  );
}

function AlertOctagonIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M7.9 3.5h8.2l5.4 5.4v8.2l-5.4 5.4H7.9l-5.4-5.4V8.9l5.4-5.4z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="16" r="0.9" fill="currentColor" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="5.5" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
