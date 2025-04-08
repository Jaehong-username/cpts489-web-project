import React, { useEffect } from 'react';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import '../index.css';

const BrokersPage = () => {
  useEffect(() => {
    new Swiper('.slider-wrapper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
        },
        1024: {
          slidesPerView: 3,
        },
      },
    });
  }, []);

  const renderCards = () => {
    return [1, 2, 3].map((_, index) => (
      <div key={index} className="card-item swiper-slide">
        <div className="basic-info">
          <img src="profile.png" alt="User" className="profile-image" />
          <h2 className="user-name">First Name, Last Name</h2>
          <p className="user-location">Pullman, WA</p>
          <p className="user-profession">Broker</p>
          <p className="user-brokerage">Brokerage:</p>
          <p className="user-availability">Available</p>
          <button className="button">Message</button>
          <button className="button">Request</button>
        </div>
      </div>
    ));
  };

  return (
    <div className="profile-container">
      <div className="slider-wrapper">
        <div className="card-list swiper-wrapper">
          {renderCards()}
        </div>
        <div className="swiper-pagination"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
      </div>
    </div>
  );
};

export default BrokersPage;
