import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gdphxtmizrmfyoaqxodz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdkcGh4dG1penJtZnlvYXF4b2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzNDA2MDAsImV4cCI6MjA5MTkxNjYwMH0.VsudccDWckVP9yoDlW0e6BZfAgCiIQw1ownfE3t2mF0'

export const supabase = createClient(supabaseUrl, supabaseKey)