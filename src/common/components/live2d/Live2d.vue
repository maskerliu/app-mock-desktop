<template>
    <div id="live2d" :style="{ zIndex }" @mouseover="toolShow = true" @mouseout="toolShow = false">
        <div v-show="mainShow">
            <div id="live2d-tip" v-html="tipText" v-show="tipShow" />
            <canvas id="live2d-main" width="250" height="250" />
        </div>
        <div id="live2d-toggle" v-show="!mainShow" @click="mainShow = true">
            <span>看板娘</span>
        </div>
    </div>
</template>

<script lang="ts" src="./Live2d.vue.ts"></script>

<style scoped>
#live2d {
    position: fixed;
    width: 250px;
    height: 250px;
    bottom: 10px;
    right: 0;
    transition: transform 0.3s ease-in-out;
    transform: translateY(3px);
}
#live2d:hover {
    width: 250px;
    transform: translateY(0);
}
#live2d-tip {
    position: absolute;
    width: 220px;
    min-height: 2rem;
    margin-top: -20px;
    padding: 5px 10px;
    font-size: 0.9rem;
    line-height: 1.5rem;
    word-break: break-all;
    text-overflow: ellipsis;
    border: 1px solid rgba(224, 186, 140, 0.62);
    border-radius: 12px;
    background-color: rgba(236, 217, 188, 0.5);
    box-shadow: 0 3px 15px 2px rgba(191, 158, 118, 0.2);
    animation: shake 50s ease-in-out 5s infinite;
}
#live2d-main {
    cursor: grab;
    cursor: -webkit-grab;
    cursor: -o-grab;
    cursor: -ms-grab;
}
#live2d-main:active {
    cursor: grabbing;
    cursor: -webkit-grabbing;
    cursor: -o-grabbing;
    cursor: -ms-grabbing;
}
#live2d-tool {
    position: absolute;
    bottom: 10px;
    right: 0;
    color: #aaa;
    transition: opacity 1s;
}
#live2d-tool span {
    display: block;
    cursor: pointer;
    line-height: 30px;
    text-align: center;
    color: #5b6c7d;
    transition: color 0.3s;
}
#live2d-tool span:hover {
    color: #0684bd;
}
#live2d-toggle {
    width: 1.7rem;
    position: absolute;
    bottom: 2rem;
    right: 0;
    padding: 0.3rem 0;
    writing-mode: vertical-lr;
    color: #fff;
    background-color: #fa0;
    border-radius: 0.5rem 0 0 0.5rem;
    font-size: 1rem;
    cursor: pointer;
}
#live2d-toggle:hover {
    width: 2rem;
}
@keyframes shake {
    2% {
        transform: translate(0.5px, -1.5px) rotate(-0.5deg);
    }
    4% {
        transform: translate(0.5px, 1.5px) rotate(1.5deg);
    }
    6% {
        transform: translate(1.5px, 1.5px) rotate(1.5deg);
    }
    8% {
        transform: translate(2.5px, 1.5px) rotate(0.5deg);
    }
    10% {
        transform: translate(0.5px, 2.5px) rotate(0.5deg);
    }
    12% {
        transform: translate(1.5px, 1.5px) rotate(0.5deg);
    }
    14% {
        transform: translate(0.5px, 0.5px) rotate(0.5deg);
    }
    16% {
        transform: translate(-1.5px, -0.5px) rotate(1.5deg);
    }
    18% {
        transform: translate(0.5px, 0.5px) rotate(1.5deg);
    }
    20% {
        transform: translate(2.5px, 2.5px) rotate(1.5deg);
    }
    22% {
        transform: translate(0.5px, -1.5px) rotate(1.5deg);
    }
    24% {
        transform: translate(-1.5px, 1.5px) rotate(-0.5deg);
    }
    26% {
        transform: translate(1.5px, 0.5px) rotate(1.5deg);
    }
    28% {
        transform: translate(-0.5px, -0.5px) rotate(-0.5deg);
    }
    30% {
        transform: translate(1.5px, -0.5px) rotate(-0.5deg);
    }
    32% {
        transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }
    34% {
        transform: translate(2.5px, 2.5px) rotate(-0.5deg);
    }
    36% {
        transform: translate(0.5px, -1.5px) rotate(0.5deg);
    }
    38% {
        transform: translate(2.5px, -0.5px) rotate(-0.5deg);
    }
    40% {
        transform: translate(-0.5px, 2.5px) rotate(0.5deg);
    }
    42% {
        transform: translate(-1.5px, 2.5px) rotate(0.5deg);
    }
    44% {
        transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }
    46% {
        transform: translate(1.5px, -0.5px) rotate(-0.5deg);
    }
    48% {
        transform: translate(2.5px, -0.5px) rotate(0.5deg);
    }
    50% {
        transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }
    52% {
        transform: translate(-0.5px, 1.5px) rotate(0.5deg);
    }
    54% {
        transform: translate(-1.5px, 1.5px) rotate(0.5deg);
    }
    56% {
        transform: translate(0.5px, 2.5px) rotate(1.5deg);
    }
    58% {
        transform: translate(2.5px, 2.5px) rotate(0.5deg);
    }
    60% {
        transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }
    62% {
        transform: translate(-1.5px, 0.5px) rotate(1.5deg);
    }
    64% {
        transform: translate(-1.5px, 1.5px) rotate(1.5deg);
    }
    66% {
        transform: translate(0.5px, 2.5px) rotate(1.5deg);
    }
    68% {
        transform: translate(2.5px, -1.5px) rotate(1.5deg);
    }
    70% {
        transform: translate(2.5px, 2.5px) rotate(0.5deg);
    }
    72% {
        transform: translate(-0.5px, -1.5px) rotate(1.5deg);
    }
    74% {
        transform: translate(-1.5px, 2.5px) rotate(1.5deg);
    }
    76% {
        transform: translate(-1.5px, 2.5px) rotate(1.5deg);
    }
    78% {
        transform: translate(-1.5px, 2.5px) rotate(0.5deg);
    }
    80% {
        transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
    }
    82% {
        transform: translate(-1.5px, 0.5px) rotate(-0.5deg);
    }
    84% {
        transform: translate(-0.5px, 0.5px) rotate(1.5deg);
    }
    86% {
        transform: translate(2.5px, 1.5px) rotate(0.5deg);
    }
    88% {
        transform: translate(-1.5px, 0.5px) rotate(1.5deg);
    }
    90% {
        transform: translate(-1.5px, -0.5px) rotate(-0.5deg);
    }
    92% {
        transform: translate(-1.5px, -1.5px) rotate(1.5deg);
    }
    94% {
        transform: translate(0.5px, 0.5px) rotate(-0.5deg);
    }
    96% {
        transform: translate(2.5px, -0.5px) rotate(-0.5deg);
    }
    98% {
        transform: translate(-1.5px, -1.5px) rotate(-0.5deg);
    }
    0%,
    100% {
        transform: translate(0, 0) rotate(0deg);
    }
}
</style>
