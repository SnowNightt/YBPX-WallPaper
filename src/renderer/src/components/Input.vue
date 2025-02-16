<template>
    <div class="input nodrag">
        <input type="text" class="put" v-model="config.key" ref="inputInstance" />
        <search theme="outline" size="16" fill="#999" class="icon search" @click="searchImages" />
    </div>
</template>

<script setup>
import { Search } from '@icon-park/vue-next';
import { reqSearchImages } from '@renderer/plugin/api';
import { ref } from 'vue';
import useConfigStore from '@renderer/store'
const { config } = useConfigStore()
const searchImages = async () => {
    config.currentPage = 1
    const res = await reqSearchImages(config.key, config.currentPage)
    if (res.status == 201) {
        config.searchImages = res.data.data
        config.total = res.data.meta.total
    }
}
</script>

<style lang="scss" scoped>
.input {
    position: relative;
    width: 350px;
    height: 30px;
    box-sizing: border-box;

    input {
        margin: 0;
        font-size: 12px;
        color: #868e96;
        padding: 5px;
        height: 30px;
        width: 350px;
        outline: none;
        padding-inline: none;
        border: 1.5px solid #adb5bd;
        border-radius: 5px;

        &:focus {
            border: 1px solid #d0bfff;
            box-shadow: 0px 0px 5px 0px #d0bfff;
        }
    }

    .search {
        cursor: pointer;
        position: absolute;
        right: 2px;
        top: 6px;
    }
}
</style>