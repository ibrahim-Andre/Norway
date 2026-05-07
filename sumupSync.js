require("dotenv").config({
  path: "./frontend/.env",
});

const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

// ENV
const SUPABASE_URL =
  process.env.REACT_APP_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.REACT_APP_SUPABASE_ANON_KEY;

const SUMUP_API_KEY =
  process.env.SUMUP_API_KEY;

// Supabase
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// MAIN
async function syncSumupTransactions() {
  try {
    console.log("SumUp işlemleri çekiliyor...");

    const response = await axios.get(
      "https://api.sumup.com/v0.1/me/transactions/history",
      {
        headers: {
          Authorization: `Bearer ${SUMUP_API_KEY}`,
        },
      }
    );

    const transactions =
      response.data.items || [];

    console.log(
      `${transactions.length} işlem bulundu`
    );

    for (const tx of transactions) {

      // SADECE BAŞARILI ÖDEMELER
      if (tx.status !== "SUCCESSFUL") {
        continue;
      }

      const amount = Number(tx.amount || 0);

      const fee = Number(tx.fee || 0);

      const timestamp =
        tx.timestamp || null;

      const txDate = timestamp
        ? new Date(timestamp)
            .toISOString()
            .split("T")[0]
        : null;

      const transactionId =
        tx.transaction_id || tx.id;

      // MERCHANT
      const merchantCode =
        tx.merchant_code ||
        tx.merchant?.merchant_code ||
        null;

      // DRIVER BUL
      let driverId = null;

      if (merchantCode) {

        const { data: driver } =
          await supabase
            .from("drivers")
            .select("id")
            .eq(
              "sumup_merchant",
              merchantCode
            )
            .maybeSingle();

        if (driver) {
          driverId = driver.id;
        }
      }

      // DUPLICATE KONTROL
      const { data: existing } =
        await supabase
          .from("sumup_transactions")
          .select("id")
          .eq(
            "transaction_id",
            transactionId
          )
          .maybeSingle();

      if (existing) {
        console.log(
          "Zaten kayıtlı:",
          transactionId
        );
        continue;
      }

      // TRANSACTION INSERT
      const { error } =
        await supabase
          .from("sumup_transactions")
          .insert({
            driver_id: driverId,

            date: txDate,

            amount,

            fee,

            net_amount: amount - fee,

            transaction_id: transactionId,

            status: tx.status || null,

            currency:
              tx.currency || null,

            payment_type:
              tx.payment_type || null,

            card_type:
              tx.card?.type || null,
          });

      if (error) {
        console.error(
          "Insert error:",
          error.message
        );

        continue;
      }

      console.log(
        "Kaydedildi:",
        transactionId
      );

      // DRIVER DAILY SUMMARY UPDATE
      if (driverId && txDate) {

        const {
          data: existingSummary,
        } = await supabase
          .from("driver_daily_summary")
          .select("*")
          .eq("driver_id", driverId)
          .eq("date", txDate)
          .maybeSingle();

        if (existingSummary) {

          const currentSumup =
            Number(
              existingSummary.sumup || 0
            );

          const currentTotal =
            Number(
              existingSummary.total_income || 0
            );

          await supabase
            .from(
              "driver_daily_summary"
            )
            .update({
              sumup:
                currentSumup + amount,

              total_income:
                currentTotal + amount,
            })
            .eq(
              "id",
              existingSummary.id
            );

        } else {

          await supabase
            .from(
              "driver_daily_summary"
            )
            .insert({
              driver_id: driverId,

              date: txDate,

              uber: 0,

              uber_tips: 0,

              bolt: 0,

              bolt_tips: 0,

              sumup: amount,

              sumup_tips: 0,

              total_income: amount,
            });
        }
      }
    }

    console.log("Sync tamamlandı");

  } catch (err) {

    console.error(
      "SumUp sync error:",
      err.response?.data ||
      err.message
    );
  }
}

syncSumupTransactions();