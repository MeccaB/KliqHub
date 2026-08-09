import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';

export const runtime = 'nodejs';

type CheckType = 'email' | 'domain' | 'phone' | 'image';
type FlagSeverity = 'positive' | 'warning' | 'critical';

interface Flag {
  severity: FlagSeverity;
  label: string;
  detail: string;
}

interface ScoreResult {
  score: number;
  flags: Flag[];
}

interface VirusTotalAnalysisStats {
  harmless?: number;
  malicious?: number;
  suspicious?: number;
  undetected?: number;
  timeout?: number;
}

interface VirusTotalDomainAttributes {
  last_analysis_stats: VirusTotalAnalysisStats;
  reputation?: number;
}

interface VirusTotalFileAttributes {
  last_analysis_stats: VirusTotalAnalysisStats;
  reputation?: number;
  meaningful_name?: string;
  type_description?: string;
}

interface HibpBreach {
  Name: string;
  Title: string;
  Domain?: string;
  BreachDate?: string;
  PwnCount?: number;
  DataClasses?: string[];
  IsVerified?: boolean;
  IsSensitive?: boolean;
  IsMalware?: boolean;
}

interface HibpPaste {
  Source: string;
  Id: string;
  Title?: string;
  Date?: string;
  EmailCount?: number;
}

interface GoogleVisionWebEntity {
  url: string;
}

interface GoogleVisionPageMatch {
  url: string;
  pageTitle?: string;
}

interface GoogleVisionWebDetection {
  fullMatchingImages?: GoogleVisionWebEntity[];
  partialMatchingImages?: GoogleVisionWebEntity[];
  pagesWithMatchingImages?: GoogleVisionPageMatch[];
  visuallySimilarImages?: GoogleVisionWebEntity[];
}

interface CachedRow {
  id: string;
  input_type: CheckType;
  input_value: string;
  trust_score: number;
  flags: Flag[];
  raw_data: unknown;
  created_at: string;
  expires_at: string;
}

const MAX_SCORE = 100;
const MIN_SCORE = 0;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase: SupabaseClient | null =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, { auth: { persistSession: false } })
    : null;

function clampScore(score: number): number {
  return Math.max(MIN_SCORE, Math.min(MAX_SCORE, Math.round(score)));
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

function normalizeDomain(value: string): string {
  let normalized = value.trim().toLowerCase();
  normalized = normalized.replace(/^https?:\/\//, '');
  normalized = normalized.replace(/^www\./, '');
  normalized = normalized.split('/')[0];
  normalized = normalized.split('?')[0];
  normalized = normalized.split(':')[0];
  return normalized;
}

function normalizePhone(value: string): string {
  const trimmed = value.trim();
  const hasPlus = trimmed.startsWith('+');
  const digitsOnly = trimmed.replace(/\D/g, '');
  return hasPlus ? `+${digitsOnly}` : digitsOnly;
}

function isValidEmail(value: string): boolean {
  const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailPattern.test(value);
}

function isValidDomain(value: string): boolean {
  const domainPattern = /^(?!-)[a-z0-9-]{1,63}(?<!-)(\.[a-z0-9-]{1,63})+$/;
  return domainPattern.test(value);
}

function isValidPhone(value: string): boolean {
  const digitsOnly = value.replace(/\D/g, '');
  const e164Pattern = /^[1-9]\d{7,14}$/;
  return e164Pattern.test(digitsOnly);
}

async function getCachedResult(type: CheckType, value: string): Promise<CachedRow | null> {
  if (!supabase) return null;
  const nowIso = new Date().toISOString();
  const { data, error } = await supabase
    .from('trust_cache')
    .select('*')
    .eq('input_type', type)
    .eq('input_value', value)
    .gt('expires_at', nowIso)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) {
    console.error('Kliqhub cache lookup failed', error.message);
    return null;
  }
  return (data as CachedRow) ?? null;
}

async function saveCachedResult(
  type: CheckType,
  value: string,
  score: number,
  flags: Flag[],
  rawData: unknown,
  ttlHours: number
): Promise<void> {
  if (!supabase) return;
  const expiresAt = new Date(Date.now() + ttlHours * 60 * 60 * 1000).toISOString();
  const { error } = await supabase.from('trust_cache').insert({
    input_type: type,
    input_value: value,
    trust_score: score,
    flags,
    raw_data: rawData,
    expires_at: expiresAt,
  });
  if (error) {
    console.error('Kliqhub cache write failed', error.message);
  }
}

async function fetchVirusTotalDomain(domain: string): Promise<VirusTotalDomainAttributes | null> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`, {
      headers: { 'x-apikey': apiKey },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const json = await response.json();
    return (json?.data?.attributes as VirusTotalDomainAttributes) ?? null;
  } catch (error) {
    console.error('VirusTotal domain lookup failed', error);
    return null;
  }
}

async function fetchVirusTotalFile(hash: string): Promise<VirusTotalFileAttributes | null> {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(`https://www.virustotal.com/api/v3/files/${encodeURIComponent(hash)}`, {
      headers: { 'x-apikey': apiKey },
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const json = await response.json();
    return (json?.data?.attributes as VirusTotalFileAttributes) ?? null;
  } catch (error) {
    console.error('VirusTotal file lookup failed', error);
    return null;
  }
}

