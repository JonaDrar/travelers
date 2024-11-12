// src/components/AddExpenseForm.tsx
import { useState } from 'react';
import { toast } from 'react-toastify';
import { Traveler } from '../types';
import { db } from '../firebase/firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';

interface AddExpenseFormProps {
  travelers: Traveler[];
}

export const AddExpenseForm: React.FC<AddExpenseFormProps> = ({ travelers }) => {
  const [type, setType] = useState('');
  const [amount, setAmount] = useState<number>(0);

  const handleAddExpense = async (travelerId: string) => {
    if (!type.trim() || amount <= 0) {
      toast.error('El tipo de gasto y el monto son requeridos');
      return;
    }
    try {
      await addDoc(collection(db, 'expenses'), {
        type,
        amount,
        travelerId,
        date: new Date().toLocaleDateString(),
      });
      setType('');
      setAmount(0);
      toast.success('Gasto guardado');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Ocurrió un error al guardar el gasto');
      }
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Agregar Gasto</h2>
      <input
        type="text"
        value={type}
        onChange={(e) => setType(e.target.value)}
        placeholder="Tipo de gasto"
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(parseFloat(e.target.value))}
        placeholder="Monto"
        className="w-full mb-4 p-2 border rounded"
      />
      <div>
        {travelers.map((traveler) => (
          <button
            key={traveler.id}
            onClick={() => handleAddExpense(traveler.id)}
            className="bg-green-500 text-white px-4 py-2 m-1 rounded"
          >
            {traveler.name}
          </button>
        ))}
      </div>
    </div>
  );
};