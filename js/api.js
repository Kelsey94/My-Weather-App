// API functions

//Fetch city data
const getCityObjectData = async () => {
	const cityInput = cityInputElement.value;
	console.log(cityInput);
	//Geo-coding API: Direct Geo-coding: Takes a city name, and returns an array of cities for the user to choose from if there are multiple matches.
	try {
		const response = await fetch(
			`http://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=3&appid=${apiKey}`
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
		const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
		if (!response.ok) {
			throw new Error('Weather data not found');
		}
		const data = await response.json();
		console.log(data);
		lastData = data;
		// Save to localStorage for persistence
		localStorage.setItem('weatherData', JSON.stringify(data));
		// Update DOM
		cityDisplayElement.textContent = data.name;
    const isFahrenheit = tempUnitToggle.checked;
		const description = data.weather[0].description;
		const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);
		currentWeatherDescription.textContent = capitalizedDescription;

    //Feels-Like Temp
		const feelsLikeTemp = document.getElementById('feelsLikeTemp');
    const feels_likeK = data.main.feels_like;
    //Convert from Kelvin to Celsius
    const feels_likeC = feels_likeK - 273.15;
    //If the temperature unit is Fahrenheit, convert to Fahrenheit, otherwise keep Celsius
    const feels_like = isFahrenheit ? (feels_likeC * 9/5 + 32) : feels_likeC;
    feelsLikeTemp.innerHTML = `${Math.round(feels_like)}°${isFahrenheit ? 'F' : 'C'}`;

    //Current Temp
		const tempK = data.main.temp;
		const tempC = tempK - 273.15;
		const temp = isFahrenheit ? (tempC * 9/5 + 32) : tempC;
		currentWeatherNumber.textContent = Math.round(temp) + '°' + (isFahrenheit ? 'F' : 'C');
		const iconClass = getWeatherIconClass(data.weather[0].id, data.weather[0].icon);
		currentWeatherIcon.className = iconClass;
		dynamicTextSize();
		
		// Hide empty weather message after successful data load
		const emptyWeatherMsg = document.getElementById("emptyWeatherMsg");
		emptyWeatherMsg.classList.add("visually-hidden");

		// Fetch and display UV Index
		const uvValue = await fetchUVIndex(lat, lon);
		updateUVIndex(uvValue);
	} catch (error) {
		console.error(error);
		alert('Error fetching weather data: ' + error.message);
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
	const uvSummaryElement = document.querySelector('.uv-index-summary');
	const rangeSlider = document.getElementById('range-slider');

	if (uvValue !== null && uvValue !== undefined) {
		// Update the UV Index number
		uvNumberElement.textContent = uvValue.toFixed(1);

		// Update slider value
		rangeSlider.value = Math.min(uvValue, 13); // Cap at 13 for display

		// Update summary text based on UV Index level
		let category = '';
		let color = '';

		if (uvValue <= 2) {
			category = 'Low';
			color = '#4bc67d'; // Green
		} else if (uvValue <= 5) {
			category = 'Moderate';
			color = '#f1c40f'; // Yellow
		} else if (uvValue <= 7) {
			category = 'High';
			color = '#e67e22'; // Orange
		} else if (uvValue <= 10) {
			category = 'Very High';
			color = '#b94a48'; // Red
		} else {
			category = 'Extreme';
			color = '#8e44ad'; // Purple
		}

		uvSummaryElement.textContent = category;
		uvSummaryElement.style.color = color;
		uvSummaryElement.style.fontWeight = 'bold';
	} else {
		// Handle case where UV data is not available
		uvNumberElement.textContent = 'N/A';
		uvSummaryElement.textContent = 'Not Available';
		uvSummaryElement.style.color = '#6c757d';
		rangeSlider.value = 0;
	}
}