async function fetchGoogleVisionWebDetection(imageBuffer: Buffer): Promise<GoogleVisionWebDetection | null> {
  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  if (!apiKey) return null;
  try {
    const base64Content = imageBuffer.toString('base64');
    const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [
          {
            image: { content: base64Content },
            features: [{ type: 'WEB_DETECTION', maxResults: 15 }],
          },
        ],
      }),
      cache: 'no-store',
    });
    if (!response.ok) return null;
    const json = await response.json();
    return (json?.responses?.[0]?.webDetection as GoogleVisionWebDetection) ?? null;
  } catch (error) {
    console.error('Google Vision web detection failed', error);
    return null;
  }
}

async function fetchHibpBreaches(email: string): Promise<HibpBreach[] | null> {
  const apiKey = process.env.HIBP_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(
      `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
      {
        headers: {
          'hibp-api-key': apiKey,
          'user-agent': 'Kliqhub-Trust-Scanner',
        },
        cache: 'no-store',
      }
    );
    if (response.status === 404) return [];
    if (!response.ok) return null;
    return (await response.json()) as HibpBreach[];
  } catch (error) {
    console.error('HIBP breach lookup failed', error);
    return null;
  }
}

async function fetchHibpPastes(email: string): Promise<HibpPaste[] | null> {
  const apiKey = process.env.HIBP_API_KEY;
  if (!apiKey) return null;
  try {
    const response = await fetch(`https://haveibeenpwned.com/api/v3/pasteaccount/${encodeURIComponent(email)}`, {
      headers: {
        'hibp-api-key': apiKey,
        'user-agent': 'Kliqhub-Trust-Scanner',
      },
      cache: 'no-store',
    });
    if (response.status === 404) return [];
    if (!response.ok) return null;
    return (await response.json()) as HibpPaste[];
  } catch (error) {
    console.error('HIBP paste lookup failed', error);
    return null;
  }
}

function scoreDomainFromVirusTotal(vt: VirusTotalDomainAttributes | null): ScoreResult {
  let score = 100;
  const flags: Flag[] = [];

  if (!vt) {
    flags.push({
      severity: 'warning',
      label: 'No VirusTotal Record',
      detail: 'This domain has not been analyzed by VirusTotal, so historical reputation data is unavailable.',
    });
    return { score: clampScore(score - 5), flags };
  }

  const stats = vt.last_analysis_stats ?? {};
  const maliciousCount = stats.malicious ?? 0;
  const suspiciousCount = stats.suspicious ?? 0;
  const harmlessCount = stats.harmless ?? 0;
  const reputation = vt.reputation ?? 0;

  if (maliciousCount > 0) {
    score -= Math.min(60, maliciousCount * 15);
    flags.push({
      severity: 'critical',
      label: `Flagged Malicious by ${maliciousCount} Security Vendor${maliciousCount === 1 ? '' : 's'}`,
      detail: 'Multiple VirusTotal security engines identified this domain as malicious.',
    });
  }

  if (suspiciousCount > 0) {
    score -= Math.min(20, suspiciousCount * 5);
    flags.push({
      severity: 'warning',
      label: `Flagged Suspicious by ${suspiciousCount} Security Vendor${suspiciousCount === 1 ? '' : 's'}`,
      detail: 'Some VirusTotal engines flagged this domain as potentially suspicious.',
    });
  }

  if (reputation < 0) {
    score -= Math.min(20, Math.abs(reputation));
    flags.push({
      severity: 'warning',
      label: 'Negative Community Reputation',
      detail: `This domain holds a community reputation score of ${reputation} on VirusTotal.`,
    });
  }

  if (maliciousCount === 0 && suspiciousCount === 0 && harmlessCount > 0) {
    flags.push({
      severity: 'positive',
      label: 'Clean Across Security Vendors',
      detail: `${harmlessCount} security vendors reported this domain as harmless.`,
    });
  }

  return { score: clampScore(score), flags };
}

