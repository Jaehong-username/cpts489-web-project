const { Load } = require('../models');
const DGRAPH_ENDPOINT = process.env.DGRAPH_ENDPOINT;

const fetch = (...args) =>
  import('node-fetch').then(({ default: fetch }) => fetch(...args));

const getBrokerFromGraph = async (brokerId) => {
    const res = await fetch(DGRAPH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query {
          getWorker(id: "${brokerId}") {
            id
            name
            email
            phone
            company {
              name
              rating
            }
          }
        }
      `
        }),
    });

    const { data } = await res.json();
    return data?.getWorker;
};

const getBrokerLoads = async (brokerId) => {
    return await Load.findAll({
        where: { broker_worker_id: brokerId },
        order: [['pickup_date', 'ASC']],
    });
};

// Unified interface
const getBrokerProfileWithLoads = async (brokerId) => {
    const [broker, loads] = await Promise.all([
        getBrokerFromGraph(brokerId),
        getBrokerLoads(brokerId)
    ]);

    return { broker, loads };
};

module.exports = {
    getBrokerProfileWithLoads,
};
