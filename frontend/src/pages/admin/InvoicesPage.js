import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";
import InvoiceForm from "./components/InvoiceForm";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";

export default function InvoicesPage() {

  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState([]);
  

  // DATA ÇEK

  useEffect(() => {

    fetchInvoices();

  }, []);

  const fetchInvoices = async () => {

    const { data, error } = await supabase
      .from("invoices")
      .select("*")
      .order("payment_date", { ascending: true });

    if (!error) {

      setInvoices(data);

    }

  };
  


  // ÖDEME YAPILDI

  const markAsPaid = async (id) => {

    const { error } = await supabase
      .from("invoices")
      .update({
        status: "paid",
        paid_at: new Date(),
      })
      .eq("id", id);

    if (!error) {

      fetchInvoices();

    }

  };
  
  // DELETE
  const deleteInvoice = async (id) => {

  const confirmDelete =
    window.confirm("Bu kaydı silmek istiyor musun?");

  if (!confirmDelete) return;

  const { error } = await supabase
    .from("invoices")
    .delete()
    .eq("id", id);

  if (!error) {

    fetchInvoices();

  }

};

  return (
    <Box>

      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Faturalar
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Fatura Ekle
        </Button>
      </Box>

      {/* TABLE */}

      <Table>

        <TableHead>

  <TableRow>

    <TableCell>Kime</TableCell>

    <TableCell>Tutar</TableCell>

    <TableCell>Tarih</TableCell>

    <TableCell>Durum</TableCell>

    <TableCell>Belge</TableCell>

    <TableCell>İşlem</TableCell>

  </TableRow>

</TableHead>

        <TableBody>

          {invoices.map((invoice) => (

            <TableRow key={invoice.id}>

  <TableCell>
    {invoice.pay_to}
  </TableCell>

  <TableCell>
    {invoice.amount} Sek
  </TableCell>

  <TableCell>
    {invoice.payment_date}
  </TableCell>

  <TableCell>

    {invoice.status === "paid" ? (

      <Chip label="Paid" color="success" />

    ) : (

      <Chip label="Pending" color="warning" />

    )}

  </TableCell>

  {/* PDF PREVIEW */}

  <TableCell>

    {invoice.document_url ? (

      <Box
        sx={{
          width: 60,
          height: 80,
          border: "1px solid #ccc",
          borderRadius: 1,
          overflow: "hidden",
          cursor: "pointer",
        }}
        onClick={() =>
          window.open(invoice.document_url)
        }
      >

        <iframe
          src={invoice.document_url}
          width="100%"
          height="100%"
          style={{
            border: "none",
            pointerEvents: "none",
          }}
          title="pdf-preview"
        />

      </Box>

    ) : (

      "-"
    )}

  </TableCell>

  {/* ACTIONS */}

  <TableCell>

    {/* ÖDEME */}

    {invoice.status !== "paid" && (

      <Button
        variant="contained"
        color="success"
        size="small"
        onClick={() =>
          markAsPaid(invoice.id)
        }
      >
        Ödeme Yapıldı
      </Button>

    )}

    {/* DOWNLOAD */}

    {invoice.document_url && (

      <Tooltip title="İndir">

        <IconButton
          color="primary"
          onClick={() => {

            const link =
              document.createElement("a");

            link.href =
              invoice.document_url;

            link.download =
              "invoice.pdf";

            link.click();

          }}
        >

          <DownloadIcon />

        </IconButton>

      </Tooltip>

    )}

    {/* DELETE */}

    <Tooltip title="Sil">

      <IconButton
        color="error"
        onClick={() =>
          deleteInvoice(invoice.id)
        }
      >

        <DeleteIcon />

      </IconButton>

    </Tooltip>

  </TableCell>

</TableRow>

          ))}

        </TableBody>

      </Table>

      {/* FORM MODAL */}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>

          Yeni Fatura

        </DialogTitle>

        <DialogContent>

          <InvoiceForm
            onClose={() => {

              setOpen(false);

              fetchInvoices();

            }}
          />

        </DialogContent>

      </Dialog>

    </Box>
  );

}