import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async () => {

  const clientId = Deno.env.get("UBER_CLIENT_ID");

  const redirectUri =
    "https://scwijrbzkdzrimvzpkqr.supabase.co/functions/v1/uber-callback";

  const scope =
    "solutions.suppliers.metrics.read";

  const authUrl =
    `https://auth.uber.com/oauth/v2/authorize` +
    `?client_id=${clientId}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&state=test123`;

  return new Response(
    JSON.stringify({
      login_url: authUrl
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );

});