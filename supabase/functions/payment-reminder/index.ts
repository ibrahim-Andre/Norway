import { serve } from "https://deno.land/std/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js";

// TELEGRAM GÖNDERME FONKSİYONU

async function sendTelegram(message: string) {

  const token =
    Deno.env.get("TELEGRAM_BOT_TOKEN");

  const chatId =
    Deno.env.get("TELEGRAM_CHAT_ID");

  try {

    await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
        }),
      }
    );

  } catch (err) {

    console.log("Telegram error:", err);

  }

}

serve(async () => {

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const today = new Date();

  // pending ödemeleri çek

  const { data, error } = await supabase
    .from("invoices")
    .select("*")
    .eq("status", "pending");

  if (error) {
    console.log(error);
    return new Response("Error");
  }

  for (const invoice of data) {

    const paymentDate = new Date(invoice.payment_date);
	const reminderDate = new Date(paymentDate);
	
	///////////////////////////////////
	const now = new Date();

if (
  paymentDate < now &&
  invoice.status === "pending"
) {

  console.log("OVERDUE:", invoice.pay_to);

  await sendTelegram(

`🚨 GECİKEN ÖDEME

Kime:
${invoice.pay_to}

Tutar:
${invoice.amount} €

Son ödeme tarihi:
${invoice.payment_date}

Durum:
Gecikti`

  );

}
//////////////////////////////////////////////////

    reminderDate.setDate(
      paymentDate.getDate() - invoice.reminder_days
    );

    if (
      reminderDate.toDateString() ===
      today.toDateString()
    ) {

      console.log(
        "Reminder:",
        invoice.pay_to,
        "Amount:",
        invoice.amount
      );

      // TELEGRAM MESAJ GÖNDER

      await sendTelegram(

`🔔 Ödeme Hatırlatma

Kime:
${invoice.pay_to}

Tutar:
${invoice.amount} €

Tarih:
${invoice.payment_date}

Açıklama:
${invoice.description ?? "-"}`

      );

    }

  }

  return new Response("OK");

});