<template>
  <div class="rule-snap-item">
    <span class="item-selected" v-if="isSelected"></span>
    <strong class="rule-snap-method">[{{rule.name}}]</strong>
    <span class="rule-snap-url">{{rule.desc}}</span>
    <div style="width: 100%; margin-top: 10px;">
      <span class="rule-snap-status">
        <b style="color: #2980b9;">请求数:</b>
        {{rule.requests.length}}
      </span>
    </div>
    <i
      class="el-icon-arrow-right"
      style="position: absolute;top: 30px; right: 15px; font-size: 1.2rem; color: grey;"
    ></i>
    <el-dialog title="提示" :visible.sync="showEditor" width="50%">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showEditor = false">取 消</el-button>
        <el-button type="primary" @click="showEditor = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./MockRuleSnap.vue.ts"></script>

<style>
.rule-snap-item {
  position: relative;
  height: 60px;
  border-style: none none solid none;
  border-bottom: thick dotted #bdc3c7;
  border-bottom-width: 1px;
  padding: 10px;
}

.rule-snap-item:hover {
  background: #ececec;
  cursor: pointer;
}

.rule-snap-method {
  font-size: 0.8rem;
  color: #2980b9;
}

.rule-snap-url {
  font-size: 0.8rem;
  color: #34495e;
  font-style: italic;
}

.rule-snap-status {
  font-size: 0.6rem;
  font-weight: bold;
  color: #34495e;
  font-style: italic;
}

.item-selected {
  position: absolute;
  width: 6px;
  height: 100%;
  background: #16a085;
  left: 0;
  top: 0;
}
</style>
