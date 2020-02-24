<template>
  <div>
    <el-table
      :data="tableData"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="date" label="日期" sortable width="180"></el-table-column>
      <el-table-column prop="name" label="姓名" sortable width="180"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>

    <el-table
      :data="tableData1"
      style="width: 100%"
      row-key="id"
      border
      lazy
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="event_id" label="类型" width="80"></el-table-column>
      <el-table-column prop="pageId" label="pageId" width="120"></el-table-column>
      <el-table-column prop="elementId" label="elementId" width="120"></el-table-column>
      <el-table-column prop="args" label="参数" width="180"></el-table-column>
      <el-table-column prop="arg1" label="ReferPage" width="120"></el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts" src="./ProxyStatDetail.vue.ts"></script>

<style>
</style>
