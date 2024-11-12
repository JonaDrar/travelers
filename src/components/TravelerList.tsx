import React, { useState } from 'react';
import { Traveler } from '../types';
import { ConfirmationModal } from './ConfirmationModal';

interface TravelerListProps {
  travelers: Traveler[];
  onRemove: (travelerId: string) => void;
}

export const TravelerList: React.FC<TravelerListProps> = ({ travelers, onRemove }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTraveler, setSelectedTraveler] = useState<string | null>(null);

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

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Viajeros</h2>
      <ul>
        {travelers.map((traveler) => (
          <li key={traveler.id} className="flex justify-between items-center mb-2">
            <span>{traveler.name}</span>
            <button
              onClick={() => handleDeleteClick(traveler.id)}
              className="text-red-500 hover:underline"
            >
              Eliminar
            </button>
          </li>
        ))}
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