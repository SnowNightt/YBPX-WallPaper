<template>
    <div class="pagination-container flex justify-center my-5">
        <el-pagination v-model:current-page="config.currentPage" :page-size="pageSize" :small="isSmall"
            :disabled="isDisabel" :background="isBackground" layout=" pager" :total="total"
            @current-change="handleCurrentChange" />
    </div>
</template>

<script setup lang="ts">
import { paginationConfig } from './type';
import { reqImageList, reqSearchImages } from '../../../src/renderer/src/plugin/api.ts';
import { Data } from '../../../src/renderer/src/plugin/type.ts';
import useConfigStore from '../../../src/renderer/src/store/index.ts';
const { config } = useConfigStore()
defineProps<paginationConfig>()

// const emit = defineEmits(['getImageList'])
const emit = defineEmits<{ (e: 'getImageList', data: Data[]): void }>()
const handleCurrentChange = async (page: number) => {
    // 判断是否是搜索得到的图片
    if (config.key) {
        const res = await reqSearchImages(config.key, config.currentPage)
        if (res.status == 201) {
            emit('getImageList', res.data.data)
        }
    } else {
        const res = await reqImageList(page)
        if (res.status == 200) {
            emit('getImageList', res.data.data)
        }
    }

}
</script>

<style scoped lang="scss"></style>