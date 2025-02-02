import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'crm_db',
  password: 'postgres',
  port: 5432,
});

export const db = {
  query: <T = any>(text: string, params?: any[]) => 
    pool.query<T>(text, params),
};