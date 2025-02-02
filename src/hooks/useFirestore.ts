import { useState, useEffect } from 'react';
import {
  collection,
  query,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  DocumentData,
  QueryConstraint,
  Timestamp,
  where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

interface UseFirestoreOptions {
  collectionName: string;
  queries?: QueryConstraint[];
  limit?: number;
}

export function useFirestore<T extends DocumentData>({ 
  collectionName,
  queries = [],
  limit: queryLimit
}: UseFirestoreOptions) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const constraints: QueryConstraint[] = [
          where('userId', '==', user.id),
          ...queries
        ];

        const q = query(collection(db, collectionName), ...constraints);
        const querySnapshot = await getDocs(q);
        
        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];

        setData(documents);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [collectionName, queries, queryLimit, user]);

  const add = async (data: Omit<T, 'id'>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        userId: user.id,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (err) {
      console.error('Error adding document:', err);
      throw err;
    }
  };

  const update = async (id: string, data: Partial<T>) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: Timestamp.now()
      });
    } catch (err) {
      console.error('Error updating document:', err);
      throw err;
    }
  };

  const remove = async (id: string) => {
    if (!user) throw new Error('User must be authenticated');

    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (err) {
      console.error('Error deleting document:', err);
      throw err;
    }
  };

  return {
    data,
    loading,
    error,
    add,
    update,
    remove
  };
}