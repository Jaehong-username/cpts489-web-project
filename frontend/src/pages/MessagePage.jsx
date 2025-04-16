import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MessagePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    content: '',
    targetType: '',
    targetId: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to send messages');
      navigate('/login');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
     
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Send the authentication token
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        alert('Job Request submitted successfully!');
        setFormData({
          content: '',
          targetType: '',
          targetId: '',
        });
      } else {
        setError(data.message || 'Error submitting message');
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div style={{
        flex: 1,
        maxWidth: '600px',
        background: '#f5f5f5',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
      }}>
        <h2>Send a Job Request</h2>
        {error && (
          <div style={{ 
            padding: '10px', 
            backgroundColor: '#f8d7da', 
            color: '#721c24',
            borderRadius: '5px',
            marginBottom: '15px'
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Please select the recipient's occupation</label>
            <select
              name="targetType"
              required
              value={formData.targetType}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value="">-- Select Recipient Type --</option>
              <option value="trucker">Trucker</option>
              <option value="broker">Broker</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Please enter the recipient's user ID</label>
            <input
              type="text"
              name="targetId"
              required
              value={formData.targetId}
              onChange={handleInputChange}
              placeholder="e.g. 202"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Your Message</label>
            <textarea
              name="content"
              required
              value={formData.content}
              onChange={handleInputChange}
              placeholder="Type your message..."
              style={{ height: '150px', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: isLoading ? '#cccccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
          >
            {isLoading ? 'Sending...' : 'Send Job Request'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagePage;