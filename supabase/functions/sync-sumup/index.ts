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

async function syncSumup() {

  try {

    console.log("🚀 SumUp sync başladı");

    let allTransactions = [];
    let nextCursor = null;

    // TÜM TRANSACTIONS
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

      const items =
        response.data.items || [];

      allTransactions.push(...items);

      nextCursor =
        response.data.cursor || null;

    } while (nextCursor);

    // SADECE BAŞARILI
    const transactions =
      allTransactions.filter(
        (tx) =>
          tx.status === "SUCCESSFUL" ||
          tx.status === "PAID"
      );

    console.log(
      "✅ Başarılı işlem:",
      transactions.length
    );

    for (const tx of transactions) {

      const transactionId =
        tx.transaction_id || tx.id;

      // DUPLICATE CHECK
      const { data: exists } =
        await supabase
          .from("sumup_transactions")
          .select("id")
          .eq(
            "transaction_id",
            transactionId
          )
          .maybeSingle();

      if (exists) continue;

      const amount =
        Number(tx.amount || 0);

      const fee =
        Number(tx.fee || 0);

      const date =
        tx.timestamp
          ?.split("T")[0];

      // DRIVER ID
      let driverId = null;

      if (
        tx.checkout_reference?.startsWith(
          "driver_"
        )
      ) {

        driverId =
          tx.checkout_reference.replace(
            "driver_",
            ""
          );
      }

      // INSERT
      await supabase
        .from("sumup_transactions")
        .insert({
          driver_id: driverId,
          date,
          amount,
          fee,
          net_amount: amount - fee,
          transaction_id: transactionId,
          status: tx.status,
          currency: tx.currency,
        });

      console.log(
        "💾 kayıt:",
        transactionId
      );
    }

    console.log("✅ Sync tamamlandı");

  } catch (err) {

    console.error(
      "❌ Hata:",
      err.response?.data ||
      err.message
    );
  }
}

syncSumup();