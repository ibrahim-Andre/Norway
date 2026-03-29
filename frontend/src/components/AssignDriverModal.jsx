import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  CircularProgress
} from "@mui/material";
import { getAllDrivers } from "../lib/drivers";
import { assignVehicle } from "../lib/assignments";

function AssignDriverModal({ open, onClose, vehicleId, onAssigned }) {
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) loadDrivers();
  }, [open]);

  async function loadDrivers() {
    try {
      const data = await getAllDrivers();
      setDrivers(data || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAssign() {
    if (!selectedDriver) return;

    try {
      setLoading(true);
      await assignVehicle(selectedDriver, vehicleId);
      onAssigned(); // parent refresh
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Assign Driver</DialogTitle>

      <DialogContent>
        <Select
          fullWidth
          value={selectedDriver}
          onChange={(e) => setSelectedDriver(e.target.value)}
        >
          {drivers.map((driver) => (
            <MenuItem key={driver.id} value={driver.id}>
              {driver.full_name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button
          variant="contained"
          onClick={handleAssign}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : "Assign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AssignDriverModal;
