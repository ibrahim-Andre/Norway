import { useEffect, useState } from 'react';
import { deleteVehicle } from '../../features/vehicles/vehicles.api';
import VehiclesList from './Vehicles/VehiclesList';
import VehicleDrawer from './Vehicles/VehicleDrawer';
import { Plus } from 'lucide-react';
import { PrimaryButton } from '../../ui/buttons';
import VehicleMaintenanceDrawer from './Vehicles/VehicleMaintenanceDrawer';
import { getVehiclesWithMaintenance } from '../../features/vehicles/vehicles.api';
import MaintenanceHistoryModal from './Vehicles/MaintenanceHistoryModal';
import AssignDriverModal from "../../components/AssignDriverModal";



export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [maintenanceOpen, setMaintenanceOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [editingMaintenance, setEditingMaintenance] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);




  async function load() {
  const data = await getVehiclesWithMaintenance();
  setVehicles(data);
}

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <PrimaryButton onClick={() => {
  setEditing(null);
  setOpen(true);
}}>
  <Plus size={18} />
  Araç Ekle
</PrimaryButton>



<VehiclesList
  vehicles={vehicles}
  onEdit={(v) => { setEditing(v); setOpen(true); }}
  onDelete={async (id) => { if (!window.confirm('Bu araç silinsin mi?')) return;
    await deleteVehicle(id);
    load();
  }}
  onMaintenance={(v) => { setSelectedVehicle(v); setHistoryOpen(true); }}
  onAssignDriver={(vehicle) => { setSelectedVehicle(vehicle); setAssignModalOpen(true); }}
/>


{open && (
  <VehicleDrawer
    vehicle={editing}
    onClose={() => setOpen(false)}
    onSaved={load}
  />
)}
{maintenanceOpen && selectedVehicle && (
  <VehicleMaintenanceDrawer
  vehicle={selectedVehicle}
  editingMaintenance={editingMaintenance}   // 👈 ÖNEMLİ
  onClose={() => {
  setMaintenanceOpen(false);
  setEditingMaintenance(null); // 👈 BUNU UNUTMA
}}

  onSaved={load}
/>

)}

{historyOpen && selectedVehicle && (
  <MaintenanceHistoryModal
    vehicle={selectedVehicle}
    onClose={() => {
      setHistoryOpen(false);
      setSelectedVehicle(null);
    }}
    onAddMaintenance={() => {
      setHistoryOpen(false);
      setMaintenanceOpen(true);
    }}
    onEditMaintenance={(item) => {
      setEditingMaintenance(item);
      setHistoryOpen(false);
      setMaintenanceOpen(true);
    }}
  />
)}
{selectedVehicle && (
  <AssignDriverModal
    open={assignModalOpen}
    onClose={() => setAssignModalOpen(false)}
    vehicleId={selectedVehicle.id}
    onAssigned={() => {
      setAssignModalOpen(false);
      // burada istersen refreshVehicles() çağır
    }}
  />
)}




    </>
  );
}