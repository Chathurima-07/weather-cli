const axios = require("axios");

// Read city name from terminal
const city = process.argv.slice(2).join(" ");

if (!city) {
  console.error("❌ Please provide a city name.");
  process.exit(1);
}

async function getWeather(city) {
  try {
    // 1️⃣ Get latitude & longitude using Geocoding API
    const geoResponse = await axios.get(
      "https://geocoding-api.open-meteo.com/v1/search",
      {
        params: {
          name: city,
          count: 1,
          language: "en",
          format: "json",
        },
      }
    );

    if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
      throw new Error("City not found.");
    }

    const { latitude, longitude, name, country } =
      geoResponse.data.results[0];

    // 2️⃣ Fetch current weather using coordinates
    const weatherResponse = await axios.get(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude,
          longitude,
          current_weather: true,
        },
      }
    );

    const { temperature, windspeed } =
      weatherResponse.data.current_weather;

    // 3️⃣ Display output
    console.log(
      `🌤️ Weather in ${name}, ${country}: ${temperature}°C, Wind ${windspeed} km/h`
    );
  } catch (error) {
    console.error(
      "⚠️ Error:",
      error.response?.data?.reason || error.message
    );
  }
}

getWeather(city);