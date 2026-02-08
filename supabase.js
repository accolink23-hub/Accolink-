const SUPABASE_URL = "https://yrejueipcrcwmsseqqqz.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyZWp1ZWlwY3Jjd21zc2VxcXF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0NTM4NzcsImV4cCI6MjA4NjAyOTg3N30.xDsmkrnTW_bCeCyWeZfge4GujuM34JfZ98dx_t1VFJY ";

// IMPORTANT: use window.supabase
const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);
