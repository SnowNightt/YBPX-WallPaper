<template>
    <div>
        <main class="setting-container px-52"
            :class="{ 'pink-theme': useConfig.config.theme === 'pinkTheme', 'blue-theme': useConfig.config.theme == 'blueTheme', 'purple-theme': useConfig.config.theme === 'purpleTheme' }">
            <h1 class="text-xl text-center mt-1 mb-3">用户设置</h1>
            <div class="choose flex flex-col">
                <div class="flex mb-10 item-center">
                    <span class="inline-block" style="width: 100px;">下载路径：</span>
                    <el-input v-model="useConfig.config.imageSaveDirectory" disabled placeholder="请选择图片下载位置" />
                    <el-button type="primary" class="ml-2" @click="setImageSave">选择文件</el-button>
                </div>
                <div class="flex mb-10 item-center">
                    <span class="inline-block" style="width: 100px;">修改密码：</span>
                    <el-input v-model="password" placeholder="请输入" />
                    <el-button type="primary" class="ml-2" @click="setPassword">修改密码</el-button>
                </div>
                <div class="flex mb-10 item-center">
                    <span class="inline-block" style="width: 100px;">设置邮箱：</span>
                    <el-input v-model="userInfo.email" placeholder="请输入" />
                    <el-button type="primary" class="ml-2" @click="setUserInfo">设置邮箱</el-button>
                </div>
                <div class="flex mb-10 item-center">
                    <span class="inline-block" style="width: 100px;">设置昵称：</span>
                    <el-input v-model="userInfo.nickname" placeholder="请输入" />
                    <el-button type="primary" class="ml-2" @click="setUserInfo">设置昵称</el-button>
                </div>
                <div class="flex mb-10 item-center">
                    <span class="inline-block" style="width: 100px;">微信号：</span>
                    <el-input v-model="userInfo.wechat" placeholder="请输入" />
                    <el-button type="primary" class="ml-2" @click="setUserInfo">保存</el-button>
                </div>
                <div class="flex mb-10 item-center">
                    <span class="inline-block" style="width: 100px;">QQ号：</span>
                    <el-input v-model="userInfo.qqAccount" placeholder="请输入" />
                    <el-button type="primary" class="ml-2" @click="setUserInfo">保存</el-button>
                </div>
            </div>
            <div class="footer">
                <div class="logout">
                    <el-select size="large" v-model="selectTheme" placeholder="Select" style="width: 240px" @change="onChange">
                        <el-option v-for="item in themeList" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <el-button size="large" type="primary" @click="handleLogout" class="logout-btn ml-28">切换账号</el-button>
                </div>
            </div>
        </main>

    </div>
</template>

<script setup lang="ts">
import useConfigStore from '@renderer/store'
import useWallPaper from '@renderer/composable/useWallPaper';
import { useRouter } from 'vue-router';
import { changePassword, setUserInfoReq } from "@renderer/plugin/api";
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
const { setImageSave } = useWallPaper()
const router = useRouter()
const useConfig = useConfigStore()
const password = ref<string>('')
// 当前选中的主题
const selectTheme = ref<string>(localStorage.getItem('theme') || 'pinkTheme')
// 主题列表
const themeList = ref([
    {
        value: 'whiteTheme',
        label: '默认主题',
    },
    {
        value: 'pinkTheme',
        label: '粉色主题',
    },
    {
        value: 'blueTheme',
        label: '蓝色主题',
    },
    {
        value: 'purpleTheme',
        label: '紫色主题',
    },
])
// 切换主题
const onChange = (value: string) => {
    localStorage.setItem('theme', value)
    selectTheme.value = value
    useConfig.config.theme = value
}
// 用户信息
const userInfo = reactive({
    username: localStorage.getItem('username') || '',
    email: localStorage.getItem('email') || '',
    qqAccount: localStorage.getItem('qqAccount') || '',
    wechat: localStorage.getItem('wechat') || '',
    nickname: localStorage.getItem('nickname') || ''
})
// 修改密码的回调
const setPassword = async () => {
    const username = localStorage.getItem('username')
    await changePassword({ username: username!, password: password.value });
}
// 保存设置用户信息的回调
const setUserInfo = async () => {
    await setUserInfoReq(userInfo)
    if (userInfo.email) localStorage.setItem('email', userInfo.email)
    if (userInfo.qqAccount) localStorage.setItem('qqAccount', userInfo.qqAccount)
    if (userInfo.wechat) localStorage.setItem('wechat', userInfo.wechat)
    if (userInfo.nickname) localStorage.setItem('nickname', userInfo.nickname)
    ElMessage.success('设置成功！')
}
// 退出登录
const handleLogout = () => {
    localStorage.removeItem('TOKEN')
    router.push('/login')
}
</script>

<style lang="scss" scoped>
.setting-container {
    height: 100%;
    overflow: hidden;
}

.pink-theme {
    background: linear-gradient(-45deg, #fff3ff 0%, #ffe3ff 50%, #fff3ff 100%);
}

.blue-theme {
    background: linear-gradient(135deg, #f8f9ff 0%, #e6f3ff 25%, #c4dfff 50%, #a1c7ff 100%);
}

.purple-theme {
    background: linear-gradient(135deg, #f9f6ff 0%, #e6daff 25%, #c4b5ff 50%, #a18bff 100%);
}

.logout {
    @apply flex justify-center;

    .logout-btn {
        @apply w-56;
    }
}
</style>