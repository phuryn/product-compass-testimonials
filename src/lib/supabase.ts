import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gykadoptlurvnmimejlm.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5a2Fkb3B0bHVydm5taW1lamxtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3OTc2NjQsImV4cCI6MjA1MjM3MzY2NH0.9jBXFdhdcyF3rvT3eyooTqiEl4I6KroK-jZchYbJpFY';

if (!supabaseUrl) throw new Error('Missing VITE_SUPABASE_URL environment variable');
if (!supabaseAnonKey) throw new Error('Missing VITE_SUPABASE_ANON_KEY environment variable');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);