<template>
  <div class="rule-snap-item">
    <span class="item-selected" v-if="isSelected"></span>
    <strong class="rule-snap-name">[{{rule.name}}]</strong>
    <span style="position: absolute; top: 8px; right: 40px;">
      <span style="font-size: 0.6rem; margin-left: 15px; color: #34495e;">启用Mock:</span>
      <el-switch style="margin-top: 3px;" v-model="rule.isMock"></el-switch>
    </span>

    <br />
    <span class="rule-snap-desc">{{rule.desc}}</span>
    <div style="width: 100%; margin-top: 10px;">
      <span class="rule-snap-status">
        <b style="color: #2980b9;">请求数:</b>
        {{rule.requests != null ? rule.requests.length : 0}}
      </span>
    </div>
    <i
      class="el-icon-arrow-right"
      style="position: absolute;top: 30px; right: 15px; font-size: 1.2rem; color: grey;"
    ></i>
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

.rule-snap-name {
  font-size: 0.8rem;
  color: #2980b9;
}

.rule-snap-desc {
  font-size: 0.6rem;
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

.el-switch__label * {
  font-size: 0.6rem;
}
</style>
