<template>
    <div class="wall-paper-list grid grid-rows-3 grid-cols-3 gap-8">
        <div class="wall-paper-item cursor-pointer" v-for="item in data" :key="item.id">
            <img v-lazy="url + item.fileName" class="w-full h-full object-cover select-none" draggable="false"
                @click="showImgDetail(item.fileName as string)" ref="wallpaper" alt="error">
            <like theme="outline" size="30" fill="#000" :strokeWidth="2" class="icon" @click="setLike(item)" />
            <like theme="multi-color" size="30" :fill="['#212529', '#f03e3e', '#FFF', '#43CCF8']" :strokeWidth="2"
                class="icon" v-show="useConfig.config.likeList.some((ite) => item.fileName == ite.fileName)"
                @click="setDisLike(item)" />
        </div>
    </div>
    <el-drawer v-model="drawer" title="壁纸详情">

        <div class="img-detail">
            <div class="img-box w-full h-72 relative ">
                <img v-lazy="url + fileName" class="w-full h-72 object-cover shadow-md select-none rounded-t-xl "
                    draggable="false" alt="error" ref="image" @load="getImageInfo" />
                <div class="event" @mousemove="handleScaleImage" @mouseleave="isShowSetBtn = true"></div>
                <div class="big">
                    <img :src="url + fileName" ref="big" />
                </div>
                <div class="mask" ref="mask"></div>
            </div>
            <div class="p-4">
                <h2 class="title">标题</h2>
                <p class="mt-2 text-gray-600">分辨率：{{ wallpaperDetail.width }} x {{ wallpaperDetail.height }}</p>
                <p class="mt-1 text-gray-600">壁纸大小：{{ wallpaperDetail.memorySizeMB || 1 }} MB</p>
                <p class="mt-1 text-gray-600">来源：网络</p>
            </div>
        </div>
        <div class="tips" v-show="isShowSetBtn">
            <span>移</span>
            <span>到</span>
            <span>图</span>
            <span>像</span>
            <span>上</span>
            <span>看</span>
            <span>的</span>
            <span>更</span>
            <span>清</span>
            <span>晰</span>
        </div>
        <el-button @click="setWallPaper" type="success" class="set-btn" v-show="isShowSetBtn">设为壁纸</el-button>
    </el-drawer>
</template>

<script setup lang="ts">
import useWallPaper from '@renderer/composable/useWallPaper';
import { Like } from '@icon-park/vue-next';
import { ElMessage } from 'element-plus';
import { dataType } from '@renderer/store/type';
import useConfigStore from '@renderer/store/index'
import { useRoute, useRouter } from 'vue-router';
import { reactive, ref } from 'vue';
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
const drawer = ref<Boolean>(false)
const fileName = ref<String>('')
const image = ref<HTMLImageElement>()
const big = ref<HTMLImageElement>()
const mask = ref<HTMLDivElement>()
const isShowSetBtn = ref<Boolean>(true)
const wallpaperDetail = reactive({
    memorySizeMB: 0,
    width: 0,
    height: 0
})
const handleScaleImage = (event: MouseEvent) => {
    isShowSetBtn.value = false
    let left = event.offsetX - (mask.value as HTMLDivElement).offsetWidth / 2;
    let top = event.offsetY - (mask.value as HTMLDivElement).offsetHeight / 2;
    if (left < 0) {
        left = 0;
    }
    if (left > (mask.value as HTMLDivElement).offsetWidth) {
        left = (mask.value as HTMLDivElement).offsetWidth;
    }
    if (top < 0) {
        top = 0;
    }
    if (top > (mask.value as HTMLDivElement).offsetHeight) {
        top = (mask.value as HTMLDivElement).offsetHeight;
    }
    (mask.value as HTMLDivElement).style.left = left + 'px';
    (mask.value as HTMLDivElement).style.top = top + 'px';
    big.value!.style.left = -2 * left + 'px'
    big.value!.style.top = -2 * top + 'px'
}
const getImageInfo = () => {
    const img = new Image();
    img.src = url + fileName.value;
    img.onload = function () {
        // 获取分辨率
        wallpaperDetail.width = img.naturalWidth
        wallpaperDetail.height = img.naturalHeight
    };
    const width = (image.value as HTMLImageElement).naturalWidth;
    const height = (image.value as HTMLImageElement).naturalHeight;
    // 计算内存大小 (假设为 24-bit RGB)
    const memorySizeBytes = width * height * 3;
    wallpaperDetail.memorySizeMB = Math.round(memorySizeBytes / 1024 / 1024); // 转换为 KB
}
const setWallPaper = () => {
    if (route.name == 'sort' || route.name == 'like') {
        router.push({ name: 'home' })
        useConfig.config.url = url + fileName.value
    }
    allPageSetWallPaper(url + fileName.value)
}
const showImgDetail = (filename: string) => {
    drawer.value = true
    fileName.value = filename
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
        bottom: 10px;
        right: 30px;
    }

    .wall-paper-item {
        position: relative;
        overflow: hidden;
        transition: .5s;
        padding-right: 20px;

        &:hover {
            transform: scale(1.05);
        }

    }
}

.set-btn {
    @apply absolute bottom-8 left-1/2 -translate-x-1/2 w-56;
}

.img-detail {
    @apply max-w-sm mx-auto bg-white rounded-xl shadow-lg transition-transform duration-300 hover:scale-105;
}

.title {
    @apply text-xl font-semibold text-gray-800;
}

.big {
    width: 100%;
    height: 288px;
    position: absolute;
    top: 152%;
    left: 1px;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
        width: 200%;
        max-width: 200%;
        height: 200%;
        position: absolute;
        left: 0;
        top: 0;
    }
}

.mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
}

.event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
}

.event:hover~.mask,
.event:hover~.big {
    display: block;
}

.tips {
    margin-top: 130px;
    // 文字跳动帧动画
    @keyframes fontjump {
        0% {
            transform: translateY(0px);
        }

        91% {
            transform: translateY(0px);
        }

        100% {
            transform: translateY(-40px);

        }
    }

    span {
        color: #333;
        font-size: 30px;
        letter-spacing: 6px;
        font-family: 'FZShuTi';
        font-weight: bold;
        // 行内元素不能设置动画
        display: inline-block;

        // 设置文字不会被选中
        -moz-user-select: none;
        /*火狐*/
        -webkit-user-select: none;
        /*webkit浏览器*/
        -ms-user-select: none;
        /*IE10*/
        -khtml-user-select: none;
        /*早期浏览器*/
        user-select: none;
        // 帧动画
        animation: fontjump 4.6s cubic-bezier(0.05, 0, 0.2, 1) infinite;
        animation-direction: alternate;

    }

    // 单独设置每个字母的动画延时
    span:nth-of-type(1) {
        animation-delay: 2.2s;
    }

    span:nth-of-type(2) {
        animation-delay: 2.4s;
    }

    span:nth-of-type(3) {
        animation-delay: 2.6s;
    }

    span:nth-of-type(4) {
        animation-delay: 2.8s;
    }

    span:nth-of-type(5) {
        animation-delay: 3s;
    }

    span:nth-of-type(6) {
        animation-delay: 3.2s;
    }

    span:nth-of-type(7) {
        animation-delay: 3.4s;
    }

    span:nth-of-type(8) {
        animation-delay: 3.6s;
    }

    span:nth-of-type(9) {
        animation-delay: 3.8s;
    }

    span:nth-of-type(10) {
        animation-delay: 4s;
    }

}
</style>