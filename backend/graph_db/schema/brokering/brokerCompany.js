module.exports = `
type BrokerCompany {
    id: ID!
    name: String! @search(by: [exact])
    address: String
    workers: [BrokerWorker] @hasInverse(field: company)
    brokering: Brokering
    reviews: [Review] @hasInverse(field: revieweeBrokerCompany)
    website: String
    email: String
    phone: String
    facebook: String
    linkedin: String
    twitter: String
}
`;