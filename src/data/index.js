const url = "http://api.weatherapi.com/v1";

const apiKey = process.env.REACT_APP_WEATHER_API;

const location = "New Delhi";

const apiUrl = `http://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${location}`;

export { apiUrl };
