const { Client } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Error: DATABASE_URL environment variable is not defined in .env');
  process.exit(1);
}

async function run() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Successfully connected to the database.');

    // Fetch all user tables in public schema (excluding _prisma_migrations or other system tables starting with underscore)
    const res = await client.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public' 
        AND tablename NOT LIKE '\\_%';
    `);

    const tables = res.rows.map(row => row.tablename);
    console.log('Found tables to secure:', tables);

    if (tables.length === 0) {
      console.log('No public tables found.');
      return;
    }

    for (const table of tables) {
      console.log(`\nSecuring table: "${table}"`);
      
      // 1. Enable Row Level Security (RLS)
      console.log(`- Enabling Row Level Security...`);
      await client.query(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      
      // 2. Drop existing SELECT policy if it exists to avoid errors on rerun
      console.log(`- Recreating "Allow public read access" policy...`);
      await client.query(`DROP POLICY IF EXISTS "Allow public read access" ON "${table}";`);
      
      // 3. Create a policy to allow public select (read-only) for anon/authenticated roles
      await client.query(`
        CREATE POLICY "Allow public read access" 
        ON "${table}" 
        FOR SELECT 
        TO anon, authenticated 
        USING (true);
      `);
      
      console.log(`- Table "${table}" secured successfully.`);
    }

    console.log('\nAll tables have been successfully secured with RLS and public read-only access!');
  } catch (err) {
    console.error('Error executing SQL queries:', err);
  } finally {
    await client.end();
  }
}

run();
