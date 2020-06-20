<template>
  <el-row :gutter="20">
    <el-col style="padding: 15px 20px;">
      <el-input placeholder="请输入内容" v-model="spiderUrl" size="small">
        <template slot="prepend">URL: </template>
        <el-button slot="append" :icon="spiderIcon" @click="onSpiderClick"></el-button>
      </el-input>
    </el-col>
    <el-col style="width: calc(100vw - 400px); margin: 5px;"> </el-col>
  </el-row>
</template>

<script lang="ts" src="./Spider.vue.ts"></script>

<style scoped></style>
