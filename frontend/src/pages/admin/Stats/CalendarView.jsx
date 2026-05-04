import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function CalendarView() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {

    const { data } =
      await supabase.from("invoices").select("*");

    const mapped = data.map(e => ({
      title: `${e.pay_to} - ₺${e.amount}`,
      date: e.payment_date,
    }));

    setEvents(mapped);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin]}
      initialView="dayGridMonth"
      events={events}
      height="600px"
    />
  );
}