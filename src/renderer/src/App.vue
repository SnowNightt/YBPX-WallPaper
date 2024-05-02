<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <Suspense>
    <main class="w-screen h-screen">
      <Navbar />
      <router-view></router-view>
    </main>
  </Suspense>

</template>
<style scoped></style>
