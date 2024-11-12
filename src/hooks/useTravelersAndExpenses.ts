import { useState, useEffect } from 'react';
import {
  onSnapshot,
  collection,
  doc,
  deleteDoc,
  addDoc,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Traveler, Expense } from '../types';
import { toast } from 'react-toastify';

export const useTravelersAndExpenses = () => {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Observar cambios en la colección de viajeros
    const unsubscribeTravelers = onSnapshot(collection(db, 'travelers'), (snapshot) => {
      const travelersData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Traveler));
      setTravelers(travelersData);
    });

    // Observar cambios en la colección de gastos
    const unsubscribeExpenses = onSnapshot(collection(db, 'expenses'), (snapshot) => {
      const expensesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Expense));
      setExpenseList(expensesData);
      setLoading(false);
    });

    return () => {
      unsubscribeTravelers();
      unsubscribeExpenses();
    };
  }, []);

  const addTraveler = async (name: string) => {
    if (!name.trim()) {
      toast.error('El nombre del viajero no puede estar vacío');
      return;
    }
    try {
      await addDoc(collection(db, 'travelers'), { name });
      toast.success(`Viajero ${name} añadido`);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al añadir viajero');
      }
    }
  };

  const removeTraveler = async (travelerId: string) => {
    try {
      // Crear el batch de escritura para eliminar en lote
      const batch = writeBatch(db);

      // Consultar todos los gastos asociados al viajero
      const expensesQuery = query(collection(db, 'expenses'), where('travelerId', '==', travelerId));
      const expensesSnapshot = await getDocs(expensesQuery);

      // Agregar cada gasto al batch para eliminarlo
      expensesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      // Confirmar las eliminaciones en lote
      await batch.commit();

      // Eliminar el viajero después de eliminar sus gastos
      await deleteDoc(doc(db, 'travelers', travelerId));
      toast.info('Viajero y gastos asociados eliminados');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error al eliminar viajero');
      }
    }
  };

  return { travelers, expenseList, loading, addTraveler, removeTraveler };
};