<template>
  <biz-main v-if="canRender" />
</template>

<script lang="ts" src="./App.vue.ts"></script>

<style>
.el-tabs--border-card > .el-tabs__content {
  padding: 0;
}

.el-tabs__header {
  margin-bottom: 5px;
}

.tabs-pure .el-tabs__item {
  color: #fff;
}

* {
  user-select: none;
  -webkit-appearance: none;
  outline: 0 none !important;
}

input,
textarea {
  user-select: auto;
}
</style>
