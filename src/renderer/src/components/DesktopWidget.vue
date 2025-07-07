<template>
  <div
    class="widget-container"
    @mousedown="startDrag"
    :style="{
      opacity: isDragging ? '0.8' : '1'
    }"
  >
    <div class="widget-content">
      <TimeModule />
      <WeatherModule />
      <AudioModule />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import TimeModule from './widget/TimeModule.vue'
import WeatherModule from './widget/WeatherModule.vue'
import AudioModule from './widget/AudioModule.vue'

const isDragging = ref(false)

// 开始拖动
const startDrag = (e: MouseEvent) => {
  if (e.target instanceof HTMLElement && e.target.closest('.no-drag')) {
    return
  }
  
  isDragging.value = true
  const { clientX, clientY } = e
  const { left, top } = (e.currentTarget as HTMLElement).getBoundingClientRect()
  
  window.electron.ipcRenderer.send('widget-drag-start', {
    mouseX: clientX - left,
    mouseY: clientY - top
  })

  const handleMouseMove = (e: MouseEvent) => {
    window.electron.ipcRenderer.send('widget-mouse-move', {
      screenX: e.screenX,
      screenY: e.screenY
    })
  }

  const handleMouseUp = () => {
    isDragging.value = false
    window.electron.ipcRenderer.send('widget-mouse-up')
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 监听快捷键
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') {
    window.electron.ipcRenderer.send('toggle-widget', false)
  }
}

onMounted(() => {
  console.log('Widget mounted');
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>

<style scoped lang="scss">
.widget-container {
  width: 300px;
  height: 400px;
  background: rgba(17, 17, 17, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(17, 17, 17, 0.8);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.15);
  }
}

.widget-content {
  height: 100%;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  color: rgba(255, 255, 255, 0.9);
}
</style> 