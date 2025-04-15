import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//This is a request!
const MessagePage = () => {
  const [formData, setFormData] = useState({
    content: '',
    senderType: '',
    senderId: '',
    targetType: '',
    targetId: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     
      try {
        const response = await fetch('http://localhost:3001/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert('Job Request submitted successfully!');
          setFormData({
            content: '',
            senderType: '',
            senderId: '',
            targetType: '',
            targetId: '',
          });
        } else {
          alert('Error submitting message: ' + data.message);
        }
      } catch (error) {
        console.error('Error submitting message:', error);
        alert('Something went wrong. Please try again.');
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
        <form onSubmit={handleSubmit}>

          <div style={{ marginBottom: '15px' }}>
            <label>Please select your occupation</label>
            <select
              type="text"
              name="senderType"
              required
              value={formData.senderType}
              onChange={handleInputChange}
              placeholder="e.g. user"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value = 'trucker'>Trucker</option>
              <option value = 'broker'>Broker</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Please type your user ID</label>
            <input
              type="text"
              name="senderId"
              required
              value={formData.senderId}
              onChange={handleInputChange}
              placeholder="e.g. 101"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Plase select the recipient's oocupation</label>
            <select
              type="text"
              name="targetType"
              required
              value={formData.targetType}
              onChange={handleInputChange}
              placeholder="e.g. user"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
            >
              <option value = 'trucker'>Trucker</option>
              <option value = 'broker'>Broker</option>
            </select>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label>Please type the recipient's user id</label>
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
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Send Job Request
          </button>
        </form>
      </div>
    </div>
  );
};

export default MessagePage;
