import { useState } from "react"
import { supabase } from "../../../lib/supabase"
import {
  TextField,
  Button,
  Box
} from "@mui/material"

export default function SalarySettingsForm({
  driverId,
  onClose
}) {
  const [threshold, setThreshold] = useState(70000)
  const [percentAbove, setPercentAbove] = useState(50)
  const [percentBelow, setPercentBelow] = useState(48)
  const [taxPercent, setTaxPercent] = useState(20)

  const handleSave = async () => {
    await supabase
      .from("driver_salary_settings")
      .upsert({
        driver_id: driverId,
        threshold,
        percent_above: percentAbove,
        percent_below: percentBelow,
        tax_percent: taxPercent
      })

    alert("Kaydedildi")

    onClose()
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
        mt: 1
      }}
    >
      <TextField
        label="Kazanç Eşiği"
        type="number"
        value={threshold}
        onChange={(e) =>
          setThreshold(Number(e.target.value))
        }
      />

      <TextField
        label="Eğer üstünde ise %"
        type="number"
        value={percentAbove}
        onChange={(e) =>
          setPercentAbove(Number(e.target.value))
        }
      />

      <TextField
        label="Eğer altında ise %"
        type="number"
        value={percentBelow}
        onChange={(e) =>
          setPercentBelow(Number(e.target.value))
        }
      />

      <TextField
        label="Vergi %"
        type="number"
        value={taxPercent}
        onChange={(e) =>
          setTaxPercent(Number(e.target.value))
        }
      />

      <Button
        variant="contained"
        onClick={handleSave}
      >
        Kaydet
      </Button>
    </Box>
  )
}