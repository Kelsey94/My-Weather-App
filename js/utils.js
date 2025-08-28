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

// Get the appropriate weather icon class based on weather condition ID and icon code
const getWeatherIconClass = (id, icon) => {
  //error handling
  if (typeof icon !== 'string' || !icon.endsWith('d') && !icon.endsWith('n')) {
    console.error('Invalid icon code:', icon);
    return ''; // Return an empty string for invalid icon codes
  }
  //if the icon name ends with 'd', it's a day icon. isDay will be true
	const isDay = icon.endsWith('d');
  //if isDay is true, use the day icon prefix, otherwise use the night icon prefix
	const prefix = isDay ? 'wi-owm-day-' : 'wi-owm-night-';
  //The class for the weather icon is constructed by combining "wi "(weather icons) plus the prefix, plus the weather condition ID
	return 'wi ' + prefix + id;
};
