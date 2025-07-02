<template>
    <header class="box-border px-8 py-6 flex justify-between drag">
        <h2 class="font-light text-3xl select-none">WallPaper</h2>
        <Input v-show="$route.name == 'sort'" />
        <nav class="flex items-center nodrag">
            <home theme="outline" :strokeWidth="3" size="30" class="cursor-pointer"
                @click="$router.push({ name: 'home' })" :class="{ iconColor: $route.name == 'home' }" />
            <!-- <all-application theme="outline" size="28" :strokeWidth="3" class="ml-2 cursor-pointer"
                :class="{ iconColor: $route.name == 'selectpage' }" @click="$router.push({ name: 'selectpage' })" /> -->
            <all-application theme="outline" size="28" :strokeWidth="3" class="ml-2 cursor-pointer"
                :class="{ iconColor: $route.name == 'sort' }" @click="$router.push({ name: 'sort' })" />
            <star theme="outline" size="30" :strokeWidth="3" class="ml-2 cursor-pointer"
                @click="$router.push({ name: 'like' })" :class="{ iconColor: $route.name == 'like' }" />
            <avatar theme="outline" size="30" class="ml-2 cursor-pointer" :strokeWidth="3"
                :class="{ iconColor: $route.name == 'setting' }" @click="$router.push({ name: 'setting' })" />
            <android theme="outline" size="30" class="ml-2 cursor-pointer" :strokeWidth="3"
                :class="{ iconColor: $route.name == 'ai' }" @click="$router.push({ name: 'ai' })" />
            <preview-close theme="outline" size="28" fill="#333" :strokeWidth="4" class="ml-2 cursor-pointer" @click="miniSize"/>
            <power theme="outline" size="28" fill="#333" :strokeWidth="4" class="ml-2 cursor-pointer" @click="quit" />
        </nav>
    </header>
</template>

<script setup lang="ts">
import Input from './Input.vue';
import { Home, AllApplication, Star, Power, Avatar,BookmarkOne,PreviewClose,Android } from '@icon-park/vue-next';
const quit = () => {
    window.api.quit()
}
const miniSize = ()=>{
    window.api.miniSize()
}
</script>

<style lang="scss" scoped>
.iconColor {
    color: #b197fc;
}
</style>