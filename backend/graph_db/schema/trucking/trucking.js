module.exports = `
   type Trucking {
   id: ID!
   name: String! @search(by: [exact])
   categories: [TruckingCategory]
}
`;