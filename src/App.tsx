// src/App.tsx
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TravelerList } from './components/TravelerList';
import { ExpenseDashboard } from './components/ExpenseDashboard';
import { useTravelersAndExpenses } from './hooks/useTravelersAndExpenses';
import { AddExpenseForm } from './components/AddExpenseFrom';

const App: React.FC = () => {
  const { travelers, expenseList, loading, removeTraveler } =
    useTravelersAndExpenses();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">
        Calculadora de Gastos de Viaje
      </h1>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TravelerList travelers={travelers} onRemove={removeTraveler} />
          <AddExpenseForm travelers={travelers} />
          <ExpenseDashboard expenseList={expenseList} />
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;
