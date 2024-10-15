<template>
    <main class="box-border px-4 py-2 " >
        <ImageList :data="likeList" v-if="likeList.length > 0"/>
        <NoLike v-else/>
    </main>

</template>

<script setup lang="ts">
import ImageList from '@renderer/components/ImageList.vue';
import NoLike from '@renderer/components/NoLike.vue';
import useConfigStore from '@renderer/store/index'
import { dataType } from '@renderer/store/type';
import { ref } from 'vue';
const { config } = useConfigStore()
const likeList = ref<dataType[]>(config.likeList)
</script>

<style scoped lang="scss"></style>