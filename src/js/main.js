//API OpenWeather
const apiKey = '81169cf5652a98069c5713e74765afc5';
//DOM Elements
const cityInputElement = document.getElementById('citySearch');
const cityDisplayElement = document.getElementById('cityDisplay');
const currentWeatherDescription = document.getElementById('currentWeatherDescription');
const currentWeatherIcon = document.getElementById('currentWeatherIcon');
const currentWeatherNumber = document.getElementById('currentWeatherNumber');

//Search input
const cityInput = cityInputElement.value;
console.log(cityInput);



//Temperature unit toggle
const tempUnitToggle = document.getElementById('switchCheckDefault');



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