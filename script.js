const swiper = new Swiper('.slider-wrapper', {
    // Optional parameters
    //direction: 'vertical',
    loop: true,
    grabCursor: true,
    spaceBetween: true,
    
    // If we need pagination
    pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: true
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    
    breakpoints: {
        0: {
            slidePerView:1
        },
        620: {
            slidePerView:2
        },
        1024: {
            slidePerView:3
        },
    }
    
    // And if we need scrollbar
    //scrollbar: {
    //  el: '.swiper-scrollbar',
    // /},
  });