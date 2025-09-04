// API functions

//Fetch city data
const getCityObjectData = async () => {
	const cityInput = cityInputElement.value;
	console.log(cityInput);
	//Geo-coding API: Direct Geo-coding: Takes a city name, and returns an array of cities for the user to choose from if there are multiple matches.
	try {
		const response = await fetch(
			`https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=3&appid=${apiKey}`
		);
		if (!response.ok) {
			throw new Error("City not found");
		}
		const data = await response.json();
		console.log(data);
		//The data returns an array of cities, which we store as our own array of city objects
		const cities = [];
		data.forEach((city) => {
			cities.push({
				"data.name": city.name,
				"data.state": city.state,
				"data.country": city.country,
				"data.lat": city.lat,
				"data.lon": city.lon,
			});
		});
		console.log("cities array:", cities);

		//If there is only one city, use it
		if (cities.length === 1) {
			const city = cities[0];
			cityInputElement.value = city["data.name"];
			const dropdown = document.querySelector(".dropdown");
			dropdown.classList.add("d-none");
			fetchWeather(city["data.lat"], city["data.lon"]);
		}
		// If there is more than one city, show the dropdown
		if (cities.length > 1) {
			const dropdown = document.querySelector(".dropdown");
			const cityList = document.getElementById("cityList");
			dropdown.classList.remove("d-none");
			cityList.innerHTML = ""; // Clear existing content
			cities.forEach((city) => {
				const option = document.createElement("div");
				option.innerHTML = `${city["data.name"]}${
					city["data.state"] ? ", " + city["data.state"] : ""
				}, ${city["data.country"]}`;
				option.dataset.name = city["data.name"];
				option.dataset.state = city["data.state"] || '';
				option.dataset.country = city["data.country"];
				option.dataset.lat = city["data.lat"];
				option.dataset.lon = city["data.lon"];

				//Event Listener for city selection
				option.addEventListener('click', () => {
					cityInputElement.value = option.dataset.name;
					const dropdown = document.querySelector(".dropdown");
					dropdown.classList.add("d-none");
					fetchWeather(option.dataset.lat, option.dataset.lon);
				});
				cityList.appendChild(option);
			});
		}
	} catch (error) {
		console.error(error);
		alert("Error fetching geo data: " + error.message);
	}
};

//Fetch weather data
async function fetchWeather(lat, lon) {
	try {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
		);
		if (!response.ok) {
			throw new Error("Weather data not found");
		}
		const data = await response.json();
		console.log(data);
		lastData = data;

		// Capture timestamp when data is successfully fetched
		const timestamp = new Date();
		lastData.timestamp = timestamp.getTime();

		// Save to localStorage with timezone (no timestamp needed)
		const dataToStore = {
			...data,
			timezone: data.timezone,
		};
		localStorage.setItem("weatherData", JSON.stringify(dataToStore));

		// Update DOM
		cityDisplayElement.textContent = data.name;
		const isFahrenheit = tempUnitToggle.checked;
		const description = data.weather[0].description;
		const capitalizedDescription =
			description.charAt(0).toUpperCase() + description.slice(1);
		currentWeatherDescription.textContent = capitalizedDescription;

		// Update local time for the city
		updateLocalTime(data.timezone);

		//Feels-Like Temp
		const feelsLikeTemp = document.getElementById("feelsLikeTemp");
		const feels_likeK = data.main.feels_like;
		//Convert from Kelvin to Celsius
		const feels_likeC = feels_likeK - 273.15;
		//If the temperature unit is Fahrenheit, convert to Fahrenheit, otherwise keep Celsius
		const feels_like = isFahrenheit ? (feels_likeC * 9) / 5 + 32 : feels_likeC;
		feelsLikeTemp.innerHTML = `${Math.round(feels_like)}°${
			isFahrenheit ? "F" : "C"
		}`;

		//Current Temp
		const tempK = data.main.temp;
		const tempC = tempK - 273.15;
		const temp = isFahrenheit ? (tempC * 9) / 5 + 32 : tempC;
		currentWeatherNumber.textContent =
			Math.round(temp) + "°" + (isFahrenheit ? "F" : "C");
		const iconClass = getWeatherIconClass(
			data.weather[0].id,
			data.weather[0].icon
		);
		currentWeatherIcon.className = iconClass;
		dynamicTextSize();

		// Hide empty weather message after successful data load
		const emptyWeatherMsg = document.getElementById("emptyWeatherMsg");
		emptyWeatherMsg.classList.add("visually-hidden");

		// Fetch and display UV Index
		const uvValue = await fetchUVIndex(lat, lon);
		updateUVIndex(uvValue);

		//Fetch and display relative humidity
		const humidityValue = await fetchHumidity(lat, lon);
		updateHumidityDisplay(humidityValue);

		// Fetch and display 3 day forecast
		const forecastData = await fetch3DayForecast(lat, lon);
		updateForecast(forecastData);

	} catch (error) {
		console.error(error);
		alert("Error fetching weather data: " + error.message);

		// Show empty weather message on error
		const emptyWeatherMsg = document.getElementById("emptyWeatherMsg");
		emptyWeatherMsg.classList.remove("visually-hidden");
	}
}

