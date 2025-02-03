import { initializeApp } from 'firebase/app';
import { getFirestore, collection, orderBy, where, QueryConstraint } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBzdQE_-COOYXUx8hHn4j0Ew1nOR1uODz8",
  authDomain: "mycrmapp-38a5d.firebaseapp.com",
  projectId: "mycrmapp-38a5d",
  storageBucket: "mycrmapp-38a5d.firebasestorage.app",
  messagingSenderId: "211469404913",
  appId: "1:211469404913:web:4128392d6c164394f8b750"
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

export const createQueryConstraints = (): QueryConstraint[] => {
  return [
    where('userId', '==', DEFAULT_USER_ID),
    orderBy('createdAt', 'desc')
  ];
};