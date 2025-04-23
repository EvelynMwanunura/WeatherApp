function updateWeather(response) {
  let temperatureElement = document.getElementById("currenttemperature");
  let descriptionElement = document.getElementById("description");
  let windElement = document.getElementById("wind");
  let humidityElement = document.getElementById("humidity");
  let dateElement = document.getElementById("date");
  let cityElement = document.getElementById("city");
  let iconElement = document.getElementById("icon");

  let time = new Date(response.data.time * 1000);
  temperatureElement.innerHTML = Math.round(response.data.temperature.current);
  descriptionElement.innerHTML = response.data.condition.description;
  windElement.innerHTML = response.data.wind.speed;
  humidityElement.innerHTML = response.data.temperature.humidity;
  dateElement.innerHTML = formatDate(time);
  iconElement.innerHTML = `<img src="${response.data.condition.icon_url}" class="iconimg" />`;

  cityElement.innerHTML = response.data.city;
  getForecast(response.data.city);
}
function formatDate(time) {
  let minutes = time.getMinutes();
  let hours = time.getHours();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  let day = days[time.getDay()];
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${day} ${hours}:${minutes}`;
}
function searchCity(city) {
  let apiKey = "98c6908928o398at73a4fcd4bb2e4180";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}`;
  axios
    .get(apiUrl)
    .then(updateWeather)
    .catch((error) => console.error("Error fetching weather data:", error));
}
function handleSearchSubmit(event) {
  event.preventDefault();
  let searchInput = document.getElementById("search");
  let cityName = searchInput.value.trim() || "Cape Town";
  searchCity(cityName);
}

function getForecast(city) {
  let apiKey = "98c6908928o398at73a4fcd4bb2e4180";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?query=${city}&key=${apiKey}`;
  axios(apiUrl).then(displayForecast);
}
function displayForecast(response) {
  let forecastElement = document.getElementById("forecast");
  let forecastHtml = "";

  let now = new Date();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];

  response.data.daily.slice(0, 5).forEach(function (day, index) {
    let dayIndex = (now.getDay() + index + 1) % 7;
    let dayName = days[dayIndex];

    forecastHtml += `
      <div class="forecastd">
        <div class="hour">${dayName}</div>
        <div class="imoji">
          <img src="${day.condition.icon_url}" alt="${
      day.condition.description
    }" />
        </div>
        <div class="min-maxtemp">
          <div class="max-temp">${Math.round(day.temperature.maximum)}
            <span class="temp-symbol1">&deg;C</span>
          </div>
          <div class="min-temp">${Math.round(day.temperature.minimum)}
            <span class="temp-symbol1">&deg;C</span>
          </div>
        </div>
      </div>
    `;
  });

  forecastElement.innerHTML = forecastHtml;
}

window.onload = function () {
  searchCity("Cape Town");
};

let searchForm = document.getElementById("search-form");
searchForm.addEventListener("submit", handleSearchSubmit);
