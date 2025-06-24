
"use strict";

import { updateWeather, error404, showNotification } from "./app.js";

// Default location coordinates (Kulgaon Badlapur, IN)
const defaultLocation = "#/weather?lat=19.1650196&lon=73.237532";

// Get user's current location using Geolocation API
const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;
      updateWeather(`${latitude}`, `${longitude}`);
      showNotification("Successfully Retrieved Your Location 🎉", "success");
    },
    (err) => {
      console.error("Error getting location:", err);
      showNotification("Unable To Get Your Location, Showing Default Weather 🫠", "info");
      window.location.hash = defaultLocation;
    }
  );
};

// Handle weather display for searched location
const searchedLocation = (query) => {
  const params = new URLSearchParams(query);
  const lat = params.get("lat");
  const lon = params.get("lon");
  if (lat && lon) {
    updateWeather(lat, lon);
  } else {
    error404();
  }
};

// Route definitions for different URL patterns
const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchedLocation],
]);

// Route handler function
const checkHash = function () {
  const requestURL = window.location.hash.slice(1);

  // Split URL into route and query parameters
  const [route, query] = requestURL.includes("?")
    ? requestURL.split("?")
    : [requestURL];

  routes.get(route) ? routes.get(route)(query) : error404();
};

// Listen for URL hash changes
window.addEventListener("hashchange", checkHash);

// Initial route setup on page load
window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});