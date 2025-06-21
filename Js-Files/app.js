
"use strict";

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

// Notification System
const activeNotifications = new Set();

export function showNotification(message, type = "info") {

  // If the same message is already being shown, Not to be shown again
  if (activeNotifications.has(message)) {
    return;
  }

  const container = document.getElementById("notification-container");
  if (!container) {
    console.error("Notification container not found in the DOM.");
    return;
  }

  // Add message to active notifications set
  activeNotifications.add(message);

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.setAttribute("role", "alert");
  notification.setAttribute("aria-live", "assertive");

  notification.innerHTML = `
    <div class="notification-content">
      <span class="notification-message">${message}</span>
    </div>
  `;

  container.appendChild(notification);
  notification.offsetHeight;
  notification.classList.add("show");

  setTimeout(() => {
    if (container.contains(notification)) {
      notification.classList.remove("show");
      notification.classList.add("hide");
      setTimeout(() => {
        if (container.contains(notification)) {
          container.removeChild(notification);
          activeNotifications.delete(message);
        }
      }, 350);
    }
  }, 3500);
}

// Utility function to add event listeners to multiple elements
const addEventOnElements = function (elements, eventType, callback) {
  for (const element of elements) element.addEventListener(eventType, callback);
};

// Navigation - Improved version
const searchView = document.querySelector("[data-search-view]");
const searchTogglers = document.querySelectorAll("[data-search-toggler]");

const toggleSearch = () => searchView.classList.toggle("active");
addEventOnElements(searchTogglers, "click", toggleSearch);

// Search Functionality
const searchField = document.querySelector("[data-search-field]");
const searchResult = document.querySelector("[data-search-result]");
const searchForm = searchField.closest("form") || searchField.parentElement;

let searchTimeout = null;
const searchTimeoutDuration = 500;
let lastSearchValue = ""; // Store the last search value

function performSearch(query) {
  searchField.classList.add("searching");

  fetchData(url.geo(query), function (locations) {
    searchField.classList.remove("searching");
    searchResult.classList.add("active");
    searchResult.innerHTML = `
      <ul class="view-list" data-search-list></ul>
    `;

    if (!locations || locations.length === 0) {
      searchResult.querySelector("[data-search-list]").innerHTML = `
        <li class="view-item no-result">
          <span class="m-icon">search_off</span>
          <div>
            <p class="item-title">No results found for "${query}"</p>
            <p class="label-2 item-subtitle">Try different keywords</p>
          </div>
        </li>
      `;
      return;
    }

    const items = [];

    for (const { name, lat, lon, country, state } of locations) {
      const searchItem = document.createElement("li");
      searchItem.classList.add("view-item");

      searchItem.innerHTML = `
        <span class="m-icon">location_on</span>

        <div>
          <p class="item-title">${name}</p>
          <p class="label-2 item-subtitle">${state || ""}, ${country}</p>
        </div>

        <a href="#/weather?lat=${lat}&lon=${lon}" class="item-link has-state" 
           aria-label="${name} weather" data-search-toggler></a>
      `;

      searchResult.querySelector("[data-search-list]").appendChild(searchItem);
      items.push(searchItem.querySelector("[data-search-toggler]"));
    }

    addEventOnElements(items, "click", function () {
      toggleSearch();
      searchResult.classList.remove("active");
      lastSearchValue = searchField.value; // Store the value before clearing
      searchField.value = ""; // Clear the search field
    });
  });
}

// Search field input handling
searchField.addEventListener("input", function () {
  if (searchTimeout) clearTimeout(searchTimeout);

  if (!searchField.value) {
    searchResult.classList.remove("active");
    searchResult.innerHTML = "";
    searchField.classList.remove("searching");
  } else {
    searchField.classList.add("searching");

    searchTimeout = setTimeout(() => {
      performSearch(searchField.value);
    }, searchTimeoutDuration);
  }
});

// Handle focus on search field
searchField.addEventListener("focus", function () {
  if (lastSearchValue) {
    searchField.value = lastSearchValue;
    performSearch(lastSearchValue);
  }
});

searchField.addEventListener("blur", function () {
  setTimeout(() => {
    if (
      !searchResult.contains(document.activeElement) &&
      !searchField.contains(document.activeElement)
    ) {
      searchResult.classList.remove("active");
    }
  }, 200);
});

// Handle form submission (Enter key)
searchForm.addEventListener("submit", function (e) {
  e.preventDefault();

  if (searchField.value) {
    // If there are search results and at least one item
    const firstResult = searchResult.querySelector("[data-search-toggler]");
    if (firstResult) {
      // Simulate click on first result
      firstResult.click();
    } else {
      // Store the value anyway
      lastSearchValue = searchField.value;
      searchField.value = "";
      searchResult.classList.remove("active");
    }

    // Clear any pending search
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }
  }
});

