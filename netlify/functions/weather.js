exports.handler = async (event, context) => {
	const { endpoint, cityInput, lat, lon } = event.queryStringParameters;
	const API_KEY = process.env.OPENWEATHER_API_KEY;

	if (!API_KEY) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "API key not configured" }),
		};
	}

	let url;

	// Route to different OpenWeather endpoints based on the request
	switch (endpoint) {
		case "current":
			url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
			break;
		case "forecast":
			url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
			break;
		case "uvi":
			url = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
			break;
		case "onecall":
			url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly&appid=${API_KEY}&units=metric`;
			break;
		case "geo":
			url = `https://api.openweathermap.org/geo/1.0/direct?q=${cityInput}&limit=3&appid=${API_KEY}`;
			break;
		default:
			return {
				statusCode: 400,
				body: JSON.stringify({ error: "Invalid endpoint specified" }),
			};
	}

	try {
		const response = await fetch(url);
		const data = await response.json();

		return {
			statusCode: 200,
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: "Failed to fetch data from OpenWeather" }),
		};
	}
};
