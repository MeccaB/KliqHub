'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  { min: 90, max: 100, color: '#1F51FF', glow: 'rgba(34,211,238,0.35)', label: 'Excellent' },
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
      <path d="M3 12h18M12 3c2.6 2.6 4 5.7 4 9s-1.4 6.4-4 9c-2.6-2.6-4-5.7-4-9s1.4-6.4 4-9z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M6.5 3.5h3l1.4 4.2-2.1 1.7a13 13 0 006.8 6.8l1.7-2.1 4.2 1.4v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7a2 2 0 012-2.2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ImageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="4.5" width="18" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 17l5.5-5.5L13 15l3-3 4 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UploadIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      <path d="M12 15V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2.5A1.5 1.5 0 005.5 20h13a1.5 1.5 0 001.5-1.5V16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M15 8.5h2V5.5h-2c-2.2 0-4 1.8-4 4V12H9v3h2v6h3v-6h2.3l.7-3H14v-2.2c0-.7.3-1.3 1-1.3z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M4.5 4.5l15 15M19.5 4.5l-15 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <line x1="7.5" y1="10" x2="7.5" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="7.5" cy="7" r="1" fill="currentColor" />
      <path d="M11.5 17v-4.5c0-1.4 1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="11.5" y1="10" x2="11.5" y2="17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="6" width="18" height="12" rx="3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" />
    </svg>
  );
}

function TiktokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M13 3v10.8a2.7 2.7 0 11-2.2-2.65"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M13 3c.3 2.2 2 3.9 4.2 4.1"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const SOCIAL_LINKS: { label: string; url: string; icon: (props: { className?: string }) => JSX.Element }[] = [
  { label: 'Facebook', url: 'https://www.facebook.com/KLIQHUB', icon: FacebookIcon },
  { label: 'Instagram', url: 'https://www.instagram.com/kliqhub/', icon: InstagramIcon },
  { label: 'X', url: 'https://x.com/Kliq_Hub', icon: XIcon },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/company/101115191', icon: LinkedInIcon },
  { label: 'YouTube', url: 'https://www.youtube.com/channel/UClj9rPDU7t4FouvrstJ6EEg', icon: YoutubeIcon },
  { label: 'TikTok', url: 'https://www.tiktok.com/@kliqhub', icon: TiktokIcon },
];

function FlagIcon({ severity, className }: { severity: FlagSeverity; className?: string }) {
  if (severity === 'positive') return <CheckCircleIcon className={className} />;
  if (severity === 'warning') return <AlertTriangleIcon className={className} />;
  return <AlertOctagonIcon className={className} />;
}

function severityColor(severity: FlagSeverity): string {
  if (severity === 'positive') return '#34D399';
  if (severity === 'warning') return '#F5C044';
  return '#EF4444';
}

const TABS: { id: TabType; label: string; icon: (props: { className?: string }) => JSX.Element; placeholder: string }[] = [
  { id: 'email', label: 'Email', icon: MailIcon, placeholder: 'name@example.com' },
  { id: 'domain', label: 'Domain', icon: GlobeIcon, placeholder: 'example.com' },
  { id: 'phone', label: 'Phone', icon: PhoneIcon, placeholder: '+1 555 010 1234' },
  { id: 'image', label: 'Image', icon: ImageIcon, placeholder: '' },
];

