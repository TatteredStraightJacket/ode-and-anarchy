// Initialize the map
let map;
let markers = [];

function initMap() {
  // Default location (center of the map)
  const defaultLocation = { lat: -25.344, lng: 131.036 }; // Change this to your preferred default location
  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: defaultLocation,
  });

  // Load saved venues from local storage
  loadVenues();
}

// Add a venue to the map and list
function addVenue(name, address) {
  // Geocode the address to get coordinates
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: address }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;

      // Add a marker for the venue
      const marker = new google.maps.Marker({
        position: location,
        map: map,
        title: name,
      });
      markers.push(marker);

      // Add the venue to the list
      const venueList = document.getElementById("venue-list");
      const listItem = document.createElement("li");
      listItem.textContent = `${name} - ${address}`;
      venueList.appendChild(listItem);

      // Save the venue to local storage
      saveVenue(name, address, location.lat(), location.lng());
    } else {
      alert("Could not find the address. Please try again.");
    }
  });
}

// Save a venue to local storage
function saveVenue(name, address, lat, lng) {
  const venues = JSON.parse(localStorage.getItem("venues")) || [];
  venues.push({ name, address, lat, lng });
  localStorage.setItem("venues", JSON.stringify(venues));
}

// Load venues from local storage
function loadVenues() {
  const venues = JSON.parse(localStorage.getItem("venues")) || [];
  venues.forEach((venue) => {
    addVenue(venue.name, venue.address);
  });
}

// Handle form submission
document.getElementById("add-venue-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("venue-name").value;
  const address = document.getElementById("venue-address").value;
  addVenue(name, address);
  document.getElementById("add-venue-form").reset();
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