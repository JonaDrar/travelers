// src/App.js
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { db } from './firebase';
import { addDoc, collection, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [expenses, setExpenses] = useState({ type: '', amount: 0 });
  const [travelers, setTravelers] = useState([]);
  const [travelerName, setTravelerName] = useState('');
  const [expenseList, setExpenseList] = useState([]);

  // Cargar viajeros y gastos desde Firebase al inicio
  useEffect(() => {
    const fetchTravelers = async () => {
      const travelerCollection = collection(db, 'travelers');
      const travelerSnapshot = await getDocs(travelerCollection);
      const travelersData = travelerSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTravelers(travelersData);
    };

    const fetchExpenses = async () => {
      const expenseCollection = collection(db, 'expenses');
      const expenseSnapshot = await getDocs(expenseCollection);
      const expensesData = expenseSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setExpenseList(expensesData);
    };

    fetchTravelers();
    fetchExpenses();
  }, []);

  // Añadir un nuevo viajero y guardarlo en Firebase
  const addTraveler = async () => {
    if (travelerName.trim() === '') return;

    const newTraveler = { name: travelerName };
    try {
      const docRef = await addDoc(collection(db, 'travelers'), newTraveler);
      setTravelers([...travelers, { id: docRef.id, ...newTraveler }]);
      setTravelerName('');
      toast.success(`Viajero ${travelerName} añadido`);
    } catch (error) {
      toast.error(`Error al añadir viajero: ${error.message}`);
    }
  };

  // Eliminar un viajero y sus gastos asociados
  const removeTraveler = async (travelerId) => {
    try {
      // Eliminar el viajero de la colección 'travelers'
      await deleteDoc(doc(db, 'travelers', travelerId));
      
      // Consultar y eliminar los gastos asociados al viajero en la colección 'expenses'
      const expenseQuery = query(collection(db, 'expenses'), where("travelerId", "==", travelerId));
      const expenseSnapshot = await getDocs(expenseQuery);
      const batchDeletes = expenseSnapshot.docs.map(expenseDoc => deleteDoc(doc(db, 'expenses', expenseDoc.id)));

      // Esperar a que se completen todas las eliminaciones de gastos
      await Promise.all(batchDeletes);

      // Actualizar el estado local
      setTravelers(travelers.filter((traveler) => traveler.id !== travelerId));
      setExpenseList(expenseList.filter((expense) => expense.travelerId !== travelerId));

      toast.info('Viajero y gastos asociados eliminados');
    } catch (error) {
      toast.error(`Error al eliminar viajero: ${error.message}`);
    }
  };

  // Actualizar los detalles del gasto
  const handleExpenseChange = (e) => {
    setExpenses({
      ...expenses,
      [e.target.name]: e.target.value,
    });
  };

  // Guardar el gasto en Firebase
  const saveToFirebase = async (travelerId) => {
    const traveler = travelers.find(t => t.id === travelerId);
    const expenseData = {
      ...expenses,
      travelerId,
      travelerName: traveler ? traveler.name : 'Desconocido',
      date: new Date().toLocaleDateString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'expenses'), expenseData);
      setExpenseList([...expenseList, { id: docRef.id, ...expenseData }]);
      toast.success('Gasto guardado en Firebase');
    } catch (error) {
      toast.error(`Error al guardar en Firebase: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Calculadora de Gastos de Viaje</h1>
      
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
          />
          <button
            onClick={addTraveler}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Añadir
          </button>
        </div>
        <ul>
          {travelers.map((traveler) => (
            <li key={traveler.id} className="flex justify-between mb-2">
              <span>{traveler.name}</span>
              <button
                onClick={() => removeTraveler(traveler.id)}
                className="text-red-500"
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
        />
        <label className="block mb-2">Monto:</label>
        <input
          type="number"
          name="amount"
          value={expenses.amount}
          onChange={(e) => setExpenses({ ...expenses, amount: parseFloat(e.target.value) })}
          className="w-full mb-4 p-2 border rounded"
        />
        <h3 className="text-lg font-semibold mb-2">Seleccione un viajero:</h3>
        <div>
          {travelers.map((traveler) => (
            <button
              key={traveler.id}
              onClick={() => saveToFirebase(traveler.id)}
              className="bg-green-500 text-white px-4 py-2 m-1 rounded"
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