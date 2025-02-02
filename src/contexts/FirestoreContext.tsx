import React, { createContext, useContext } from 'react';
import { collection, query, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { db, COLLECTIONS } from '../lib/firebase';
import { Customer, Product, Task } from '../types';

interface FirestoreContextType {
  customersRef: () => QueryConstraint[];
  productsRef: () => QueryConstraint[];
  tasksRef: () => QueryConstraint[];
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const customersRef = () => {
    return [
      orderBy('createdAt', 'desc')
    ];
  };

  const productsRef = () => {
    return [
      orderBy('createdAt', 'desc')
    ];
  };

  const tasksRef = () => {
    return [
      orderBy('createdAt', 'desc')
    ];
  };

  return (
    <FirestoreContext.Provider value={{
      customersRef,
      productsRef,
      tasksRef
    }}>
      {children}
    </FirestoreContext.Provider>
  );
}

export function useFirestoreContext() {
  const context = useContext(FirestoreContext);
  if (context === undefined) {
    throw new Error('useFirestoreContext must be used within a FirestoreProvider');
  }
  return context;
}