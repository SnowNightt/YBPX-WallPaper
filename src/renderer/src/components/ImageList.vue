<template>
    <div class="wall-paper-list grid grid-rows-3 grid-cols-3 gap-8">
        <div class="wall-paper-item cursor-pointer" v-for="item in data" :key="item.id">
            <img v-lazy="url + item.fileName" class="w-full h-full object-cover select-none" draggable="false"
                @click="setWallPaper(item.fileName as string)" ref="wallpaper" alt="error">
            <like theme="outline" size="30" fill="#000" :strokeWidth="2" class="icon" @click="setLike(item)" />
            <like theme="multi-color" size="30" :fill="['#212529', '#f03e3e', '#FFF', '#43CCF8']" :strokeWidth="2"
                class="icon" v-show="useConfig.config.likeList.some((ite) => item.fileName == ite.fileName)"
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
import { collectImage, getCollectImage, uncollectImage } from '@renderer/plugin/api';
import { getLocalStorage } from '@renderer/utils/localStorage';
const { allPageSetWallPaper } = useWallPaper()
// defineProps(['data'])
defineProps<{ data: dataType[] }>()
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
const userId = getLocalStorage('userId')
// 爱心点击事件
const setLike = async (item: dataType) => {
    if (useConfig.config.likeList.length == 9) {
        ElMessage.warning('只能收藏9张壁纸哦~')
    } else {
        const { status } = await collectImage({ wallpaperName: item.fileName!, userId: +userId! })
        if (status === 200) {
            // useConfig.config.likeList.push(item)
            ElMessage.success({
                message: '收藏成功^_^',
                duration: 500
            })
            const { status, data: { favorites } } = await getCollectImage({ userId: +userId! })
            if (status === 200) {
                useConfig.config.likeList = favorites
            }
        }

    }
}
const setDisLike = async (item: dataType) => {
    const { status } = await uncollectImage({ wallpaperName: item.fileName!, userId: +userId! })
    if (status === 200) {
        // const delIndex = useConfig.config.likeList.findIndex((ite => ite.fileName == item.fileName))
        // useConfig.config.likeList.splice(delIndex, 1)
        ElMessage.success({
            message: '取消收藏QAQ~',
            duration: 500
        })
        const { status, data: { favorites } } = await getCollectImage({ userId: +userId! })
        if (status === 200) {
            useConfig.config.likeList = favorites
        }
    }

}

</script>

<style scoped lang="scss">
.wall-paper-list {
    .icon {
        position: absolute;
        bottom: 0;
        right: 0;
    }

    .wall-paper-item {
        position: relative;

        overflow: hidden;
        transition: .5s;

        &:hover {
            transform: scale(1.05);
        }

    }
}
</style>