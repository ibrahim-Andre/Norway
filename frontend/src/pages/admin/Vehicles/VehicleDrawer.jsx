import { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { createVehicle, updateVehicle } from '../../../features/vehicles/vehicles.api';

export default function VehicleDrawer({ vehicle, onClose, onSaved }) {
  const [form, setForm] = useState({
    plate: vehicle?.plate || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    year: vehicle?.year || '',
	fuel_cost: vehicle?.fuel_cost || '',
	insurance_expiry: vehicle?.insurance_expiry || '',
	inspection_expiry: vehicle?.inspection_expiry || '',
    status: vehicle?.status || 'active'
  });
  


  async function submit() {
  if (!form.plate) return alert('Plaka zorunlu');

  const payload = {
    ...form,
    fuel_cost: form.fuel_cost
      ? Number(form.fuel_cost)
      : 0,
  };

  if (vehicle) {
    await updateVehicle(vehicle.id, payload);
  } else {
    await createVehicle(payload);
  }

  onSaved();
  onClose();
}

  return (
    <>
      <Backdrop onClick={onClose} />
      <Drawer>
        <Title>{vehicle ? 'Araç Düzenle' : 'Yeni Araç'}</Title>

        <Input placeholder="Plaka"
          value={form.plate}
          onChange={e => setForm({ ...form, plate: e.target.value })} />

        <Input placeholder="Marka"
          value={form.brand}
          onChange={e => setForm({ ...form, brand: e.target.value })} />

        <Input placeholder="Model"
          value={form.model}
          onChange={e => setForm({ ...form, model: e.target.value })} />

        <Input type="number" placeholder="Yıl" value={form.year}
			onChange={e => setForm({ ...form, year: e.target.value })} />
		  
		<Input type="number" placeholder="Yakıt" value={form.fuel_cost} 
			onChange={(e) => setForm({ ...form, fuel_cost: e.target.value })}/>
		<p>Sigorta Tarihi</p>	
		<Input type="date" value={form.insurance_expiry} 
			onChange={(e) => setForm({ ...form, insurance_expiry: e.target.value })}/>
		<p>Muayene Tarihi</p>
		<Input type="date" value={form.inspection_expiry} 
			onChange={(e) => setForm({ ...form, inspection_expiry: e.target.value })}/>
		
		

        <Footer>
          <Cancel onClick={onClose}>Vazgeç</Cancel>
          <Save onClick={submit}>Kaydet</Save>
        </Footer>
      </Drawer>
    </>
  );
}

const slide = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
`;

const Drawer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  height: 100%;
  width: 360px;
  background: #fff;
  padding: 24px;
  animation: ${slide} .25s ease-out;
`;

const Title = styled.h3`
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 24px;
  right: 24px;
  display: flex;
  gap: 8px;
`;

const Cancel = styled.button`
  background: #f1f5f9;
  border: none;
  padding: 10px 14px;
  border-radius: 8px;
`;

const Save = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 8px;
`;
