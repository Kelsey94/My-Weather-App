



//DOM Elements

//Search bar
const cityInputElement = document.getElementById('citySearch');

//Search input
const cityInput = cityInputElement.value;

//Temperature unit toggle
const tempUnitToggle = document.getElementById('switchCheckDefault');

//City Name Display
const cityDisplayElement = document.getElementById('cityDisplay');

//Current weather - Description
const currentWeatherDescription = document.getElementById('currentWeatherDescription');

//Current Weather - Icon
const currentWeatherIcon = document.getElementById('currentWeatherIcon');

//Current weather - Number
const currentWeatherNumber = document.getElementById('currentWeatherNumber');



function dynamicTextSize() {
  const textLength = cityInput.length;
  // Adjust font size based on textLength
  if (textLength < 10) {
    cityDisplayElement.style.fontSize = '42px';
  } else if (textLength >= 10 && textLength < 20) {
    cityDisplayElement.style.fontSize = '32px';
  } else {
    cityDisplayElement.style.fontSize = '22px';
  }
}