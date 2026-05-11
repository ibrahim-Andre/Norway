require("dotenv").config({
  path: "./frontend/.env",
});

const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

// ENV
const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;

const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE ||
  process.env.REACT_APP_SUPABASE_ANON_KEY;

const SUMUP_API_KEY = process.env.SUMUP_API_KEY;

// Supabase
const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// MAIN
async function syncSumupTransactions() {
  try {
    console.log("🚀 SumUp sync başlıyor...");

    let allTransactions = [];
    let nextCursor = null;

    // 🔥 TÜM TRANSACTIONS
    do {
      const response = await axios.get(
        "https://api.sumup.com/v0.1/me/transactions/history",
        {
          headers: {
            Authorization: `Bearer ${SUMUP_API_KEY}`,
          },
          params: {
            limit: 100,
            cursor: nextCursor,
            order: "descending",
          },
        }
      );

      const items = response.data.items || [];

      console.log("📦 batch:", items.length);

      allTransactions.push(...items);

      nextCursor = response.data.cursor || null;

    } while (nextCursor);

    console.log("📊 toplam:", allTransactions.length);

    // ✅ SADECE BAŞARILI
    const transactions = allTransactions.filter(
      (tx) =>
        tx.status === "SUCCESSFUL" ||
        tx.status === "PAID"
    );

    console.log("✅ başarılı:", transactions.length);

    for (const tx of transactions) {

      const amount = Number(tx.amount || 0);
      const fee = Number(tx.fee || 0);

      const timestamp = tx.timestamp || null;

      const txDate = timestamp
        ? new Date(timestamp).toISOString().split("T")[0]
        : null;

      const transactionId =
        tx.transaction_id || tx.id;

      // 🔥 DRIVER BUL (EN DOĞRU: checkout_reference)
      let driverId = null;

      if (tx.checkout_reference) {
        try {
          if (tx.checkout_reference.startsWith("driver_")) {
            driverId = tx.checkout_reference.replace("driver_", "");
          } else {
            const parsed = JSON.parse(tx.checkout_reference);
            driverId = parsed.driverId || null;
          }
        } catch (e) {}
      }

      // 🔁 FALLBACK (merchant)
      if (!driverId) {
        const merchantCode =
          tx.merchant_code ||
          tx.merchant?.merchant_code ||
          tx.merchant?.id ||
          null;

        if (merchantCode) {
          const { data: driver } = await supabase
            .from("drivers")
            .select("id")
            .eq(
              "sumup_merchant_code",
              merchantCode.toString().trim()
            )
            .maybeSingle();

          if (driver) driverId = driver.id;
        }
      }

      if (!driverId) {
        console.log("❌ DRIVER YOK:", transactionId);
      }

      // ❌ DUPLICATE ENGELLE
      const { data: existing } = await supabase
        .from("sumup_transactions")
        .select("id")
        .eq("transaction_id", transactionId)
        .maybeSingle();

      if (existing) continue;

      // ✅ TRANSACTION INSERT
      const { error } = await supabase
        .from("sumup_transactions")
        .insert({
          driver_id: driverId,
          date: txDate,
          amount,
          fee,
          net_amount: amount - fee,
          transaction_id: transactionId,
          status: tx.status,
          currency: tx.currency,
          payment_type: tx.payment_type,
          card_type: tx.card?.type || null,
        });

      if (error) {
        console.error("Insert error:", error.message);
        continue;
      }

      console.log("💾 kayıt:", transactionId);

      // 🔥 EN KRİTİK KISIM (DOUBLE COUNT FIX)
      if (driverId && txDate) {

        // O günün TÜM işlemlerini DB'den çek
        const { data: dayTransactions } = await supabase
          .from("sumup_transactions")
          .select("amount")
          .eq("driver_id", driverId)
          .eq("date", txDate);

        const dayTotal = (dayTransactions || []).reduce(
          (sum, t) => sum + Number(t.amount || 0),
          0
        );

        const { data: existingSummary } = await supabase
          .from("driver_daily_summary")
          .select("*")
          .eq("driver_id", driverId)
          .eq("date", txDate)
          .maybeSingle();

        if (existingSummary) {

          await supabase
            .from("driver_daily_summary")
            .update({
              sumup: dayTotal,
              total_income: dayTotal,
            })
            .eq("id", existingSummary.id);

        } else {

          await supabase
            .from("driver_daily_summary")
            .insert({
              driver_id: driverId,
              date: txDate,
              uber: 0,
              uber_tips: 0,
              uber_cash: 0,
              bolt: 0,
              bolt_tips: 0,
              sumup: dayTotal,
              sumup_tips: 0,
              total_income: dayTotal,
            });
        }
      }
    }

    console.log("✅ SYNC TAMAMLANDI");

  } catch (err) {
    console.error(
      "❌ HATA:",
      err.response?.data || err.message
    );
  }
}

syncSumupTransactions();