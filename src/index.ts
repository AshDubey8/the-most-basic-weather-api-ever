import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.WEATHER_API_KEY;

app.use(express.json());

// Serve HTML frontend
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Weather API</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
          background: #f5f5f5;
          padding: 40px 20px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        h1 {
          color: #333;
          margin-bottom: 30px;
          font-size: 24px;
        }
        .search-box {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }
        input {
          flex: 1;
          padding: 12px 16px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 16px;
        }
        button {
          padding: 12px 24px;
          background: #333;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }
        button:hover {
          background: #555;
        }
        .weather-display {
          display: none;
        }
        .weather-display.active {
          display: block;
        }
        .city-name {
          font-size: 20px;
          color: #333;
          margin-bottom: 20px;
        }
        .weather-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }
        .info-item {
          padding: 15px;
          background: #f8f8f8;
          border-radius: 4px;
        }
        .label {
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 5px;
        }
        .value {
          color: #333;
          font-size: 18px;
          font-weight: 500;
        }
        .error {
          color: #d32f2f;
          padding: 15px;
          background: #ffebee;
          border-radius: 4px;
          display: none;
        }
        .error.active {
          display: block;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Weather API</h1>
        <div class="search-box">
          <input type="text" id="cityInput" placeholder="Enter city name" />
          <button onclick="getWeather()">Search</button>
        </div>
        
        <div id="error" class="error"></div>
        
        <div id="weatherDisplay" class="weather-display">
          <div class="city-name" id="cityName"></div>
          <div class="weather-info">
            <div class="info-item">
              <div class="label">Temperature</div>
              <div class="value" id="temp"></div>
            </div>
            <div class="info-item">
              <div class="label">Condition</div>
              <div class="value" id="condition"></div>
            </div>
            <div class="info-item">
              <div class="label">Humidity</div>
              <div class="value" id="humidity"></div>
            </div>
            <div class="info-item">
              <div class="label">Wind Speed</div>
              <div class="value" id="wind"></div>
            </div>
          </div>
        </div>
      </div>

      <script>
        async function getWeather() {
          const city = document.getElementById('cityInput').value;
          const errorDiv = document.getElementById('error');
          const weatherDiv = document.getElementById('weatherDisplay');
          
          if (!city) {
            errorDiv.textContent = 'Please enter a city name';
            errorDiv.classList.add('active');
            weatherDiv.classList.remove('active');
            return;
          }
          
          try {
            const response = await fetch(\`/weather/\${city}\`);
            const data = await response.json();
            
            if (data.error) {
              errorDiv.textContent = 'City not found';
              errorDiv.classList.add('active');
              weatherDiv.classList.remove('active');
            } else {
              errorDiv.classList.remove('active');
              weatherDiv.classList.add('active');
              
              document.getElementById('cityName').textContent = \`\${data.location}, \${data.country}\`;
              document.getElementById('temp').textContent = \`\${data.temp_c}°C / \${data.temp_f}°F\`;
              document.getElementById('condition').textContent = data.condition;
              document.getElementById('humidity').textContent = \`\${data.humidity}%\`;
              document.getElementById('wind').textContent = \`\${data.wind_mph} mph\`;
            }
          } catch (error) {
            errorDiv.textContent = 'Failed to fetch weather data';
            errorDiv.classList.add('active');
            weatherDiv.classList.remove('active');
          }
        }
        
        document.getElementById('cityInput').addEventListener('keypress', function(e) {
          if (e.key === 'Enter') getWeather();
        });
      </script>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    
    const response = await axios.get(url);
    
    res.json({
      location: response.data.location.name,
      country: response.data.location.country,
      temp_c: response.data.current.temp_c,
      temp_f: response.data.current.temp_f,
      condition: response.data.current.condition.text,
      wind_mph: response.data.current.wind_mph,
      humidity: response.data.current.humidity
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

app.get('/forecast/:city/:days', async (req, res) => {
  try {
    const { city, days } = req.params;
    const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}`;
    
    const response = await axios.get(url);
    
    res.json({
      location: response.data.location.name,
      forecast: response.data.forecast.forecastday.map((day: any) => ({
        date: day.date,
        max_temp_c: day.day.maxtemp_c,
        min_temp_c: day.day.mintemp_c,
        condition: day.day.condition.text
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch forecast data' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});