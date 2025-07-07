<template>
  <div class="weather-module">
    <div class="weather-main">
      <div class="weather-icon">{{ weather.icon }}</div>
      <div class="weather-info">
        <div class="temperature">{{ weather.temperature }}°C</div>
        <div class="location">{{ location }}</div>
      </div>
    </div>
    <div class="weather-details">
      <span>湿度 {{ weather.humidity }}%</span>
      <span>|</span>
      <span>AQI {{ airQuality.aqi }}</span>
    </div>
    <div v-if="warning.length > 0" class="weather-warning">
      ⚠️ {{ warning[0].title }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getCityId, getNowWeather, getWarning, getAirQuality } from '../../services/weatherService'

const location = ref('定位中...')
const weather = ref({
  temperature: '--',
  icon: '🌈',
  humidity: '--'
})
const airQuality = ref({
  aqi: '--'
})
const warning = ref([])

// 获取位置信息
const getLocation = async () => {
  try {
    // 这里使用IP定位，也可以改用浏览器定位API
    const response = await fetch('https://restapi.amap.com/v3/ip?key=fa82a1d0a8c6e5b1640ab4dce81e4ca1')
    const data = await response.json()
    console.log('data', data)
    location.value = `${data.city}`
    return data.city
  } catch (error) {
    console.error('获取位置失败:', error)
    location.value = '北京市' // 默认位置
    return '北京市'
  }
}

// 更新天气信息
const updateWeather = async () => {
  console.log('updateWeather')
  try {
    const city = await getLocation()
    console.log('city', city)
    const cityId = await getCityId(city.slice(0,city.length-1))
    console.log('cityId', cityId)
    // 获取天气数据
    const weatherData = await getNowWeather(cityId)
    weather.value = weatherData
    
    // 获取空气质量
    const airData = await getAirQuality(cityId)
    airQuality.value = airData
    
    // 获取预警信息
    const warningData = await getWarning(cityId)
    warning.value = warningData
  } catch (error) {
    console.error('更新天气失败:', error)
  }
}

// 定时更新天气
let weatherInterval: number

onMounted(async () => {
  await updateWeather()
  weatherInterval = window.setInterval(updateWeather, 15 * 60 * 1000) // 每15分钟更新一次
})

onUnmounted(() => {
  window.clearInterval(weatherInterval)
})
</script>

<style scoped lang="scss">
.weather-module {
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.weather-main {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.weather-icon {
  font-size: 32px;
  margin-right: 12px;
}

.weather-info {
  flex: 1;
}

.temperature {
  font-size: 24px;
  font-weight: bold;
  color: white;
}

.location {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
}

.weather-details {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 8px;
}

.weather-warning {
  font-size: 12px;
  color: #FFC107;
  animation: blink 2s infinite;
}

@keyframes blink {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style> 