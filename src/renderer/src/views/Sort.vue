<template>
    <main class="box-border px-8 py-2 flex">
        <div class="left">
            <div class="sort-nav mr-6">
                <!-- 山 -->
                <el-tooltip class="box-item" effect="dark" content="山" placement="right">
                    <mountain theme="outline" size="34" :strokeWidth="2" class="icons" @click="handleClick"
                        data-des="山" />
                </el-tooltip>
                <!-- 河 -->
                <el-tooltip class="box-item" effect="dark" content="河" placement="right">
                    <ProcessLine theme="outline" size="34" :strokeWidth="2" class="icons" @click="handleClick"
                        data-des="河" />
                </el-tooltip>
                <!-- 海 -->
                <el-tooltip class="box-item" effect="dark" content="海" placement="right">
                    <aquarius theme="outline" size="34" :strokeWidth="2" class="icons" @click="handleClick"
                        data-des="海" />
                </el-tooltip>
                <!-- 草原 -->
                <el-tooltip class="box-item" effect="dark" content="草原" placement="right">
                    <Sleaves theme="outline" size="34" :strokeWidth="2" class="icons" @click="handleClick"
                        data-des="草原" />
                </el-tooltip>
                <!-- 人 -->
                <el-tooltip class="box-item" effect="dark" content="人" placement="right">
                    <Peoples theme="outline" size="34" :strokeWidth="2" class="icons" @click="handleClick"
                        data-des="人" />
                </el-tooltip>
            </div>
        </div>
        <div class="right">
            <ImageList :data="data" />
            <Pagination :currentPage="config.currentPage" :pageSize="config.pageSize" :isSmall="config.isSmall"
                :isDisabel="config.isDisabel" :isBackground="config.isBackground" :total="config.total"
                @getImageList=getImageList />
        </div>
    </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { Mountain, ProcessLine, Aquarius, Sleaves, Peoples } from '@icon-park/vue-next';
import Pagination from '@renderer/components/Pagination.vue';
import ImageList from '@renderer/components/ImageList.vue';
import { dataType, configType } from '@renderer/type/selectPage/index';
import { reqImageList, reqSearchImages } from '@renderer/plugin/api';
import useConfigStore from '@renderer/store'
const configStore = useConfigStore()
const data = ref<dataType[]>([])
const config = reactive<configType>({
    currentPage: 1,
    pageSize: 9,
    total: 0,
    isSmall: false,
    isDisabel: false,
    isBackground: false,
})
watch(() => configStore.config.searchImages, () => {
    data.value = configStore.config.searchImages as dataType[]
    config.total = configStore.config.total
})
const searchImages = async () => {
    configStore.config.currentPage = 1
    const res = await reqSearchImages(configStore.config.key, configStore.config.currentPage)
    console.log(res);
    
    if (res.status == 201) {
        configStore.config.searchImages = res.data.data
        configStore.config.total = res.data.meta.total
    }
}
const handleClick = async (e: Event) => {
    const target = e.target as HTMLElement
    const parents = target.parentElement?.parentElement;
    [...(parents as HTMLElement).children].forEach(item => {
        ((item as HTMLElement).firstChild as SVGAElement).style.color = '#333'
    })
    target.style.color = '#74c0fc'
    configStore.config.key = target.parentElement!.dataset.des as string
    await searchImages()
}
const getImageList = (list: dataType[]) => {
    data.value = list
}
onMounted(async () => {
    configStore.config.currentPage = 1
    if (!configStore.config.key) {
        const res = await reqImageList(config.currentPage)
        if (res.status == 200) {
            data.value = res.data.data
            config.total = res.data.meta.total
        }
    } else {
        const res = await reqSearchImages(configStore.config.key, configStore.config.currentPage)
        if (res.status == 201) {
            configStore.config.searchImages = res.data.data
            configStore.config.total = res.data.meta.total
        }
    }

})
</script>

<style lang="scss" scoped>
.iconColor {
    color: #b197fc;
}

.icons {
    @apply mb-4 block cursor-pointer;

    &:hover {
        color: #74c0fc;
    }
}

.active {
    color: #74c0fc;
}
</style>