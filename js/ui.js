/*DOM manipulation and user interactions*/

// DOM Elements
const cityForm = document.getElementById("citySearchForm");
const cityInputElement = document.getElementById("citySearch");
const cityDisplayElement = document.getElementById("cityDisplay");
const currentWeatherDescription = document.getElementById("currentWeatherDescription");
const currentWeatherIcon = document.getElementById("currentWeatherIcon");
const currentWeatherNumber = document.getElementById("currentWeatherNumber");

// Global variable for last weather data
let lastData = null;

// Event Listeners

//Event Listener for City Search
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
