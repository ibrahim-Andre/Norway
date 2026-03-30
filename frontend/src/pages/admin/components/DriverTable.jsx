import { useEffect, useState } from "react"
import { DataGrid } from "@mui/x-data-grid"
import { Chip, IconButton, Box, Dialog, DialogTitle, DialogContent } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import BlockIcon from "@mui/icons-material/Block"
import DeleteIcon from "@mui/icons-material/Delete"
import AttachMoneyIcon from "@mui/icons-material/AttachMoney"
import { supabase } from "../../../lib/supabase"
import { useNavigate } from "react-router-dom"
import DriverDailyIncomeForm from "./DriverDailyIncomeForm"

export default function DriverTable({ onEdit, refreshKey }) {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)

  // GELIR MODAL STATE
  const [incomeOpen, setIncomeOpen] = useState(false)
  const [selectedDriver, setSelectedDriver] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    fetchDrivers()
  }, [refreshKey])

  const fetchDrivers = async () => {
    const { data, error } = await supabase
      .from("drivers")
      .select(` id, auth_user_id, full_name, phone, email, license_no, license_expiry, status, rating,
      driver_vehicle_assignments (
        vehicle_id,
        is_active,
        vehicles ( id, plate, brand, model )
      )
    `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(error)
      return
    }

    setRows(data || [])
    setLoading(false)
  }

  const updateStatus = async (id, status) => {
    await supabase
      .from("drivers")
      .update({ status })
      .eq("id", id)

    fetchDrivers()
  }

  const deleteDriver = async (authUserId) => {
    const ok = window.confirm("Driver tamamen silinsin mi?")
    if (!ok) return

    const {
      data: { session }
    } = await supabase.auth.getSession()

    const res = await fetch(
      `${process.env.REACT_APP_SUPABASE_URL}/functions/v1/delete-driver`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ auth_user_id: authUserId }),
      }
    )

    if (!res.ok) {
      const err = await res.text()
      alert("Silme başarısız: " + err)
      return
    }

    fetchDrivers()
  }

  // GELIR BUTONU
  const handleIncomeClick = (driver) => {
    setSelectedDriver(driver)
    setIncomeOpen(true)
  }

  const columns = [
    {
      field: "full_name",
      headerName: "Driver",
      flex: 1
    },
    {
      field: "phone",
      headerName: "Phone",
      flex: 1
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === "active"
              ? "success"
              : params.value === "inactive"
                ? "warning"
                : "error"
          }
          size="small"
        />
      )
    },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.7,
      renderCell: (params) => params.value ?? "-"
    },
    {
      field: "vehicles",
      headerName: "Assigned Vehicles",
      flex: 1.5,
      renderCell: (params) => {
        const activeAssignments =
          params.row.driver_vehicle_assignments?.filter(a => a.is_active)

        if (!activeAssignments || activeAssignments.length === 0)
          return "-"

        return (
          <div>
            {activeAssignments.map(a => (
              <Chip
                key={a.vehicle_id}
                label={a.vehicles?.plate}
                size="small"
                clickable
                onClick={() => navigate("/admin/vehicles")}
                sx={{ mr: 0.5, cursor: "pointer" }}
              />
            ))}
          </div>
        )
      }
    },
    {
      field: "license_expiry",
      headerName: "License Expiry",
      flex: 1,
      renderCell: (params) => {
        const expired = new Date(params.value) < new Date()
        return (
          <span style={{ color: expired ? "red" : "inherit" }}>
            {params.value}
          </span>
        )
      }
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1.3,

      renderCell: (params) => (
        <>
          {/* EDIT */}
          <IconButton
            size="small"
            color="primary"
            onClick={() => onEdit(params.row)}
          >
            <EditIcon fontSize="small" />
          </IconButton>

          {/* AKTIF / PASIF */}
          <IconButton
            size="small"
            color="warning"
            onClick={() =>
              updateStatus(
                params.row.id,
                params.row.status === "active" ? "inactive" : "active"
              )
            }
          >
            <BlockIcon fontSize="small" />
          </IconButton>

          {/* DELETE */}
          <IconButton
            size="small"
            color="error"
            onClick={() => deleteDriver(params.row.auth_user_id)}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

          {/* KAZANC BUTONU */}
          <IconButton
            size="small"
            color="success"
            onClick={() => handleIncomeClick(params.row)}
          >
            <AttachMoneyIcon fontSize="small" />
          </IconButton>
        </>
      )
    }
  ]

  return (
    <>
      <Box sx={{ height: 600, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id}
          loading={loading}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
        />
      </Box>

      {/* POPUP */}
      <Dialog
        open={incomeOpen}
        onClose={() => setIncomeOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {selectedDriver?.full_name} - Günlük Kazanç Girişi
        </DialogTitle>

        <DialogContent>
          {selectedDriver && (
            <DriverDailyIncomeForm driverId={selectedDriver.id} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
