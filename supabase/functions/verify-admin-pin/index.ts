
// This Edge Function handles admin PIN verification securely
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  try {
    const { pin } = await req.json()
    
    if (!pin) {
      return new Response(
        JSON.stringify({ error: 'PIN is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // Create a Supabase client for the function
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || ''
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') || ''
    const supabase = createClient(supabaseUrl, supabaseKey)
    
    // Query the admins table to check the PIN
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('hashed_pin', pin)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error verifying PIN:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to verify PIN' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }
    
    // If data exists, the PIN is valid
    const isValid = !!data
    
    return new Response(
      JSON.stringify({ isValid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error in verify-admin-pin function:', err)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
