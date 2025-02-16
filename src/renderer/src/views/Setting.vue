<template>
    <div>
        <main class="px-4">
            <h1 class="text-xl text-center mt-1 mb-3">用户设置</h1>
            <div class="choose flex flex-col">
                <h2 class="text-center">下载路径</h2>
                <div class="flex">
                    <el-input v-model="useConfig.config.imageSaveDirectory" disabled placeholder="请选择图片下载位置" />
                    <el-button type="primary" class="ml-2" @click="setImageSave">选择文件</el-button>
                </div>
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