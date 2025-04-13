module.exports = `
type TruckingCategory {
    id: ID!
    name: String! @search(by: [exact])
    companies: [TruckingCompany]
}
`;