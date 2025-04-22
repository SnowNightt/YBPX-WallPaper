<template>
    <div class="login-container">
        <div class="img">
            <img src="../public/1.jpg" alt="">
        </div>
        <form @submit.prevent="handleLogin" class="form">
            <h2>登录</h2>
            <div class="form-group">
                <label for="username">用户名：</label>
                <input type="text" id="username" v-model="form.username" placeholder="请输入用户名" required />
                <span v-if="errors.username" class="error">{{ errors.username }}</span>
            </div>
            <div class="form-group">
                <label for="password">密码：</label>
                <input type="password" id="password" v-model="form.password" placeholder="请输入密码" required />
                <span v-if="errors.password" class="error">{{ errors.password }}</span>
            </div>
            <button type="submit" :disabled="loading">登录</button>
            <div class="tips">
                <p v-if="loginError" class="error">{{ loginError }}</p>
                <p class="text-center">没有账号？<span class="cursor-pointer" style="color: skyblue;"
                        @click="toRegister">点击注册</span></p>
            </div>

        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { authLogin } from "@renderer/plugin/api";
import { setToken } from "@renderer/utils/token";
import userStore from "@renderer/store/user";
import { useRouter } from "vue-router";
import { setLocalStorage } from "@renderer/utils/localStorage";
const router = useRouter()
const user = userStore()
const form = reactive({
    username: "",
    password: "",
});

const errors = reactive({
    username: "",
    password: "",
});

const loading = ref(false);
const loginError = ref("");

const validateForm = () => {
    let isValid = true;
    errors.username = form.username ? "" : "用户名不能为空";
    errors.password = form.password ? "" : "密码不能为空";
    if (!form.username) isValid = false;
    if (!form.password) isValid = false;
    return isValid;
};
const toRegister = async () => {
    router.push({ name: 'register' })
}
const handleLogin = async () => {
    if (!validateForm()) return;
    loading.value = true;
    loginError.value = "";
    try {
        const { status, data } = await authLogin(form)
        if (status === 200) {
            setToken(data.token)
            localStorage.setItem('username',form.username)
            user.username = data.username
            user.id = data.id
            setLocalStorage('userId', user.id)
            router.push({ name: 'home' })
        }
    } catch (error) {
        loginError.value = error.message;
    } finally {
        loading.value = false;
    }
};
</script>

<style lang="scss" scoped>
$primary-color: #4a90e2;
$error-color: #e74c3c;
$input-border-color: #ddd;
$input-focus-border-color: $primary-color;
$background-gradient-start: #e3f2fd;
$background-gradient-end: #bbdefb;

body {
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;
    background: linear-gradient(135deg, $background-gradient-start 0%, $background-gradient-end 100%);
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-container {
    width: 100%;
    max-width: 1000px;
    border-radius: 12px;
    background: #ffffff;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    transform: scale(1);
    transition: transform 0.3s;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    display: flex;

    &:hover {
        transform: scale(1.02) translate(-50%, -50%);
    }

    .form {
        flex: 1;
        padding: 30px 20px;
    }

    h2 {
        text-align: center;
        font-size: 34px;
        font-weight: bold;
        color: $primary-color;
        margin-bottom: 40px;
        position: relative;
        &:after {
            content: "";
            width: 68px;
            height: 4px;
            background: $primary-color;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            bottom: -8px;
            border-radius: 2px;
        }
    }

    .form-group {
        margin-bottom: 40px;
        display: flex;

        label {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            font-weight: bold;
            color: #555;
            width: 80px;

        }

        input {
            width: 100%;
            padding: 10px;
            border: 1px solid $input-border-color;
            border-radius: 6px;
            font-size: 16px;
            transition: all 0.3s ease-in-out;

            &:focus {
                border-color: $input-focus-border-color;
                box-shadow: 0 0 5px lighten($primary-color, 40%);
            }
        }

        .error {
            margin-top: 5px;
            font-size: 14px;
            color: $error-color;
            animation: shake 0.3s;
        }
    }

    button {
        width: 100%;
        padding: 12px;
        font-size: 16px;
        font-weight: bold;
        border: none;
        border-radius: 6px;
        background: $primary-color;
        color: #fff;
        cursor: pointer;
        transition: all 0.3s ease-in-out;
        margin-top: 20px;

        &:hover {
            background: darken($primary-color, 10%);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
        }

        &:disabled {
            background: lighten($primary-color, 20%);
            cursor: not-allowed;
        }
    }

    .tips {
        margin-top: 40px;
    }

    .error {
        color: $error-color;
        font-size: 14px;
        text-align: center;
        margin-top: 15px;
    }
}

/* 动画效果 */
@keyframes shake {

    0%,
    100% {
        transform: translateX(0);
    }

    25% {
        transform: translateX(-5px);
    }

    50% {
        transform: translateX(5px);
    }

    75% {
        transform: translateX(-5px);
    }
}
</style>
