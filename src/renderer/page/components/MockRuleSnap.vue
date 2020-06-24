<template>
  <div
    class="rule-snap-item"
    @click="onClick()"
    v-bind:style="{
      background:
        curRule != null && curRule._id == source._id ? '#00000010' : 'white',
    }"
  >
    <span class="rule-snap-name">[{{ source.name }}]</span>
    <span
      class="iconfont icon-edit"
      style="color: #3498db; padding: 0 5px;"
      @click="onEdit()"
    ></span>
    <span
      class="iconfont icon-delete"
      style="color: red; padding: 0 5px;"
      @click="onDelete()"
    ></span>
    <span
      class="iconfont icon-upload"
      style="color: red; padding: 0 5px;"
      @click="onUpload()"
    ></span>
    <br />
    <span class="rule-snap-desc">{{ source.desc }}</span>
    <br />
    <span style="position: absolute; bottom: 5px; left: 10px;">
      <span style="font-size: 0.6rem; color: #34495e;">启用Mock:</span>
      <el-switch
        style="margin-top: 3px;"
        v-model="source.isMock"
        @change="onMockSwitchChanged()"
      ></el-switch>
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
  width: 150px;
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

</style>
