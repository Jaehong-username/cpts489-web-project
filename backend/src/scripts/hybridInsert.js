
const fs = require('fs/promises');
const path = require('path');
const dotenv = require('dotenv');
const { User, Broker, Trucker, sequelize } = require('../models');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const DGRAPH_ENDPOINT = process.env.DGRAPH_ENDPOINT_LINUX + '/graphql';

// Load seed JSON from file
async function loadSeedData(seedPath) {
  const data = await fs.readFile(seedPath, 'utf-8');
  return JSON.parse(data);
}

// Insert SQL users, brokers, truckers
async function insertSQL({ users, brokers, truckers }) {
  const userMap = {}; // Maps email -> inserted user.id for broker/trucker linkage

  for (const user of users) {
    const [u] = await User.findOrCreate({
      where: { email: user.email },
      defaults: user
    });
    userMap[user.email] = u.id;
  }

  for (const broker of brokers) {
    if (!broker.userId && userMap[broker.email]) broker.userId = userMap[broker.email];
    await Broker.findOrCreate({
      where: { userId: broker.userId },
      defaults: broker
    });
  }

  for (const trucker of truckers) {
    if (!trucker.userId && userMap[trucker.email]) trucker.userId = userMap[trucker.email];
    await Trucker.findOrCreate({
      where: { userId: trucker.userId },
      defaults: trucker
    });
  }

  return userMap;
}

// Send GraphQL mutation to Dgraph
async function sendGraphQLMutation(gqlPayload, fetch) {
  const res = await fetch(DGRAPH_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gqlPayload)
  });

  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json;
}

async function main() {
  const fetch = (await import('node-fetch')).default;

  try {
    const sqlSeed = await loadSeedData(path.resolve(__dirname, '../../graph_db/seed_data/sqlSeedFromGraph.json'));
    const gqlSeed = await loadSeedData(path.resolve(__dirname, '../../graph_db/seed_data/graphqlSeed.json'));

    console.log('🚀 Inserting SQL data...');
    await insertSQL(sqlSeed);

    console.log('🚀 Sending GraphQL mutation...');
    const result = await sendGraphQLMutation(gqlSeed, fetch);

    console.log('✅ Hybrid seed complete:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('❌ Hybrid insert failed:', error.message);
  } finally {
    await sequelize.close();
  }
}

main();
