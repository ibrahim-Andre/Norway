import { useEffect, useState } from "react";
import { getDriverVehicles, unassignVehicle } from "../lib/assignments";

function DriverDetail({ driverId }) {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadVehicles();
  }, []);

  async function loadVehicles() {
    const data = await getDriverVehicles(driverId);
    setVehicles(data);
  }

  async function handleUnassign(vehicleId) {
    await unassignVehicle(driverId, vehicleId);
    loadVehicles();
  }

  return (
    <div>
      <h2>Assigned Vehicles</h2>
      {vehicles.map((v) => (
        <div key={v.vehicles.id}>
          {v.vehicles.plate} - {v.vehicles.brand}
          <button onClick={() => handleUnassign(v.vehicles.id)}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
}

export default DriverDetail;
