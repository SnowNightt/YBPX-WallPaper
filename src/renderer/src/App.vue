<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import Navbar from './components/Navbar.vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
const router = useRouter()
onMounted(() => {
  window.electron.ipcRenderer.on('logout', () => {
    localStorage.removeItem('TOKEN');
    router.push('/login');
    ElMessage.success({
      message: '退出成功^_^',
      duration: 1000
    })
  });
});

// 在组件卸载时移除事件监听器，防止内存泄漏
onUnmounted(() => {
  window.electron.ipcRenderer.removeAllListeners('logout');
});
</script>

<template>
  <Suspense>
    <main class="box-border w-screen h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <router-view class="router-view overflow-y-auto"></router-view>
    </main>
  </Suspense>

</template>
<style scoped>
.router-view{
  height: calc(100% - 84px);
}
</style>
