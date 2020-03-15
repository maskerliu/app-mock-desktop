<template>
  <div class="rule-snap-item">
    <span class="item-selected" v-if="isSelected"></span>
    <span class="rule-snap-name">[{{rule.name}}]</span>
    <span class="el-icon-edit" style="color: #3498db; padding: 0 5px;" v-on:click="$emit('edit')"></span>
    <span class="el-icon-delete" style="color: red; padding: 0 5px;" v-on:click="$emit('delete')"></span>
    <br />
    <span class="rule-snap-desc">{{rule.desc}}</span>
    <br />
    <span class="rule-snap-status">
      <b style="color: #2980b9;">请求数:</b>
      {{rule.requests != null ? rule.requests.length : 0}}
    </span>
    <span style="position: absolute; bottom: 12px; right: 50px;">
      <span style="font-size: 0.6rem; color: #34495e;">启用Mock:</span>
      <el-switch style="margin-top: 3px;" v-model="rule.isMock" v-on:change="$emit('open-mock')"></el-switch>
    </span>
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
  width: 258px;
  max-width: 258px;
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
  max-width: 180px;
  font-size: 0.8rem;
  font-weight: bold;
  color: #2980b9;
  white-space: nowrap;
  word-wrap: break-word;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rule-snap-desc {
  max-width: 220px;
  color: #34495e;
  font-size: 0.6rem;
  white-space: nowrap;
  word-wrap: break-word;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rule-snap-status {
  font-size: 0.6rem;
  font-weight: normal;
  color: #34495e;
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
