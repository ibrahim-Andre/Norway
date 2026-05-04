import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function UpcomingPaymentsWidget() {

  const [payments, setPayments] = useState([]);

  useEffect(() => {

    fetchPayments();

  }, []);

  const fetchPayments = async () => {

    const today = new Date();

    const next7 = new Date();

    next7.setDate(today.getDate() + 7);

    const { data } = await supabase
      .from("invoices")
      .select("*")
      .gte("payment_date", today.toISOString())
      .lte("payment_date", next7.toISOString())
      .eq("status", "pending")
      .order("payment_date");

    setPayments(data || []);

  };

  return (

    <div>

      <h3>
        Yaklaşan Ödemeler (7 gün)
      </h3>

      {payments.map((p) => (

        <div key={p.id}>

          <strong>
            {p.pay_to}
          </strong>

          {" - "}

          {p.amount} €

          {" - "}

          {p.payment_date}

        </div>

      ))}

    </div>

  );

}