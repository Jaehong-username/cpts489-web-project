import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


const ViewReviewPage = () => {
  
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    // to get the user information
    const token = localStorage.getItem('token');
    
    const decoded = jwtDecode(token);
    const userId = decoded.id
    
    if (!token) {
        alert("You must be logged in to view your profile!");
        return;
    }
    
    fetch(`http://localhost:3001/api/reviews/user/${userId}`, {  //make sure to use back tick
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
    })
    .then((res) => {
    if (!res.ok) { // failed to fetch the user profie data
        alert('Failed to fetch the review data for the user from the database');
    }
    return res.json(); // return 
    })     
    .then((data) => {
        setReviews(data);  // Set user profile data if successful
    })
    .catch((err) => {
        alert("Error Occured fetching user data", err)
    })
    
  }, []);
  
  const reviewList = (review) => (
    <div className="flex items-center gap-4">
      
        <Link to={`/view-reviews-detail?id=${review.id}`}>
              
            <h2 className="user-name">
                A message from an user Id of {review.reviewerId}
            </h2>
        
        </Link>
                
                
    </div>
  );
  
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Contact Info Section */}
      <div style={{ flex: 1, background: '#e1cdca', padding: '20px', borderRadius: '10px' }}>
        <h1>Hello! You have received {reviews.length } reviews so far!</h1>
        
        
        {reviews.length === 0 ? ( /*if the the list of truckers is empty*/
          <h1>
            You currently have no requests!
          </h1>
        
        ) : (
              reviews.map((review) => (
                reviewList(review)
            ))
        )}
        
      </div>

    </div>
  );
};

export default ViewReviewPage;