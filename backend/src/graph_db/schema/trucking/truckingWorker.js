module.exports = `
type TruckingWorker {
    id: ID!
    name: String! @search(by: [exact])
    role: String!
    company: TruckingCompany!
    currentCity: String
    status: String
    reviews: [Review] @hasInverse(field: revieweeTruckingWorker)
    reviewsLeft: [Review] @hasInverse(field: reviewerTruckingWorker)
    email: String
    phone: String
    isCustomerFacing: Boolean @search
}
`;