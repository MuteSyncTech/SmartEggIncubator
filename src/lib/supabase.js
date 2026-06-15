import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xpuczopkjroydioircju.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwdWN6b3BranJveWRpb2lyY2p1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMjM0MzEsImV4cCI6MjA5MjU5OTQzMX0.14JyysyrE96xGcCLh5yBTGzkJ6mpJUkUehXso8z10uY";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);