function scoreEmailFromHibp(breaches: HibpBreach[] | null, pastes: HibpPaste[] | null): ScoreResult {
  let score = 100;
  const flags: Flag[] = [];

  if (breaches === null && pastes === null) {
    flags.push({
      severity: 'warning',
      label: 'Breach Database Unavailable',
      detail: 'Could not reach Have I Been Pwned to verify breach history for this address.',
    });
    return { score: clampScore(score - 5), flags };
  }

  const breachCount = breaches?.length ?? 0;
  const pasteCount = pastes?.length ?? 0;

  if (breachCount > 0) {
    score -= Math.min(50, breachCount * 8);
    const breachTitles = (breaches ?? []).slice(0, 3).map((breach) => breach.Title).join(', ');
    flags.push({
      severity: 'critical',
      label: `Found in ${breachCount} Known Data Breach${breachCount === 1 ? '' : 'es'}`,
      detail: `This email appeared in breaches including ${breachTitles}${breachCount > 3 ? ', and more' : ''}.`,
    });

    const sensitiveBreaches = (breaches ?? []).filter((breach) => breach.IsSensitive || breach.IsMalware);
    if (sensitiveBreaches.length > 0) {
      score -= 10;
      flags.push({
        severity: 'critical',
        label: 'Sensitive Breach Exposure',
        detail: 'At least one breach involved sensitive or malware-linked data.',
      });
    }
  } else {
    flags.push({
      severity: 'positive',
      label: 'No Known Breaches',
      detail: 'This email was not found in any breach currently indexed by Have I Been Pwned.',
    });
  }

  if (pasteCount > 0) {
    score -= Math.min(15, pasteCount * 3);
    flags.push({
      severity: 'warning',
      label: `Found in ${pasteCount} Public Paste${pasteCount === 1 ? '' : 's'}`,
      detail: 'This email appears in publicly posted paste data, often linked to credential dumps.',
    });
  }

  return { score: clampScore(score), flags };
}

function scorePhoneHeuristic(phone: string): ScoreResult {
  let score = 100;
  const flags: Flag[] = [];
  const digitsOnly = phone.replace(/\D/g, '');

  if (!isValidPhone(phone)) {
    score -= 25;
    flags.push({
      severity: 'critical',
      label: 'Invalid Phone Format',
      detail: 'This number does not match a valid international phone number format.',
    });
  } else {
    flags.push({
      severity: 'positive',
      label: 'Valid Number Format',
      detail: 'This number matches a standard international phone number format.',
    });
  }

  if (/^(\d)\1{6,}$/.test(digitsOnly)) {
    score -= 30;
    flags.push({
      severity: 'critical',
      label: 'Repeated Digit Pattern',
      detail: 'This number consists of an unusually repetitive digit sequence, a common trait of spoofed numbers.',
    });
  }

  if (/0123456789|9876543210|1234567890/.test(digitsOnly)) {
    score -= 20;
    flags.push({
      severity: 'warning',
      label: 'Sequential Digit Pattern',
      detail: 'This number contains a sequential digit run frequently seen in fabricated numbers.',
    });
  }

  if (digitsOnly.length < 8) {
    score -= 15;
    flags.push({
      severity: 'warning',
      label: 'Unusually Short Number',
      detail: 'This number has fewer digits than a typical international phone number.',
    });
  }

  flags.push({
    severity: 'warning',
    label: 'Limited Verification Available',
    detail:
      'No free reputation API exists for phone numbers, so this score reflects format and pattern analysis only, not carrier or spam-report data.',
  });

  return { score: clampScore(score), flags };
}

