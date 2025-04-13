import { exec } from 'child_process';
import { promisify } from 'util';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const run = promisify(exec);
const __dirname = dirname(fileURLToPath(import.meta.url));
const base = resolve(__dirname);

const runScript = async (scriptPath) => {
    try {
        console.log(`Running ${scriptPath}...`);
        await run(`node "${scriptPath}"`);
        console.log(`✅ Finished ${scriptPath}`);
    } catch (err) {
        console.error(`❌ Error in ${scriptPath}:`, err.stderr || err);
        process.exit(1);
    }
};

const main = async () => {
    await runScript(`${base}/buildSchema.mjs`);
    await runScript(`${base}/updateDgraph.mjs`);
    await runScript(`${base}/graphDBSeed.mjs`);
    console.log('🚀 Dgraph setup complete.');
};

await main();
