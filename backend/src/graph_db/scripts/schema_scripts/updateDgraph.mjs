import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import { access, rename } from 'fs/promises';
import { constants } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
const rootEnv = path.resolve(__dirname, '../../../../.env');
config({ path: rootEnv });

const baseEndpoint = process.env.DGRAPH_ENDPOINT;
if (!baseEndpoint) {
    console.error('❌ DGRAPH_ENDPOINT not defined in .env');
    process.exit(1);
}

const DGRAPH_ENDPOINT = baseEndpoint + '/admin/schema';
const schemaPath = path.resolve(__dirname, './output/build.graphql');


const execAsync = promisify(exec);

async function fileExists(path) {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function runCurl() {
    if (!await fileExists(schemaPath)) {
        console.log('build.graphql does not exist. Run buildSchema.mjs prior to the updateDgraph.mjs script.');
        process.exit(1);
    }

    const curlCmd = `curl -X POST ${DGRAPH_ENDPOINT} -H "Content-Type: application/graphql" --data-binary @${schemaPath}`;
    console.log('🚀 Running curl:\n', curlCmd);

    try {
        const { stdout, stderr } = await execAsync(curlCmd);
        console.log('✅ Curl output:\n', stdout);

        try {
            await rename('./output/build.graphql', './output/current.graphql');
            console.log('Schema updated: build.graphql -> current.graphql');
        } catch (err) {
            console.error('Failed to rename schema file:', err);
        }

        if (stderr) console.warn('⚠️ Curl stderr:\n', stderr);
    } catch (err) {
        console.error('❌ Curl command failed:', err.message);
        process.exit(1);
    }
}

runCurl();
