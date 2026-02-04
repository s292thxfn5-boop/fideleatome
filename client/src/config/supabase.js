import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nlpkvbfdnuglnshzctfg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5scGt2YmZkbnVnbG5zaHpjdGZnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5NjUwMCwiZXhwIjoyMDg0MDcyNTAwfQ.hTLjgy0REKV9cyyZqcH0goW3A6WOMZVKmvQhOZDuRgI';

export const supabase = createClient(supabaseUrl, supabaseServiceKey);
