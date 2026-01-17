import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://huysvliqpiadnkwylrcj.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1eXN2bGlxcGlhZG5rd3lscmNqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1NzcyMjEsImV4cCI6MjA4NDE1MzIyMX0.kwJmDvmSUOAR_aVaunMKOyE61CjiNvtYRZzKK_1e2bs";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
