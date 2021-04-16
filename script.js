const API_KEY = 'at_RTZGTfJNowjO2VAoYuYsLcY8M0bq7';
const input = document.querySelector('.header__form-input');
const ipData = document.querySelector('.result__ip p');
const locationData = document.querySelector('.result__location p');
const timezoneData = document.querySelector('.result__timezone p');
const ispData = document.querySelector('.result__isp p');
const btnSubmit = document.querySelector('.header__form-submit');
const map = L.map('map');

// display client IP address on page load
const displayClientIP = async () => {
  const res = await fetch('https://api.ipify.org?format=json');
  const data = await res.json();
  const clientIP = data.ip;

  input.value = clientIP;
  checkInput(clientIP);
};
displayClientIP();

// listen for button click and fetch location data
btnSubmit.addEventListener('click', e => {
  e.preventDefault();

  input.value
    ? checkInput(input.value)
    : alert('Please enter a valid IP Address or Domain.');
});

// check if user input is an IP address or a domain
const checkInput = value => {
  const domainFormat = /^(?!\-)([a-zA-Z0-9 \-?]{2,63})\.([a-zA-Z]{2,10})(.[a-z]{2,4})?$/;
  const ipFormat = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

  if (value.match(domainFormat)) {
    fetchData(value, 'domain');
  } else if (value.match(ipFormat)) {
    fetchData(value, 'ipAddress');
  } else {
    alert('Invalid input. Please enter a valid IP Address or Domain.');
  }
};

// fetch location data based on user input and generate info and map
const fetchData = async (value, type) => {
  try {
    const url = `https://geo.ipify.org/api/v1?apiKey=${API_KEY}&${type}=${value}`;
    const res = await fetch(url);
    const data = await res.json();
    generateResults(data);
    generateMap(data);
  } catch (err) {
    console.log(err);
  }
};

// generate location info
const generateResults = data => {
  const ip = data.ip;
  const loc = `${data.location.city}, ${data.location.region} ${data.location.postalCode}`;
  const timezone = `UTC ${data.location.timezone}`;
  const isp = data.isp;

  ipData.textContent = ip;
  locationData.textContent = loc;
  timezoneData.textContent = timezone;
  ispData.textContent = isp;
};

// generate map
const generateMap = data => {
  const markerIcon = L.icon({
    iconUrl: 'images/icon-location.svg',
  });

  map.setView([data.location.lat, data.location.lng], 15);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  L.marker([data.location.lat, data.location.lng], { icon: markerIcon }).addTo(
    map
  );
};
