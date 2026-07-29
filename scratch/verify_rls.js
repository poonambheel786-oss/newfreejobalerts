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

    // Query to check if RLS is enabled on user tables in public schema
    const rlsRes = await client.query(`
      SELECT 
        c.relname AS table_name,
        c.relrowsecurity AS rls_enabled
      FROM pg_class c
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'public' 
        AND c.relkind = 'r'
        AND c.relname NOT LIKE '\\_%';
    `);

    console.log('\n--- Row-Level Security Status ---');
    for (const row of rlsRes.rows) {
      console.log(`Table: "${row.table_name}" | RLS Enabled: ${row.rls_enabled}`);
    }

    // Query to get existing policies on these tables
    const policyRes = await client.query(`
      SELECT 
        schemaname,
        tablename,
        policyname,
        permissive,
        roles,
        cmd,
        qual
      FROM pg_policies
      WHERE schemaname = 'public'
        AND tablename NOT LIKE '\\_%';
    `);

    console.log('\n--- Active Policies ---');
    if (policyRes.rows.length === 0) {
      console.log('No policies found.');
    } else {
      for (const policy of policyRes.rows) {
        console.log(`Table: "${policy.tablename}" | Policy: "${policy.policyname}" | CMD: ${policy.cmd} | Roles: ${JSON.stringify(policy.roles)} | Qual: ${policy.qual}`);
      }
    }
  } catch (err) {
    console.error('Error executing verification queries:', err);
  } finally {
    await client.end();
  }
}

run();
