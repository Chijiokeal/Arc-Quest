import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tzrrmxqzdzdmsljmbtks.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6cnJteHF6ZHpkbXNsam1idGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzM1MjYsImV4cCI6MjA5MzkwOTUyNn0.Is1cNG5sgpJ7EsIfFxxIqIZ8JEUrbGMSFiOnUn-h6a0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
