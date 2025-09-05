# Weather API

A weather API built with TypeScript, Node.js, and Express that fetches weather data from WeatherAPI.

## Features

- Web interface for weather searches
- Current weather data for any city
- Multi-day weather forecast
- Temperature in both Celsius and Fahrenheit
- Humidity, wind speed, and weather conditions

## Tech Stack

- TypeScript
- Node.js
- Express.js
- Axios
- WeatherAPI

## Prerequisites

- Node.js (v18 or higher)
- npm
- WeatherAPI key from [weatherapi.com](https://www.weatherapi.com/my/)

## Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/weather-api.git
cd weather-api
```

2. Install dependencies
```bash
npm install
```

3. Create `.env` file from the example
```bash
cp .env.example .env
```

4. Add your WeatherAPI key to `.env`
```
WEATHER_API_KEY=your_api_key_here
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

Server runs on `http://localhost:3000`

## API Endpoints

### Web Interface
- `GET /` - Weather search interface

### REST API
- `GET /weather/:city` - Get current weather for a city
- `GET /forecast/:city/:days` - Get weather forecast (1-3 days)

### Example API Responses

Current Weather:
```json
{
  "location": "London",
  "country": "United Kingdom",
  "temp_c": 15,
  "temp_f": 59,
  "condition": "Partly cloudy",
  "wind_mph": 10,
  "humidity": 72
}
```

Forecast:
```json
{
  "location": "Tokyo",
  "forecast": [
    {
      "date": "2025-09-04",
      "max_temp_c": 28,
      "min_temp_c": 22,
      "condition": "Sunny"
    }
  ]
}
```

## Project Structure

```
weather-api/
├── src/
│   └── index.ts        # Main application file
├── .env                # Environment variables (not in repo)
├── .env.example        # Environment template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── README.md           # Documentation
```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `WEATHER_API_KEY` - Your WeatherAPI key (required)

## License

MIT
