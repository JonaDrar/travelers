// src/components/LoadingSpinner.tsx
import './LoadingSpinner.css';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="loader"></div>
    </div>
  );
};
