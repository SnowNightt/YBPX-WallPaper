<script setup lang="ts">
import Navbar from './components/Navbar.vue';
</script>

<template>
  <Suspense>
    <main class="box-border w-screen h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <router-view></router-view>
    </main>
  </Suspense>

</template>
<style scoped></style>
