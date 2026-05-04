import { useState } from 'react';
import styled from 'styled-components';
import { addExpense } from '../../../features/expenses/expenses.api';

const TYPES = [
  'Sigorta',
  'Yol Vergisi',
  'Yakıt',
  'Taksimetre',
  'Hat Ücreti',
  'Kredi',
  'Araç Vergisi',
  'Diğer'
];

export default function VehicleExpensesModal({ vehicle, onClose, onSaved }) {
  const [type, setType] = useState(TYPES[0]);
  const [amount, setAmount] = useState('');

  async function handleSave() {
    if (!amount) return alert('Ücret gir');

    await addExpense({
      vehicle_id: vehicle.id,
      type,
      amount: Number(amount)
    });

    onSaved();
    onClose();
  }

  return (
    <>
      <Backdrop onClick={onClose} />
      <Modal>
        <h3>{vehicle.plate} • Ödemeler</h3>

        <Select
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {TYPES.map(t => (
            <option key={t}>{t}</option>
          ))}
        </Select>

        <Input
          type="number"
          placeholder="Tutar"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <Save onClick={handleSave}>Kaydet</Save>
      </Modal>
    </>
  );
}

/* styles */

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.4);
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme }) => theme.colors.card};
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  width: 400px;
`;

const Select = styled.select`
  width: 100%;
  margin-top: 10px;
  padding: 8px;
`;

const Input = styled.input`
  width: 100%;
  margin-top: 10px;
  padding: 8px;
`;

const Save = styled.button`
  margin-top: 12px;
  width: 100%;
  padding: 10px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radius.md};
`;