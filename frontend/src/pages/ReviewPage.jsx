import React, { useState, useEffect } from 'react';

const ReviewPage = () => {
  const [formData, setFormData] = useState({
    targetType: '',
    targetId: '',
    rating: '',
    content: '',
    reviewerId: '',
  });

  const [targets, setTargets] = useState([]);

  useEffect(() => {
    const fetchTargets = async () => {
      try {
        const res = await fetch(`http://localhost:3001/api/reviews`);
        const data = await res.json();
        setTargets(data); // put the data as an arg to setTargets
        setFormData(prev => ({ ...prev, targetId: data[0]?.id || '' }));
      } catch (err) {
        console.error('Error fetching targets:', err);
      }
    };

    fetchTargets();
  }, [formData.targetType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { rating, content, targetId } = formData;
    const validRating = rating >= 1 && rating <= 5;
    if (!validRating) {
      alert('Rating must be between 1 and 5.');
      return false;
    }
    if (!content.trim() || !targetId) {
      alert('Please fill out all fields.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        alert('Review submitted successfully!');
        setFormData({ // empty the form afrer review submitted successfully
          targetType: '',
          targetId: '',
          rating: '',
          content: ''
        });
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert('Error submitting review:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', background: '#f2f2f2', borderRadius: '10px' }}>
      <h2 style={{ marginBottom: '20px' }}>Write a Review</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Target Type</label>
          <select
            name="targetType"
            value={formData.targetType}
            onChange={handleInputChange}
            style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
          >
            <option value="trucker">Trucker</option>
            <option value="broker">Broker</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Target</label>
          <select
            name="targetId"
            value={formData.targetId}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
          >
            {targets.map(target => (
              <option key={target.id} value={target.id}>
                {target.name} (ID: {target.id})
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Rating (1 to 5)</label>
          <input
            type="number"
            name="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleInputChange}
            required
            style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Review</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            placeholder="Write your review here..."
            style={{ height: '120px', width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
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
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewPage;


// import React, { useState } from 'react';

// const ReviewPage = () => {
//   const [formData, setFormData] = useState({
//     targetType: 'trucker', // default
//     targetId: '',
//     rating: '',
//     content: ''
//   });

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const validateForm = () => {
//     const { rating, content, targetId } = formData;
//     const validRating = rating >= 1 && rating <= 5;
//     if (!validRating) {
//       alert('Rating must be between 1 and 5.');
//       return false;
//     }
//     if (!content.trim() || !targetId.trim()) {
//       alert('Please fill out all fields.');
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validateForm()) return;

//     try {
//       const token = localStorage.getItem('token'); // Adjust based on your auth method

//       const response = await fetch('http://localhost:3001/api/reviews', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert('Review submitted successfully!');
//         setFormData({
//           targetType: 'trucker',
//           targetId: '',
//           rating: '',
//           content: ''
//         });
//       } else {
//         alert(`Error: ${data.error}`);
//       }
//     } catch (error) {
//       console.error('Error submitting review:', error);
//       alert('Something went wrong.');
//     }
//   };

//   return (
//     <div style={{ maxWidth: '600px', margin: '30px auto', padding: '20px', background: '#f2f2f2', borderRadius: '10px' }}>
//       <h2 style={{ marginBottom: '20px' }}>Write a Review</h2>
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <label>Review to a trucker or a broker?</label>
//           <select
//             name="targetType"
//             value={formData.targetType}
//             onChange={handleInputChange}
//             style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
//           >
//             <option value="trucker">Trucker</option>
//             <option value="broker">Broker</option>
//           </select>
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Target ID</label>
//           <input
//             type="text"
//             name="targetId"
//             value={formData.targetId}
//             onChange={handleInputChange}
//             placeholder="Enter the ID of the trucker or broker"
//             required
//             style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Rating (1 to 5)</label>
//           <input
//             type="number"
//             name="rating"
//             min="1"
//             max="5"
//             value={formData.rating}
//             onChange={handleInputChange}
//             required
//             style={{ width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label>Review</label>
//           <textarea
//             name="content"
//             value={formData.content}
//             onChange={handleInputChange}
//             required
//             placeholder="Write your review here..."
//             style={{ height: '120px', width: '100%', padding: '10px', borderRadius: '5px', marginTop: '5px' }}
//           />
//         </div>

//         <button
//           type="submit"
//           style={{
//             padding: '10px 20px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '5px',
//             cursor: 'pointer'
//           }}
//         >
//           Submit Review
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ReviewPage;
