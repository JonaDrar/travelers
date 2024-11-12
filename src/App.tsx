import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TravelerList } from './components/TravelerList';
import { ExpenseDashboard } from './components/ExpenseDashboard';
import { useTravelersAndExpenses } from './hooks/useTravelersAndExpenses';
import { AddExpenseForm } from './components/AddExpenseFrom';

const App: React.FC = () => {
  const { travelers, expenseList, loading, addTraveler, removeTraveler } = useTravelersAndExpenses();

  // Calcular el total general de gastos
  const totalExpenses = expenseList.reduce((total, expense) => total + expense.amount, 0);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Calculadora de Gastos de Viaje</h1>

      {/* Mostrar el total de gastos generales */}
      <div className="bg-blue-100 p-4 rounded mb-4 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold">Total de Gastos: ${totalExpenses}</h2>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <TravelerList
            travelers={travelers}
            expenseList={expenseList}
            onAdd={addTraveler}
            onRemove={removeTraveler}
          />
          <AddExpenseForm travelers={travelers} />
          <ExpenseDashboard expenseList={expenseList} />
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;