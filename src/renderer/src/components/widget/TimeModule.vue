<template>
  <div class="time-module">
    <div class="time">{{ currentTime }}</div>
    <div class="date">{{ currentDate }}</div>
    <div v-if="festivalInfo" class="festival">
      {{ festivalInfo.icon }} {{ festivalInfo.name }}倒计时 {{ festivalInfo.days }}天
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

const currentTime = ref('')
const currentDate = ref('')
const festivalInfo = ref<{ name: string; days: number; icon: string } | null>(null)

// 节日数据
const festivals = [
  { name: '春节', date: '2025-02-10', icon: '🎉' },
  { name: '元宵节', date: '2025-02-24', icon: '🏮' },
  { name: '清明节', date: '2025-04-04', icon: '🌿' },
  { name: '端午节', date: '2025-06-02', icon: '🎋' },
  { name: '中秋节', date: '2024-09-17', icon: '🌕' },
  { name: '国庆节', date: '2024-10-01', icon: '🇨🇳' }
]

// 更新时间
const updateTime = () => {
  const now = new Date()
  currentTime.value = format(now, 'HH:mm:ss')
  currentDate.value = format(now, 'yyyy年MM月dd日 EEEE', { locale: zhCN })
}

// 更新节日信息
const updateFestival = () => {
  const now = new Date()
  for (const festival of festivals) {
    const festivalDate = new Date(festival.date)
    const diffDays = Math.ceil((festivalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays > 0 && diffDays <= 3) {
      festivalInfo.value = {
        name: festival.name,
        days: diffDays,
        icon: festival.icon
      }
      return
    }
  }
  festivalInfo.value = null
}

let timeInterval: number
let festivalInterval: number

onMounted(() => {
  updateTime()
  updateFestival()
  timeInterval = window.setInterval(updateTime, 1000)
  festivalInterval = window.setInterval(updateFestival, 1000 * 60 * 60) // 每小时更新一次节日信息
})

onUnmounted(() => {
  window.clearInterval(timeInterval)
  window.clearInterval(festivalInterval)
})
</script>

<style scoped lang="scss">
.time-module {
  text-align: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.time {
  font-family: 'DIN Alternate', sans-serif;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 4px;
}

.date {
  font-size: 14px;
  opacity: 0.7;
  margin-bottom: 8px;
}

.festival {
  font-size: 14px;
  color: #FF4081;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}
</style> 