import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { schema } from './schema.js'

// Simulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

const endpoint = process.env.DGRAPH_ENDPOINT_LINUX;
if (!endpoint) {
  console.error('DGRAPH_ENDPOINT_LINUX not defined in .env');
  process.exit(1);
}


async function updateSchema() {
  try {
    const res = await fetch(`${endpoint}/admin/schema`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/graphql' },
      body: schema
    });

    const result = await res.text();

    if (!res.ok) {
      console.error(`Failed to update schema: ${res.status}`);
      console.error(result);
    } else {
      console.log('Schema successfully updated!');
      console.log(result);
    }
  } catch (err) {
    console.error('Error while sending schema:', err.message);
  }
}

updateSchema();

