
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
    const { playerData } = await req.json();
    
    if (!playerData) {
      return new Response(
        JSON.stringify({ success: false, message: "Player data is required" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Parse the data (expected format: IGN,JavaAvatarUsername per line)
    const lines = playerData.trim().split('\n');
    const players = [];
    const errors = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const [ign, javaUsername] = line.split(',').map(s => s.trim());
      
      if (!ign || !javaUsername) {
        errors.push(`Line ${i + 1}: Invalid format. Expected "IGN, JavaUsername"`);
        continue;
      }
      
      players.push({
        ign,
        java_username: javaUsername,
        avatar_url: `https://crafthead.net/avatar/${javaUsername}`,
        gamemode: "unranked", // Legacy field
        tier_number: "unranked", // Legacy field
      });
    }

    // Insert players
    if (players.length > 0) {
      const { data, error } = await supabaseClient
        .from("players")
        .insert(players)
        .select("id");

      if (error) {
        console.error("Error inserting players:", error);
        return new Response(
          JSON.stringify({ success: false, message: "Error inserting players", error: error.message }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        created: players.length, 
        errors 
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in register-players:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error", error: error.message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
