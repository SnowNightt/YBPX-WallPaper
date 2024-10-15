<template>
    <header class="px-4 py-3 flex justify-between drag">
        <h2 class="font-light text-xl select-none">WallPaper</h2>
        <Input v-show="$route.name == 'selectpage'" />
        <nav class="flex items-center nodrag">
            <home theme="outline" :strokeWidth="3" size="24" class="cursor-pointer"
                @click="$router.push({ name: 'home' })" :class="{ iconColor: $route.name == 'home' }" />

            <all-application theme="outline" size="22" :strokeWidth="3" class="ml-2 cursor-pointer"
                :class="{ iconColor: $route.name == 'selectpage' }" @click="$router.push({ name: 'selectpage' })" />
            <star theme="outline" size="24" :strokeWidth="3" class="ml-2 cursor-pointer"
                @click="$router.push({ name: 'like' })" :class="{ iconColor: $route.name == 'like' }" />
            <config theme="outline" size="24" class="ml-2 cursor-pointer" :strokeWidth="3"
                :class="{ iconColor: $route.name == 'setting' }" @click="$router.push({ name: 'setting' })" />

            <power theme="outline" size="22" fill="#333" :strokeWidth="4" class="ml-2 cursor-pointer" @click="quit" />
        </nav>
    </header>
</template>

<script setup lang="ts">
import Input from './Input.vue';
import { Config, Home, AllApplication, Star, Power } from '@icon-park/vue-next';
const quit = () => {
    window.api.quit()
}
</script>

<style lang="scss" scoped>
.iconColor {
    color: #b197fc;
}
</style>