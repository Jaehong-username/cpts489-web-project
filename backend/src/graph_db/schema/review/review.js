module.exports = `
type Review {
    id: ID!
    comment: String
    
    rating: Float!
    communication: Float
    reliability: Float
    professionalism: Float
    
    timestamp: DateTime!
    
    reviewerBrokerWorker: BrokerWorker @hasInverse(field: reviewsLeft)
    reviewerTruckingWorker: TruckingWorker @hasInverse(field: reviewsLeft)
    
    revieweeBrokerCompany: BrokerCompany @hasInverse(field: reviews)
    revieweeBrokerWorker: BrokerWorker @hasInverse(field: reviews)
    
    revieweeTruckingWorker: TruckingWorker @hasInverse(field: reviews)
    revieweeTruckingCompany: TruckingCompany @hasInverse(field: reviews)
}
`;