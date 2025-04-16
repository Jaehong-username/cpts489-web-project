import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, '../../../../.env') });

// Grab endpoint from env
const DGRAPH_ENDPOINT = `${process.env.DGRAPH_ENDPOINT_LINUX}/graphql`;

// Path to your GraphQL input JSON file
const seedFilePath = path.join(__dirname, '../../graphqlSeed.json');

async function sendGraphQLSeed() {
  try {
    const body = await fs.readFile(seedFilePath, 'utf-8');

    const response = await fetch(DGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
    });

    const result = await response.json();
    console.log('Seeding complete:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Error while sending seed data:', error);
  }
}

sendGraphQLSeed();