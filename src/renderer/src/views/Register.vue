<template>
    <div class="register-container">
        <div class="img">
            <img src="../public/2.jpg" alt="">
        </div>
        <form @submit.prevent="handleRegister" class="form">
            <h2>注册</h2>
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
            <button type="submit" :disabled="loading">注册</button>
            <div class="tips">
                <p v-if="registerError" class="error">{{ registerError }}</p>
                <p>已有账号，<span class="cursor-pointer" style="color: skyblue;"
                        @click="router.push({ name: 'login' })">点击登录</span></p>
            </div>
        </form>
    </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { authRegister } from "@renderer/plugin/api";
import { useRouter } from "vue-router";
const router = useRouter()
const form = reactive({
    username: "",
    password: "",
});

const errors = reactive({
    username: "",
    password: "",
});

const loading = ref(false);
const registerError = ref("");

const validateForm = () => {
    let isValid = true;
    errors.username = form.username ? "" : "用户名不能为空";
    errors.password = form.password ? "" : "密码不能为空";
    if (!form.username || !form.password) isValid = false;
    return isValid;
};
const handleRegister = async () => {
    if (!validateForm()) return;
    loading.value = true;
    registerError.value = "";
    try {
        const { status } = await authRegister(form); // 替换为实际注册请求
        if (status === 200) {
            router.push({ name: 'login' })
        }
    } catch (error) {
        registerError.value = error.message || "注册失败";
    } finally {
        loading.value = false;
    }
};
</script>

<style lang="scss" scoped>
$primary-color: #4caf50;
$secondary-color: #81c784;
$error-color: #e57373;
$input-border-color: #ddd;
$input-focus-border-color: $primary-color;
$background-gradient: linear-gradient(135deg, #a8e063, #56ab2f);

body {
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
    background: $background-gradient;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

.register-container {
    max-width: 1000px;
    width: 100%;
    border-radius: 12px;
    background-color: #fff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    transform: scale(1);
    transition: transform 0.3s;
    text-align: center;
    // animation: fadeIn 0.6s ease-out;
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
        margin-bottom: 40px;
        color: $primary-color;
        font-size: 34px;
        font-weight: bold;
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
        text-align: left;
        display: flex;

        label {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            width: 80px;
        }

        input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid $input-border-color;
            border-radius: 8px;
            font-size: 14px;
            outline: none;
            background: #f9f9f9;
            transition: all 0.3s ease;

            &:focus {
                border-color: $input-focus-border-color;
                background: #fff;
                box-shadow: 0 0 5px rgba($primary-color, 0.5);
            }
        }

        .error {
            margin-top: 5px;
            font-size: 12px;
            color: $error-color;
        }
    }

    button {
        width: 100%;
        padding: 12px 0;
        font-size: 16px;
        font-weight: bold;
        color: #fff;
        background: $primary-color;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        margin-top: 20px;

        &:hover {
            background: darken($primary-color, 10%);
            transform: scale(1.02);
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        &:disabled {
            background: lighten($primary-color, 20%);
            cursor: not-allowed;
            transform: none;
        }
    }

    .tips {
        margin-top: 40px;
    }

    .error {
        color: $error-color;
        font-size: 14px;
        margin-top: 15px;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>