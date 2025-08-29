/*DOM manipulation and user interactions*/

// DOM Elements
const cityForm = document.getElementById("citySearchForm");
const cityInputElement = document.getElementById("citySearch");
const cityDisplayElement = document.getElementById("cityDisplay");
const currentWeatherDescription = document.getElementById(
	"currentWeatherDescription"
);
const currentWeatherIcon = document.getElementById("currentWeatherIcon");
const currentWeatherNumber = document.getElementById("currentWeatherNumber");
const accordionButtonDown = document.getElementById("accordionButtonDown");
const accordionButtonUp = document.getElementById("accordionButtonUp");

// Global variable for last weather data
let lastData = null;

// Load saved weather data on page load
window.addEventListener("load", () => {
	const savedData = localStorage.getItem("weatherData");
	if (savedData) {
		lastData = JSON.parse(savedData);
		// Restore the display
		cityDisplayElement.textContent = lastData.name;
		const description = lastData.weather[0].description;
		const capitalizedDescription =
			description.charAt(0).toUpperCase() + description.slice(1);
		currentWeatherDescription.textContent = capitalizedDescription;
		const isFahrenheit = tempUnitToggle.checked;
		const feelsLikeTemp = document.getElementById("feelsLikeTemp");
		const feels_likeK = lastData.main.feels_like;
		const feels_likeC = feels_likeK - 273.15;
		const feels_like = isFahrenheit ? (feels_likeC * 9) / 5 + 32 : feels_likeC;
		feelsLikeTemp.innerHTML = `Feels like: ${Math.round(feels_like)}°${
			isFahrenheit ? "F" : "C"
		}`;

		// Current temperature
		const tempK = lastData.main.temp;
		const tempC = tempK - 273.15;
		const temp = isFahrenheit ? (tempC * 9) / 5 + 32 : tempC;
		currentWeatherNumber.textContent =
			Math.round(temp) + "°" + (isFahrenheit ? "F" : "C");
		const iconClass = getWeatherIconClass(
			lastData.weather[0].id,
			lastData.weather[0].icon
		);
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
cityInputElement.addEventListener("input", () => {
	if (!cityInputElement.value.trim()) {
		// Clear weather data and show empty message
		cityDisplayElement.textContent = "";
		currentWeatherDescription.textContent = "";
		currentWeatherNumber.textContent = "";
		currentWeatherIcon.className = "wi display-1";
		lastData = null;
		localStorage.removeItem("weatherData");
		const emptyWeatherMsg = document.getElementById("emptyWeatherMsg");
		emptyWeatherMsg.classList.remove("visually-hidden");
	}
});

//Temperature unit toggle
const tempUnitToggle = document.getElementById("switchCheckDefault");
tempUnitToggle.addEventListener("change", () => {
	if (lastData) {
		const isFahrenheit = tempUnitToggle.checked;
		const tempK = lastData.main.temp;
		const tempC = tempK - 273.15;
		const temp = isFahrenheit ? (tempC * 9) / 5 + 32 : tempC;
		currentWeatherNumber.textContent =
			Math.round(temp) + "°" + (isFahrenheit ? "F" : "C");
		//Update Feels Like Temp
		const feelsLikeTemp = document.getElementById("feelsLikeTemp");
		const feels_likeK = lastData.main.feels_like;
		//Convert from Kelvin to Celsius
		const feels_likeC = feels_likeK - 273.15;
		//If the temperature unit is Fahrenheit, convert to Fahrenheit, otherwise keep Celsius
		const feels_like = isFahrenheit ? (feels_likeC * 9) / 5 + 32 : feels_likeC;
		feelsLikeTemp.innerHTML = `Feels like: ${Math.round(feels_like)}°${
			isFahrenheit ? "F" : "C"
		}`;
	}
});

// Create tooltip element
const tooltip = document.createElement("div");
tooltip.className = "my-tooltip-text";
tooltip.textContent = "Show more details";
tooltip.style.cssText = `
    position: absolute;
    line-height: 0.5;
    font-size: 0.9rem;
    white-space: nowrap;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
`;

// Add tooltip to the my-tooltip container
const tooltipContainer = document.querySelector(".my-tooltip");
tooltipContainer.style.position = "relative";
tooltipContainer.appendChild(tooltip);

// Show tooltip on hover
tooltipContainer.addEventListener("mouseenter", () => {
	tooltip.style.opacity = "1";
});

// Hide tooltip on mouse leave
tooltipContainer.addEventListener("mouseleave", () => {
	tooltip.style.opacity = "0";
});

// Accordion functionality
let isExpanded = false;
tooltipContainer.addEventListener("click", () => {
	isExpanded = !isExpanded;

	if (isExpanded) {
		// Show up arrow, hide down arrow
		accordionButtonDown.classList.add("d-none");
		accordionButtonUp.classList.remove("d-none");
		tooltip.textContent = "Show less details";

		// Expand the weather details section
		const moreDetail = document.getElementById("moreDetail");
		if (moreDetail) {
			moreDetail.classList.remove("d-none");
		}
	} else {
		// Show down arrow, hide up arrow
		accordionButtonDown.classList.remove("d-none");
		accordionButtonUp.classList.add("d-none");
		tooltip.textContent = "Show more details";

		// Collapse the weather details section
		const moreDetail = document.getElementById("moreDetail");
		if (moreDetail) {
			moreDetail.classList.add("d-none");
		}
	}
});
