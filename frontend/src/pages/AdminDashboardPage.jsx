import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [truckers, setTruckers] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const checkAdminStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = JSON.parse(localStorage.getItem('user'));
        if (!userData || userData.role !== 'admin') {
          navigate('/');
          return;
        }
      } catch (err) {
        navigate('/login');
      }
    };

    checkAdminStatus();
    fetchData(activeTab);
  }, [activeTab, navigate]);

  const fetchData = async (tab) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      let response;
      switch (tab) {
        case 'users':
          response = await axios.get('http://localhost:3001/api/admin/users', config);
          setUsers(response.data);
          break;
        case 'truckers':
          response = await axios.get('http://localhost:3001/api/admin/truckers', config);
          setTruckers(response.data);
          break;
        case 'brokers':
          response = await axios.get('http://localhost:3001/api/admin/brokers', config);
          setBrokers(response.data);
          break;
        default:
          break;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while fetching data');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
  };

  const cancelDelete = () => {
    setUserToDelete(null);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      await axios.delete(`http://localhost:3001/api/admin/users/${userToDelete.id}`, config);
      
      // Update the users list by removing the deleted user
      const updatedUsers = users.filter(user => user.id !== userToDelete.id);
      setUsers(updatedUsers);
      
      setSuccessMessage(`User ${userToDelete.username} deleted successfully`);
      setUserToDelete(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
      if (err.response?.status === 401 || err.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderUsersTab = () => {
    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`badge ${
                    user.role === 'admin' ? 'bg-danger' : 
                    user.role === 'trucker' ? 'bg-primary' : 'bg-success'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  <span className={`badge ${user.isActive ? 'bg-success' : 'bg-secondary'}`}>
                    {user.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => confirmDeleteUser(user)}
                      className="btn btn-sm btn-danger"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderTruckersTab = () => {
    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User Info</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Rating</th>
              <th>Current City</th>
              <th>Qualifications</th>
            </tr>
          </thead>
          <tbody>
            {truckers.map(trucker => (
              <tr key={trucker.id}>
                <td>{trucker.id}</td>
                <td>
                  <div>
                    <strong>{trucker.User?.name}</strong>
                  </div>
                  <div className="small text-muted">
                    @{trucker.User?.username}
                  </div>
                  <div className="small text-muted">
                    {trucker.User?.email}
                  </div>
                </td>
                <td>{trucker.capacity || 'Not specified'}</td>
                <td>
                  <span className={`badge ${
                    trucker.status === 'available' ? 'bg-success' : 
                    trucker.status === 'in_transit' ? 'bg-warning' : 'bg-secondary'
                  }`}>
                    {trucker.status}
                  </span>
                </td>
                <td>
                  {trucker.rating > 0 ? (
                    <div>
                      <span className="text-warning">{'★'.repeat(Math.floor(trucker.rating))}</span>
                      <span className="text-muted">{'★'.repeat(5 - Math.floor(trucker.rating))}</span>
                      <span className="ms-1">({trucker.rating.toFixed(1)})</span>
                    </div>
                  ) : (
                    <span className="text-muted">No ratings</span>
                  )}
                </td>
                <td>{trucker.currentCity || 'Not specified'}</td>
                <td>{trucker.qualifications || 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBrokersTab = () => {
    return (
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User Info</th>
              <th>Company</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {brokers.map(broker => (
              <tr key={broker.id}>
                <td>{broker.id}</td>
                <td>
                  <div>
                    <strong>{broker.User?.name}</strong>
                  </div>
                  <div className="small text-muted">
                    @{broker.User?.username}
                  </div>
                  <div className="small text-muted">
                    {broker.User?.email}
                  </div>
                </td>
                <td>{broker.company}</td>
                <td>
                  {broker.rating > 0 ? (
                    <div>
                      <span className="text-warning">{'★'.repeat(Math.floor(broker.rating))}</span>
                      <span className="text-muted">{'★'.repeat(5 - Math.floor(broker.rating))}</span>
                      <span className="ms-1">({broker.rating.toFixed(1)})</span>
                    </div>
                  ) : (
                    <span className="text-muted">No ratings</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container py-5">
        <div className="card shadow-lg rounded-4">
            <div className="card-body">
            
                <h1 className="mb-4">Admin Dashboard</h1>
                
                {/* Alert messages */}
                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError(null)}></button>
                    </div>
                )}
                
                {successMessage && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                    {successMessage}
                    <button type="button" className="btn-close" onClick={() => setSuccessMessage(null)}></button>
                    </div>
                )}
                
                {/* Delete confirmation modal */}
                {userToDelete && (
                    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button type="button" className="btn-close" onClick={cancelDelete}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete user <strong>{userToDelete.username}</strong>?</p>
                            <p className="text-danger">This action cannot be undone. All associated data will be permanently removed.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={deleteUser}>Delete User</button>
                        </div>
                        </div>
                    </div>
                    </div>
                )}
                
                {/* Tab navigation */}
                <ul className="nav nav-tabs mb-4">
                    <li className="">
                    <button 
                        className={`nav-link ${activeTab === 'users' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('users')}
                    >
                        Users
                    </button>
                    </li>
                    <li className="">
                    <button 
                        className={`nav-link ${activeTab === 'truckers' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('truckers')}
                    >
                        Truckers
                    </button>
                    </li>
                    <li className="">
                    <button 
                        className={`nav-link ${activeTab === 'brokers' ? 'active' : ''}`} 
                        onClick={() => setActiveTab('brokers')}
                    >
                        Brokers
                    </button>
                    </li>
                </ul>
                
                {/* Loading indicator */}
                {loading ? (
                    <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    </div>
                ) : (
                    <div className="card">
                    <div className="card-body">
                        {activeTab === 'users' && users.length > 0 && renderUsersTab()}
                        {activeTab === 'truckers' && truckers.length > 0 && renderTruckersTab()}
                        {activeTab === 'brokers' && brokers.length > 0 && renderBrokersTab()}
                        
                        {/* Empty state messages */}
                        {activeTab === 'users' && users.length === 0 && !loading && (
                        <div className="text-center p-4">No users found</div>
                        )}
                        {activeTab === 'truckers' && truckers.length === 0 && !loading && (
                        <div className="text-center p-4">No truckers found</div>
                        )}
                        {activeTab === 'brokers' && brokers.length === 0 && !loading && (
                        <div className="text-center p-4">No brokers found</div>
                        )}
                    </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default AdminDashboardPage;