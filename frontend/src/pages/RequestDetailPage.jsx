import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const RequestDetailPage = () => {
  
  const [request, setRequest] = useState([]);
  
  const location = useLocation();
  // Extract 'id' from the URL query string
  const queryParams = new URLSearchParams(location.search); // allows us to parse the query string and get the id.
  const requestId = queryParams.get('id');
    
  useEffect(() => {
    
    if (!requestId) {
        alert("This request doesn't exist!");
        return;
    }
    
    // fetch will return the particular review data object!
    fetch(`http://localhost:3001/api/message/${requestId}`, {  //make sure to use back tick
        method: 'GET',
    })
    .then((res) => {
    if (!res.ok) { // failed to fetch the user profie data
        alert('Failed to fetch the request data for the user from the database');
    }
    return res.json(); // return 
    })     
    .then((data) => {
        setRequest(data);  // Set user profile data if successful
    })
    .catch((err) => {
        alert("Error Occured fetching request data", err);
        console.error(err);
    })
    
  }, []
  );
  
  const requestDetail = (request) => (
    <div className="flex items-center gap-4">
        
        <h2 className="user-name">
              A message from an user Id of {request.senderId}
        </h2>
        
        <p>Request: {request.content}</p>
        
                
    </div>
  );
  
  
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Contact Info Section */}
      <div style={{ flex: 1, background: '#e1cdca', padding: '20px', borderRadius: '10px' }}>
        
        {requestDetail(request)}
      </div>

    </div>
  );
};

export default RequestDetailPage;