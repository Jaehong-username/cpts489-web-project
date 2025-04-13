import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
config({ path: path.resolve(__dirname, './../../.env') });

const baseEndpoint = process.env.DGRAPH_ENDPOINT;
if (!baseEndpoint) {
    console.error('❌ DGRAPH_ENDPOINT not defined in .env');
    process.exit(1);
}

const DGRAPH_ENDPOINT = baseEndpoint + '/admin/schema';
const schemaPath = path.resolve(__dirname, './output/build.graphql');

const execAsync = promisify(exec);

async function runCurl() {
    const curlCmd = `curl -X POST ${DGRAPH_ENDPOINT} -H "Content-Type: application/graphql" --data-binary @${schemaPath}`;
    console.log('🚀 Running curl:\n', curlCmd);

    try {
        const { stdout, stderr } = await execAsync(curlCmd);
        console.log('✅ Curl output:\n', stdout);
        if (stderr) console.warn('⚠️ Curl stderr:\n', stderr);
    } catch (err) {
        console.error('❌ Curl command failed:', err.message);
        process.exit(1);
    }
}

runCurl();
