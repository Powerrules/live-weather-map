import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
  Marker,
  Popup,
} from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./App.css";

// Fix missing marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const WeatherMarker = ({ position, weather }) => {
  const popupRef = useRef();

  useEffect(() => {
    if (popupRef.current) {
      popupRef.current._source.openPopup();
    }
  }, [position]);

  return (
    <Marker position={position}>
      <Popup ref={popupRef}>
        <div className="popup-box">
          <h3>{weather.name}</h3>
          <p><strong>🌡 Temp:</strong> {weather.main.temp}°C</p>
          <p><strong>🌥 Description:</strong> {weather.weather[0].description}</p>
          <p><strong>💨 Wind:</strong> {weather.wind.speed} m/s</p>
          <p><strong>⬇ Pressure:</strong> {weather.main.pressure} hPa</p>
        </div>
      </Popup>
    </Marker>
  );
};

const LocationMarker = ({ setWeather, setPosition }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);

      const API_KEY = "4dfae8124a11024a2f4170379b4e0f02";
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`
        )
        .then((res) => {
          console.log(res.data);
          setWeather(res.data);
        })
        .catch((err) => console.error(err));
    },
  });
  return null;
};

function App() {
  const [position, setPosition] = useState([20, 0]);
  const [weather, setWeather] = useState(null);

  return (
    <div className="app-container">
      <header className="header">
        🌤️ <span className="highlight">Live Weather</span> Tracker
      </header>

      <MapContainer
        center={position}
        zoom={2}
        style={{ height: "85vh", width: "100%" }}
        scrollWheelZoom={true}
      >
        {/* Light theme map tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <LocationMarker setWeather={setWeather} setPosition={setPosition} />
        {weather && <WeatherMarker position={position} weather={weather} />}
      </MapContainer>

      {weather && (
        <div className="weather-sidebar">
          <h2>📍 {weather.name}</h2>
          <p><strong>🌡 Temperature:</strong> {weather.main.temp}°C</p>
          <p><strong>🌥 Condition:</strong> {weather.weather[0].main}</p>
          <p><strong>💧 Humidity:</strong> {weather.main.humidity}%</p>
          <p><strong>💨 Wind Speed:</strong> {weather.wind.speed} m/s</p>
          <p><strong>🧭 Direction:</strong> {weather.wind.deg}°</p>
        </div>
      )}
    </div>
  );
}

export default App;
