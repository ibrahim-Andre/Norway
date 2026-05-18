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

    console.log(
      "Bolt driver sync başladı"
    );


   

    // DRIVERS

    const drivers = [

      {
        id: 9049643,
        name: "Ismail Koc",
      },

      {
        id: 9041626,
        name: "Muhammet Cankaya",
      },

    ];

 


const syncDate =
  new Date()
    .toISOString()
    .split("T")[0];




  console.log(
    "SYNC DATE:",
    syncDate
  );

  console.log(
    "Driver count:",
    drivers.length
  );



      // LOOP DRIVERS

      for (const d of drivers) {

        const boltDriverId =
          d.id;

        // EARNINGS

console.log(
  "CURRENT TOKEN:",
  Deno.env
    .get("BOLT_AUTH_TOKEN")
);

const earningsResponse =
  await fetch(
    "https://fleetownerportal.live.boltsvc.net/fleetOwnerPortal/driverEarnings/getTable?language=en&version=FO.3.1996&company_id=308887&user_id=336691&brand=bolt",

    {

      method: "POST",

      headers: {

		"authorization":
			`Bearer ${Deno.env.get("BOLT_AUTH_TOKEN")!}`,


        "cookie":
          Deno.env.get("BOLT_COOKIE")!,

        "content-type":
          "application/json",

      },

      
body: JSON.stringify({

  start_date:
    syncDate,

  end_date:
    syncDate,

  driver_ids: [
    boltDriverId
  ],

  report_type:
    "payments",

  timezone:
    "Europe/Stockholm",

  sorting_field:
    "driver_name",

  sorting_direction:
    "asc",

  limit: 50,

  offset: 0,

}),


    }
  );

console.log(
  "EARNINGS STATUS:",
  earningsResponse.status
);

const earningsJson =
  await earningsResponse.json();

if (
  earningsJson?.code === 503
) {

  throw new Error(
    "TOKEN EXPIRED"
  );

}

console.log(
  "EARNINGS RESPONSE:",
  JSON.stringify(
    earningsJson,
    null,
    2
  )
);


        const columns =
          earningsJson?.data?.columns || [];

        // PARSE

        let gross = 0;
        let tips = 0;
        let net = 0;

        for (const col of columns) {

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

        console.log({
          syncDate,
          driver:
            d.name,
          net,
        });
		
		if (net <= 0) {

  console.log(
    "VERİ YOK"
  );

  continue;
}

        // DB DRIVER

        const {
          data: dbDriver
        } =
          await supabase
            .from("drivers")
            .select("*")
            .eq(
              "bolt_driver_id",
              String(
                boltDriverId
              )
            )
            .single();

        if (!dbDriver) {

          console.log(
            "DB DRIVER YOK"
          );

          continue;
        }

        // EXISTING

        const {
          data: existing
        } =
          await supabase
            .from(
              "driver_daily_summary"
            )
            .select("*")
            .eq(
              "driver_id",
              dbDriver.id
            )
            .eq(
              "date",
              syncDate
            )
            .single();

        if (existing) {

          // UPDATE

          await supabase
            .from(
              "driver_daily_summary"
            )
            .update({

              bolt_income:
                net,

              bolt_tips:
                tips,

              bolt:
                net,

              total_income:
                Number(
                  existing.uber_income || 0
                ) +
                Number(
                  existing.sumup_income || 0
                ) +
                net,

            })
            .eq(
              "id",
              existing.id
            );

          console.log(
            "UPDATE ÇALIŞTI"
          );

        } else {

          // INSERT

          await supabase
            .from(
              "driver_daily_summary"
            )
            .insert({

              driver_id:
                dbDriver.id,

              date:
                syncDate,

              bolt_income:
                net,

              bolt_tips:
                tips,

              bolt:
                net,

              total_income:
                net,

            });

          console.log(
            "INSERT ÇALIŞTI"
          );

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

        }

      }
    );

  

  } catch (err) {

    console.log(err);

    return new Response(
      JSON.stringify({
        error:
          err.message
      }),
      {
        status: 500
      }
    );

  }

});