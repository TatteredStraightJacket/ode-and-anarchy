// Initialize Map Function
function initEventMap() {
  // Check if we're on the events page
  if (!document.getElementById('event-map')) return;

  // Create the map centered on a default location
  const map = L.map('event-map').setView([51.505, -0.09], 13);

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Fetch events from Firebase
  db.collection('events')
    .where('approved', '==', true)
    .where('date', '>=', new Date())
    .orderBy('date')
    .get()
    .then((querySnapshot) => {
      const events = [];
      const markers = [];
      
      querySnapshot.forEach((doc) => {
        const event = doc.data();
        events.push(event);
        
        // Get coordinates (you'll need to store these in your events)
        if (event.location && event.location.lat && event.location.lng) {
          const marker = L.marker([event.location.lat, event.location.lng])
            .addTo(map)
            .bindPopup(`
              <h3>${event.name}</h3>
              <p>${new Date(event.date.seconds * 1000).toLocaleDateString()}</p>
              <p>${event.location.address || ''}</p>
              ${event.ticketLink ? `<a href="${event.ticketLink}" target="_blank">Get Tickets</a>` : ''}
            `);
            
          // Style markers based on event type
          if (event.type === 'music') {
            marker.setIcon(getCustomIcon('#8b0000'));
          } else if (event.type === 'poetry') {
            marker.setIcon(getCustomIcon('#b22222'));
          } else {
            marker.setIcon(getCustomIcon('#ff5500'));
          }
          
          markers.push(marker);
        }
      });
      
      // Fit map to show all markers
      if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.2));
      }
    })
    .catch((error) => {
      console.error("Error loading events:", error);
    });

  // Custom marker icons
  function getCustomIcon(color) {
    return L.divIcon({
      className: 'custom-marker',
      html: `<svg viewBox="0 0 24 24" width="24" height="24" fill="${color}">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>`,
      iconSize: [24, 24],
      iconAnchor: [12, 24]
    });
  }
}

// Call this after Firebase initialization
auth.onAuthStateChanged(() => {
  initEventMap();
});

{
  name: "Metal Night",
  date: firebase.firestore.Timestamp.fromDate(new Date("2025-06-15")),
  location: {
    address: "123 Venue St, City",
    lat: 51.505, // Latitude
    lng: -0.09   // Longitude
  },
  type: "music", // "music", "poetry", or "art"
  ticketLink: "https://tickets.example.com"
}

// Add geocoding function to convert addresses to coordinates
async function geocodeAddress(address) {
  const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const data = await response.json();
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      address: address
    };
  }
  return null;
}

// Use in your form submission
const location = await geocodeAddress(document.getElementById('eventLocation').value);
if (location) {
  eventData.location = location;
}