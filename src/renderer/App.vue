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
    height: calc(100vh - 80px);
    margin: 5px;
    padding: 0;
    border: 1px solid #f1f1f1;
    border-radius: 8px;
    box-shadow: 1px 1px 1px rgba(120, 120, 120, 0.5);
}
</style>
