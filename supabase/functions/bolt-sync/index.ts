import { serve } from "https://deno.land/std/http/server.ts";

import { createClient }
from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {

  try {

    const supabase =
      createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );

    console.log("Bolt driver sync başladı");

    const today =
      new Date()
        .toISOString()
        .split("T")[0];

    // DRIVER LIST

    const driversResponse =
  await fetch(
    "https://fleetownerportal.live.boltsvc.net/fleetOwnerPortal/getDriversByDateRange?language=en&version=FO.3.1996&company_id=308887&user_id=336691&brand=bolt",
	
    {

      method: "POST",

      headers: {

        "authorization":
          `Bearer ${Deno.env.get("BOLT_AUTH_TOKEN")}`,

        "content-type":
          "application/json",
		  
		  "cookie":
    Deno.env.get("BOLT_COOKIE")!,

      },

      body: JSON.stringify({

        start_date: today,
        end_date: today,

        limit: 50,
        offset: 0,

      }),

    }
  );

const rawText =
  await driversResponse.text();



const driversJson =
  JSON.parse(rawText);

const drivers =
  driversJson?.data?.list || [];

console.log(
  "Driver count:",
  drivers.length
);

    // LOOP DRIVERS

    for (const d of drivers) {

      const boltDriverId =
        d.id;

      // DRIVER EARNINGS

      const earningsResponse =
        await fetch(
          "https://fleetownerportal.live.boltsvc.net/fleetOwnerPortal/driverEarnings/getTable?language=en&version=FO.3.1996&company_id=308887&user_id=336691&brand=bolt",
		  
          {

            method: "POST",

            headers: {

              "authorization":
                `Bearer ${Deno.env.get("BOLT_AUTH_TOKEN")}`,

              "content-type":
                "application/json",
				
			  "cookie":
				Deno.env.get("BOLT_COOKIE")!,

            },

            body: JSON.stringify({

              start_date: today,
              end_date: today,

              driver_ids: [
                boltDriverId
              ],

              sorting_field:
                "driver_name",

              sorting_direction:
                "asc",

              limit: 50,
              offset: 0,

            }),

          }
        );

      const earningsJson =
        await earningsResponse.json();

      const columns =
        earningsJson?.data?.columns || [];
		

      // PARSE DATA

      let driverName = "";
      let gross = 0;
      let tips = 0;
      let net = 0;

      for (const col of columns) {

        if (
          col.key ===
          "driver_name"
        ) {
          driverName =
            col.cells?.[0]?.name || "";
        }

        if (
          col.key ===
          "gross_earnings"
        ) {
          gross =
            Number(
              col.cells?.[0]
            ) || 0;
        }

        if (
          col.key ===
          "rider_tips"
        ) {
          tips =
            Number(
              col.cells?.[0]
            ) || 0;
        }

        if (
          col.key ===
          "net_earnings"
        ) {
          net =
            Number(
              col.cells?.[0]
            ) || 0;
        }

      }

      

      // MATCH DRIVER

      const { data: dbDriver } =
        await supabase
          .from("drivers")
          .select("*")
          .eq(
            "bolt_driver_id",
            String(boltDriverId)
          )
          .single();

      if (!dbDriver) {


        continue;
      }

      // EXISTING DAY

      const { data: existing } =
        await supabase
          .from("driver_daily_summary")
          .select("*")
          .eq(
            "driver_id",
            dbDriver.id
          )
          .eq(
            "date",
            today
          )
          .single();

      if (existing) {
		  
		  

        // UPDATE

        await supabase
          .from("driver_daily_summary")
          .update({

			bolt_income: net,
			bolt_tips: tips,

			// legacy columns
			bolt: net,

			total_income:
				Number(existing.uber_income || 0) +
				Number(existing.sumup_income || 0) +
				net,

})
          .eq(
            "id",
            existing.id
          );
			console.log("UPDATE ÇALIŞTI");
      } else {

        // INSERT

        await supabase
			.from("driver_daily_summary")
			.insert({

			driver_id:
				dbDriver.id,

			date: today,

			bolt_income:
				net,

			bolt_tips:
				tips,

			// legacy
			bolt:
				net,

			total_income:
				net,

			});
			console.log("INSERT ÇALIŞTI");
		}

      
    }

    return new Response(
      JSON.stringify({
        success: true
      }),
      {
        headers: {
          "Content-Type":
            "application/json",
          "Access-Control-Allow-Origin":
            "*",
			"cookie":
    Deno.env.get("BOLT_COOKIE")!,
        }
      }
    );

  } catch (err) {

    return new Response(
      JSON.stringify({
        error: err.message
      }),
      {
        status: 500
      }
    );

  }

});