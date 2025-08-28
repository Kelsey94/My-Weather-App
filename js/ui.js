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

// Load saved weather data on page load
window.addEventListener('load', () => {
	const savedData = localStorage.getItem('weatherData');
	if (savedData) {
		lastData = JSON.parse(savedData);
		// Restore the display
		cityDisplayElement.textContent = lastData.name;
		const description = lastData.weather[0].description;
		const capitalizedDescription = description.charAt(0).toUpperCase() + description.slice(1);
		currentWeatherDescription.textContent = capitalizedDescription;
		
		const isFahrenheit = tempUnitToggle.checked;
		// Feels-like temperature
		const feels_likeK = lastData.main.feels_like;
		const feels_likeC = feels_likeK - 273.15;
		const feels_like = isFahrenheit ? (feels_likeC * 9/5 + 32) : feels_likeC;
		currentWeatherDescription.innerHTML += `<br> Feels like: ${Math.round(feels_like)}°${isFahrenheit ? 'F' : 'C'}`;
		
		// Current temperature
		const tempK = lastData.main.temp;
		const tempC = tempK - 273.15;
		const temp = isFahrenheit ? (tempC * 9/5 + 32) : tempC;
		currentWeatherNumber.textContent = Math.round(temp) + "°" + (isFahrenheit ? "F" : "C");
		const iconClass = getWeatherIconClass(lastData.weather[0].id, lastData.weather[0].icon);
		currentWeatherIcon.className = iconClass;
		dynamicTextSize();
		
		// Hide empty weather message
		const emptyWeatherMsg = document.getElementById("emptyWeatherMsg");
		emptyWeatherMsg.classList.add("visually-hidden");
	}
});

// Event Listeners

//Event Listener for City Search
cityForm.addEventListener("submit", (event) => {
	event.preventDefault();
	getCityObjectData();
});

// Add listener to show empty message when search input is cleared
cityInputElement.addEventListener('input', () => {
	if (!cityInputElement.value.trim()) {
		// Clear weather data and show empty message
		cityDisplayElement.textContent = '';
		currentWeatherDescription.textContent = '';
		currentWeatherNumber.textContent = '';
		currentWeatherIcon.className = 'wi display-1';
		lastData = null;
		localStorage.removeItem('weatherData');
		const emptyWeatherMsg = document.getElementById("emptyWeatherMsg");
		emptyWeatherMsg.classList.remove("visually-hidden");
	}
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


//Slide-down accordion drawer for more details with slide down animation

const accordionButton = document.getElementById("accordionButton");
accordionButton.addEventListener("click", () => {
	const accordionContent = document.getElementById("accordionContent");
	accordionContent.classList.toggle("d-none");
});