// Calculate and display local time for the city
function updateLocalTime(timezoneOffset) {
	const localTimeElement = document.getElementById('localTime');

	if (timezoneOffset !== undefined && timezoneOffset !== null) {
		// Get current UTC time
		const now = new Date();

		// Calculate local time by adding timezone offset (in seconds)
		const localTime = new Date(now.getTime() + (timezoneOffset * 1000));

		// Format the time
		const timeOptions = {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
			timeZone: 'UTC'
		};

		const dateOptions = {
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC'
		};

		// Format time and date separately to match user's preferred format
		const timeString = localTime.toLocaleTimeString('en-US', timeOptions);
		const dateString = localTime.toLocaleDateString('en-US', dateOptions);

		localTimeElement.textContent = `${timeString} ${dateString}`;
		localTimeElement.classList.remove('d-none');
	} else {
		localTimeElement.textContent = 'Local time unavailable';
		localTimeElement.classList.add('text-muted');
	}
}

//Fetch UV Index data
async function fetchUVIndex(lat, lon) {
	try {
		const response = await fetch(`https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`);
		if (!response.ok) {
			throw new Error('UV Index data not found');
		}
		const data = await response.json();
		console.log('UV Index data:', data);
		return data.value;
	} catch (error) {
		console.error('Error fetching UV Index:', error);
		return null;
	}
}

// Update UV Index display and slider
function updateUVIndex(uvValue) {
	const uvNumberElement = document.getElementById('uv-index-num');
	const uvSummaryElement = document.getElementById('uv-index-summary');
	const uvRangeSlider = document.getElementById('uv-index-range');

	if (uvValue !== null && uvValue !== undefined) {
		// Update the UV Index number rounded to the nearest integer
		uvNumberElement.textContent = Math.round(uvValue);

		// Update slider value
		uvRangeSlider.value = Math.min(uvValue, 13); // Cap at 13 for display

		// Update summary text based on UV Index level
		let category = '';
		let color = '';

		if (uvValue <= 2.9) {
			category = 'Low';
			color = '#4bc67d'; // Green
		} else if (uvValue <= 5.9) {
			category = 'Moderate';
			color = '#f1c40f'; // Yellow
		} else if (uvValue <= 7.9) {
			category = 'High';
			color = '#e67e22'; // Orange
		} else if (uvValue <= 10.9) {
			category = 'Very High';
			color = '#b94a48'; // Red
		} else {
			category = 'Extreme';
			color = '#8e44ad'; // Purple
		}

		uvSummaryElement.textContent = category;
	} else {
		// Handle case where UV data is not available
		uvNumberElement.textContent = 'N/A';
		uvSummaryElement.textContent = 'Not Available';
		uvSummaryElement.style.color = '#6c757d';
		uvRangeSlider.value = 0;
	}
}

