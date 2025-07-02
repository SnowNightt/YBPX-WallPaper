// ChatView.vue
<template>
    <div class="min-h-screen bg-gradient-to-br from-pink-100 to-purple-100">
        <div class="container mx-auto px-4 py-8 max-w-4xl">
            <div class="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <!-- Header -->
                <div class="bg-gradient-to-r from-pink-400 to-purple-500 p-6 relative">
                    <h1 class="text-3xl md:text-4xl font-bold text-white text-center">
                        <a href="http://bhuacm.gczdy.cn" target="_blank" class="hover:text-gray-100 transition-colors">
                            WallPaper AIChat
                        </a>
                    </h1>
                    <p class="text-white text-center mt-2 opacity-90">你好像在等十九世纪的青洄</p>
                    <p class="text-white text-center mt-2 opacity-90">可我是北纬六十七度以北的雪</p>
                </div>

                <!-- Chat Container -->
                <div ref="chatBox" class="h-[60vh] overflow-y-auto p-6 bg-gray-50 scroll-smooth" @scroll="handleScroll">
                    <TransitionGroup name="message" enter-active-class="transition-all duration-300 ease-out"
                        enter-from-class="opacity-0 transform translate-y-4"
                        enter-to-class="opacity-100 transform translate-y-0">
                        <ChatMessage v-for="(msg, index) in messages" :key="index" :message="msg"
                            :is-last="index === messages.length - 1" />
                    </TransitionGroup>
                    <div v-if="isTyping" class="flex items-center space-x-2 p-4">
                        <div class="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>

                <!-- Input Area -->
                <MessageInput v-model="userMessage" @send="sendMessage" :disabled="isTyping"
                    @keydown.enter.prevent="handleEnter" />
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import ChatMessage from '../components/ChatMessage.vue'
import MessageInput from '../components/MessageInput.vue'
import { marked } from 'marked'
import OpenAI from "openai";
export default {
    name: 'ChatView',
    components: { ChatMessage, MessageInput },

    setup() {
        const chatBox = ref(null)
        const userMessage = ref('')
        const messages = ref([])
        const isTyping = ref(false)
        const showScrollButton = ref(false)

        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: 'sk-7139298919814474a08443a9fd33eb3e',
            dangerouslyAllowBrowser: true
        });
        // async function sendMessage() {
        //     const completion = await openai.chat.completions.create({
        //         messages: [{ role: "system", content: userMessage.value.trim() }],
        //         model: "deepseek-chat",
        //     });
        //     console.log(completion.choices[0].message.content);
        // }
        const scrollToBottom = async () => {
            await nextTick()
            if (chatBox.value) {
                chatBox.value.scrollTop = chatBox.value.scrollHeight
            }
        }

        const handleScroll = () => {
            if (!chatBox.value) return
            const { scrollTop, scrollHeight, clientHeight } = chatBox.value
            showScrollButton.value = scrollHeight - scrollTop - clientHeight > 100
        }

        const scrollToBottomSmooth = () => {
            if (chatBox.value) {
                chatBox.value.scrollTo({
                    top: chatBox.value.scrollHeight,
                    behavior: 'smooth'
                })
            }
        }

        const handleEnter = (e) => {
            if (!e.shiftKey) {
                sendMessage()
            }
        }

        const sendMessage = async () => {
            const message = userMessage.value.trim()
            if (!message || isTyping.value) return

            messages.value.push({
                text: message,
                sender: 'user',
                timestamp: new Date().toISOString()
            })

            userMessage.value = ''
            isTyping.value = true
            await scrollToBottom()

            try {
                // const response = await fetch(
                //     `http://gpt.gczdy.cn:8080/dduoai/chat?message=${encodeURIComponent(message)}`,
                //     { method: 'GET' }
                // )

                // if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`)
                const completion = await openai.chat.completions.create({
                    messages: [{ role: "system", content: message }],
                    model: "deepseek-chat",
                });
                console.log(completion.choices[0].message.content);

                // const data = await response.text()
                const data = completion.choices[0].message.content
                messages.value.push({
                    text: data,
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                })
            } catch (error) {
                messages.value.push({
                    text: '请求失败，请稍后再试',
                    sender: 'bot',
                    timestamp: new Date().toISOString()
                })
            } finally {
                isTyping.value = false
                await scrollToBottom()
            }
        }

        onMounted(() => {
            messages.value.push({
                text: '你好,我是WallPaper聊天机器人,你可以问我任何壁纸方面的问题或者和我聊天~~',
                sender: 'bot',
                timestamp: new Date().toISOString()
            })
        })

        return {
            chatBox,
            userMessage,
            messages,
            isTyping,
            showScrollButton,
            sendMessage,
            handleScroll,
            scrollToBottomSmooth,
            handleEnter
        }
    }
}
</script>

<style scoped>
.typing-indicator {
    display: flex;
    align-items: center;
    gap: 4px;
}

.typing-indicator span {
    width: 8px;
    height: 8px;
    background-color: #33e5e5;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
}

.typing-indicator span:nth-child(1) {
    animation-delay: -0.32s;
}

.typing-indicator span:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes bounce {

    0%,
    80%,
    100% {
        transform: scale(0);
    }

    40% {
        transform: scale(1.0);
    }
}

.scroll-smooth {
    scroll-behavior: smooth;
}
</style>
