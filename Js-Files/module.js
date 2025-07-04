
"use strict";

// Array of week day names for date formatting
export const weekDayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];


// Abbreviated month names for date formatting
export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];


// Returns formatted date string "Weekday Day Month" based on Unix timestamp and timezone offset
export const getDate = function (dateUnix, timeZone) {
  const date = new Date((dateUnix + timeZone) * 1000);
  const weekDayName = weekDayNames[date.getUTCDay()];
  const monthName = monthNames[date.getUTCMonth()];
  return `${weekDayName} ${date.getUTCDate()} ${monthName}`;
};


// Returns formatted 12-hour time string "HH:MM AM/PM" based on Unix timestamp and timezone offset
export const getTime = function (timeUnix, timeZone) {
  const date = new Date((timeUnix + timeZone) * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";
  const minutesPadded = minutes.toString().padStart(2, "0");
  return `${hours % 12 || 12}:${minutesPadded} ${period}`;
};


// Returns formatted hour with period "H AM/PM" based on Unix timestamp and timezone offset
export const getHours = function (timeUnix, timeZone) {
  const date = new Date((timeUnix + timeZone) * 1000);
  const hours = date.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";
  return `${hours % 12 || 12} ${period}`;
};


// Converts meters per second to kilometers per hour
export const mps_to_kmh = (mps) => mps * 3.6;


// Air Quality Index (AQI) levels with corresponding descriptions
export const aqiText = {

  1: {
    level: "Good",
    message:
      "Air quality is considered satisfactory, and air pollution poses little or no risk.",
  },

  2: {
    level: "Fair",
    message:
      "Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.",
  },

  3: {
    level: "Moderate",
    message:
      "Members of sensitive groups may experience health effects. The general public is not likely to be affected.",
  },

  4: {
    level: "Poor",
    message:
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
  },
  
  5: {
    level: "Very Poor",
    message:
      "Health warnings of emergency conditions. The entire population is more likely to be affected.",
  },
};
