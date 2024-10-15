<template>
    <div class="wall-paper-list grid grid-rows-3 grid-cols-3 gap-2">
        <div class="wall-paper-item cursor-pointer" v-for="item in data" :key="item.id">
            <img v-lazy="url + item.fileName" class="w-full h-full object-cover select-none" draggable="false"
                @click="setWallPaper(item.fileName as string)" ref="wallpaper" alt="error">
            <like theme="outline" size="24" fill="#000" :strokeWidth="2" class="icon" @click="setLike(item)" />
            <like theme="multi-color" size="24" :fill="['#212529', '#f03e3e', '#FFF', '#43CCF8']" :strokeWidth="2"
                class="icon" v-show="useConfig.config.likeList.some((ite) => item.id == ite.id)"
                @click="setDisLike(item)" />
        </div>
    </div>
</template>

<script setup lang="ts">
import useWallPaper from '@renderer/composable/useWallPaper';
import { Like } from '@icon-park/vue-next';
import { ElMessage } from 'element-plus';
import { dataType } from '@renderer/store/type';
import useConfigStore from '@renderer/store/index'
import { useRoute, useRouter } from 'vue-router';
import { ref } from 'vue';
const { allPageSetWallPaper } = useWallPaper()
// defineProps(['data'])
defineProps<{data:dataType[]}>()
// 以后记得改一下
const url = 'http://localhost:3000/wallpaper/'
const route = useRoute()
const router = useRouter()
const useConfig = useConfigStore()
const wallpaper = ref<HTMLImageElement>()
const setWallPaper = (fileName: string) => {
    if (route.name == 'selectpage' || route.name == 'like') {
        router.push({ name: 'home' })
        useConfig.config.url = url + fileName
    }
    allPageSetWallPaper(url + fileName)
}

// 爱心点击事件
const setLike = (item: dataType) => {
    if (useConfig.config.likeList.length == 9) {
        ElMessage.warning('只能收藏9张壁纸哦~')
    } else {
        ElMessage.success({
            message: '收藏成功^_^',
            duration: 500
        })
        useConfig.config.likeList.push(item)
    }
}
const setDisLike = (item: dataType) => {
    ElMessage.success({
        message: '取消收藏QAQ~',
        duration: 500
    })
    const delIndex = useConfig.config.likeList.findIndex((ite => ite.id == item.id))
    useConfig.config.likeList.splice(delIndex, 1)
}

</script>

<style scoped lang="scss">
.wall-paper-list {
    height: 355px;
    width: 468px;

    .icon {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .wall-paper-item {
        position: relative;
        height: 113px;
        width: 151px;
        // max-height: 113px;
        // max-width: 151px;
        overflow: hidden;
        transition: .5s;

        &:hover {
            transform: scale(1.05);
        }

    }
}
</style>