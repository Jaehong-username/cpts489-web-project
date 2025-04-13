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
    
    
    useEffect(() => {
        // Swiper and Bootstrap JS is handled through the Swiper React component
        fetch('http://localhost:3000/api/truckers')
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
            <h2 className="user-name">User ID: {trucker.id }</h2>
            <p className="user-location">Location: {trucker.currentCity}</p>
            <p className="user-profession">Occupation: Trucker</p>
            <p className="user-vehicle">Capacity: {trucker.capacity}</p>
            <p className="user-capacity">Current City: {trucker.currentCity}</p>
            <p className="user-availability">Available: {trucker.status}</p>
            
            <Link to="/messages">
                <button className="button">Message</button>
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