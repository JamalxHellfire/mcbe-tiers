
import { serve } from "https://deno.land/std@0.167.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const password = body.password;
    if (!password) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing password" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Set up Supabase client
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch owner password config
    const { data: configs, error: configError } = await client
      .from("auth_config")
      .select("config_key, config_value");
    if (configError)
      throw configError;

    const ownerPassword = configs?.find((c: any) => c.config_key === "owner_password")?.config_value;
    if (!ownerPassword) {
      return new Response(
        JSON.stringify({ success: false, error: "No owner password set" }),
        { status: 500, headers: corsHeaders }
      );
    }
    if (password !== ownerPassword) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid password" }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Get user IP from request headers
    const headers = Object.fromEntries(req.headers);
    const ip =
      headers["x-forwarded-for"] ||
      headers["x-real-ip"] ||
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      req.conn?.remoteAddr?.hostname ||
      null;

    // Fallback if IP can't be determined
    const ip_address = ip || "unknown_ip";

    // Insert or upsert row in admin_users
    const { error: upsertError } = await client
      .from("admin_users")
      .upsert({
        ip_address,
        role: "owner",
        approved_by: "system",
        approved_at: new Date().toISOString(),
        last_access: new Date().toISOString(),
      });

    if (upsertError)
      throw upsertError;

    return new Response(JSON.stringify({ success: true, role: "owner", ip_address }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ success: false, error: String(e?.message || e) }),
      { status: 500, headers: corsHeaders }
    );
  }
});
