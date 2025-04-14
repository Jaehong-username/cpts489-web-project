import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';
import { Link } from 'react-router-dom';


function BrokersPage() {
    
    const [brokers, setBrokers] = useState([]);
    
    
    useEffect(() => {
        // Swiper and Bootstrap JS is handled through the Swiper React component
        fetch('http://localhost:3001/api/brokers')
            .then(res => res.json())
            .then(data => {
                console.log("Fetched Brokers:", data); // Log the data to see if it's returned properly
                setBrokers(data);
            })
            .catch(err => {
                console.error('Error fetching broker data:', err);
            });
    }, []);

    const userCard = (broker) => (
        <div className="basic-info">
            <img src="profile.png" alt="User" className="profile-image" />
            <h2>Username: {broker.User.username}</h2>
            <p>Email: {broker.User.email}</p>
            <p>Occupation: Broker</p>
            <p>Company: {broker.company}</p>
            <p>Rating: {broker.rating}</p>
            
            <Link to="/messages">
                <button className="button">Request Job</button>
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
                        {brokers.length === 0 ? ( /*if the the list of truckers is empty*/
                            <SwiperSlide className="card-item"> {/* Show a message when no truckers are available */}
                                No Brokers in the list
                            </SwiperSlide>
                        ) : (
                            brokers.map((broker) => (
                            <SwiperSlide key={broker.id} className="card-item">
                                {userCard(broker)}
                            </SwiperSlide>
                            ))
                        )}
                    
                        
                        
                        
                        
                    </Swiper>
                </div>
            </div>
        );
}

export default BrokersPage;
