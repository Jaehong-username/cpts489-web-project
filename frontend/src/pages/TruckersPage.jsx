import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { Link } from 'react-router-dom';

function TruckerBroker() {
    
    const [truckers, setTruckers] = useState([]);
    
    // const [selectedTarget, setSelectedTarget] = useState(null); // For the selected trucker
    //const handleSelectUser = (user) => {
    //    setSelectedTarget(user); // user = { id: ..., name: ... }
    // };
    
    useEffect(() => {
        // Swiper and Bootstrap JS is handled through the Swiper React component
        fetch('http://localhost:3001/api/truckers')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched truckers:", data); // Log the data to see if it's returned properly
                setTruckers(data);
            })
            .catch(err => {
                console.error('Error fetching trucker data:', err);
            });
    }, []);

    const userCard = (trucker) => (
        <div className="basic-info">
            <img src="profile.png" alt="User" className="profile-image" />
            <h2 className="user-name">Username: {trucker.User.username}</h2>
            <p>User Id: {trucker.userId}</p>
            <p>Email: {trucker.User.email}</p>
            <p>Location: {trucker.currentCity}</p>
            <p>Occupation: Trucker</p>
            <p>Rating: {trucker.rating}</p>
            <p>Capacity: {trucker.capacity}</p>
            <p>Current City: {trucker.currentCity}</p>
            <p>Available: {trucker.status}</p>
            
            
            
            <Link to={`/messages?id=${trucker.id}`}>
                <button className="button">
                    Request Job
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
                        
                        {/* Render the truckers dynamically */}
                        {truckers.length === 0 ? ( /*if the the list of truckers is empty*/
                            <SwiperSlide className="card-item"> {/* Show a message when no truckers are available */}
                                No truckers in the list
                            </SwiperSlide>
                        ) : (
                            truckers.map((trucker) => (
                            <SwiperSlide key={trucker.id} className="card-item">
                                {userCard(trucker)}
                            </SwiperSlide>
                            ))
                        )}
                    
                    </Swiper>
                </div>
            </div>
        );
}

export default TruckerBroker;