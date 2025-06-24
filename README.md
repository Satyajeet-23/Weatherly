# Weatherly 🌦️

**Weatherly** is a modern, responsive weather application that provides real-time weather updates, air quality information, and forecasts for any location worldwide. Built with JavaScript, HTML, and CSS, Weatherly leverages the OpenWeatherMap API to deliver accurate and detailed weather data in a user-friendly interface.

---

## 🚀 Features

- **Current Weather:** Instantly view temperature, weather conditions, humidity, pressure, and more for your current or searched location.
- **5-Day Forecast:** Get a detailed 5-day weather forecast with daily temperature highs.
- **Hourly Forecast:** Visualize temperature and wind speed for the next 24 hours.
- **Air Quality Index (AQI):** See real-time air quality data with health recommendations.
- **Location Search:** Search for any city worldwide and get instant weather updates.
- **Geolocation Support:** Automatically fetch weather for your current location.
- **Responsive Design:** Fully optimized for desktop and mobile devices.
- **Notifications:** Get informative notifications for actions and errors.
- **404 Error Handling:** Friendly error page for invalid routes or locations.

---

## 🖼️ Screenshots

> _Weatherly Home Page_
>
> ![Weatherly Home](./Assets/Screenshot/Weatherly%20Home%20Page.png)
---

## 🛠️ Technologies Used

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **API:** [OpenWeatherMap API](https://openweathermap.org/)
- **Icons:** Material Symbols, Font Awesome
- **Fonts:** Google Fonts (Nunito Sans, Julius Sans One)

---

## 📦 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Satyajeet-23/Weatherly.git
cd Weatherly
```

### 2. Install Dependencies

No build tools required! Just open `index.html` in your browser.

### 3. Configure API Key

1. Get your free API key from [OpenWeatherMap](https://openweathermap.org/api).
2. In `Js-Files/config.js`, replace the placeholder with your API key:

   ```js
   const config = {
     Api_Key: "YOUR_API_KEY_HERE",
   };
   export default config;
   ```

### 4. Run the App

Open `index.html` in your favorite browser.

---

## ⚙️ Project Structure

```
Weatherly/
│
├── Assets/                # Images, icons, fonts, screenshots
├── Js-Files/              # JavaScript modules (app logic, API, routing, config)
├── style.css              # Main stylesheet
├── index.html             # Main HTML file
└── README.md              # Project documentation
```

---

## ✨ Credits

- **Design & Development:** [Satyajeet Jena](https://github.com/Satyajeet-23)
- **Weather Data:** [OpenWeatherMap](https://openweathermap.org/)
- **Icons:** [Material Symbols](https://fonts.google.com/icons), [Font Awesome](https://fontawesome.com/)
- **Fonts:** [Google Fonts](https://fonts.google.com/)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## ❤️ Support

If you like this project, please ⭐️ star the repo and share it!  
For feedback or contributions, open an issue or pull request.

---