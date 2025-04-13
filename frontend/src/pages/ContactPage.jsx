import React, { useState } from 'react';

const ContactPage = () => {
  //setFormData: A function used to update the state (formData).
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    content: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateEmail = () => {
    const { email } = formData;
    const emailValid = email.includes('@');
    if (!emailValid) {
      alert("Email is bad. Fix it!\n");
    }
    return emailValid;
  };
  
  // making it an async function
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateEmail()) {
      console.log('Form data submitted:', formData);
      
      // Add form submission logic here (e.g., API call)
      try {
        // Send the form data to the backend API
        // The fetch API returns a Promise that resolves when the request completes, either successfully or with an erro
        const response = await fetch('http://localhost:3000/api/feedback', {
          
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        if (response.ok) {
          alert('Feedback submitted successfully!');
          // Clear form data after submission
          setFormData({
            first_name: '',
            last_name: '',
            email: '',
            content: '',
          });
        } else {
          alert('Error submitting feedback: ' + formData.content);
        }
      } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('Something went wrong. Please try again.');
      }
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* Contact Info Section */}
      <div style={{ flex: 1, background: '#e1cdca', padding: '20px', borderRadius: '10px' }}>
        <h1>Contact Us</h1>
        <h3>- If you have any questions or feedback, please don't feel hesitant to reach out to us!</h3>
        <p>Hours: M-F 9am - 5pm</p>
        <p>Call: 123-456-7890</p>
        <p>Email: trucker.broker@email.com</p>
        <p>Address: 1500 Spokane 3rd St. <br /> Pullman, WA 99163</p>
      </div>

      {/* Form Section */}
      <div style={{ flex: 1, padding: '20px' }}>
        <div style={{
          background: '#e1cdca', // Matching background color
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
        }}>
          <h2>Questions & Feedback</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                name="first_name" /* name and value formData.  need to math */
                required
                value={formData.first_name}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <label>First Name</label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="text"
                name="last_name"
                required
                value={formData.last_name}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <label>Last Name</label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
              />
              <label>Email</label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Your message</label>
              <br />
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
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
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;