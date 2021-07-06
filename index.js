//Current Variables
const searchBtn = document.querySelector(".search__button");
const searchbox = document.querySelector("#search__bar");

const api = {
  key: "28747b56a2cb0a54d19cbbcecf3da25e",
  // base: "https://api.openweathermap.org/data/2.5/",
};
const homepage = document.querySelector(".home__container");
const weatherpage = document.querySelector(".weather__container");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

//Geo - Location;
window.addEventListener("load", () => {
  let long;
  let lat;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
    });
  } else {
    h1.textContent = "Please enable geolocation";
  }
});

//Search Functions
// function setQueryKey(evt) {
//   e.preventDefault();
//   if (evt.keyCode == 13) {
//     getResults(searchbox.value);
//     weatherpage.classList.remove("weather__hidden");
//   }
// }

//Current Forecast
function resetQuery(e) {
  // today =
  //   cityText.innerText =
  //   temp.innerHTML =
  //   feelsLike.innerHTML =
  //   curHiTemp.innerHTML =
  //   curLowTemp.innerHTML =
  //   humidity.innerHTML =
  //     "";
  // background.classList.remove("night-mode");
  weatherpage.classList.add("weather__hidden");
  weatherpage.style.transition = "all 0.5s ease-in";
  // weatherpage.style.opacity = "0";
  setQuery();
}

function setQuery(e) {
  getWeatherData(searchbox.value);
  // getFiveDay(searchbox.value);
  weatherpage.classList.remove("weather__hidden");

  // weatherpage.style.transition = "all 0.5s ease-in";
  // weatherpage.classList.add("weather__uncover");
  // weatherpage.style.opacity = "100";
  // weatherpage.addEventListener("load", fadeIn);
  // function fadeIn() {
  //   weatherpage.style.transition = "all 0.5s ease-in";
  // }
}

function getWeatherData(query) {
  fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${query}&units=imperial&APPID=${api.key}`
  )
    .then((response) => {
      return response.json();
    })
    // .then((data) => {
    //   console.log(data);
    // })
    .then((weatherData) => {
      let dailyForecast = weatherData.list;
      let city_location = weatherData.city.name;
      let country_location = weatherData.city.country;
      let city_info = weatherData.city;
      displayResults(city_location, country_location, dailyForecast, city_info);
    });
}

function currentDateBuilder(d) {
  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${month} ${date}, ${year}`;
}

