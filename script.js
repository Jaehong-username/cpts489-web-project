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

// -------------- Load Board -------------- //

function loadLoadsFromFile() {
    fetch('loads.json')
        .then(response => response.json())
        .then(data => {
            // data is an array of loads
            const tableBody = document.querySelector('#loadTable tbody');
            if (tableBody) {
                tableBody.innerHTML = "";
                data.forEach(load => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
            <td>${load.loadId}</td>
            <td>${load.commodity}</td>
            <td>${load.weight}</td>
            <td>${load.dimensions}</td>
            <td>${load.equipment}</td>
            <td>${load.origin}</td>
            <td>${load.destination}</td>
            <td>${load.rate}</td>
          `;
                    tableBody.appendChild(row);
                });
            }
        })
        .catch(error => console.error('Error loading JSON:', error));
}


// -------------- Add Load Form -------------- //
function handleFormSubmit(e) {
  e.preventDefault();

  const load = {
    loadId: document.getElementById('loadId').value,
    commodity: document.getElementById('commodity').value,
    weight: document.getElementById('weight').value,
    dimensions: document.getElementById('dimensions').value,
    equipment: document.getElementById('equipment').value,
    origin: document.getElementById('origin').value,
    destination: document.getElementById('destination').value,
    rate: document.getElementById('rate').value
  };

  let loads = JSON.parse(localStorage.getItem('loads')) || [];
  loads.push(load);
  localStorage.setItem('loads', JSON.stringify(loads));

  // Redirect back to the load board page
  window.location.href = 'index.html';
}

// -------------- Page Initialization -------------- //
window.addEventListener('DOMContentLoaded', function() {
  // If we're on the load board page, display loads
  if (document.querySelector('#loadTable')) {
    loadLoads();
  }

  // If we're on the add_load page, attach the form listener
  const loadForm = document.getElementById('loadForm');
  if (loadForm) {
    loadForm.addEventListener('submit', handleFormSubmit);
  }
});