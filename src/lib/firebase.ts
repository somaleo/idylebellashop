import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, QueryConstraint } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyC0Jr9IlurH1-AfStLVaDFMv81IJTh2Btw",
  authDomain: "crmboltapp.firebaseapp.com",
  projectId: "crmboltapp",
  storageBucket: "crmboltapp.firebasestorage.app",
  messagingSenderId: "596047524575",
  appId: "1:596047524575:web:6830f4b95a42c13523ef6a",
  measurementId: "G-FLW4MFYJGG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

// Collection references
export const COLLECTIONS = {
  CUSTOMERS: 'customers',
  PRODUCTS: 'products',
  TASKS: 'tasks'
} as const;

// Helper functions for common queries
export const getCollectionRef = (collectionName: string) => collection(db, collectionName);

export const createQueryConstraints = (
  orderByField: string = 'createdAt',
  orderDirection: 'asc' | 'desc' = 'desc',
  whereConditions?: { field: string; operator: string; value: any }[]
): QueryConstraint[] => {
  const constraints: QueryConstraint[] = [orderBy(orderByField, orderDirection)];
  
  if (whereConditions) {
    whereConditions.forEach(condition => {
      constraints.push(where(condition.field, condition.operator as any, condition.value));
    });
  }
  
  return constraints;
};