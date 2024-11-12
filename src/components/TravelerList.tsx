import React, { useState } from 'react';
import { Traveler, Expense } from '../types';
import { ConfirmationModal } from './ConfirmationModal';

interface TravelerListProps {
  travelers: Traveler[];
  expenseList: Expense[];
  onRemove: (travelerId: string) => void;
  onAdd: (name: string) => void;
}

export const TravelerList: React.FC<TravelerListProps> = ({ travelers, expenseList, onRemove, onAdd }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState<string | null>(null);
  const [newTravelerName, setNewTravelerName] = useState('');

  const handleDeleteClick = (travelerId: string) => {
    setSelectedTraveler(travelerId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedTraveler) {
      onRemove(selectedTraveler);
    }
    setIsModalOpen(false);
    setSelectedTraveler(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedTraveler(null);
  };

  const handleAddTraveler = () => {
    if (newTravelerName.trim()) {
      onAdd(newTravelerName.trim());
      setNewTravelerName('');
    } else {
      alert("El nombre del viajero no puede estar vacío");
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Viajeros</h2>

      {/* Formulario para agregar un nuevo viajero */}
      <div className="flex mb-4">
        <input
          type="text"
          value={newTravelerName}
          onChange={(e) => setNewTravelerName(e.target.value)}
          placeholder="Nombre del viajero"
          className="w-full p-2 border rounded-l"
        />
        <button
          onClick={handleAddTraveler}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600"
        >
          Añadir
        </button>
      </div>

      {/* Lista de viajeros con el total de gastos de cada uno */}
      <ul>
        {travelers.map((traveler) => {
          const travelerExpenses = expenseList.filter((expense) => expense.travelerId === traveler.id);
          const travelerTotal = travelerExpenses.reduce((total, expense) => total + expense.amount, 0);

          return (
            <li key={traveler.id} className="flex justify-between items-center mb-2">
              <div>
                <span>{traveler.name}</span>
                <span className="text-gray-500 text-sm ml-2">Total: ${travelerTotal}</span>
              </div>
              <button
                onClick={() => handleDeleteClick(traveler.id)}
                className="text-red-500 hover:underline"
              >
                Eliminar
              </button>
            </li>
          );
        })}
      </ul>

      <ConfirmationModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="¿Estás seguro de que deseas eliminar este viajero y todos sus registros asociados?"
      />
    </div>
  );
};