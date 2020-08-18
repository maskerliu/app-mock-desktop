<template>
    <biz-main v-if="canRender" />
</template>

<script lang="ts" src="./App.vue.ts"></script>

<style>
::-webkit-scrollbar {
    width: 5px;
    height: 5px;
}
::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
}

.bg-border {
    margin: 5px;
    padding: 0;
    border-radius: 8px;
    border: 1px solid #e1e1e1;
    box-shadow: 0px 12px 8px -12px #000;
}
</style>
