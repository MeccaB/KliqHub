import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);
export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!, { auth: { persistSession: true, autoRefreshToken: true } }) : null;
export const adminSupabase = url && serviceKey ? createClient(url, serviceKey, { auth: { persistSession: false } }) : null;
export type DbBusiness = { id:string; name:string; category:string[]; city:string; state:string; description:string|null; average_rating:number; review_count:number; photos:string[] };
