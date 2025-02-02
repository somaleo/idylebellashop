# Database Configuration Instructions

## Local PostgreSQL Configuration

1. Create a `.env` file in the project root with your PostgreSQL connection details:

```env
VITE_PG_USER=postgres
VITE_PG_HOST=localhost
VITE_PG_DATABASE=crm_db
VITE_PG_PASSWORD=your_password
VITE_PG_PORT=5432
```

2. Update the database configuration in `src/lib/db.ts`:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  user: import.meta.env.VITE_PG_USER,
  host: import.meta.env.VITE_PG_HOST,
  database: import.meta.env.VITE_PG_DATABASE,
  password: import.meta.env.VITE_PG_PASSWORD,
  port: parseInt(import.meta.env.VITE_PG_PORT),
});

export const db = {
  query: <T = any>(text: string, params?: any[]) => 
    pool.query<T>(text, params),
};
```

## Supabase Configuration

1. Click the "Connect to Supabase" button in the top right of the StackBlitz editor.

2. After connecting, Supabase will automatically create a `.env` file with the following variables:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

3. The Supabase client is already configured in `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
```

## Connection String Formats

### Local PostgreSQL
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Example:
```
postgresql://postgres:your_password@localhost:5432/crm_db
```

### Supabase
The connection string is automatically handled by the Supabase client using the project URL and anon key.

## Security Notes

1. Never commit `.env` files to version control
2. Use strong passwords for database access
3. Restrict database user permissions appropriately
4. Keep connection strings and credentials secure
5. Use environment variables for all sensitive configuration

## Troubleshooting

1. Connection refused:
   - Check if PostgreSQL is running
   - Verify port number
   - Check firewall settings

2. Authentication failed:
   - Verify username and password
   - Check database user permissions

3. Database not found:
   - Ensure database exists
   - Check database name spelling

4. SSL/TLS issues:
   - For local development, you may need to set `sslmode=disable`
   - For production, always use SSL/TLS

## Migration

When switching between local PostgreSQL and Supabase:

1. Export data from source database
2. Run migrations on target database
3. Import data to target database
4. Update environment variables
5. Test application thoroughly