<template>
    <div class="home-container flex-1 ">
        <div class="top">
            <div class="left-part">
                <span class="left-bg"
                    :class="{ 'pink-theme': useConfig.config.theme === 'pinkTheme', 'blue-theme': useConfig.config.theme == 'blueTheme', 'purple-theme': useConfig.config.theme === 'purpleTheme' }"></span>
                <canvas id="left-canvas"></canvas>
            </div>
            <div class="img-container h-[711px] w-full flex  justify-center">
                <img @click="change" ref="img" :src="useConfig.config.url" alt="网络错误"
                    class="select-none object-cover w-[1080px]" draggable="false">
            </div>
            <div class="right-part">
                <span class="right-bg"
                    :class="{ 'pink-theme': useConfig.config.theme === 'pinkTheme', 'blue-theme': useConfig.config.theme == 'blueTheme', 'purple-theme': useConfig.config.theme === 'purpleTheme' }"></span>
                <canvas id="right-canvas"></canvas>
            </div>
        </div>
        <div class="switch relative h-[48px]">
            <div class="text-center py-3 my-4 mx-6 rounded-md btn w-1/2 absolute left-1/2 -translate-x-1/2 text-2xl"
                @click="setWallPaper">设置壁纸</div>
        </div>
        <footer class="flex justify-between px-[250px] text-xl footer mt-8 pb-8">
            <div class="left cursor-pointer" @click="downLoadImage">下载壁纸</div>
            <div class="right cursor-pointer"><a href="https://space.bilibili.com/50992816" target="_blank">联系我</a>
            </div>
        </footer>
    </div>
</template>

<script setup lang="ts">
import http from '@renderer/plugin/axios';
import { ElLoading } from 'element-plus';
import { onMounted, ref } from 'vue';
import useConfigStore from '@renderer/store'
import useWallPaper from '@renderer/composable/useWallPaper';

const { setWallPaper, downLoadImage } = useWallPaper()
const useConfig = useConfigStore()
const img = ref<HTMLImageElement>()
const change = async () => {
    const res = await http.get('/')
    const url = res.data
    useConfig.config.url = url
    const loading = ElLoading.service({ fullscreen: true, text: '设置中...', background: 'rgba(255,255,255,.5)' })
    img.value!.src = url
    img.value!.addEventListener('load', () => {
        loading.close()
    })
}
const initLine = (className: string) => {
    (function () {
        const canvas = document.getElementById(`${className}`) as HTMLCanvasElement;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const particleNum = 13;
        const lineDistance = 400;
        const minConnectionDistance = 50; // 设置最小连接距离
        const colorRGB = '216, 123, 190';
        let particles: Particle[] = [];
        let interactionParticle: Particle | null = null;

        class Particle {
            x: number;
            y: number;
            velocityX: number;
            velocityY: number;
            size: number;
            color: string;

            constructor(x: number, y: number, velocityX: number, velocityY: number, size: number, color: string) {
                this.x = x;
                this.y = y;
                this.velocityX = velocityX;
                this.velocityY = velocityY;
                this.size = size;
                this.color = color;
            }

            draw(): void {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            update(): void {
                if (this.x > canvas.width || this.x < 0) {
                    this.velocityX *= -1;
                }
                if (this.y > canvas.height || this.y < 0) {
                    this.velocityY *= -1;
                }
                this.x += this.velocityX;
                this.y += this.velocityY;
                this.draw();
            }
        }

        function getRandomArbitrary(min: number, max: number): number {
            return Math.random() * (max - min) + min;
        }

        function createParticles(): void {
            for (let i = 0; i < particleNum; i++) {
                let size = getRandomArbitrary(1, 3);
                let x = Math.random() * canvas.width;
                let y = Math.random() * canvas.height;
                let velocityX = getRandomArbitrary(-2, 2);
                let velocityY = getRandomArbitrary(-2, 2);
                let color = `rgba(${colorRGB}, ${1 - size / 3})`;
                particles.push(new Particle(x, y, velocityX, velocityY, size, color));
            }
        }

        function animate(): void {
            requestAnimationFrame(animate);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => particle.update());
            connect();
        }

        function connect(): void {
            ctx.lineWidth = 6.0
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const p1 = particles[i];
                    const p2 = particles[j];
                    let distance = Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
                    if (distance < lineDistance && distance > minConnectionDistance) {
                        ctx.strokeStyle = `rgba(${colorRGB}, ${1 - distance / lineDistance})`;
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();

                        // 绘制线条端点
                        const endpointSize = 4; // 端点的大小
                        ctx.fillStyle = `rgba(${colorRGB}, 1)`; // 端点颜色

                        ctx.beginPath();
                        ctx.arc(p1.x, p1.y, endpointSize, 0, Math.PI * 2); // 端点1
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(p2.x, p2.y, endpointSize, 0, Math.PI * 2); // 端点2
                        ctx.fill();
                    }
                }
            }
        }

        function bindEvents(): void {
            canvas.addEventListener('mouseout', (_e: MouseEvent) => {
                if (interactionParticle) {
                    interactionParticle.x = NaN; // or any value that makes sense
                    interactionParticle.y = NaN; // to indicate no interaction
                }
            });

            canvas.addEventListener('mouseover', (e: MouseEvent) => {
                if (!interactionParticle) {
                    // 粒子应当出现在鼠标位置
                    interactionParticle = new Particle(e.clientX, e.clientY, 0, 0, 4, `rgba(${colorRGB}, 1)`);
                    particles.push(interactionParticle);
                }
            });

            canvas.addEventListener('mousemove', (e: MouseEvent) => {
                if (interactionParticle) {
                    // 鼠标移动时，更新粒子位置
                    interactionParticle.x = e.clientX;
                    interactionParticle.y = e.clientY;
                }
            });
        }

        bindEvents();
        createParticles();
        animate();
    }());
}

