module.exports = `
type BrokerWorker {
    id: ID!
    name: String! @search(by: [exact])
    role: String!
    status: String
    company: BrokerCompany
    reviews: [Review] @hasInverse(field: revieweeBrokerWorker)
    reviewsLeft: [Review] @hasInverse(field: reviewerBrokerWorker)
    email: String
    phone: String
    isCustomerFacing: Boolean @search
}
`;