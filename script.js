const API_KEY = "168592d2455546daa5483324262504";

async function getWeather(location) {
    try {
        const response = await fetch(
            `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${location}&aqi=no`,
        );

        if (!response.ok) {
            throw new Error("Location not found");
        }

        const data = await response.json();
        console.log("RAW API DATA:", data);

        return data;
    } catch (error) {
        console.error("Error:", error);
        alert("Could not find that location. Try another city.");
    }
}

function processWeatherData(data) {
    return {
        city: data.location.name,
        country: data.location.country,
        temp: data.current.temp_c,
        feelsLike: data.current.feelslike_c,
        condition: data.current.condition.text,
        icon: data.current.condition.icon,
        humidity: data.current.humidity,
        wind: data.current.wind_kph,
    };
}

function displayWeather(weatherObj) {
    const weatherDisplay = document.getElementById("weatherDisplay");

    weatherDisplay.style.display = "block";

    weatherDisplay.innerHTML = `
    <h2>${weatherObj.city}, ${weatherObj.country}</h2>
    <img src="https:${weatherObj.icon}" alt="weather icon" />
    <p><strong>Temperature:</strong> ${weatherObj.temp}°C</p>
    <p><strong>Feels Like:</strong> ${weatherObj.feelsLike}°C</p>
    <p><strong>Condition:</strong> ${weatherObj.condition}</p>
    <p><strong>Humidity:</strong> ${weatherObj.humidity}%</p>
    <p><strong>Wind:</strong> ${weatherObj.wind} kph</p>
  `;
}

const form = document.getElementById("weatherForm");
const input = document.getElementById("locationInput");
const loadingDiv = document.getElementById("loading");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    loadingDiv.classList.remove("hidden");

    const location = input.value;

    const rawData = await getWeather(location);

    if (rawData) {
        const processedData = processWeatherData(rawData);
        console.log("PROCESSED DATA:", processedData);
        displayWeather(processedData);
    }

    loadingDiv.classList.add("hidden");
});