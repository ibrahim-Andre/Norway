import { useEffect, useState } from 'react';
import { addMaintenance, updateMaintenance } from '../../../features/maintenance/maintenance.api';
import { Drawer, Backdrop } from '../../../ui/drawer';
import {FormCard, FormTitle, Field, Label, Input, Textarea, SaveButton } from '../../../ui/form';
import styled from 'styled-components';



export default function VehicleMaintenanceDrawer({ vehicle, editingMaintenance, onClose, onSaved }) {
  const [form, setForm] = useState({
  maintenance_date: editingMaintenance?.maintenance_date || '',
  operations: editingMaintenance?.operations || '',
  next_maintenance_date: editingMaintenance?.next_maintenance_date || '',
  cost: editingMaintenance?.cost || ''
});
const isEditMode = Boolean(editingMaintenance);


useEffect(() => {
  if (editingMaintenance) {
    setForm({
      maintenance_date: editingMaintenance.maintenance_date || '',
      operations: editingMaintenance.operations || '',
      next_maintenance_date: editingMaintenance.next_maintenance_date || '',
      cost: editingMaintenance.cost || ''
    });
  }
}, [editingMaintenance]);

  







async function submit() {
  try {
    if (!form.maintenance_date || !form.operations) {
      alert('Bakım tarihi ve yapılan işlemler zorunlu');
      return;
    }

    const payload = {
      ...form,
      cost: form.cost ? Number(form.cost) : null
    };

    if (isEditMode) {
      await updateMaintenance(editingMaintenance.id, payload);
    } else {
      await addMaintenance({
        vehicle_id: vehicle.id,
        ...payload
      });
    }

    onSaved();
    onClose();
  } catch (err) {
    console.error('MAINTENANCE SUBMIT ERROR:', err);
    alert(err.message || 'Bakım kaydedilemedi');
  }
}





  return (
    <>
      <Backdrop onClick={onClose} />
	  {isEditMode && (
  <EditInfo>
    ✏️ Bakım Düzenleniyor
  </EditInfo>
)}

      <Drawer>
        <FormCard>
  <FormTitle>Yeni Bakım Ekle</FormTitle>

  <Field>
    <Label>Bakım Tarihi</Label>
    <Input
      type="date"
      value={form.maintenance_date}
      onChange={e =>
        setForm({ ...form, maintenance_date: e.target.value })
      }
    />
  </Field>

  <Field>
    <Label>Yapılan İşlemler</Label>
    <Textarea
      rows={4}
      placeholder="Örn: Yağ değişimi, fren balataları, filtreler..."
      value={form.operations}
      onChange={e =>
        setForm({ ...form, operations: e.target.value })
      }
    />
  </Field>

  <Field>
    <Label>Sonraki Bakım Tarihi</Label>
    <Input
      type="date"
      value={form.next_maintenance_date}
      onChange={e =>
        setForm({ ...form, next_maintenance_date: e.target.value })
      }
    />
  </Field>
  <Field>
  <Label>Bakım Maliyeti (₺)</Label>
  <Input
    type="number"
    placeholder="Örn: 2500"
    value={form.cost}
    onChange={(e) =>
      setForm({ ...form, cost: e.target.value })
    }
  />
</Field>



  <SaveButton onClick={submit}>
  {isEditMode ? 'Değişiklikleri Kaydet' : 'Bakımı Kaydet'}
</SaveButton>

</FormCard>

      </Drawer>
    </>
  );
}

const EditInfo = styled.div`
  background: #fef3c7;
  color: #92400e;
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 12px;
`;
