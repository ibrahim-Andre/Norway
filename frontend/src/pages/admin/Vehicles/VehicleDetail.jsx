import { useState } from "react";
import { Button } from "@mui/material";
import AssignDriverModal from "../../../components/AssignDriverModal";
import { useParams } from "react-router-dom";


function VehicleDetail({ vehicleId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const { id } = useParams();

  function refreshAssignments() {
    // burada aktif driver listesini tekrar çek
  }

  return (
    <div>
      <h2>Vehicle Detail</h2>

      <Button
        variant="contained"
        onClick={() => setModalOpen(true)}
      >
        Assign Driver
      </Button>

      <AssignDriverModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicleId={vehicleId}
        onAssigned={refreshAssignments}
      />
    </div>
  );
}

export default VehicleDetail;
