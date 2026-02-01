import fs from 'fs'
import got from 'got'
import { formatDistance } from 'date-fns'

// WMO Weather Codes -> Emojis
const emojis = {
  0: '☀️',  // Clear sky
  1: '🌤',  // Mainly clear
  2: '⛅',  // Partly cloudy
  3: '☁️',  // Overcast
  45: '🌫', // Fog
  48: '🌫', // Depositing rime fog
  51: '🌧', // Light drizzle
  53: '🌧', // Moderate drizzle
  55: '🌧', // Dense drizzle
  56: '🌧', // Light freezing drizzle
  57: '🌧', // Dense freezing drizzle
  61: '🌧', // Slight rain
  63: '🌧', // Moderate rain
  65: '🌧', // Heavy rain
  66: '🌧', // Light freezing rain
  67: '🌧', // Heavy freezing rain
  71: '🌨', // Slight snow
  73: '🌨', // Moderate snow
  75: '❄️', // Heavy snow
  77: '🌨', // Snow grains
  80: '🌦', // Slight rain showers
  81: '🌦', // Moderate rain showers
  82: '🌧', // Violent rain showers
  85: '🌨', // Slight snow showers
  86: '❄️', // Heavy snow showers
  95: '⛈',  // Thunderstorm
  96: '⛈',  // Thunderstorm with slight hail
  99: '⛈',  // Thunderstorm with heavy hail
}

// Columbus, Ohio
const LATITUDE = 39.9612
const LONGITUDE = -82.9988

// Cheap, janky way to have variable bubble width
const dayBubbleWidths = {
  Monday: 235,
  Tuesday: 235,
  Wednesday: 260,
  Thursday: 245,
  Friday: 220,
  Saturday: 245,
  Sunday: 230,
}

// Time working at PlanetScale
const today = new Date()
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(
  today
)

const psTime = formatDistance(new Date(2020, 12, 14), today, {
  addSuffix: false,
})

// Today's weather from Open-Meteo (free, no API key required)
const url = `https://api.open-meteo.com/v1/forecast?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=temperature_2m_max,weather_code&temperature_unit=fahrenheit&timezone=auto`

got(url)
  .then((response) => {
    const json = JSON.parse(response.body)

    const degF = Math.round(json.daily.temperature_2m_max[0])
    const degC = Math.round((degF - 32) * 5 / 9)
    const weatherCode = json.daily.weather_code[0]

    fs.readFile('template.svg', 'utf-8', (error, data) => {
      if (error) {
        console.error(error)
        return
      }

      data = data.replace('{degF}', degF)
      data = data.replace('{degC}', degC)
      data = data.replace('{weatherEmoji}', emojis[weatherCode] || '🌡')
      data = data.replace('{psTime}', psTime)
      data = data.replace('{todayDay}', todayDay)
      data = data.replace('{dayBubbleWidth}', dayBubbleWidths[todayDay])

      fs.writeFile('chat.svg', data, (err) => {
        if (err) {
          console.error(err)
        }
      })
    })
  })
  .catch((err) => {
    console.error('Failed to fetch weather:', err.message)
    process.exit(1)
  })
