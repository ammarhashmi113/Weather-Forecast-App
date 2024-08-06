document.getElementById('getWeatherBtn').addEventListener('click', function() {
    const location = document.getElementById('locationInput').value;
    if (location) {
        fetchWeather(location);
    } else {
        showError('Please enter a location');
    }
});

document.getElementById('getCurrentLocationBtn').addEventListener('click', function() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoordinates(lat, lon);
        });
    } else {
        showError('Geolocation is not supported by this browser.');
    }
});

document.getElementById('unitToggle').addEventListener('change', function() {
    const isFahrenheit = this.checked;
    const tempElement = document.getElementById('temperature');
    const temp = parseFloat(tempElement.textContent);
    if (isFahrenheit) {
        tempElement.textContent = (temp * 9/5 + 32).toFixed(2);
    } else {
        tempElement.textContent = ((temp - 32) * 5/9).toFixed(2);
    }
});

function fetchWeather(location) {
    const apiKey = '3fadb214e335ca7ffd72544c8085f582';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                fetchForecast(location);
                fetchHourlyForecast(location);
            } else {
                showError('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            showError('An error occurred while fetching the weather data');
        });
}

function fetchWeatherByCoordinates(lat, lon) {
    const apiKey = '3fadb214e335ca7ffd72544c8085f582';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                displayWeather(data);
                fetchForecast(data.name);
                fetchHourlyForecast(data.name);
            } else {
                showError('Location not found');
            }
        })
        .catch(error => {
            console.error('Error fetching the weather data:', error);
            showError('An error occurred while fetching the weather data');
        });
}

function fetchForecast(location) {
    const apiKey = '3fadb214e335ca7ffd72544c8085f582';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                displayForecast(data);
            } else {
                showError('Forecast not available');
            }
        })
        .catch(error => {
            console.error('Error fetching the forecast data:', error);
            showError('An error occurred while fetching the forecast data');
        });
}

function fetchHourlyForecast(location) {
    const apiKey = '3fadb214e335ca7ffd72544c8085f582';
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                displayHourlyForecast(data);
            } else {
                showError('Hourly forecast not available');
            }
        })
        .catch(error => {
            console.error('Error fetching the hourly forecast data:', error);
            showError('An error occurred while fetching the hourly forecast data');
        });
}

function displayWeather(data) {
    document.getElementById('locationName').textContent = data.name;
    document.getElementById('weatherDescription').textContent = data.weather[0].description;
    document.getElementById('temperature').textContent = `${data.main.temp}°C`;
    document.getElementById('humidity').textContent = `Humidity: ${data.main.humidity}%`;
    document.getElementById('weatherIcon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

    document.getElementById('weatherResult').classList.remove('d-none');
    document.getElementById('errorMessage').classList.add('d-none');
}

function displayForecast(data) {
    const forecastContainer = document.getElementById('forecastContainer');
    forecastContainer.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) {
        const forecast = data.list[i];
        const forecastElement = document.createElement('div');
        forecastElement.className = 'forecast-card col-md-2';
        forecastElement.innerHTML = `
            <p>${new Date(forecast.dt * 1000).toLocaleDateString()}</p>
            <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png" alt="Weather Icon">
            <p>${forecast.weather[0].description}</p>
            <p>${forecast.main.temp}°C</p>
        `;
        forecastContainer.appendChild(forecastElement);
    }
    document.getElementById('forecastResult').classList.remove('d-none');
}

function displayHourlyForecast(data) {
    const hourlyForecastContainer = document.getElementById('hourlyForecastContainer');
    hourlyForecastContainer.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 1) {
        const hourly = data.list[i];
        const hourlyElement = document.createElement('div');
        hourlyElement.className = 'hourly-card col-md-1';
        hourlyElement.innerHTML = `
            <p>${new Date(hourly.dt * 1000).toLocaleTimeString()}</p>
            <img src="http://openweathermap.org/img/wn/${hourly.weather[0].icon}.png" alt="Weather Icon">
            <p>${hourly.weather[0].description}</p>
            <p>${hourly.main.temp}°C</p>
        `;
        hourlyForecastContainer.appendChild(hourlyElement);
    }
    document.getElementById('hourlyForecastResult').classList.remove('d-none');
}

function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorMessage.classList.remove('d-none');
}
