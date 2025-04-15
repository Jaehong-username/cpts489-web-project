import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function ProfilePage() {
    
    const [user, setUser] = useState([]);
    
    
    useEffect(() => {
        // to get the user information
        const token = localStorage.getItem('token');
        
        const decoded = jwtDecode(token);
        const userId = decoded.id
        
        if (!token) {
            alert("You must be logged in to view your profile!");
            return;
        }
        
        fetch(`http://localhost:3001/api/users/${userId}`, {  //make sure to use back tick
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
        })
        .then((res) => {
        if (!res.ok) { // failed to fetch the user profie data
            alert('Failed to fetch the user data from the database');
        }
        return res.json(); // return 
        })     
        .then((data) => {
            setUser(data);  // Set user profile data if successful
        })
        .catch((err) => {
            alert("Error Occured fetching user data", err)
        })
        
    }, []);
    
    
    const profileCard = (user) => (
        <div className="basic-info">
            <img src="profile.png" alt="User" className="profile-image" />
            <h2>Welcome, {user.username}!</h2>
            
            <p>User Id: {user.id}</p>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            
            <Link to={`/view-reviews?id=${user.id}`}>
                <button className="button">
                    View Reviews
                </button>
            </Link>
            
            <Link to={`/requests?id=${user.id}`}>
                <button className="button">
                    View Requests
                </button>
            </Link>
            
           
            
        </div>
    );
    return(
            <div className="profile-container">
                <div className="slider-wrapper">
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={30}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        className="card-list"
                    >
                        <SwiperSlide className="card-item">
                            {profileCard(user)}
                        </SwiperSlide>
                    
                    </Swiper>
                </div>
            </div>
        );
}

export default ProfilePage;



/*
            {user.role === 'trucker' ? (
                <>
                    <h2>Trucker Profile</h2>
                    <p>Current city: {user.Trucker.currentCity}</p>
                    <p>Rating: {user.Trucker.rating}</p>
                    <p>Truck Capacity: {user.Truck.capacity}</p>
                    <p>Qualifications: {user.Truck.qualifications}</p>
                    <p>Available for Jobs: {user.Trucker.status}</p>
                </>
            ) : user.role === 'broker' ? (
                <>
                    <h2>Broker Profile</h2>
                    <p>Company: {user.Trucker.company}</p>
                    <p>Rating: {user.Trucker.rating}</p>
                </>
            ) : (
                <p>You are an admin!</p>
            )}
            */
           
            /*
            <Link to={`/messages?id=${user.id}`}>
                <button className="button">
                    Request Job
                </button>
            </Link>
            */