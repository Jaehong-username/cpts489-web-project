import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const ViewReviewDetailPage = () => {
  
  const [review, setReview] = useState([]);
  
  const location = useLocation();
  // Extract 'id' from the URL query string
  const queryParams = new URLSearchParams(location.search); // allows us to parse the query string and get the id.
  const reviewId = queryParams.get('id');
    
  useEffect(() => {
    
    if (!reviewId) {
        alert("This review doesn't exist!");
        return;
    }
    
    // fetch will return the particular review data object!
    fetch(`http://localhost:3001/api/reviews/${reviewId}`, {  //make sure to use back tick
        method: 'GET',
    })
    .then((res) => {
    if (!res.ok) { // failed to fetch the user profie data
        alert('Failed to fetch the review data for the user from the database');
    }
    return res.json(); // return 
    })     
    .then((data) => {
        setReview(data);  // Set user profile data if successful
    })
    .catch((err) => {
        alert("Error Occured fetching user data", err);
        console.error(err);
    })
    
  }, [reviewId]
  ); // reviewID  It runs again only if reviewId changes — like navigating to a different review.
  
  const reviewDetail = (review) => (
    <div className="flex items-center gap-4">
        
        <h2 className="user-name">
              A Review from an user Id of {review.reviewerId}
        </h2>
        
        <p>Rating: {review.rating}</p>
        <p>Review: {review.content}</p>
                
    </div>
  );
  
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Contact Info Section */}
      <div style={{ flex: 1, background: '#e1cdca', padding: '20px', borderRadius: '10px' }}>
        
        {reviewDetail(review)}
      </div>

    </div>
  );
};

export default ViewReviewDetailPage;
