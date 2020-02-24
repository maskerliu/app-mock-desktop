<template>
  <div>
    <el-row :gutter="20">
      <el-col class="border-panel" style="width: 300px; margin-left: 15px;">
        <el-input size="small" placeholder="筛选关键字" v-model="filterInput" style="margin-top: 10px;">
          <i slot="prefix" class="el-input__icon iconfont icon-search" style="font-size: 1.0rem;"></i>
          <el-button slot="append" icon="el-icon-check"></el-button>
        </el-input>

        <el-divider />

        <div class="rule-snap-panel" ref="wrapper">
          <mock-rule-snap
            v-for="item in rules"
            :key="item.id"
            :rule="item"
            :isSelected="curRule!== null && item.id === curRule.id"
            @click.native="onRuleClicked(item)"
          />
          <div ref="bottom"></div>
        </div>
      </el-col>
      <el-col class="border-panel" style="width: calc(100vw - 400px);">
        <mock-rule-detail :rule="curRule" />
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" src="./MockRuleMgr.vue.ts"></script>

<style>
.border-panel {
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  margin: 5px;
  padding: 5px;
}
</style>
