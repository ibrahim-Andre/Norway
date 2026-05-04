import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
);

const CLIENT_ID = Deno.env.get("BOLT_CLIENT_ID");
const CLIENT_SECRET = Deno.env.get("BOLT_CLIENT_SECRET");

serve(async () => {
  try {
    console.log("🔄 Getting Bolt token...");

    // 1) TOKEN AL
    const tokenRes = await fetch("https://oidc.bolt.eu/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "client_credentials",
        scope: "fleet-integration:api",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      throw new Error("Token alınamadı");
    }

    const accessToken = tokenData.access_token;

    console.log("✅ Token alındı");

    // 2) ORDERLARI ÇEK
    const response = await fetch(
      "https://node.bolt.eu/fleet-integration-gateway/fleetIntegration/v1/getFleetOrders",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}) // istersen tarih filtresi ekleyebiliriz
      }
    );

    const data = await response.json();

    console.log("📦 FULL RESPONSE:", JSON.stringify(data, null, 2));

    const orders = data.data?.items || [];

    if (!orders.length) {
      console.log("⚠️ No rides yet");
      return new Response(JSON.stringify({ success: true, message: "No rides" }), {
        status: 200,
      });
    }

    // 3) GÜNLÜK TOPLAMA
    const dailyMap = {};

    for (const order of orders) {
      const price = order.price || {};

      const date =
        (order.created_at || order.createdAt || "").slice(0, 10);

      if (!date) continue;

      if (!dailyMap[date]) {
        dailyMap[date] = {
          driver_uuid: order.driver_uuid,
          earnings: 0,
          tips: 0,
        };
      }

      dailyMap[date].earnings += Number(price.net_earnings || 0);
      dailyMap[date].tips += Number(price.tip || 0);
    }

    // 4) DB'YE YAZ
    for (const date in dailyMap) {
      const item = dailyMap[date];

      const { data: driver } = await supabase
        .from("drivers")
        .select("id")
        .eq("bolt_driver_id", item.driver_uuid)
        .single();

      if (!driver) {
        console.log("❌ Driver not found:", item.driver_uuid);
        continue;
      }

      await supabase
        .from("driver_daily_income")
        .upsert({
          driver_id: driver.id,
          date: date,

          bolt: item.earnings,
          bolt_tips: item.tips,
        });

      console.log("✅ Saved:", date, item.earnings, item.tips);
    }

    return new Response(
      JSON.stringify({
        success: true,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("❌ ERROR:", error);

    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      { status: 500 }
    );
  }
});