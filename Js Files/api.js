"use strict";

const api_key = "6693bcacb4d42ae0daebd358f50eebcd";

/**
 * Fetch Data From Server
 
 * @param {string} URL API URL
 * @param {Function} callback callback

*/

export const fetchData = function (URL, callback) {
  fetch(`${URL}&appid=${api_key}`)
    .then(res => res.json())
    .then(data => callback(data));
}
