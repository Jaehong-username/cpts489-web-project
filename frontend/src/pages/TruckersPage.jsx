import React, { useEffect } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

function TruckerBroker() {
    useEffect(() => {
        // Swiper and Bootstrap JS is handled through the Swiper React component
    }, []);

    const userCard = (
        <div className="basic-info">
            <img src="profile.png" alt="User" className="profile-image" />
            <h2 className="user-name">First Name, Last Name</h2>
            <p className="user-location">Pullman, WA</p>
            <p className="user-profession">Trucker</p>
            <p className="user-vehicle">Vehicle:</p>
            <p className="user-capacity">Capacity:</p>
            <p className="user-availability">Available</p>
            <button className="button">Message</button>
            <button className="button">Request</button>
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
                        <SwiperSlide className="card-item">{userCard}</SwiperSlide>
                        <SwiperSlide className="card-item">{userCard}</SwiperSlide>
                        <SwiperSlide className="card-item">{userCard}</SwiperSlide>
                    </Swiper>
                </div>
            </div>
        );
}

export default TruckerBroker;