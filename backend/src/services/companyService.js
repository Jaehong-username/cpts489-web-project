const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { Load } = require('../models'); // Sequelize

const DGRAPH_ENDPOINT = process.env.DGRAPH_ENDPOINT;

const getCompanyGraphData = async (companyId) => {
    const res = await fetch(DGRAPH_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            query: `
        query {
          getCompany(id: "${companyId}") {
            id
            name
            email
            phone
            website
            address
            rating
            ratingCount
            socialMedia {
              platform
              url
            }
            industry {
              name
            }
            categories {
              name
            }
            workers(filter: { isCustomerFacing: true }) {
              id
              name
              role
              rating
              ratingCount
              email
              phone
              isCustomerFacing
              reviews {
                rating
                comment
                timestamp
                reviewer {
                  name
                  role
                  company {
                    name
                  }
                }
              }
            }
            reviews {
              rating
              comment
              timestamp
              reviewer {
                name
                role
                company {
                  name
                }
              }
              reviewee {
                id
              }
            }
          }
        }
      `
        }),
    });

    const json = await res.json();
    return json.data?.getCompany || null;
};

const getCompanyLoads = async (companyName) => {
    return await Load.findAll({
        where: {
            brokerage_name: companyName // You may need to adjust this field
        },
        order: [['pickup_date', 'ASC']]
    });
};

const getCompanyPageData = async (companyId) => {
    const graphCompany = await getCompanyGraphData(companyId);

    if (!graphCompany) return null;

    const sqlLoads = await getCompanyLoads(graphCompany.name);

    return {
        ...graphCompany,
        loads: sqlLoads
    };
};

module.exports = {
    getCompanyPageData
};
