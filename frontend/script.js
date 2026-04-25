let isCelsius = true;
let lastWeatherData = null;

async function getWeather(location) {
    try {
        const response = await fetch(`http://localhost:3000/weather?location=${location}`);

        if (!response.ok) {
            throw new Error("Location not found");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        alert("Could not find that location.");
        console.error(error);
    }
}

function processWeatherData(data) {
    return {
        city: data.location.name,
        country: data.location.country,

        current: {
            temp_c: data.current.temp_c,
            temp_f: data.current.temp_f,
            feelslike_c: data.current.feelslike_c,
            feelslike_f: data.current.feelslike_f,
            condition: data.current.condition.text,
            icon: data.current.condition.icon,
            humidity: data.current.humidity,
            wind_kph: data.current.wind_kph,
        },

        forecast: data.forecast.forecastday.map((day) => ({
            date: day.date,
            max_c: day.day.maxtemp_c,
            max_f: day.day.maxtemp_f,
            min_c: day.day.mintemp_c,
            min_f: day.day.mintemp_f,
            condition: day.day.condition.text,
            icon: day.day.condition.icon,
        })),
    };
}

function setBackground(condition) {
    condition = condition.toLowerCase();

    if (condition.includes("sunny") || condition.includes("clear")) {
        document.body.style.background = "linear-gradient(to right, #fceabb, #f8b500)";
    } else if (condition.includes("cloud")) {
        document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
    } else if (condition.includes("rain") || condition.includes("drizzle")) {
        document.body.style.background = "linear-gradient(to right, #4e54c8, #8f94fb)";
    } else if (condition.includes("snow")) {
        document.body.style.background = "linear-gradient(to right, #e6dada, #274046)";
    } else if (condition.includes("storm") || condition.includes("thunder")) {
        document.body.style.background = "linear-gradient(to right, #141e30, #243b55)";
    } else {
        document.body.style.background = "linear-gradient(to right, #74ebd5, #9face6)";
    }
}

function displayWeather(weatherObj) {
    const weatherDisplay = document.getElementById("weatherDisplay");

    const temp = isCelsius ? weatherObj.current.temp_c : weatherObj.current.temp_f;
    const feelsLike = isCelsius
        ? weatherObj.current.feelslike_c
        : weatherObj.current.feelslike_f;

    const unit = isCelsius ? "°C" : "°F";

    weatherDisplay.innerHTML = `
    <h2>${weatherObj.city}, ${weatherObj.country}</h2>
    <img src="https:${weatherObj.current.icon}" alt="weather icon" />
    <p><strong>Temperature:</strong> ${temp}${unit}</p>
    <p><strong>Feels Like:</strong> ${feelsLike}${unit}</p>
    <p><strong>Condition:</strong> ${weatherObj.current.condition}</p>
    <p><strong>Humidity:</strong> ${weatherObj.current.humidity}%</p>
    <p><strong>Wind:</strong> ${weatherObj.current.wind_kph} kph</p>
  `;

    weatherDisplay.classList.remove("hidden");
}

function displayForecast(weatherObj) {
    const forecastDisplay = document.getElementById("forecastDisplay");
    const forecastTitle = document.getElementById("forecastTitle");

    forecastDisplay.innerHTML = "";

    weatherObj.forecast.forEach((day) => {
        const maxTemp = isCelsius ? day.max_c : day.max_f;
        const minTemp = isCelsius ? day.min_c : day.min_f;
        const unit = isCelsius ? "°C" : "°F";

        const card = document.createElement("div");
        card.classList.add("forecast-day");

        card.innerHTML = `
      <h4>${day.date}</h4>
      <img src="https:${day.icon}" alt="forecast icon" />
      <p>${day.condition}</p>
      <p><strong>Max:</strong> ${maxTemp}${unit}</p>
      <p><strong>Min:</strong> ${minTemp}${unit}</p>
    `;

        forecastDisplay.appendChild(card);
    });

    forecastTitle.classList.remove("hidden");
    forecastDisplay.classList.remove("hidden");
}

const form = document.getElementById("weatherForm");
const input = document.getElementById("locationInput");
const loadingDiv = document.getElementById("loading");
const toggleBtn = document.getElementById("toggleUnit");
const toggleBox = document.getElementById("toggleBox");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    loadingDiv.classList.remove("hidden");

    const location = input.value;
    const rawData = await getWeather(location);

    if (rawData) {
        lastWeatherData = processWeatherData(rawData);

        setBackground(lastWeatherData.current.condition);
        displayWeather(lastWeatherData);
        displayForecast(lastWeatherData);

        toggleBox.classList.remove("hidden");
    }

    loadingDiv.classList.add("hidden");
});

toggleBtn.addEventListener("click", () => {
    if (!lastWeatherData) return;

    isCelsius = !isCelsius;

    displayWeather(lastWeatherData);
    displayForecast(lastWeatherData);
});