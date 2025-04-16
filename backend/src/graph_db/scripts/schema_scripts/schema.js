const schema = `
type Industry @dgraph(type: "Industry") {
  id: ID!
  name: String! @search(by: [exact])
  companies: [Company] @hasInverse(field: industry)
}

type Company @dgraph(type: "Company") {
  id: ID!
  industry: Industry!
  categories: [Category]
  name: String! @search(by: [exact])
  address: String
  workers: [Worker] @hasInverse(field: company)
  reviews: [Review] @hasInverse(field: revieweeCompany)
  rating: Float
  ratingCount: Int
  website: String
  email: String!
  phone: String!
  socialMedia: [SocialMediaLink]
}

type SocialMediaLink @dgraph(type: "SocialMediaLink") {
  platform: String!
  url: String!
}

type Worker @dgraph(type: "Worker") {
  username: String! @id
  name: String! @search(by: [exact])
  role: String! @search(by: [exact])
  company: Company! @hasInverse(field: workers)
  status: String
  rating: Float
  ratingCount: Int
  reviews: [Review] @hasInverse(field: reviewee)
  reviewsLeft: [Review] @hasInverse(field: reviewer)
  email: String
  phone: String
  isCustomerFacing: Boolean
  activeLoads: [LoadRef] @hasInverse(field: postedBy)
}

type LoadRef @dgraph(type: "LoadRef") {
  id: ID!
  sqlId: String!
  postedBy: Worker
  status: String!
}

type Review @dgraph(type: "Review") {
  id: ID!
  comment: String
  rating: Float!
  timestamp: DateTime!
  reviewer: Worker @hasInverse(field: reviewsLeft)
  reviewee: Worker @hasInverse(field: reviews)
  revieweeCompany: Company 
}

type Category @dgraph(type: "Category") {
  id: ID!
  name: String! @search(by: [exact])
  companies: [Company] @hasInverse(field: categories)
}
`

module.exports = { schema }