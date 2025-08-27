//API OpenWeather
const apiKey = "81169cf5652a98069c5713e74765afc5";
//DOM Elements
const cityInputElement = document.getElementById("citySearch");
const cityDisplayElement = document.getElementById("cityDisplay");
const currentWeatherDescription = document.getElementById(
	"currentWeatherDescription"
);
const currentWeatherIcon = document.getElementById("currentWeatherIcon");
const currentWeatherNumber = document.getElementById("currentWeatherNumber");

cityInputElement.addEventListener("submit", (event) => {
	event.preventDefault();
	const cityInput = cityInputElement.value;
	console.log("cityInput:", cityInput);
	async (params) => {
		const response = await fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${apiKey}`
		);
		const data = await response.json();
		console.log(data);
	};
});

//Temperature unit toggle
const tempUnitToggle = document.getElementById("switchCheckDefault");

function dynamicTextSize() {
	const textLength = cityInput.length;
	// Adjust font size based on textLength
	if (textLength < 10) {
		cityDisplayElement.style.fontSize = "42px";
	} else if (textLength >= 10 && textLength < 20) {
		cityDisplayElement.style.fontSize = "32px";
	} else {
		cityDisplayElement.style.fontSize = "22px";
	}
}
