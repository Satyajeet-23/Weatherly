
"use strict";

import config from "./config.js";

// Fetch Data From API
export const fetchData = function (URL, callback) {
  fetch(`${URL}&appid=${config.Api_Key}`)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      callback(data);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
};

// API Endpoint URLs
export const url = {

  // Get Current Weather
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;
  },

  // Get Forecast
  forecast(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric`;
  },

  // Get Air Pollution
  airPollution(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}`;
  },

  // Get Location From Coordinates
  reverseGeo(lat, lon) {
    return `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`;
  },
  
  // Get Coordinates From Location Name
  geo(query) {
    return `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
  },
};