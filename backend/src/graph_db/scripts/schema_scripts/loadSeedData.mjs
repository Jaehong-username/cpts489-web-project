import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../../../.env') });
const DGRAPH_ENDPOINT = process.env.DGRAPH_ENDPOINT_LINUX;
const seedFilePath = path.join(__dirname, '../../seed-data.json');

async function sendSeed() {
    try {
        const raw = await fs.readFile(seedFilePath, 'utf-8');
        const seedData = JSON.parse(raw);

        const res = await fetch(`${DGRAPH_ENDPOINT}/mutate?commitNow=true`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(seedData)
        });

        const result = await res.text();
        console.log('📬 Dgraph response:\n', result);

        if (!res.ok) {
            console.error(`❌ Failed to upload seed data: ${res.status}`);
        } else {
            console.log('✅ Successfully uploaded full seed data!');
        }
    } catch (err) {
        console.error('❌ Error sending seed:', err.message);
    }
}

sendSeed();
