/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEdit, faTrash, faSignOutAlt, faEnvelope, faPhone, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import './Profile.css';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const ProfilePage = () => {
    const [profile, setProfile] = useState({});
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const user_id = localStorage.getItem('user_id');
    const navigate = useNavigate();

    // Fetch user profile
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/account/api/view_profile/?user_id=${user_id}`)
            .then(response => response.json())
            .then(data => {
                setProfile(data);
                setName(data.name);
                setMobile(data.mobile);
                setAddress(data.address);
            });
    }, []);

    const handleEdit = () => {
        const updatedData = {
            user_id: user_id,
            name,
            mobile,
            address,
        };

        fetch('http://127.0.0.1:8000/account/api/edit_profile/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            setEditing(false);
        });
    };

    const handleDelete = () => {
        const confirmDelete = window.confirm("Are you sure you want to remove your account? This action cannot be undone.");
        
        if (confirmDelete) {
            fetch('http://127.0.0.1:8000/account/api/remove_account/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_id: user_id }),
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                localStorage.clear();
                navigate('/');
            });
        } else {
            // User cancelled the deletion
            alert("Account deletion cancelled.");
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/');
    };

    return (
        <>
            <Navbar />
            <div className="profile-page">
                <div className="sidebar">
                    <h2>User Menu</h2>
                    <button onClick={() => setEditing(false)}>
                        <FontAwesomeIcon icon={faUser} /> View Profile
                    </button>
                    <button onClick={() => setEditing(true)}>
                        <FontAwesomeIcon icon={faEdit} /> Edit Profile
                    </button>
                    <button onClick={handleDelete}>
                        <FontAwesomeIcon icon={faTrash} /> Remove Account
                    </button>
                    <button onClick={handleLogout}>
                        <FontAwesomeIcon icon={faSignOutAlt} /> Log Out
                    </button>
                </div>
                <div className="content">
                    {editing ? (
                        <div className="edit-profile">
                            <h2>Edit Profile</h2>
                            <strong>Name:</strong>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                            />
                            <strong>Mobile:</strong>
                            <input
                                type="text"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="Mobile"
                            />
                            <strong>Address:</strong>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Address"
                            />
                            <button onClick={handleEdit}>Save Changes</button>
                        </div>
                    ) : (
                        <div className="view-profile">
                            <h2>Profile</h2>
                            <p>
                                <FontAwesomeIcon icon={faUser} /> <strong>Name:</strong> {profile.name}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> {profile.email}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faPhone} /> <strong>Mobile:</strong> {profile.mobile}
                            </p>
                            <p>
                                <FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Address:</strong> {profile.address}
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ProfilePage;
