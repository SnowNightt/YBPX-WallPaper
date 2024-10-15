<template>
    <div>
        <main class="px-4">
            <h2 class="text-center mt-1 mb-3">参数设置</h2>
            <div class="choose flex">
                <el-input v-model="useConfig.config.imageSaveDirectory" disabled placeholder="请选择图片下载位置" />
                <el-button type="primary" class="ml-2" @click="setImageSave">选择文件</el-button>
            </div>
        </main>
    </div>
</template>

<script setup lang="ts">
import useConfigStore from '@renderer/store'
import useWallPaper from '@renderer/composable/useWallPaper';
const { setImageSave } = useWallPaper()
const useConfig = useConfigStore()
</script>

<style lang="scss" scoped></style>