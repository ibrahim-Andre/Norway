import { useState } from "react"
import {
  Button,
  Box
} from "@mui/material"
import { supabase } from "../../lib/supabase"
import DriverTable from "../admin/components/DriverTable"
import DriverForm from "../admin/components/DriverForm"

export default function DriverDashboard() {
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState("create")
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  

  const handleCreate = () => {
    setMode("create")
    setSelectedDriver(null)
    setOpen(true)
  }

  const handleEdit = (driver) => {
    setMode("edit")
    setSelectedDriver(driver)
    setOpen(true)
  }

  const handleSuccess = () => {
    setRefreshKey((k) => k + 1)
  }

  return (
    <>
      

      <Box sx={{ p: 3 }}>
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={handleCreate}
        >
          Add Driver
        </Button>

        <DriverTable
          onEdit={handleEdit}
          refreshKey={refreshKey}
        />

        <DriverForm
          open={open}
          onClose={() => setOpen(false)}
          mode={mode}
          initialData={selectedDriver}
          onSuccess={handleSuccess}
        />
      </Box>
    </>
  )
}
