
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://tgjwlyjumboigvwpattx.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRnandseWp1bWJvaWd2d3BhdHR4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDc5Mjk5MjUsImV4cCI6MjAyMzUwNTkyNX0.zb9oEq1BkR48kPH0oIzk4BWTFagFKf-aPOKFC7G-j3M"

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase