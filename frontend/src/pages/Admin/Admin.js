import React, { useState, useEffect } from 'react';
import './Admin.css';
import AddProduct from './Addproduct';
import ProductList from './ProductList';
import { useNavigate } from 'react-router-dom';
// AdminDashboard Component
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalcontact: 0
  });
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [showProfileModal, setShowProfileModal] = useState(false); // For the modal
  const userId = localStorage.getItem('user_id');
  const [contactSubmissions, setContactSubmissions] = useState([]); // Contact submissions
  const [selectedMessage, setSelectedMessage] = useState(null); // State for selected message


  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
  });

  useEffect(() => {
    if (activeView === 'dashboard') {
      fetch(`http://localhost:8000/product/api/dashboard-stats/${userId}/`)
        .then((response) => response.json())
        .then((data) => {
          setStats({
            totalUsers: data.total_users,
            totalProducts: data.total_products,
            totalcontact: data.total_contact
          });
        })
        .catch((error) => console.error('Error fetching dashboard stats:', error));
    }
    if (activeView === 'contact-submissions') {
      fetch(`http://localhost:8000/account/contact-submissions/${userId}/`)
      .then((response) => response.json())
      .then((data) => {
        setContactSubmissions(data); // Set contact submissions
      })
      .catch((error) => console.error('Error fetching contact submissions:', error));
  }
  }, [activeView, userId]);

  // Fetch profile data when the modal opens
  useEffect(() => {
    if (showProfileModal) {
      fetch(`http://localhost:8000/account/profile/${userId}/`)
        .then((response) => response.json())
        .then((data) => {
          setProfileData(data);  // Set the fetched profile data
        })
        .catch((error) => console.error('Error fetching profile:', error));
    }
  }, [showProfileModal, userId]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/'); // Redirect to the home page or login page
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8000/account/update/${userId}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(profileData), // Send the updated profile data
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert('Profile updated successfully');
          setShowProfileModal(false); // Close the modal on success
        } else {
          alert('Error updating profile');
        }
      })
      .catch((error) => console.error('Error updating profile:', error));
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      fetch(`http://localhost:8000/account/delete/${userId}/`, {
        method: 'DELETE',
      })
        .then((response) => {
          if (response.ok) {
            alert('Account deleted successfully');
            handleLogout(); // Logout after account deletion
          } else {
            alert('Error deleting account');
          }
        })
        .catch((error) => console.error('Error deleting account:', error));
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <div className="stats">
            <div className="stat-item">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-item">
              <h3>Total Products</h3>
              <p>{stats.totalProducts}</p>
            </div>
            <div className="stat-item">
              <h3>Contacted User</h3>
              <p>{stats.totalcontact}</p>
            </div>
          </div>
        );
      case 'add-product':
        return <AddProduct />;
      case 'product-list':
        return <ProductList />;
        case 'contact-submissions':
          return (
            <div className="contact-submissions">
              <h2>Contact Submissions</h2>
              <table className="contact-table show-msg-table">
                <thead>
                  <tr>
                    <th>User Name</th>
                    <th>User Email</th>
                    <th>Seller Name</th>
                    <th>Message</th>
                    <th>Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {contactSubmissions.map((submission) => (
                    <tr key={submission.id}>
                      <td>{submission.user_name}</td>
                      <td>{submission.user_email}</td>
                      <td>{submission.seller_name}</td>
                      <td onClick={() => setSelectedMessage(submission.msg)}>
                        {submission.msg.substring(0, 30)}...
                      </td>
                      <td>{new Date(submission.submitted_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
        
              {/* Full Message Modal */}
              {selectedMessage && (
                <div className="show-msg-modal">
                  <div className="show-msg-modal-content">
                    <h2>Full Message</h2>
                    <p>{selectedMessage}</p>
                    <button onClick={() => setSelectedMessage(null)}>Close</button>
                  </div>
                </div>
              )}
            </div>
          );
        
      default:
        return <h2>Select an option from the sidebar</h2>;
    }
  };

  return (
    <div className="admin-container">
      <Sidebar
        setActiveView={setActiveView}
        handleLogout={handleLogout}
        openProfileModal={() => setShowProfileModal(true)} // Trigger modal opening
      />
      <div className="main-content">
        <h1>Admin Dashboard</h1>
        {renderContent()}
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleProfileUpdate}>
              <label>
                Name:
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
              </label>
              <label>
                Mobile:
                <input
                  type="text"
                  value={profileData.mobile}
                  onChange={(e) => setProfileData({ ...profileData, mobile: e.target.value })}
                />
              </label>
              <label>
                Address:
                <textarea
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                />
              </label>
              <button type="submit">Save Changes</button>
            </form>
            <button className="delete-account" onClick={handleDeleteAccount}>
              Delete Account
            </button>
            <button onClick={() => setShowProfileModal(false)} style={{marginTop:'20px'}}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Sidebar component handles navigation
const Sidebar = ({ setActiveView, handleLogout, openProfileModal }) => (
  <div className="sidebar">
    <ul>
      <li onClick={() => setActiveView('dashboard')}>Dashboard</li>
      <li onClick={() => setActiveView('add-product')}>Add Product</li>
      <li onClick={() => setActiveView('product-list')}>Product List</li>
      <li onClick={() => setActiveView('contact-submissions')}>Contact Submissions</li> {/* New contact submission link */}
      <li onClick={openProfileModal}>Profile</li> {/* Profile link */}
    </ul>
    <ul style={{ marginBottom: '10px' }}>
      <li>
        <button className="logout-button" onClick={handleLogout}>Log out</button>
      </li>
    </ul>
  </div>
);

export default AdminDashboard;

