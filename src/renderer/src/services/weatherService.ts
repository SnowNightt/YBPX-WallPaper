import axios from 'axios'

// 和风天气API配置
const WEATHER_API_KEY = '5495c47895dd42a389413439f3c460d5' // 需要替换为实际的API key
const BASE_URL = 'https://k43aap849e.re.qweatherapi.com/v7'

// 天气图标映射
const weatherIcons: Record<string, string> = {
  '100': '☀️',
  '101': '🌤️',
  '102': '⛅',
  '103': '🌥️',
  '104': '☁️',
  '300': '🌧️',
  '301': '🌧️',
  '302': '⛈️',
  '303': '⛈️',
  '304': '⛈️',
  '305': '🌧️',
  '306': '🌧️',
  '307': '🌧️',
  '308': '🌧️',
  '309': '🌧️',
  '310': '🌧️',
  '311': '🌧️',
  '312': '🌧️',
  '313': '🌧️',
  '314': '🌧️',
  '399': '🌧️',
  '400': '🌨️',
  '401': '🌨️',
  '402': '🌨️',
  '403': '🌨️',
  '404': '🌨️',
  '405': '🌨️',
  '406': '🌨️',
  '407': '🌨️',
  '408': '🌨️',
  '409': '🌨️',
  '410': '🌨️',
  '499': '🌨️',
}

// 获取城市ID
export async function getCityId(location: string) {
  try {
    const response = await axios.get('https://k43aap849e.re.qweatherapi.com/geo/v2/city/lookup', {
      params: {
        key: WEATHER_API_KEY,
        location,
        range: 'cn'
      }
    });
    return response.data.location[0].id
  } catch (error) {
    console.error('获取城市ID失败:', error)
    throw error
  }
}

// 获取实时天气
export async function getNowWeather(cityId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/weather/now`, {
      params: {
        key: WEATHER_API_KEY,
        location: cityId
      }
    })
    const data = response.data.now
    return {
      temperature: data.temp,
      icon: weatherIcons[data.icon] || '🌈',
      text: data.text,
      humidity: data.humidity,
      windSpeed: data.windSpeed,
      windDir: data.windDir
    }
  } catch (error) {
    console.error('获取天气数据失败:', error)
    throw error
  }
}

// 获取天气预警信息
export async function getWarning(cityId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/warning/now`, {
      params: {
        key: WEATHER_API_KEY,
        location: cityId
      }
    })
    return response.data.warning || []
  } catch (error) {
    console.error('获取天气预警失败:', error)
    throw error
  }
}

// 获取空气质量
export async function getAirQuality(cityId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/air/now`, {
      params: {
        key: WEATHER_API_KEY,
        location: cityId
      }
    })
    return response.data.now
  } catch (error) {
    console.error('获取空气质量失败:', error)
    throw error
  }
} 