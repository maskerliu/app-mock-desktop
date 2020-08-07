<template>
    <el-row id="box" style="height: 100%; padding: 15px;">
        <el-input v-model="input" placeholder="请输入内容"></el-input>
        <el-button @click="closePushClient" type="success" plain>断开PushClient</el-button>
    </el-row>
</template>

<script lang="ts" src="./Demo.vue.ts"></script>

<style scoped></style>
