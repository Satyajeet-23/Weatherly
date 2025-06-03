"use strict";

import { updateWeather, error404, showNotification } from "./app.js";

const defaultLocation = "#/weather?lat=19.1650196&lon=73.237532"; // Kulgaon Badlapur, IN

const currentLocation = function () {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;
      updateWeather(`${latitude}`, `${longitude}`);
      showNotification("Successfully Retrieved Your Location 🎉", "success");
    },
    (err) => {
      console.error("Error getting location:", err);
      showNotification(
        "Unable To Get Your Location, Showing Default Weather 🫠",
        "info"
      );
      window.location.hash = defaultLocation;
    }
  );
};
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

const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchedLocation],
]);

const checkHash = function () {
  const requestURL = window.location.hash.slice(1);

  const [route, query] = requestURL.includes("?")
    ? requestURL.split("?")
    : [requestURL];

  routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", function () {
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});