function TrustGauge({ score }: { score: number }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    setAnimatedScore(0);
    const timeout = setTimeout(() => setAnimatedScore(score), 80);
    return () => clearTimeout(timeout);
  }, [score]);

  const size = 260;
  const center = size / 2;
  const outerRadius = 108;
  const tickRadius = 96;
  const band = getBandForScore(score);
  const needleAngle = scoreToAngle(animatedScore);

  const ticks = Array.from({ length: 11 }, (_, index) => {
    const tickScore = index * 10;
    const angle = scoreToAngle(tickScore);
    const inner = polarToCartesian(center, center, tickRadius - 8, angle);
    const outer = polarToCartesian(center, center, tickRadius + 2, angle);
    return { tickScore, inner, outer, angle };
  });

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size * 0.78} viewBox={`0 0 ${size} ${size * 0.78 + 10}`}>
        <defs>
          <filter id="needle-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {SCORE_BANDS.map((segment) => {
          const startAngle = scoreToAngle(segment.min);
          const endAngle = scoreToAngle(Math.min(segment.max + 1, 100));
          return (
            <path
              key={segment.label}
              d={describeArc(center, center, outerRadius, startAngle, endAngle)}
              stroke={segment.color}
              strokeWidth={10}
              strokeLinecap="butt"
              fill="none"
              opacity={0.85}
            />
          );
        })}

        {ticks.map((tick) => (
          <line
            key={tick.tickScore}
            x1={tick.inner.x}
            y1={tick.inner.y}
            x2={tick.outer.x}
            y2={tick.outer.y}
            stroke="#3A4756"
            strokeWidth={tick.tickScore % 50 === 0 ? 2 : 1}
          />
        ))}

        <g style={{ transform: `rotate(${needleAngle}deg)`, transformOrigin: `${center}px ${center}px`, transition: 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <line x1={center} y1={center} x2={center} y2={center - outerRadius + 22} stroke={band.color} strokeWidth={3} strokeLinecap="round" filter="url(#needle-glow)" />
        </g>
        <circle cx={center} cy={center} r={7} fill="#000000" stroke={band.color} strokeWidth={2.5} />
      </svg>

      <div className="absolute top-[58%] flex flex-col items-center">
        <span className={'font-mono'} style={{ fontSize: '2.75rem', fontWeight: 600, color: band.color, letterSpacing: '-0.02em' }}>
          {Math.round(animatedScore)}
        </span>
        <span
          className={'font-display'}
          style={{ fontSize: '0.85rem', fontWeight: 600, color: band.color, textTransform: 'uppercase', letterSpacing: '0.14em' }}
        >
          {band.label}
        </span>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('email');
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [imageHash, setImageHash] = useState<string | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<TrustResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const resetForNewTab = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setInputValue('');
    setSelectedFile(null);
    setImagePreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return null;
    });
    setImageHash(null);
    setResult(null);
    setErrorMessage(null);
  }, []);

  const processFile = useCallback(async (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setErrorMessage(null);
    setImagePreviewUrl((previous) => {
      if (previous) URL.revokeObjectURL(previous);
      return URL.createObjectURL(file);
    });
    setIsHashing(true);
    try {
      const hash = await hashFile(file);
      setImageHash(hash);
    } catch (error) {
      console.error('Client-side hashing failed', error);
      setErrorMessage('Could not read this file in your browser. Please try a different image.');
    } finally {
      setIsHashing(false);
    }
  }, []);

  const handleFileInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDraggingOver(false);
      const file = event.dataTransfer.files?.[0];
      if (file) processFile(file);
    },
    [processFile]
  );

  const handleCopyHash = useCallback(() => {
    if (!imageHash) return;
    navigator.clipboard.writeText(imageHash).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  }, [imageHash]);

  const canSubmit =
    activeTab === 'image' ? Boolean(imageHash) && !isHashing : inputValue.trim().length > 0;

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || isScanning) return;
    setIsScanning(true);
    setResult(null);
    setErrorMessage(null);

    const minimumScanDelay = new Promise((resolve) => setTimeout(resolve, 1100));

    try {
      let response: Response;

      if (activeTab === 'image' && selectedFile && imageHash) {
        const formData = new FormData();
        formData.append('type', 'image');
        formData.append('file', selectedFile);
        formData.append('hash', imageHash);
        formData.append('fileName', selectedFile.name);
        const fetchPromise = fetch('/api/check', { method: 'POST', body: formData });
        const [fetchResult] = await Promise.all([fetchPromise, minimumScanDelay]);
        response = fetchResult;
      } else {
        const fetchPromise = fetch('/api/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: activeTab, value: inputValue.trim() }),
        });
        const [fetchResult] = await Promise.all([fetchPromise, minimumScanDelay]);
        response = fetchResult;
      }

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data?.error ?? 'Something went wrong while running this check.');
        return;
      }

      setResult(data as TrustResult);
    } catch (error) {
      console.error('Trust check request failed', error);
      setErrorMessage('Could not reach the KliqHub scanning service. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }, [activeTab, canSubmit, imageHash, inputValue, isScanning, selectedFile]);

  const activeTabConfig = TABS.find((tab) => tab.id === activeTab) ?? TABS[0];

  return (
    <main className={'font-body min-h-screen w-full'} style={{ background: '#000000', color: '#E6EDF3' }}>
      <div className="pointer-events-none fixed inset-0 opacity-[0.06]" style={gridBackgroundStyle} />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-16 sm:pt-24">
        <div className="mb-12 flex flex-col items-center text-center">
          <img src="/logo.png" alt="KliqHub logo" style={{ width: '72px', height: '72px', borderRadius: '16px', marginBottom: '1.25rem' }} />
          <div className="mb-4 flex items-center gap-2 rounded-full border px-3 py-1" style={{ borderColor: '#232D3A' }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#1F51FF', boxShadow: '0 0 8px #1F51FF' }} />
            <span className={'font-mono'} style={{ fontSize: '0.72rem', letterSpacing: '0.12em', color: '#8B98A5' }}>
              TRUST LAYER · LIVE SCANNER
            </span>
          </div>
          <h1 className={'font-display'} style={{ fontSize: '2.6rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
            KliqHub
          </h1>
          <p className="mt-3 max-w-md" style={{ color: '#8B98A5', fontSize: '0.98rem' }}>
            Point a free trust engine at anything, an email, a domain, a phone number, an image, and get back a Trust
            Score built from real security signal.
          </p>
        </div>

        <div
          className="w-full rounded-2xl border p-2"
          style={{ borderColor: '#232D3A', background: 'linear-gradient(180deg, #0A0A0F 0%, #050507 100%)' }}
        >
          <div className="flex gap-1 rounded-xl p-1" style={{ background: '#000000' }}>
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => resetForNewTab(tab.id)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 transition-all duration-200"
                  style={{
                    background: isActive ? '#1A222C' : 'transparent',
                    color: isActive ? '#1F51FF' : '#8B98A5',
                    boxShadow: isActive ? 'inset 0 0 0 1px #2A3644' : 'none',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="p-5">
            {activeTab !== 'image' ? (
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') handleSubmit();
                  }}
                  placeholder={activeTabConfig.placeholder}
                  className="font-mono w-full rounded-xl border bg-transparent px-4 py-3.5 outline-none transition-colors focus:border-cyan-400"
                  style={{ borderColor: '#232D3A', fontSize: '0.95rem' }}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isScanning}
                  className="shrink-0 rounded-xl px-6 py-3.5 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: '#1F51FF', color: '#000000' }}
                >
                  {isScanning ? 'Scanning…' : 'Run Scan'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center transition-colors duration-200"
                  style={{
                    borderColor: isDraggingOver ? '#1F51FF' : '#232D3A',
                    background: isDraggingOver ? 'rgba(34,211,238,0.05)' : 'transparent',
                  }}
                >
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
                  {imagePreviewUrl ? (
                    <img src={imagePreviewUrl} alt="Selected preview" className="h-28 w-28 rounded-lg object-cover" style={{ boxShadow: '0 0 0 1px #232D3A' }} />
                  ) : (
                    <UploadIcon className="h-8 w-8" style={{ color: '#8B98A5' }} />
                  )}
                  <div>
                    <p style={{ fontSize: '0.92rem', fontWeight: 500 }}>
                      {selectedFile ? selectedFile.name : 'Drop an image here, or click to select one'}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#8B98A5', marginTop: '0.25rem' }}>
                      Hashed locally in your browser with SHA-256 before anything is sent
                    </p>
                  </div>
                </div>

                {(isHashing || imageHash) && (
                  <div className="flex items-center justify-between rounded-lg border px-4 py-3" style={{ borderColor: '#232D3A' }}>
                    <div className="flex items-center gap-2 overflow-hidden">
                      <span className={'font-mono'} style={{ fontSize: '0.75rem', color: '#8B98A5', whiteSpace: 'nowrap' }}>
                        SHA-256
                      </span>
                      <span className={'font-mono'} style={{ fontSize: '0.78rem', color: '#E6EDF3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {isHashing ? 'computing hash…' : imageHash}
                      </span>
                    </div>
                    {imageHash && !isHashing && (
                      <button onClick={handleCopyHash} className="shrink-0 pl-3" style={{ color: '#1F51FF', fontSize: '0.75rem' }}>
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit || isScanning}
                  className="rounded-xl px-6 py-3.5 font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                  style={{ background: '#1F51FF', color: '#000000' }}
                >
                  {isScanning ? 'Scanning…' : 'Run Scan'}
                </button>
              </div>
            )}
          </div>

          {isScanning && (
            <div className="relative mx-5 mb-5 h-1 overflow-hidden rounded-full" style={{ background: '#1A222C' }}>
              <div className="scan-sweep absolute inset-y-0 w-1/3 rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #1F51FF, transparent)' }} />
            </div>
          )}
        </div>

        <a
          href="/business"
          className="font-mono"
          style={{
            marginTop: '2rem',
            fontSize: '0.78rem',
            color: '#1F51FF',
            textDecoration: 'none',
            border: '1px solid #22284a',
            borderRadius: '0.5rem',
            padding: '0.5rem 1rem',
          }}
        >
          For Business & API Access →
        </a>

        {errorMessage && (
          <div className="mt-6 w-full rounded-xl border px-4 py-3" style={{ borderColor: 'rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.08)' }}>
            <p style={{ color: '#F87171', fontSize: '0.88rem' }}>{errorMessage}</p>
          </div>
        )}

        {result && (
          <div className="fade-in-up mt-10 w-full rounded-2xl border p-8" style={{ borderColor: '#232D3A', background: 'linear-gradient(180deg, #0A0A0F 0%, #050507 100%)' }}>
            <div className="flex flex-col items-center">
              <TrustGauge score={result.score} />
              <div className="mt-2 flex items-center gap-2">
                <span className={'font-mono'} style={{ fontSize: '0.82rem', color: '#8B98A5' }}>
                  {result.type.toUpperCase()}
                </span>
                <span style={{ color: '#3A4756' }}>·</span>
                <span className={'font-mono'} style={{ fontSize: '0.82rem', color: '#E6EDF3' }}>
                  {result.value}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: result.source === 'cache' ? '#F5C044' : '#34D399' }}
                />
                <span style={{ fontSize: '0.74rem', color: '#8B98A5' }}>
                  {result.source === 'cache' ? 'Served from cache' : 'Fresh live scan'} · {new Date(result.checkedAt).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              {result.flags.map((flag, index) => (
                <div
                  key={`${flag.label}-${index}`}
                  className="flex items-start gap-3 rounded-xl border px-4 py-3.5"
                  style={{ borderColor: '#232D3A' }}
                >
                  <FlagIcon severity={flag.severity} className="mt-0.5 h-4.5 w-4.5 shrink-0" />
                  <div>
                    <p style={{ fontSize: '0.88rem', fontWeight: 600, color: severityColor(flag.severity) }}>{flag.label}</p>
                    <p style={{ fontSize: '0.82rem', color: '#8B98A5', marginTop: '0.2rem' }}>{flag.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-14 flex items-center gap-5">
          {SOCIAL_LINKS.map((social) => {
            const SocialIcon = social.icon;
            return (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                style={{ color: '#8B98A5' }}
              >
                <SocialIcon className="h-[18px] w-[18px]" />
              </a>
            );
          })}
        </div>

        <div className="mt-4 flex items-center gap-4">
          <span className="font-mono" style={{ fontSize: '0.72rem', color: '#5A6472' }}>
            © 2026 KliqHub
          </span>
          <a href="/about" className="font-mono" style={{ fontSize: '0.72rem', color: '#5A6472', textDecoration: 'none' }}>
            About KliqHub
          </a>
        </div>
     <div style={{ textAlign: 'center', padding: '40px 0', backgroundColor: '#0b0f19' }}>
  <a href="/shop/index.html" style={{ color: '#00a8ff', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px' }}>
    Visit Our Shop
  </a>
</div>

      <style jsx>{`
        .scan-sweep {
          animation: sweep 1.1s ease-in-out infinite;
        }
        @keyframes sweep {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }
        .fade-in-up {
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .scan-sweep,
          .fade-in-up {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}

const gridBackgroundStyle: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(#232D3A 1px, transparent 1px), linear-gradient(90deg, #232D3A 1px, transparent 1px)',
  backgroundSize: '48px 48px',
};