//Display Functions
function displayResults(city, country, weather, localData) {
  let today = Date.now();
  console.log(today / 1000);

  let cityText = document.querySelector(".location");
  let cityName = city;
  let countryName = country;
  cityText.innerText = `${cityName}, ${countryName}`;

  let temp = document.querySelector(".current__temp");
  temp.innerHTML = `${Math.round(weather[0].main.temp)}&#176`;

  let feelsLike = document.querySelector(".feels__like--temp");
  feelsLike.innerHTML = `${Math.round(weather[0].main.feels_like)}&#176`;

  let curHiTemp = document.querySelector(".high__degree");
  curHiTemp.innerHTML = `${Math.round(weather[0].main.temp_max)}&#176`;

  let curLowTemp = document.querySelector(".low__degree");
  curLowTemp.innerHTML = `${Math.round(weather[0].main.temp_min)}&#176`;

  let humidity = document.querySelector(".humidity__percent");
  humidity.innerHTML = `${weather[0].main.humidity}%`;

  //set background and image
  const sunrise = localData.sunrise;
  const sunnyOut = sunrise + 3600;
  console.log(sunrise);
  console.log(sunnyOut);
  const sunset = localData.sunset;
  const darkOut = sunset + 3600;
  console.log(sunset);
  console.log(darkOut);
  let background = document.querySelector(".weather__page");
  let weatherElement = weather[0].weather[0].main;
  let weatherElementLow = weatherElement.toLowerCase();
  let cloudCoverage = weather[0].clouds.all;
  let weatherIcon = `${weatherElementLow}.SVG`;
  let currentIcon = document.querySelector(".current__image");

  //background color and image - day vs night
  if (today / 1000 > sunnyOut && today / 1000 < darkOut) {
    // let weatherIcon = `${weatherElementLow}.SVG`;
    if (weatherElement === "Clouds" && cloudCoverage < 50) {
      currentIcon.setAttribute("src", "/cloud.SVG");
    } else if (weatherElement === "Clouds" && cloudCoverage > 50) {
      currentIcon.setAttribute("src", `/${weatherIcon}`);
    } else {
      currentIcon.setAttribute("src", `/${weatherIcon}`);
    }
    background.style.background = `var(--${weatherElementLow}-color)`;
  } else {
    // let weatherIcon = `${weatherElementLow}.SVG`;
    if (weatherElement === "Clouds" && cloudCoverage < 50) {
      currentIcon.setAttribute("src", "/cloud-night.SVG");
    } else if (weatherElement === "Clouds" && cloudCoverage > 50) {
      currentIcon.setAttribute("src", `/${weatherIcon}`);
    } else {
      currentIcon.setAttribute("src", `/${weatherElementLow}-night.SVG`);
    }
    background.style.background = `var(--night-color)`;
  }

  // let currentIcon = document.querySelector(".current__image");
  // if (weatherElement === "Clouds" && cloudCoverage < 50) {
  //   currentIcon.setAttribute("src", "/cloud.SVG");
  // } else if (weatherElement === "Clouds" && cloudCoverage > 50) {
  //   currentIcon.setAttribute("src", `/${weatherIcon}`);
  // } else {
  //   currentIcon.setAttribute("src", `/${weatherIcon}`);
  // }

  for (let i = 0; i <= 4; i++) {
    let now = new Date(weather[i].dt * 1000);
    if (i === 0) {
      let curDate = document.querySelector(".date");
      curDate.innerText = currentDateBuilder(now);
    } else {
      //day names
      let nextDay = new Date(today);
      nextDay.setDate(nextDay.getDate() + i);
      let name = days[nextDay.getDay()];
      let dayClass = document.querySelector(`.day-${i}`);
      dayClass.innerText = name;

      //icons
      let weatherElementDay = weather[i].weather[0].main;
      let weatherElementDayLow = weatherElementDay.toLowerCase();
      let weatherIconDay = `${weatherElementDayLow}.svg`;
      let fiveDayIcon = document.querySelector(`.icon-${i}`);
      fiveDayIcon.setAttribute("src", `/${weatherIconDay}`);

      //temps
      let dayHiTemp = document.querySelector(`.hi-temp-${i}`);
      dayHiTemp.innerHTML = `${Math.round(weather[i].main.temp_max)}&#176`;
      let dayLowTemp = document.querySelector(`.lo-temp-${i}`);
      dayLowTemp.innerHTML = `${Math.round(weather[i].main.temp_min)}&#176`;
    }
  }
  // searchbox.reset();
}

//Transition
// const pageTransition = function (query) {
//   const queryResult = setQuery(e);
//   queryResult.style.transition = "all .5s ease-in";
// };

//Event Handlers
// searchbox.addEventListener("keypress", setQueryKey);
// searchBtn.addEventListener("click", setQuery);
searchBtn.addEventListener("click", resetQuery);
//app order of operations
// 1. Capture value that the user inputs into the search
// 2. Input location into API and fetch it
// 3. Convert the result into a JSON object
// 4. Loop over the JSON object and get the information that we need:
// a. current temperature = weather.main.temp
// b. current weather condition = weather.weather.main
// c. current day high and low temps = weather.main.temp_max and weather.main.temp_min
// d. current day precipitation % = weather.
// e. current day feels like temp = weather.main.feels_like
// f. 5 days of high and low temps
// g. 5 days of weather conditions
// h. 5 days of precipitation %
// 5. Input the above information into a function that does the following:
// a. posts the current and 5 day weather forecast
// b. posts weather images according to the weather condition
// c. changes the background color based on the weather condition
// d. changes the current weather image based on current weather conditions
