import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getMaintenances } from '../../../features/maintenance/maintenance.api';
import VehicleMaintenanceTimeline from './VehicleMaintenanceTimeline';
import { deleteMaintenance } from '../../../features/maintenance/maintenance.api';


export default function MaintenanceHistoryModal({ vehicle, onClose, onAddMaintenance, onEditMaintenance }) {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (!vehicle) return;

    getMaintenances(vehicle.id).then(setList);
  }, [vehicle]);

  if (!vehicle) return null;
  
  async function handleDelete(item) {
  if (!window.confirm('Bu bakım kaydı silinsin mi?')) return;

  await deleteMaintenance(item.id);
  const updated = await getMaintenances(vehicle.id);
  setList(updated);
}
const totalCost = list.reduce(
  (sum, m) => sum + (m.cost || 0),
  0
);

function handleEdit(item) {
  onEditMaintenance(item);
}


  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal>
        <Header>
			<h3>{vehicle.plate} • Bakım Geçmişi</h3>
			<HeaderActions>
				<AddButton onClick={onAddMaintenance}> ➕ Yeni Bakım </AddButton>
				<Close onClick={onClose}>✕</Close>
			</HeaderActions>
		</Header>
		<TotalCost>
  Toplam bakım maliyeti: <b>{totalCost.toLocaleString()} ₺</b>
</TotalCost>

		<VehicleMaintenanceTimeline items={list}
			onEditMaintenance={handleEdit}
			onDeleteMaintenance={handleDelete}
		/>

      </Modal>
    </>
  );
}

/* styles */

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  z-index: 1001;
  top: 50%;
  left: 50%;
  width: 520px;
  max-height: 80vh;
  overflow-y: auto;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 20px;
  box-shadow: ${({ theme }) => theme.shadow.lg};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const Close = styled.button`
  border: none;
  background: none;
  font-size: 18px;
  cursor: pointer;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const AddButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryHover};
  }
`;
const TotalCost = styled.div`
  font-size: 14px;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.muted};
`;
