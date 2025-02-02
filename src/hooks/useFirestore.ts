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
import { db, DEFAULT_USER_ID } from '../lib/firebase';

interface UseFirestoreOptions {
  collectionName: string;
  queries?: QueryConstraint[];
  limitTo?: number;
}

export function useFirestore<T extends DocumentData>({ 
  collectionName,
  queries = [],
  limitTo
}: UseFirestoreOptions) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const q = query(
          collection(db, collectionName),
          where('userId', '==', DEFAULT_USER_ID)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!mounted) return;

        const documents = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as (T & { id: string })[];

        setData(documents);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error('An error occurred'));
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      mounted = false;
    };
  }, [collectionName]);

  const add = async (data: Omit<T, 'id'>) => {
    try {
      const docData = {
        ...data,
        userId: DEFAULT_USER_ID,
        createdAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, collectionName), docData);
      const newDoc = { id: docRef.id, ...docData } as T & { id: string };
      
      setData(prev => [newDoc, ...prev]);
      return newDoc;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error adding document');
      console.error('Error adding document:', error);
      throw error;
    }
  };

  const update = async (id: string, data: Partial<Omit<T, 'id'>>) => {
    try {
      const docRef = doc(db, collectionName, id);
      const updateData = {
        ...data,
        updatedAt: Timestamp.now()
      };
      
      await updateDoc(docRef, updateData);
      
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...updateData } : item
      ));
      
      return { id, ...updateData };
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error updating document');
      console.error('Error updating document:', error);
      throw error;
    }
  };

  const remove = async (id: string) => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      setData(prev => prev.filter(item => item.id !== id));
      return id;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error deleting document');
      console.error('Error deleting document:', error);
      throw error;
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