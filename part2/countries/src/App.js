import React, { useState } from "react";
import axios from "axios";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countries, setCountries] = useState([]);
  const [weatherData, setWeatherData] = useState(null);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    fetchWeather(country.capital);
    setSearchTerm("");
  };

  const searchCountries = async () => {
    const response = await axios.get(
      `https://restcountries.com/v3.1/name/${searchTerm}`
    );
    setCountries(response.data);
  };

  const fetchWeather = async (capital) => {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${process.env.REACT_APP_WEATHER_API_KEY}`
    );
    setWeatherData(response.data);
  };

  return (
    <div>
      <label>
        Search countries:
        <input type="text" value={searchTerm} onChange={handleSearchChange} />
      </label>
      <button onClick={searchCountries}>Search</button>
      {selectedCountry && (
        <div>
          <h2>{selectedCountry.name.common}</h2>
          <p>Capital: {selectedCountry.capital}</p>
          <p>Population: {selectedCountry.population}</p>
          <p>Region: {selectedCountry.region}</p>
          <p>Languages:</p>
          <ul>
            {Object.values(selectedCountry.languages).map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
          {selectedCountry.flags && selectedCountry.flags.length > 0 && (
            <div>
              <h3>Flags:</h3>
              <div style={{ display: "flex" }}>
                {selectedCountry.flags.map((flag, index) => (
                  <img
                    key={index}
                    src={flag}
                    alt={`${selectedCountry.name.common} flag`}
                    style={{ width: "100px", marginRight: "10px" }}
                  />
                ))}
              </div>
            </div>
          )}
          {weatherData && (
            <div>
              <h3>Weather in {selectedCountry.capital}</h3>
              <p>Temperature: {weatherData.main.temp} K</p>
              <p>Description: {weatherData.weather[0].description}</p>
              <p>Humidity: {weatherData.main.humidity}%</p>
            </div>
          )}
        </div>
      )}
      {countries.length > 0 && !selectedCountry && (
        <ul>
          {countries.map((country) => (
            <li key={country.cca2}>
              <button onClick={() => handleCountrySelect(country)}>
                {country.name.common}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
