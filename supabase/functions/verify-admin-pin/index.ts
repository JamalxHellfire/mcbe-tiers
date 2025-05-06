
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") || "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
    );

    // Parse the request body
    const { pin } = await req.json();
    
    if (!pin) {
      return new Response(
        JSON.stringify({ isValid: false, message: "PIN is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Get the admin with the matching PIN
    const { data, error } = await supabaseClient
      .from("admins")
      .select("id")
      .eq("hashed_pin", pin)
      .limit(1);

    if (error) {
      console.error("Error verifying admin PIN:", error);
      return new Response(
        JSON.stringify({ isValid: false, message: "Error verifying PIN" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const isValid = data && data.length > 0;

    return new Response(
      JSON.stringify({ isValid }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in verify-admin-pin:", error);
    return new Response(
      JSON.stringify({ isValid: false, message: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