//Fetch Relative Humidity
async function fetchHumidity(lat, lon) {
	try {
		const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
		if (!response.ok) {
			throw new Error('Humidity data not found');
		}
		const data = await response.json();
		console.log('Humidity data:', data);
		return data.main.humidity;
	} catch (error) {
		console.error('Error fetching humidity:', error);
		return null;
	}
}

//Update Relative Humidity display and slider
function updateHumidityDisplay(humidityValue) {
	const humidityNumberElement = document.getElementById('humidity-num');
	const humiditySummaryElement = document.getElementById('humidity-summary');
	const humidityRangeSlider = document.getElementById('humidity-range');

	if (humidityValue !== null && humidityValue !== undefined) {
		// Update the humidity number
		humidityNumberElement.textContent = `${humidityValue}%`;

		// Update slider value
		humidityRangeSlider.value = Math.min(humidityValue, 100); // Cap at 100 for display

		// Update summary text based on humidity level
		let category = '';
		let color = '';

		if (humidityValue <= 30) {
			category = 'Low';
		} else if (humidityValue <= 60) {
			category = 'Moderate';
		} else if (humidityValue <= 80) {
			category = 'High';
		} else if (humidityValue > 100) {
			category = 'Very High';
			color = '#b94a48'; // Red
		}

		humiditySummaryElement.textContent = category;
	} else {
		// Handle case where humidity data is not available
		humidityNumberElement.textContent = 'N/A';
		humiditySummaryElement.textContent = 'Not Available';
		humiditySummaryElement.style.color = '#6c757d';
		humidityRangeSlider.value = 0;
	}
}

//Fetch 3 day Forecast
async function fetch3DayForecast(lat, lon) {
	try {
		const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`);
		if (!response.ok) {
			throw new Error('3 day forecast data not found');
		}
		const data = await response.json();
		console.log('3 day forecast data:', data);
		return data.list;
	} catch (error) {
		console.error('Error fetching 3 day forecast:', error);
		return null;
	}
}

//Update Forecast
function updateForecast(forecastData) {
	const forecastContainer = document.getElementById('forecast');
	forecastContainer.innerHTML = ''; // Clear previous forecast

	if (forecastData && Array.isArray(forecastData)) {
		forecastData.forEach((item) => {
			const forecastItem = document.createElement('div');
			forecastItem.classList.add('forecast-item');

			// Format date
			const date = new Date(item.dt * 1000);
			const dateString = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

			// Get weather icon class
			const iconClass = getWeatherIconClass(item.weather[0].id, item.weather[0].icon);

			forecastItem.innerHTML = `
				<div class="forecast-date">${dateString}</div>
				<div class="forecast-icon ${iconClass}"></div>
				<div class="forecast-temp">${Math.round(item.main.temp - 273.15)}°C</div>
			`;

			forecastContainer.appendChild(forecastItem);
		});
	} else {
		forecastContainer.innerHTML = '<p>No forecast data available</p>';
	}
}

// Calculate and display local time for the city
function updateLocalTime(timezoneOffset) {
	const localTimeElement = document.getElementById('localTime');

	if (timezoneOffset !== undefined && timezoneOffset !== null) {
		// Get current UTC time
		const now = new Date();

		// Calculate local time by adding timezone offset (in seconds)
		const localTime = new Date(now.getTime() + (timezoneOffset * 1000));

		// Format the time
		const timeOptions = {
			hour: 'numeric',
			minute: '2-digit',
			hour12: true,
			timeZone: 'UTC'
		};

		const dateOptions = {
			month: 'short',
			day: 'numeric',
			timeZone: 'UTC'
		};

		// Format time and date separately to match user's preferred format
		const timeString = localTime.toLocaleTimeString('en-US', timeOptions);
		const dateString = localTime.toLocaleDateString('en-US', dateOptions);

		localTimeElement.textContent = `${timeString} ${dateString}`;
		localTimeElement.classList.remove('d-none');
	} else {
		localTimeElement.textContent = 'Local time unavailable';
		localTimeElement.classList.add('text-muted');
	}
}
