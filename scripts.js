async function getWeather() {
    try {
        const city = document.querySelector(".city").value;
        if (!city) {
            console.error('City parameter is required');
            return;
        }

        const response = await fetch(`/getWeather?city=${city}`);
        const data = await response.json();
        displayWeatherData(data);
        const response2 = await fetch(`/getNasa`);
        const nasaData = await response2.json();
        displayNASAData(nasaData);
        const response3 = await fetch(`/getNews`);
        const newsData = await response3.json();
        displayNewsData(newsData);
    } catch (err) {
        console.error('Error:', err);
    }
}

function displayWeatherData(weatherData) {
  const weatherDiv = document.getElementById('displayWeather');

  weatherDiv.innerHTML = '';

  const cityName = document.createElement('h2');
  cityName.textContent = `City: ${weatherData.name}`;

  const temperature = document.createElement('p');
  temperature.textContent = `Temperature: ${weatherData.main.temp}°C`;

  const description = document.createElement('p');
  description.textContent = `Description: ${weatherData.weather[0].description}`;

  const feels_like = document.createElement('p');
  feels_like.textContent = `Feels like: ${weatherData.main.feels_like}`;

  const humidity = document.createElement('p');
  humidity.textContent = `Humidity: ${weatherData.main.humidity}`;

  const pressure = document.createElement('p');
  pressure.textContent = `Pressure: ${weatherData.main.pressure}`;

  const wind = document.createElement('p');
  wind.textContent = `Wind: ${weatherData.wind.speed + "m/s"}`;

  const cod = document.createElement('p');
  cod.textContent = `Cod: ${weatherData.cod}`;

  const coord = document.createElement('p');
  coord.textContent = `Coord: ${"lon: " + weatherData.coord.lon + " lat: " + weatherData.coord.lat}`;

  weatherDiv.appendChild(cityName);
  weatherDiv.appendChild(temperature);
  weatherDiv.appendChild(description);
  weatherDiv.appendChild(feels_like);
  weatherDiv.appendChild(humidity);
  weatherDiv.appendChild(pressure);
  weatherDiv.appendChild(wind);
  weatherDiv.appendChild(cod);
  weatherDiv.appendChild(coord);

  mapUpdate(weatherData.coord.lon, weatherData.coord.lat)
}

function displayNASAData(nasaData) {
  const nasaDiv = document.getElementById('displayNasa');

  if (nasaDiv) {
    nasaDiv.innerHTML = '';

    const date = document.createElement('h2');
    date.textContent = `Date: ${nasaData.data.date}`;

    const title = document.createElement('p');
    title.textContent = `Nasa Data: ${nasaData.data.title}`;

    const img = document.createElement('img');
    img.src = nasaData.data.url;
    img.alt = "Nasa Image";
    img.style.width = "40%";
    img.style.height = "20%";

    nasaDiv.appendChild(date);
    nasaDiv.appendChild(title);
    nasaDiv.appendChild(img);
  } else {
    console.error("Element with ID 'displayNasa' not found.");
  }
}

function displayNewsData(newsData) {
  const newsDiv = document.getElementById('displayNews');

  newsDiv.innerHTML = '';

  const content = document.createElement('h2');
  content.textContent = `News: ${newsData.data.articles[0].title}`;

  newsDiv.appendChild(content);
}

function mapinit() {
    var coord = { lat: 51.509865, lng: -0.118092 };
  
    var map = new google.maps.Map(document.getElementById('map'), {
      zoom: 12, 
      center: coord 
    });
  
    var mark = new google.maps.Marker({
      position: coord,
      map: map,
      title: 'my mark'
    });
  }

function mapUpdate(lon, lat) {
  var coord = { lat: lat, lng: lon };
  
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12, 
    center: coord 
  });
  
  var mark = new google.maps.Marker({
    position: coord,
    map: map,
    title: 'my mark'
  });
}