import "jsr:@supabase/functions-js/edge-runtime.d.ts";

Deno.serve(async (req) => {

  const url = new URL(req.url);

  const allParams = {};

  for (const [key, value] of url.searchParams.entries()) {
    allParams[key] = value;
  }

  return new Response(
    JSON.stringify({
      success: true,
      full_url: req.url,
      params: allParams
    }),
    {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    }
  );

});

//CALLBACK