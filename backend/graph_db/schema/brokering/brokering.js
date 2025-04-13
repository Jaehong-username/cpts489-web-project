module.exports = `
type Brokering {
    id: ID!
    name: String! @search(by: [exact])
    companies: [BrokerCompany]
}
`;