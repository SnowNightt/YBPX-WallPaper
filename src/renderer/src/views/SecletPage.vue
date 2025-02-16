<template>
    <main class="box-border px-8 py-2">
        <ImageList :data="data" />
        <Pagination :currentPage="config.currentPage" :pageSize="config.pageSize" :isSmall="config.isSmall"
            :isDisabel="config.isDisabel" :isBackground="config.isBackground" :total="config.total"
            @getImageList=getImageList />
    </main>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
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

<style lang="scss" scoped></style>