function scoreImage(vt: VirusTotalFileAttributes | null, web: GoogleVisionWebDetection | null): ScoreResult {
  let score = 100;
  const flags: Flag[] = [];

  if (!vt) {
    flags.push({
      severity: 'positive',
      label: 'No Prior Malicious Record Found',
      detail: 'This exact file has not been previously submitted to VirusTotal, so no history of malicious behavior exists in their database.',
    });
    flags.push({
      severity: 'warning',
      label: 'Hash-Only Lookup',
      detail: "The free tier only checks this file's SHA-256 fingerprint against prior submissions; the file itself is never uploaded.",
    });
    score -= 5;
  } else {
    const stats = vt.last_analysis_stats ?? {};
    const maliciousCount = stats.malicious ?? 0;
    const suspiciousCount = stats.suspicious ?? 0;

    if (maliciousCount > 0) {
      score -= Math.min(70, maliciousCount * 12);
      flags.push({
        severity: 'critical',
        label: `Detected as Malicious by ${maliciousCount} Engine${maliciousCount === 1 ? '' : 's'}`,
        detail: 'This exact file matches signatures flagged as malicious by security vendors.',
      });
    }

    if (suspiciousCount > 0) {
      score -= Math.min(15, suspiciousCount * 4);
      flags.push({
        severity: 'warning',
        label: `Flagged Suspicious by ${suspiciousCount} Engine${suspiciousCount === 1 ? '' : 's'}`,
        detail: 'Some engines flagged this file as potentially suspicious.',
      });
    }

    if (maliciousCount === 0 && suspiciousCount === 0) {
      flags.push({
        severity: 'positive',
        label: 'Clean File History',
        detail: 'No security vendor has flagged this exact file as malicious or suspicious.',
      });
    }
  }

  if (web === null) {
    flags.push({
      severity: 'warning',
      label: 'Web Presence Check Unavailable',
      detail: 'Cross-web image matching was not configured or could not be reached for this scan.',
    });
  } else {
    const fullMatches = web.fullMatchingImages ?? [];
    const pages = web.pagesWithMatchingImages ?? [];
    const distinctDomains = new Set(
      pages.map((page) => {
        try {
          return new URL(page.url).hostname;
        } catch {
          return page.url;
        }
      })
    );

    if (fullMatches.length === 0) {
      flags.push({
        severity: 'positive',
        label: 'No Matching Copies Found Elsewhere',
        detail: 'This exact image does not appear to match any other images indexed by Google.',
      });
    } else if (distinctDomains.size <= 2) {
      score -= 3;
      flags.push({
        severity: 'warning',
        label: `Image Found on ${distinctDomains.size} Other Site${distinctDomains.size === 1 ? '' : 's'}`,
        detail: `This image also appears at: ${Array.from(distinctDomains).slice(0, 3).join(', ')}. Worth a quick manual check that this matches the claimed identity or source.`,
      });
    } else {
      score -= 12;
      flags.push({
        severity: 'warning',
        label: `Image Widely Distributed Across ${distinctDomains.size} Sites`,
        detail: `This image shows up across many unrelated sites (including ${Array.from(distinctDomains).slice(0, 3).join(', ')}), which can be a sign of a stolen or stock photo. This alone isn't proof of misuse, so it's worth reviewing manually.`,
      });
    }
  }

  return { score: clampScore(score), flags };
}

