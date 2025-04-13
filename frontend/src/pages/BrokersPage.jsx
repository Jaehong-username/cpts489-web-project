import React, { useEffect, useState } from 'react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../index.css';

function BrokersPage() {
    
    const [brokers, setBrokers] = useState([]);
    
    
    useEffect(() => {
        // Swiper and Bootstrap JS is handled through the Swiper React component
        fetch('http://localhost:3000/api/brokers')
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
            <h2 className="user-name">User ID: {broker.id}</h2>
            <p className="user-profession">Broker</p>
            <p className="user-location">Company: {broker.company}</p>
            <p className="user-location">Rating: {broker.rating}</p>
            
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











// const BrokersPage = () => {
  
//   const [brokers, setBrokers] = useState([]);
  
  
  
//   useEffect(() => {
//     // Swiper and Bootstrap JS is handled through the Swiper React component
//     fetch('http://localhost:3000/api/brokers')
//     .then(res => res.json())
//     .then(data => {
//         console.log("Fetched brokers:", data); // Log the data to see if it's returned properly
//         setBrokers(data);
//     })
//     .catch(err => {
//         console.error('Error fetching trucker data:', err);
//     });
    
    
//     new Swiper('.slider-wrapper', {
//       slidesPerView: 1,
//       spaceBetween: 20,
//       loop: true,
//       pagination: {
//         el: '.swiper-pagination',
//         clickable: true,
//       },
//       navigation: {
//         nextEl: '.swiper-button-next',
//         prevEl: '.swiper-button-prev',
//       },
//       breakpoints: {
//         768: {
//           slidesPerView: 2,
//         },
//         1024: {
//           slidesPerView: 3,
//         },
//       },
//     });
//   }, []);

//   const userCard = (broker) => (
//     <div className="basic-info">
//         <img src="profile.png" alt="User" className="profile-image" />
//         <h2 className="user-name">User ID: {broker.id }</h2>
        
//         <p className="user-company">Company: {broker.company}</p>
//         <p className="user-rating">Rating: {broker.rating}</p>
      
//         <button className="button">Message</button>
//         <button className="button">Request</button>
//     </div>
//   );
  
  
//   return(
//     <div className="profile-container">
//         <div className="slider-wrapper">
//             <Swiper
//                 modules={[Navigation, Pagination]}
//                 spaceBetween={30}
//                 slidesPerView={1}
//                 navigation
//                 pagination={{ clickable: true }}
//                 className="card-list"
//             >
                
                
//                 {brokers.length === 0 ? ( /*if the the list of truckers is empty*/
//                     <SwiperSlide className="card-item"> {/* Show a message when no truckers are available */}
//                         No truckers in the list
//                     </SwiperSlide>
//                 ) : (
//                     brokers.map((broker) => (
//                     <SwiperSlide key={broker.id} className="card-item">
//                         {userCard(broker)}
//                     </SwiperSlide>
//                     ))
//                 )}
            
                
                
                
                
//             </Swiper>
//         </div>
//     </div>
// );
// };

// // export default TruckerBroker;
// export default BrokersPage;
// /import React, { useEffect, useState } from 'react';
// // import Swiper from 'swiper/bundle';
// // import 'swiper/css/bundle';
// // import '../index.css';

// import React, { useEffect, useState } from 'react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination } from 'swiper/modules';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import '../index.css';


