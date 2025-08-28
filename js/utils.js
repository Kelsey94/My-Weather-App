// Utility functions

// Adjust font size based on city name length
function dynamicTextSize() {
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
