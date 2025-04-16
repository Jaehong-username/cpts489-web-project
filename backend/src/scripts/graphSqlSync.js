const axios = require('axios');
const { User, Broker, sequelize } = require('../models');
const dotenv = require('dotenv');
const {resolve} = require("path");

dotenv.config({ path: resolve(__dirname, '../../.env') });

const dgraph_endpoint = `${process.env.DGRAPH_ENDPOINT_LINUX}/graphql`
console.log(dgraph_endpoint)

// GraphQL query to retrieve all companies in the "Brokering" industry and their workers
const BROKER_QUERY = `
query {
  queryIndustry(filter: { name: { eq: "Brokering" } }) {
    companies {
      id
      name
      email
      phone
      workers {
        id
        name
        email
        phone
        isCustomerFacing
      }
    }
  }
}
`;

// Helper function to fetch broker data from Dgraph GraphQL
async function fetchBrokerData(graphQLEndpoint) {
  // Prepare the request body for GraphQL
  const requestData = { query: BROKER_QUERY, variables: {} };
  try {
    const response = await axios.post(graphQLEndpoint, requestData, {
      headers: { 'Content-Type': 'application/json' }
    });
    // Axios automatically handles JSON stringification&#8203;:contentReference[oaicite:1]{index=1}
    const responseData = response.data;
    if (responseData.errors) {
      // If GraphQL returned any errors, throw an exception to handle it
      throw new Error(`GraphQL Error: ${JSON.stringify(responseData.errors)}`);
    }
    // Return the data part of the response (industry and companies info)
    return responseData.data;
  } catch (err) {
    console.error("Failed to fetch data from GraphQL endpoint:", err.message);
    throw err;  // Propagate error to be caught by caller
  }
}

// Helper function to sync broker workers into the database
async function syncBrokers(brokerData) {
  // Ensure we have expected data structure
  if (!brokerData || !brokerData.queryIndustry) {
    console.warn("No broker industry data found to sync.");
    return;
  }

  // The queryIndustry could return multiple industries; find the one for Brokering (just in case)
  const industryEntry = brokerData.queryIndustry.find(ind => ind.name === "Brokering") || brokerData.queryIndustry[0];
  if (!industryEntry) {
    console.warn("Brokering industry not found in data.");
    return;
  }

  // Iterate over all companies in the Brokering industry
  for (const company of industryEntry.companies) {
    // Iterate over each worker in the company
    for (const worker of company.workers) {
      try {
        // Derive username from email (portion before '@')
        const email = worker.email;
        const username = email ? email.split('@')[0] : null;

        // Create or find the User by email to avoid duplicate users
        const [user, userCreated] = await User.findOrCreate({
          where: { email: email },
          defaults: {
            username: username,
            name: worker.name,
            email: email
          }
        });
        // (Optional) Log user creation status
        if (userCreated) {
          console.log(`Created new User: ${user.username} (${email})`);
        }

        // Create or find the Broker by name to avoid duplicate brokers
        const [broker, brokerCreated] = await Broker.findOrCreate({
          where: { name: worker.name },
          defaults: {
            name: worker.name,
            userId: user.id  // associate broker with the User
            // (Include other fields if the Broker model has them, e.g., email or phone)
          }
        });

        // Log the result for this broker
        if (brokerCreated) {
          console.log(`Synced broker: ${worker.name} (username: ${username})`);
        } else {
          console.log(`Broker already exists, skipped: ${worker.name}`);
        }
      } catch (error) {
        // Handle any error that occurs while processing this particular worker
        console.error(`Error syncing broker ${worker.name}:`, error.message);
      }
    }
  }
}

// Main execution block
(async () => {
  try {
    // 1. Fetch data from Dgraph GraphQL
    const data = await fetchBrokerData(dgraph_endpoint);

    // 2. Sync the fetched broker data into SQLite via Sequelize
    // Optionally, ensure database tables are created:
    // await sequelize.sync();
    await syncBrokers(data);

    console.log("✅ Broker data sync completed successfully.");
  } catch (err) {
    console.error("❌ Broker data sync failed:", err);
  } finally {
    // 3. Close the database connection (if applicable)
    try {
      await sequelize.close();  // Ensure the Sequelize connection is closed
    } catch (err) {
      // Ignore errors on closing connection
    }
  }
})();
