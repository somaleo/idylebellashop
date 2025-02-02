import { initializeApp } from 'firebase/app';
import { getFirestore, collection, where, orderBy, QueryConstraint, Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC0Jr9IlurH1-AfStLVaDFMv81IJTh2Btw",
  authDomain: "crmboltapp.firebaseapp.com",
  projectId: "crmboltapp",
  storageBucket: "crmboltapp.appspot.com",
  messagingSenderId: "596047524575",
  appId: "1:596047524575:web:6830f4b95a42c13523ef6a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Default user ID for demo purposes
export const DEFAULT_USER_ID = 'demo';

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
  const constraints: QueryConstraint[] = [
    where('userId', '==', DEFAULT_USER_ID)
  ];
  
  if (whereConditions) {
    whereConditions.forEach(condition => {
      constraints.push(where(condition.field, condition.operator as any, condition.value));
    });
  }
  
  return constraints;
};