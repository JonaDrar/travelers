// src/App.tsx
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from './firebase';
import { addDoc, collection, deleteDoc, doc, query, where, onSnapshot, getDocs } from 'firebase/firestore';

// Definir tipos para datos de gastos y viajeros
interface Expense {
  id?: string;
  type: string;
  amount: number;
  travelerId: string;
  travelerName: string;
  date: string;
}

interface Traveler {
  id: string;
  name: string;
}

function App() {
  const [expenses, setExpenses] = useState<Omit<Expense, 'id' | 'travelerId' | 'travelerName' | 'date'>>({ type: '', amount: 0 });
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [travelerName, setTravelerName] = useState<string>('');
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [operationLoading, setOperationLoading] = useState<boolean>(false);

  // Cargar datos de viajeros y gastos en tiempo real desde Firebase al inicio
  useEffect(() => {
    const unsubscribeTravelers = onSnapshot(collection(db, 'travelers'), (snapshot) => {
      const travelersData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Traveler));
      setTravelers(travelersData);
    });

    const unsubscribeExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      const expensesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Expense));
      setExpenseList(expensesData);
      setLoading(false);
    });

    // Limpiar las suscripciones al desmontar el componente
    return () => {
      unsubscribeTravelers();
      unsubscribeExpenses();
    };
  }, []);

  // Añadir un nuevo viajero y guardarlo en Firebase
  const addTraveler = async () => {
    if (travelerName.trim() === '') {
      toast.error('El nombre del viajero no puede estar vacío');
      return;
    }

    setOperationLoading(true);
    const newTraveler = { name: travelerName };
    try {
      await addDoc(collection(db, 'travelers'), newTraveler);
      setTravelerName('');
      toast.success(`Viajero ${travelerName} añadido`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al añadir viajero: ${error.message}`);
      } else {
        toast.error('Error desconocido al añadir viajero');
      }
    } finally {
      setOperationLoading(false);
    }
  };

  // Eliminar un viajero y sus gastos asociados
  const removeTraveler = async (travelerId: string) => {
    setOperationLoading(true);
    try {
      await deleteDoc(doc(db, 'travelers', travelerId));

      const expenseQuery = query(collection(db, 'expenses'), where("travelerId", "==", travelerId));
      const expenseSnapshot = await getDocs(expenseQuery);
      const batchDeletes = expenseSnapshot.docs.map(expenseDoc => deleteDoc(doc(db, 'expenses', expenseDoc.id)));

      await Promise.all(batchDeletes);

      toast.info('Viajero y gastos asociados eliminados');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al eliminar viajero: ${error.message}`);
      } else {
        toast.error('Error desconocido al eliminar viajero');
      }
    } finally {
      setOperationLoading(false);
    }
  };

  // Actualizar los detalles del gasto
  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setExpenses((prevExpenses) => ({
      ...prevExpenses,
      [name]: name === "amount" ? parseFloat(value) || 0 : value,
    }));
  };

  // Guardar el gasto en Firebase
  const saveToFirebase = async (travelerId: string) => {
    if (expenses.type.trim() === '' || expenses.amount <= 0) {
      toast.error('El tipo de gasto no puede estar vacío y el monto debe ser mayor a 0');
      return;
    }

    setOperationLoading(true);
    const traveler = travelers.find(t => t.id === travelerId);
    const expenseData: Expense = {
      ...expenses,
      travelerId,
      travelerName: traveler ? traveler.name : 'Desconocido',
      date: new Date().toLocaleDateString(),
    };

    try {
      await addDoc(collection(db, 'expenses'), expenseData);
      toast.success('Gasto guardado en Firebase');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`Error al guardar en Firebase: ${error.message}`);
      } else {
        toast.error('Error desconocido al guardar en Firebase');
      }
    } finally {
      setOperationLoading(false);
    }
  };

  // Calcular el gasto total de un viajero
  const getTravelerTotal = (travelerId: string): number => {
    return expenseList
      .filter((expense) => expense.travelerId === travelerId)
      .reduce((total, expense) => total + expense.amount, 0);
  };

  // Calcular el gasto total general
  const getTotalExpenses = (): number => {
    return expenseList.reduce((total, expense) => total + expense.amount, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-2xl font-semibold">Cargando datos...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Calculadora de Gastos de Viaje</h1>
      
      {/* Total de gastos */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl mb-6">
        <h2 className="text-2xl font-semibold mb-4">Gasto Total</h2>
        <p className="text-lg">Total Gastado: ${getTotalExpenses()}</p>
      </div>

      {/* Sección de viajeros */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Viajeros</h2>
        <div className="flex mb-4">
          <input
            type="text"
            value={travelerName}
            onChange={(e) => setTravelerName(e.target.value)}
            placeholder="Nombre del viajero"
            className="w-full p-2 border rounded mr-2"
            disabled={operationLoading}
          />
          <button
            onClick={addTraveler}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={operationLoading}
          >
            Añadir
          </button>
        </div>
        <ul>
          {travelers.map((traveler) => (
            <li key={traveler.id} className="flex justify-between items-center mb-2">
              <div>
                <span>{traveler.name}</span>
                <span className="ml-4 text-gray-600">Total Gastado: ${getTravelerTotal(traveler.id)}</span>
              </div>
              <button
                onClick={() => removeTraveler(traveler.id)}
                className="text-red-500"
                disabled={operationLoading}
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Sección para agregar gastos */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mb-6">
        <h2 className="text-2xl font-semibold mb-4">Agregar Gasto</h2>
        <label className="block mb-2">Tipo de gasto:</label>
        <input
          type="text"
          name="type"
          value={expenses.type}
          onChange={handleExpenseChange}
          className="w-full mb-4 p-2 border rounded"
          placeholder="Alojamiento, comida, transporte, etc."
          disabled={operationLoading}
        />
        <label className="block mb-2">Monto:</label>
        <input
          type="number"
          name="amount"
          value={expenses.amount}
          onChange={handleExpenseChange}
          className="w-full mb-4 p-2 border rounded"
          disabled={operationLoading}
        />
        <h3 className="text-lg font-semibold mb-2">Seleccione un viajero:</h3>
        <div>
          {travelers.map((traveler) => (
            <button
              key={traveler.id}
              onClick={() => saveToFirebase(traveler.id)}
              className="bg-green-500 text-white px-4 py-2 m-1 rounded"
              disabled={operationLoading}
            >
              {traveler.name}
            </button>
          ))}
        </div>
      </div>

      {/* Dashboard de gastos */}
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Dashboard de Gastos</h2>
        <ul>
          {expenseList.map((expense) => (
            <li key={expense.id} className="border-b py-2">
              <div>
                <span className="font-semibold">Viajero:</span> {expense.travelerName}
              </div>
              <div>
                <span className="font-semibold">Fecha:</span> {expense.date}
              </div>
              <div>
                <span className="font-semibold">Tipo de Gasto:</span> {expense.type}
              </div>
              <div>
                <span className="font-semibold">Monto:</span> ${expense.amount}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;