onMounted(() => {
    if (!useConfig.config.url) change()
    initLine('left-canvas')
    initLine('right-canvas')
})
</script>

<style scoped lang="scss">
.pink-theme {
    background: linear-gradient(-45deg, #fff3ff 0%, #ffe3ff 50%, #fff3ff 100%);
}

.blue-theme {
    background: linear-gradient(135deg, #f8f9ff 0%, #e6f3ff 25%, #c4dfff 50%, #a1c7ff 100%);
}

.purple-theme {
    background: linear-gradient(135deg, #f9f6ff 0%, #e6daff 25%, #c4b5ff 50%, #a18bff 100%);
}

.home-container {
    .top {
        display: flex;
    }

    .left-part {
        flex: 1;
        position: relative;

        .left-bg {
            display: inline-block;
            position: absolute;
            width: 100%;
            opacity: .5;
            // background: linear-gradient(-45deg, #fff3ff 0%, #ffe3ff 50%, #fff3ff 100%);
            min-height: 100%;
        }

        #left-canvas {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }
    }

    .right-part {
        flex: 1;
        position: relative;

        .right-bg {
            display: inline-block;
            position: absolute;
            width: 100%;
            opacity: .5;
            min-height: 100%;
            // background: linear-gradient(-45deg, #fff3ff 0%, #ffe3ff 50%, #fff3ff 100%);
        }

        #right-canvas {
            position: relative;
            display: block;
            width: 100%;
            height: 100%;
        }
    }

    .img-container {
        flex: 3;
    }

    .btn {
        background-color: #f1f3f5;
        transition: .2s linear;
        color: #d0bfff;
    }

    .btn:hover {
        background-color: #dee2e6;
        cursor: pointer;
    }

    .footer {
        color: #d0bfff;
        font-weight: 200;

        .left:hover,
        .right:hover {
            color: #9775fa;
        }
    }
}
</style>