// Keyboard navigation for search results
searchField.addEventListener("keydown", function (e) {
  const results = searchResult.querySelectorAll("[data-search-toggler]");

  if (results.length > 0) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      results[0].focus();
    }
  }
});

searchResult.addEventListener("keydown", function (e) {
  const results = searchResult.querySelectorAll("[data-search-toggler]");
  const currentIndex = Array.from(results).findIndex(
    (item) => item === document.activeElement
  );

  if (currentIndex >= 0) {
    if (e.key === "ArrowDown" && currentIndex < results.length - 1) {
      e.preventDefault();
      results[currentIndex + 1].focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (currentIndex === 0) {
        searchField.focus();
      } else {
        results[currentIndex - 1].focus();
      }
    }
  }
});

// Main weather update functionality
const container = document.querySelector("[data-main-container]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.querySelector(
  "[data-current-location-btn]"
);
const errorContent = document.querySelector("[data-error-content]");

export const updateWeather = function (lat, lon) {
  // Showing loading state
  loading.style.display = "grid";
  container.style.overflowY = "hidden";
  container.classList.remove("fade-in");
  errorContent.style.display = "none";

  // Clear existing weather sections
  const currentWeatherSection = document.querySelector(
    "[data-current-weather]"
  );
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly-forecast]");
  const forecastSection = document.querySelector("[data-5-day-forecast]");

  currentWeatherSection.innerHTML = "";
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";
  forecastSection.innerHTML = "";

  // Update current location button state
  if (window.location.hash === "#/current-location") {
    currentLocationBtn.setAttribute("disabled", "");
  } else {
    currentLocationBtn.removeAttribute("disabled");
  }

  //  CURRENT WEATHER SECTION

  fetchData(url.currentWeather(lat, lon), function (currentWeather) {
    if (!currentWeather || currentWeather.cod !== 200) {
      error404();
      loading.style.display = "none";
      container.style.overflowY = "overlay";
      return;
    }

    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;

    const [{ description, icon }] = weather;

    const card = document.createElement("div");
    card.classList.add("card", "card-lg", "current-weather-card");

    card.innerHTML = `
      <h2 class="title-2 card-title">Now</h2>

      <div class="wrapper">
        <p class="heading">${parseInt(temp)}&deg;<sup>c</sup></p>

        <img src="./Assets/Weather-Icons/${icon}.png" width="64" height="64"
          alt="${description}" class="weather-icon">
      </div>

      <p class="body-3">${description}</p>

      <ul class="meta-list">
        <li class="meta-item">
              <span class="m-icon">calendar_today</span>

              <p class="title-3 meta-text">${module.getDate(
                dateUnix,
                timezone
              )}</p>
        </li>
        <li class="meta-item">
              <span class="m-icon">location_on</span>

              <p class="title-3 meta-text" data-location></p>
        </li>
      </ul>
    `;

    fetchData(url.reverseGeo(lat, lon), function (locations) {
      if (locations && locations.length > 0) {
        const { name, country } = locations[0];
        card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
      }
    });

    currentWeatherSection.appendChild(card);

    // TODAY'S HIGHLIGHTS SECTION

    fetchData(url.airPollution(lat, lon), function (airPollution) {
      if (
        !airPollution ||
        !airPollution.list ||
        airPollution.list.length === 0
      ) {
        return;
      }

      // Utility function to format numbers with 3 significant digits and max 2 decimals
      function formatNumber(num) {
        let str = num.toPrecision(3);
        let n = Number(str);
        let fixed = n.toFixed(2);

        if (fixed.indexOf(".") !== -1) {
          fixed = fixed.replace(/\.?0+$/, "");
          if (!fixed.includes(".")) {
            fixed += ".0";
          }
        }

        return fixed;
      }

      const [
        {
          main: { aqi },
          components: { no2, o3, so2, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("card", "card-lg");

      card.innerHTML = `
        <h2 class="title-2" id="highlights-label">Today's Highlights</h2>

        <div class="highlight-list">

            <div class="card card-sm highlight-card one">

                  <h3 class="title-3">Air Quality Index</h3>

                  <div class="wrapper">

                      <span class="m-icon">air</span>

                      <ul class="card-list">

                            <li class="card-item">
                                <p class="title-1">${formatNumber(pm2_5)}</p>

                                <p class="label-1">PM <sub>2.5</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${formatNumber(so2)}</p>

                                <p class="label-1">SO <sub>2</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${formatNumber(no2)}</p>

                                <p class="label-1">NO <sub>2</sub></p>
                            </li>

                            <li class="card-item">
                                <p class="title-1">${formatNumber(o3)}</p>

                                <p class="label-1">O <sub>3</sub></p>
                            </li>

                      </ul>

                  </div>

                  <span class="badge aqi-${aqi} label-${aqi}" title="${
        module.aqiText[aqi].message
      }">
                    ${module.aqiText[aqi].level}
                  </span>

            </div>

            <div class="card card-sm highlight-card two">

                  <h3 class="title-3">Sunrise & Sunset</h3>

                  <div class="card-list">

                      <div class="card-item">

                            <span class="m-icon">clear_day</span>

                            <div>
                                <p class="label-1">Sunrise</p>

                                <p class="title-1">${module.getTime(
                                  sunriseUnixUTC,
                                  timezone
                                )}</p>
                            </div>
                      </div>

                      <div class="card-item">

                            <span class="m-icon">clear_night</span>

                            <div>
                                <p class="label-1">Sunset</p>

                                <p class="title-1">${module.getTime(
                                  sunsetUnixUTC,
                                  timezone
                                )}</p>
                            </div>
                      </div>

                  </div>

            </div>

            <div class="card card-sm highlight-card">

                  <h3 class="title-3">Humidity</h3>

                  <div class="wrapper">
                      <span class="m-icon">humidity_percentage</span>

                      <p class="title-1">${humidity}<sub>%</sub></p>
                  </div>

            </div>

            <div class="card card-sm highlight-card">

                  <h3 class="title-3">Pressure</h3>

                  <div class="wrapper">
                      <span class="m-icon">airwave</span>

                      <p class="title-1">${pressure}<sub>hPa</sub></p>
                  </div>

            </div>

            <div class="card card-sm highlight-card">

                  <h3 class="title-3">Visibility</h3>

                  <div class="wrapper">
                      <span class="m-icon">visibility</span>

                      <p class="title-1">${visibility / 1000}<sub>km</sub></p>
                  </div>

            </div>

            <div class="card card-sm highlight-card">

                  <h3 class="title-3">Feels Like</h3>

                  <div class="wrapper">
                      <span class="m-icon">thermostat</span>

                      <p class="title-1">${parseInt(
                        feels_like
                      )}&deg;<sup>c</sup></p>
                  </div>

            </div>

        </div>
      `;

      highlightSection.appendChild(card);
    });

    // HOURLY(24 hrs) FORECAST SECTION

    fetchData(url.forecast(lat, lon), function (forecast) {
      if (!forecast || !forecast.list) {
        return;
      }

      const {
        list: forecastList,
        city: { timezone },
      } = forecast;

      hourlySection.innerHTML = `
        <h2 class="title-2">Today at</h2>

        <div class="slider-container">
          <ul class="slider-list" data-temp></ul>

          <ul class="slider-list" data-wind></ul>
        </div>
      `;

      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;

        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;

        const [{ icon, description }] = weather;

        const tempLi = document.createElement("li");
        tempLi.classList.add("slider-item");

        tempLi.innerHTML = `
          <div class="card card-sm slider-card">

            <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

            <img src="./Assets/Weather-Icons/${icon}.png" alt="${description}" width="48" height="48"
              loading="lazy" class="weather-icon" title="${description}">

            <p class="body-3">${parseInt(temp)}&deg;</p>

          </div>
        `;

        hourlySection.querySelector("[data-temp]").appendChild(tempLi);

        const windLi = document.createElement("li");
        windLi.classList.add("slider-item");

        windLi.innerHTML = `
          <div class="card card-sm slider-card">

            <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>

            <img src="./Assets/Weather-Icons/direction.png" alt="direction" width="48"
              height="48" loading="lazy" class="weather-icon" style="transform: rotate(${
                windDirection - 180
              }deg)">

            <p class="body-3">${parseInt(module.mps_to_kmh(windSpeed))} km/h</p>

          </div>
        `;

        hourlySection.querySelector("[data-wind]").appendChild(windLi);
      }

      // 5 DAY FORECAST SECTION

      forecastSection.innerHTML = `
        <h2 class="title-2" id="forecast-label">5 Days Forecast</h2>

        <div class="card card-lg forecast-card">
          <ul data-forecast-list></ul>
        </div>
      `;

      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt,
        } = forecastList[i];

        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);

        const li = document.createElement("li");
        li.classList.add("card-item");

        li.innerHTML = `
          <div class="icon-wrapper">
            <img src="./Assets/Weather-Icons/${icon}.png" width="36" height="36"
            alt="${description}" class="weather-icon" title="${description}">

            <span class="span">
              <p class="title-2">${parseInt(temp_max)}&deg;</p>
            </span>
          </div>

          <p class="label-1">${date.getDate()} ${
          module.monthNames[date.getUTCMonth()]
        }</p>

          <p class="label-1">${module.weekDayNames[date.getUTCDay()]}</p>
        `;

        forecastSection.querySelector("[data-forecast-list]").appendChild(li);
      }

      loading.style.display = "none";
      container.style.overflowY = "overlay";
      container.classList.add("fade-in");
    });
  });
};


// ERROR HANDLING FOR 404 PAGE

export const error404 = () => {
  errorContent.style.display = "flex";
  loading.style.display = "none";
  container.style.overflowY = "overlay";
};
