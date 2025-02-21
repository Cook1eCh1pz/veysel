import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';

// Make sure to add DATABASE_URL in your .env file
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool); 