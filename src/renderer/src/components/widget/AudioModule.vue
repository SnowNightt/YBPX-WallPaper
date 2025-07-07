<template>
  <div class="audio-module">
    <div class="audio-info">
      <div class="album-cover">
        <img :src="currentTrack.cover || '/path/to/default-cover.png'" alt="专辑封面">
      </div>
      <div class="track-info">
        <div class="track-name">{{ currentTrack.name || '未播放' }}</div>
        <div class="artist">{{ currentTrack.artist || '未知艺术家' }}</div>
      </div>
    </div>
    <div class="controls no-drag">
      <button @click="previous">
        <span class="icon">⏮</span>
      </button>
      <button @click="togglePlay">
        <span class="icon">{{ isPlaying ? '⏸' : '▶' }}</span>
      </button>
      <button @click="next">
        <span class="icon">⏭</span>
      </button>
      <div class="volume">
        <span class="icon">🔊</span>
        <input
          type="range"
          min="0"
          max="100"
          v-model="volume"
          @input="updateVolume"
        >
      </div>
    </div>
    <div class="progress-bar no-drag">
      <div class="time">{{ formatTime(currentTime) }}</div>
      <div class="progress" @click="seek">
        <div class="progress-current" :style="{ width: progress + '%' }"></div>
      </div>
      <div class="time">{{ formatTime(duration) }}</div>
    </div>
    <canvas ref="spectrumCanvas" class="spectrum"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const currentTrack = ref({
  name: '',
  artist: '',
  cover: ''
})
const isPlaying = ref(false)
const volume = ref(80)
const currentTime = ref(0)
const duration = ref(0)
const progress = ref(0)
const spectrumCanvas = ref<HTMLCanvasElement | null>(null)

let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let audioElement: HTMLAudioElement | null = null
let animationFrame: number | null = null

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// 播放控制
const togglePlay = () => {
  if (!audioElement) return
  if (isPlaying.value) {
    audioElement.pause()
  } else {
    audioElement.play()
  }
  isPlaying.value = !isPlaying.value
}

const previous = () => {
  // 实现上一首逻辑
  console.log('Previous track')
}

const next = () => {
  // 实现下一首逻辑
  console.log('Next track')
}

const updateVolume = () => {
  if (!audioElement) return
  audioElement.volume = volume.value / 100
}

const seek = (event: MouseEvent) => {
  if (!audioElement) return
  const progressBar = event.currentTarget as HTMLElement
  const rect = progressBar.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  audioElement.currentTime = percent * duration.value
}

// 频谱动画
const drawSpectrum = () => {
  if (!analyser || !spectrumCanvas.value) return
  
  const canvas = spectrumCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const bufferLength = analyser.frequencyBinCount
  const dataArray = new Uint8Array(bufferLength)
  analyser.getByteFrequencyData(dataArray)

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.fillStyle = '#2196F3'

  const barWidth = (canvas.width / bufferLength) * 2.5
  let x = 0

  for (let i = 0; i < bufferLength; i++) {
    const barHeight = (dataArray[i] / 255) * canvas.height
    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)
    x += barWidth + 1
  }

  animationFrame = requestAnimationFrame(drawSpectrum)
}

// 初始化音频上下文
const initAudio = () => {
  audioContext = new AudioContext()
  audioElement = new Audio()
  
  const source = audioContext.createMediaElementSource(audioElement)
  analyser = audioContext.createAnalyser()
  analyser.fftSize = 256
  
  source.connect(analyser)
  analyser.connect(audioContext.destination)

  // 监听音频事件
  audioElement.addEventListener('timeupdate', () => {
    if (!audioElement) return
    currentTime.value = audioElement.currentTime
    duration.value = audioElement.duration
    progress.value = (currentTime.value / duration.value) * 100
  })

  audioElement.addEventListener('play', () => {
    isPlaying.value = true
    drawSpectrum()
  })

  audioElement.addEventListener('pause', () => {
    isPlaying.value = false
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
  })
}

onMounted(() => {
  if (spectrumCanvas.value) {
    const canvas = spectrumCanvas.value
    canvas.width = canvas.offsetWidth * window.devicePixelRatio
    canvas.height = canvas.offsetHeight * window.devicePixelRatio
  }
  initAudio()
})

onUnmounted(() => {
  if (animationFrame) {
    cancelAnimationFrame(animationFrame)
  }
  if (audioContext) {
    audioContext.close()
  }
})
</script>

<style scoped lang="scss">
.audio-module {
  padding: 12px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.1);
}

.audio-info {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.album-cover {
  width: 48px;
  height: 48px;
  border-radius: 4px;
  overflow: hidden;
  margin-right: 12px;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.track-info {
  flex: 1;
  overflow: hidden;
}

.track-name {
  font-size: 14px;
  font-weight: 500;
  color: white;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.controls {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 8px;

  button {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    padding: 4px;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .icon {
      font-size: 16px;
    }
  }
}

.volume {
  display: flex;
  align-items: center;
  flex: 1;
  gap: 8px;

  .icon {
    color: white;
    font-size: 16px;
  }

  input[type="range"] {
    flex: 1;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    outline: none;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 12px;
      height: 12px;
      background: white;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}

.progress-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  .time {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.7);
    min-width: 35px;
  }

  .progress {
    flex: 1;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
    cursor: pointer;
    position: relative;

    .progress-current {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      background: #2196F3;
      border-radius: 2px;
    }
  }
}

.spectrum {
  width: 100%;
  height: 40px;
  background: transparent;
}
</style> 