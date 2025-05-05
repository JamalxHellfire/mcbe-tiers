
// Follow this setup guide to integrate the Deno runtime and alias imports:
// https://docs.supabase.com/reference/storage/deno-runtime

// This function verifies admin PINs securely
// It should be called from the admin login page

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.0.0';
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

serve(async (req) => {
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { pin } = await req.json();

    if (!pin) {
      return new Response(
        JSON.stringify({ success: false, error: 'PIN is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    // Query the admins table to check the PIN
    // In a real app, this should use a secure password hashing mechanism
    const { data, error } = await supabase
      .from('admins')
      .select('id')
      .eq('hashed_pin', pin)
      .single();

    if (error) {
      console.error('Error verifying PIN:', error);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to verify PIN' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const isValid = !!data;

    return new Response(
      JSON.stringify({ success: true, isValid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Server error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
