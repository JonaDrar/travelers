import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { LoadingSpinner } from './components/LoadingSpinner';
import { TravelerList } from './components/TravelerList';
import { ExpenseDashboard } from './components/ExpenseDashboard';
import { useTravelersAndExpenses } from './hooks/useTravelersAndExpenses';
import { AddExpenseForm } from './components/AddExpenseFrom';

const App: React.FC = () => {
  const { travelers, expenseList, loading, addTraveler, removeTraveler } = useTravelersAndExpenses();

  // Estado para el total de gastos y para el total aleatorio mientras carga
  const [displayTotal, setDisplayTotal] = useState(0);

  // Calcular el total general de gastos
  const totalExpenses = expenseList.reduce((total, expense) => total + expense.amount, 0);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (loading) {
      // Generar números aleatorios mientras carga
      interval = setInterval(() => {
        const randomTotal = Math.floor(Math.random() * 99999999);
        setDisplayTotal(randomTotal);
      }, 100); 
    } else {
      // Mostrar el total real cuando la carga ha terminado
      setDisplayTotal(totalExpenses);
    }

    // Limpiar el intervalo cuando el efecto o la carga cambian
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, totalExpenses]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Calculadora de Gastos de Viaje</h1>

      {/* Mostrar el total de gastos generales (número aleatorio o real) */}
      <div className="bg-blue-100 p-4 rounded mb-4 w-full max-w-md text-center">
        <h2 className="text-xl font-semibold">Total de Gastos: ${displayTotal}</h2>
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