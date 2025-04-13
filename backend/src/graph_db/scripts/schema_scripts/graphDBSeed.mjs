import 'dotenv/config';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';
import { config } from 'dotenv';

const SEED_DATA_DIR = path.resolve('./../../seed_data').concat('/');
config({ path: './../../../../.env' });

const ENDPOINT = process.env.DGRAPH_ENDPOINT_LINUX.concat('/graphql');
if (!ENDPOINT) throw new Error('Missing DGRAPH_ENDPOINT in .env');

async function graphqlRequest(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables })
  });

  const text = await res.text();

  let json;
  try {
    json = JSON.parse(text);
  } catch {
    console.error('❌ Dgraph response is not JSON:\n', text);
    throw new Error('Unexpected non-JSON response from Dgraph.');
  }

  if (json.errors) {
    console.error('🛑 GraphQL errors:\n', JSON.stringify(json.errors, null, 2));
    throw new Error('GraphQL request failed.');
  }

  return json.data;
}

function getPath(file) {
  return path.resolve('./../seed_data/', file);
}

async function loadJSON(file) {
  const data = await fs.readFile(getPath(file), 'utf8');
  return JSON.parse(data);
}

// Upload brokering data
async function uploadBrokering(brokers) {
  const input = {
    name: 'Seeded Brokering',
    companies: brokers
  };
  const mutation = `
    mutation($input: [AddBrokeringInput!]!) {
      addBrokering(input: $input) {
        brokering {
          id
        }
      }
    }
  `;
  await graphqlRequest(mutation, { input });
}

// Upload trucking data
async function uploadTrucking(truckingCategories) {
  const input = {
    name: 'Seeded Trucking',
    categories: truckingCategories.map(c => ({
      name: c.category,
      companies: c.companies
    }))
  };
  const mutation = `
    mutation($input: [AddTruckingInput!]!) {
      addTrucking(input: $input) {
        trucking {
          id
        }
      }
    }
  `;
  await graphqlRequest(mutation, { input });
}

// Build name → UID index
async function getEntityUIDs() {
  const query = `
    {
      truckingWorkers: queryTruckingWorker { id name }
      brokerWorkers: queryBrokerWorker { id name }
      truckingCompanies: queryTruckingCompany { id name }
      brokerCompanies: queryBrokerCompany { id name }
    }
  `;
  const data = await graphqlRequest(query);
  const index = {};

  for (const [key, list] of Object.entries(data)) {
    for (const item of list) {
      index[item.name] = item.id;
    }
  }

  return index;
}

// Translate reviews
function formatReview(r, nameToId) {
  const getField = (type, role) => {
    if (type === 'TruckingWorker') return `${role}TruckingWorker`;
    if (type === 'BrokerWorker') return `${role}BrokerWorker`;
    if (type === 'TruckingCompany') return `${role}TruckingCompany`;
    if (type === 'BrokerCompany') return `${role}BrokerCompany`;
    throw new Error(`Unknown type: ${type}`);
  };

  return {
    rating: r.rating,
    comment: r.comment,
    communication: r.communication,
    reliability: r.reliability,
    timestamp: new Date().toISOString(),
    [getField(r.reviewerType, 'reviewer')]: { id: nameToId[r.reviewerName] },
    [getField(r.revieweeType, 'reviewee')]: { id: nameToId[r.revieweeName] }
  };
}

// Upload review documents

async function uploadReviews(reviewList, nameToId) {
  const formatted = [];

  for (const r of reviewList) {
    const getField = (type, role) => {
      if (type === 'TruckingWorker') return `${role}TruckingWorker`;
      if (type === 'BrokerWorker') return `${role}BrokerWorker`;
      if (type === 'TruckingCompany') return `${role}TruckingCompany`;
      if (type === 'BrokerCompany') return `${role}BrokerCompany`;
      throw new Error(`Unknown type: ${type}`);
    };

    const reviewerId = nameToId[r.reviewerName];
    const revieweeId = nameToId[r.revieweeName];

    if (!reviewerId || !revieweeId) {
      console.warn(`[WARNING] Skipping review from "${r.reviewerName}" to "${r.revieweeName}" — name not found.`);
      continue;
    }

    formatted.push({
      rating: r.rating,
      comment: r.comment,
      communication: r.communication,
      reliability: r.reliability,
      timestamp: new Date().toISOString(),
      [getField(r.reviewerType, 'reviewer')]: { id: reviewerId },
      [getField(r.revieweeType, 'reviewee')]: { id: revieweeId }
    });
  }

  if (formatted.length === 0) {
    console.warn("No valid reviews to upload.");
    return;
  }

  const mutation = `
    mutation($input: [AddReviewInput!]!) {
      addReview(input: $input) {
        review { id }
      }
    }
  `;
  await graphqlRequest(mutation, { input: formatted });
}


// 👇 Main Seeder Flow
(async () => {
  try {
    console.log('Loading seed data...');
    const [brokering, trucking, reviews] = await Promise.all([
      loadJSON(SEED_DATA_DIR.concat('brokering.json')),
      loadJSON(SEED_DATA_DIR.concat('trucking.json')),
      loadJSON(SEED_DATA_DIR.concat('reviews.json')),
    ]);

    console.log('Uploading brokering...');
    await uploadBrokering(brokering);

    console.log('Uploading trucking...');
    await uploadTrucking(trucking);

    console.log('Resolving UIDs...');
    const nameToId = await getEntityUIDs();

    console.log('Uploading reviews...');
    await uploadReviews(reviews, nameToId);

    console.log('All data seeded successfully.');
  } catch (err) {
    console.error('Failed to load seed data:', err.message);
  }
})();
