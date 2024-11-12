// src/components/TravelerList.tsx
import { Traveler } from '../types';

interface TravelerListProps {
  travelers: Traveler[];
  onRemove: (travelerId: string) => void;
}

export const TravelerList: React.FC<TravelerListProps> = ({ travelers, onRemove }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-6">
      <h2 className="text-2xl font-semibold mb-4">Viajeros</h2>
      <ul>
        {travelers.map((traveler) => (
          <li key={traveler.id} className="flex justify-between items-center mb-2">
            <span>{traveler.name}</span>
            <button
              onClick={() => onRemove(traveler.id)}
              className="text-red-500"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};