async function extractImagePayload(
  formData: FormData
): Promise<{ hash: string | null; fileName: string | null; buffer: Buffer | null }> {
  const file = formData.get('file');
  const providedHash = formData.get('hash')?.toString() ?? null;

  if (file && typeof file === 'object' && 'arrayBuffer' in file) {
    const typedFile = file as File;
    const arrayBuffer = await typedFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
    return { hash, fileName: typedFile.name ?? null, buffer };
  }

  if (providedHash) {
    return { hash: providedHash.toLowerCase(), fileName: formData.get('fileName')?.toString() ?? null, buffer: null };
  }

  return { hash: null, fileName: null, buffer: null };
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    let type: string | null = null;
    let rawValue: string | null = null;
    let imageHash: string | null = null;
    let imageFileName: string | null = null;
    let imageBuffer: Buffer | null = null;

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      type = formData.get('type')?.toString() ?? null;
      const extracted = await extractImagePayload(formData);
      imageHash = extracted.hash;
      imageFileName = extracted.fileName;
      imageBuffer = extracted.buffer;
      rawValue = formData.get('value')?.toString() ?? null;
    } else {
      const body = await request.json();
      type = body?.type ?? null;
      rawValue = body?.value ?? null;
      imageHash = body?.hash ? String(body.hash).toLowerCase() : null;
      imageFileName = body?.fileName ?? null;
    }

    if (!type || !['email', 'domain', 'phone', 'image'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid or missing "type". Must be one of email, domain, phone, image.' },
        { status: 400 }
      );
    }

    const checkType = type as CheckType;

    if (checkType === 'image') {
      if (!imageHash || !/^[a-f0-9]{64}$/i.test(imageHash)) {
        return NextResponse.json(
          { error: 'A valid SHA-256 hash or an image file is required for image checks.' },
          { status: 400 }
        );
      }

      const cacheKey = imageHash.toLowerCase();
      const cached = await getCachedResult('image', cacheKey);
      if (cached) {
        return NextResponse.json({
          type: 'image',
          value: imageFileName ?? cacheKey,
          hash: cacheKey,
          score: cached.trust_score,
          flags: cached.flags,
          source: 'cache',
          checkedAt: cached.created_at,
        });
      }

      const [vtFile, webDetection] = await Promise.all([
        fetchVirusTotalFile(cacheKey),
        imageBuffer ? fetchGoogleVisionWebDetection(imageBuffer) : Promise.resolve(null),
      ]);
      const { score, flags } = scoreImage(vtFile, webDetection);
      await saveCachedResult('image', cacheKey, score, flags, { vtFile, webDetection }, 24 * 7);

      return NextResponse.json({
        type: 'image',
        value: imageFileName ?? cacheKey,
        hash: cacheKey,
        score,
        flags,
        source: 'live',
        checkedAt: new Date().toISOString(),
      });
    }

    if (!rawValue || typeof rawValue !== 'string' || rawValue.trim().length === 0) {
      return NextResponse.json({ error: 'A non-empty "value" is required for this check type.' }, { status: 400 });
    }

    if (checkType === 'email') {
      const normalized = normalizeEmail(rawValue);
      if (!isValidEmail(normalized)) {
        return NextResponse.json({ error: 'The provided value is not a valid email address.' }, { status: 400 });
      }

      const cached = await getCachedResult('email', normalized);
      if (cached) {
        return NextResponse.json({
          type: 'email',
          value: normalized,
          score: cached.trust_score,
          flags: cached.flags,
          source: 'cache',
          checkedAt: cached.created_at,
        });
      }

      const [breaches, pastes] = await Promise.all([fetchHibpBreaches(normalized), fetchHibpPastes(normalized)]);
      const { score, flags } = scoreEmailFromHibp(breaches, pastes);
      await saveCachedResult('email', normalized, score, flags, { breaches, pastes }, 24);

      return NextResponse.json({
        type: 'email',
        value: normalized,
        score,
        flags,
        source: 'live',
        checkedAt: new Date().toISOString(),
      });
    }

    if (checkType === 'domain') {
      const normalized = normalizeDomain(rawValue);
      if (!isValidDomain(normalized)) {
        return NextResponse.json({ error: 'The provided value is not a valid domain.' }, { status: 400 });
      }

      const cached = await getCachedResult('domain', normalized);
      if (cached) {
        return NextResponse.json({
          type: 'domain',
          value: normalized,
          score: cached.trust_score,
          flags: cached.flags,
          source: 'cache',
          checkedAt: cached.created_at,
        });
      }

      const vtDomain = await fetchVirusTotalDomain(normalized);
      const { score, flags } = scoreDomainFromVirusTotal(vtDomain);
      await saveCachedResult('domain', normalized, score, flags, vtDomain, 24);

      return NextResponse.json({
        type: 'domain',
        value: normalized,
        score,
        flags,
        source: 'live',
        checkedAt: new Date().toISOString(),
      });
    }

    if (checkType === 'phone') {
      const normalized = normalizePhone(rawValue);
      if (!isValidPhone(normalized)) {
        return NextResponse.json({ error: 'The provided value is not a valid phone number.' }, { status: 400 });
      }

      const cached = await getCachedResult('phone', normalized);
      if (cached) {
        return NextResponse.json({
          type: 'phone',
          value: normalized,
          score: cached.trust_score,
          flags: cached.flags,
          source: 'cache',
          checkedAt: cached.created_at,
        });
      }

      const { score, flags } = scorePhoneHeuristic(normalized);
      await saveCachedResult('phone', normalized, score, flags, { normalized }, 24 * 30);

      return NextResponse.json({
        type: 'phone',
        value: normalized,
        score,
        flags,
        source: 'live',
        checkedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({ error: 'Unsupported type.' }, { status: 400 });
  } catch (error) {
    console.error('Kliqhub trust check failed', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred while processing this trust check.' },
      { status: 500 }
    );
  }
}
