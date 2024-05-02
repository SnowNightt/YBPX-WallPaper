<template>
    <div class="home-container">
        <div class="img-container h-80">
            <img @click="change" ref="img" :src="useConfig.config.url" alt="网络错误"
                class="select-none object-cover w-full h-full" draggable="false">
        </div>
        <div class="text-center py-3 my-4 mx-6 rounded-md btn" @click="setWallPaper">设置背景</div>
        <footer class="flex justify-between px-6 text-sm footer">
            <div class="left cursor-pointer" @click="downLoadImage">下载壁纸</div>
            <div class="right cursor-pointer"><a href="https://space.bilibili.com/50992816" target="_blank">联系我</a>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import http from '@renderer/plugin/axios';
import { ElLoading } from 'element-plus';
import { onMounted, ref } from 'vue';
import useConfigStore from '@renderer/store'
import useWallPaper from '@renderer/composable/useWallPaper';

const { setWallPaper, downLoadImage } = useWallPaper()
const useConfig = useConfigStore()
const img = ref<HTMLImageElement>()
const change = async () => {
    const res = await http.get('/')
    const url = res.data
    useConfig.config.url = url
    const loading = ElLoading.service({ fullscreen: true, text: '设置中...', background: 'rgba(255,255,255,.5)' })
    img.value!.src = url
    img.value!.addEventListener('load', () => {
        loading.close()
    })
}
onMounted(() => {
    if (!useConfig.config.url) change()
})
</script>

<style scoped lang="scss">
.home-container {
    .btn {
        background-color: #f1f3f5;
        transition: .2s linear;
        color: #d0bfff;
    }

    .btn:hover {
        background-color: #dee2e6;
        cursor: pointer;
    }

    .footer {
        color: #d0bfff;
        font-weight: 200;

        .left:hover,
        .right:hover {
            color: #9775fa;
        }
    }
}
</style>