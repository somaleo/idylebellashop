import React, { createContext, useContext } from 'react';
import { QueryConstraint } from 'firebase/firestore';
import { createQueryConstraints } from '../lib/firebase';

interface FirestoreContextType {
  customersRef: () => QueryConstraint[];
  productsRef: () => QueryConstraint[];
  tasksRef: () => QueryConstraint[];
}

const FirestoreContext = createContext<FirestoreContextType | undefined>(undefined);

export function FirestoreProvider({ children }: { children: React.ReactNode }) {
  const customersRef = () => {
    return createQueryConstraints('createdAt', 'desc');
  };

  const productsRef = () => {
    return createQueryConstraints('createdAt', 'desc');
  };

  const tasksRef = () => {
    return createQueryConstraints('createdAt', 'desc');
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