import { useEffect, useState } from 'react';
import { db } from '../lib/db';
import type { QueryResult } from 'pg';

export function useQuery<T>(
  query: string,
  params?: any[],
  deps: any[] = []
) {
  const [data, setData] = useState<T[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result: QueryResult<T> = await db.query(query, params);
        setData(result.rows);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, deps);

  return { data, error, loading };
}