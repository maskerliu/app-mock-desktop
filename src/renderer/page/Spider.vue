<template>
  <el-row :gutter="20">
    <el-col style="padding: 15px 20px;">
      <el-input placeholder="请输入内容" v-model="spiderUrl" size="small">
        <template slot="prepend">URL: </template>
        <el-button
          slot="append"
          :icon="spiderIcon"
          @click="onSpiderClick"
        ></el-button>
      </el-input>
    </el-col>
    <el-col style="width: calc(100vw - 400px); margin: 5px;"> </el-col>
  </el-row>
</template>

<script lang="ts" src="./Spider.vue.ts"></script>

<style scoped>
.box {
  width: 100%;
  height: 100%;
  margin: 1% 0px;
  overflow: hidden;
  box-shadow: -1px 9px 10px 3px rgba(0, 0, 0, 0.11);
}
.left {
  width: calc(32% - 10px); /*左侧初始化宽度*/
  height: 100%;
  background: #ffffff;
  float: left;
}
/*拖拽区div样式*/
.resize {
  cursor: col-resize;
  float: left;
  position: relative;
  top: 45%;
  background-color: #d6d6d6;
  border-radius: 5px;
  margin-top: -10px;
  width: 10px;
  height: 50px;
  background-size: cover;
  background-position: center;
  /*z-index: 99999;*/
  font-size: 32px;
  color: white;
}
/*拖拽区鼠标悬停样式*/
.resize:hover {
  color: #444444;
}
/*右侧div'样式*/
.mid {
  float: left;
  width: 68%; /*右侧初始化宽度*/
  height: 100%;
  background: #fff;
  box-shadow: -1px 4px 5px 3px rgba(0, 0, 0, 0.11);
}
</style>
