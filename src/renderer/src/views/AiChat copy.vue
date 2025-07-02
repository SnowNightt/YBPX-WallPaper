<template>
    <div>
        123
    </div>
</template>

<script setup lang="ts">
import OpenAI from "openai";
import { onMounted } from "vue";
const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: 'sk-7139298919814474a08443a9fd33eb3e',
    dangerouslyAllowBrowser: true
});

async function main() {
    
    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: "你好" }],
        model: "deepseek-chat",
    });

    console.log(completion.choices[0].message.content);
}
onMounted(()=>{
    main();
})
</script>

<style scoped></style>