import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://khzeylurehgmbnnxdsos.supabase.co'
const supabaseAnonKey = 'sb_publishable_g3026b3t56SZI2QlH84vLQ_nmGfq4r7'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)