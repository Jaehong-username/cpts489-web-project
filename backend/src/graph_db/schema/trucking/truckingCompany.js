module.exports = `
type TruckingCompany {
   id: ID!
   name: String! @search(by: [exact])
   address: String
   workers: [TruckingWorker] @hasInverse(field: company)
   reviews: [Review] @hasInverse(field: revieweeTruckingCompany)
   website: String
   email: String
   phone: String
   facebook: String
   linkedin: String
   twitter: String
}
`;