import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://rotczionhwbvovqtphzo.supabase.co";

const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdGN6aW9uaHdidm92cXRwaHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg1MTQ5NDIsImV4cCI6MjA4NDA5MDk0Mn0.MqZjq5noAHdE_Kz-Q0MrVo4CG2lLwppeVUHlMljCIPw";

// TEMPORARY: check if the values are correct
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase ANON KEY:", supabaseAnonKey);

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
