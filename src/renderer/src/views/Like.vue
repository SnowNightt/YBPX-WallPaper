<template>
    <main class="box-border px-4 py-2 h-full">
        <ImageList :data="config.likeList" v-if="config.likeList.length > 0" />
        <NoLike v-else />
    </main>

</template>

<script setup lang="ts">
import ImageList from '@renderer/components/ImageList.vue';
import NoLike from '@renderer/components/NoLike.vue';
import { getCollectImage } from '@renderer/plugin/api';
import useConfigStore from '@renderer/store/index'
// import { dataType } from '@renderer/store/type';
import { getLocalStorage } from '@renderer/utils/localStorage';
import { onMounted, ref } from 'vue';
const { config } = useConfigStore()
const userId = getLocalStorage('userId')
// const likeList = ref<any>(config.likeList)
onMounted(async () => {
    const { status, data: { favorites } } = await getCollectImage({ userId: +userId! })
    if (status === 200) {
        console.log(favorites);
        config.likeList = favorites
        // likeList.value = config.likeList
    }
})

</script>

<style scoped lang="scss"></style>