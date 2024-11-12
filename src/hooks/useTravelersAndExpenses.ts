// src/hooks/useTravelersAndExpenses.ts
import { useState, useEffect } from 'react';
import {
  onSnapshot,
  collection,
  doc,
  deleteDoc,
  addDoc,
} from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import { Traveler, Expense } from '../types';
import { toast } from 'react-toastify';

export const useTravelersAndExpenses = () => {
  const [travelers, setTravelers] = useState<Traveler[]>([]);
  const [expenseList, setExpenseList] = useState<Expense[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribeTravelers = onSnapshot(
      collection(db, 'travelers'),
      (snapshot) => {
        const travelersData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Traveler)
        );
        setTravelers(travelersData);
      }
    );

    const unsubscribeExpenses = onSnapshot(
      collection(db, 'expenses'),
      (snapshot) => {
        const expensesData = snapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Expense)
        );
        setExpenseList(expensesData);
        setLoading(false);
      }
    );

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
        toast.error('Error desconocido al añadir viajero');
      }
    }
  };

  const removeTraveler = async (travelerId: string) => {
    try {
      await deleteDoc(doc(db, 'travelers', travelerId));
      toast.info('Viajero y gastos asociados eliminados');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Error desconocido al eliminar viajero');
      }
    }
  };

  return { travelers, expenseList, loading, addTraveler, removeTraveler };
};
