console.log("JS is connected");

//API OpenWeather
const apiKey = "81169cf5652a98069c5713e74765afc5";

//DOM Elements
const cityForm = document.getElementById("citySearchForm");
const cityInputElement = document.getElementById("citySearch");
const cityDisplayElement = document.getElementById("cityDisplay");
const currentWeatherDescription = document.getElementById("currentWeatherDescription");
const currentWeatherIcon = document.getElementById("currentWeatherIcon");
const currentWeatherNumber = document.getElementById("currentWeatherNumber");

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

async function fetchWeather(lat, lon) {
	try {
		const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
		if (!response.ok) {
			throw new Error('Weather data not found');
		}
		const data = await response.json();
		console.log(data);
		lastData = data;
		// Update DOM
		cityDisplayElement.textContent = data.name;
		currentWeatherDescription.textContent = data.weather[0].description;
		const isFahrenheit = tempUnitToggle.checked;
		const tempK = data.main.temp;
		const tempC = tempK - 273.15;
		const temp = isFahrenheit ? (tempC * 9/5 + 32) : tempC;
		currentWeatherNumber.textContent = Math.round(temp) + '°' + (isFahrenheit ? 'F' : 'C');
		const iconClass = getWeatherIconClass(data.weather[0].id, data.weather[0].icon);
		currentWeatherIcon.className = iconClass;
		dynamicTextSize();
	} catch (error) {
		console.error(error);
		alert('Error fetching weather data: ' + error.message);
	}
}

//Event Listener for City Name
cityForm.addEventListener("submit", (event) => {
	event.preventDefault();
	getCityObjectData();
});

//Temperature unit toggle
const tempUnitToggle = document.getElementById("switchCheckDefault");

tempUnitToggle.addEventListener('change', () => {
	if (lastData) {
		const isFahrenheit = tempUnitToggle.checked;
		const tempK = lastData.main.temp;
		const tempC = tempK - 273.15;
		const temp = isFahrenheit ? (tempC * 9/5 + 32) : tempC;
		currentWeatherNumber.textContent = Math.round(temp) + "°" + (isFahrenheit ? "F" : "C");
	}
});

function dynamicTextSize() {
	// Adjust font size based on city name length
	
	const textLength = cityInputElement.value.length;

	if (textLength < 10) {
		cityDisplayElement.style.fontSize = "42px";
	} else if (textLength >= 10 && textLength < 20) {
		cityDisplayElement.style.fontSize = "32px";
	} else {
		cityDisplayElement.style.fontSize = "22px";
	}
}

const getWeatherIconClass = (id, icon) => {
	const isDay = icon.endsWith('d');
	const prefix = isDay ? 'wi-owm-day-' : 'wi-owm-night-';
	return 'wi ' + prefix + id;
};

let lastData = null;
