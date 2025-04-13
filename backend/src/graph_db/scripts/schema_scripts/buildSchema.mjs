import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaDir = path.resolve(__dirname, '../../schema');
const outputPath = path.resolve(__dirname, './output/build.graphql');

async function crawlForSchemaFiles(dir, exts = ['.js', '.mjs']) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const subFiles = await crawlForSchemaFiles(fullPath, exts);
      files.push(...subFiles);
    } else if (entry.isFile() && exts.includes(path.extname(entry.name))) {
      files.push(fullPath);
    }
  }
  return files;
}

async function readSchemaFiles(dir) {
  const filePaths = await crawlForSchemaFiles(dir);
  const typeDefs = {};
  const typeNamePattern = /type\s+(\w+)/;

  for (const filePath of filePaths) {
    const moduleUrl = pathToFileURL(filePath);
    try {
      const content = await import(moduleUrl.href);
      const raw = (content?.default || '').trim();
      const match = typeNamePattern.exec(raw);
      if (match) {
        const typeName = match[1];
        typeDefs[typeName] = raw;
      } else {
        console.warn(`⚠️ No type name found in ${filePath}`);
      }
    } catch (err) {
      console.error(`❌ Failed to import ${filePath}: ${err.message}`);
    }
  }
  return typeDefs;
}

function extractDependencies(typeDefs) {
  const dependencyGraph = {};
  const scalars = new Set(['ID', 'String', 'Int', 'Float', 'Boolean', 'DateTime']);
  const typeRefPattern = /\b([A-Z][a-zA-Z0-9_]*)\b/g;

  for (const [typeName, definition] of Object.entries(typeDefs)) {
    const refs = new Set();
    const matches = definition.match(typeRefPattern) || [];
    for (const ref of matches) {
      if (ref !== typeName && !scalars.has(ref)) refs.add(ref);
    }
    dependencyGraph[typeName] = refs;
  }
  return dependencyGraph;
}

function getTopologicalOrder(typeDefs, dependencyGraph) {
  const indexCounter = [0];
  const stack = [];
  const indices = {};
  const lowlinks = {};
  const onStack = new Set();
  const sccs = [];

  function strongconnect(node) {
    indices[node] = indexCounter[0];
    lowlinks[node] = indexCounter[0];
    indexCounter[0]++;
    stack.push(node);
    onStack.add(node);

    for (const neighbor of dependencyGraph[node] || []) {
      if (!(neighbor in indices)) {
        strongconnect(neighbor);
        lowlinks[node] = Math.min(lowlinks[node], lowlinks[neighbor]);
      } else if (onStack.has(neighbor)) {
        lowlinks[node] = Math.min(lowlinks[node], indices[neighbor]);
      }
    }

    if (lowlinks[node] === indices[node]) {
      const scc = [];
      let w;
      do {
        w = stack.pop();
        onStack.delete(w);
        scc.push(w);
      } while (w !== node);
      sccs.push(scc);
    }
  }

  for (const node of Object.keys(typeDefs)) {
    if (!(node in indices)) {
      strongconnect(node);
    }
  }

  const ordered = [];
  for (const group of sccs) {
    for (const typeName of group.sort()) {
      ordered.push(typeName);
    }
  }

  return ordered;
}

async function buildCombinedSchema() {
  try {
    const typeDefs = await readSchemaFiles(schemaDir);
    const dependencyGraph = extractDependencies(typeDefs);
    const orderedTypes = getTopologicalOrder(typeDefs, dependencyGraph);
    const finalSchema = orderedTypes.map(t => typeDefs[t]).join('\n\n');
    await fs.mkdir(path.dirname(outputPath), { recursive: true });
    await fs.writeFile(outputPath, finalSchema);
    console.log(`✅ Schema written to ${outputPath}`);
  } catch (err) {
    console.error('❌ Failed to build schema:', err.message);
    process.exit(1);
  }
}

buildCombinedSchema();
