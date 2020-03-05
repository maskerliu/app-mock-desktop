<template>
  <div class="request-snap-item">
    <span class="item-selected" v-if="isSelected"></span>
    <div style="display: block;">
      <strong class="request-snap-method">[{{reqRecord.method}}]</strong>
      <span class="request-snap-url">{{reqRecord.url}}</span>
    </div>

    <div style="width: 100%; margin-top: 10px;">
      <el-tag size="mini" :type="reqRecord.statusCode === 200 ? 'success': 'danger'" effect="plain">
        <span class="request-snap-status">
          <b style="color: #2980b9;">[HTTP]</b>
          {{reqRecord.statusCode}}
        </span>
      </el-tag>
      <el-tag
        size="mini"
        :type="parseInt(reqRecord.responseData.code) === 8000 ? 'success': 'danger'"
        effect="plain"
        v-if="reqRecord.responseData != null"
      >
        <span class="request-snap-status">
          <b style="color: #2980b9;">[BIZ]</b>
          {{reqRecord.responseData.code}}
        </span>
      </el-tag>
      <span class="request-snap-status">
        <b style="color: #2980b9;">耗时:</b>
        <span
          v-bind:style="{ color: reqRecord.time > 500 ? '#e74c3c' : '#2ecc71'}"
        >{{reqRecord.time ? reqRecord.time : '--'}} ms</span>
      </span>
    </div>
    <i
      class="el-icon-arrow-right"
      style="position: absolute;top: 30px; right: 10px; font-size: 1.2rem; color: grey;"
    ></i>
  </div>
</template>

<script lang="ts" src="./ProxyRequestSnap.vue.ts"></script>

<style>
.request-snap-item {
  position: relative;
  height: 50px;
  border-style: none none solid none;
  border-bottom: 1px solid #e1e1e1;
  border-bottom-width: 1px;
  padding: 10px 15px;
}

.request-snap-item:hover {
  background: #ececec;
  cursor: pointer;
}

.request-snap-method {
  font-size: 0.6rem;
  color: #2980b9;
  position: absolute;
  top: 10px;
  right: 35px;
}

.request-snap-url {
  width: 165px;
  font-size: 0.7rem;
  color: #34495e;
  padding: 0 0 5px 5px;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.request-snap-status {
  font-size: 0.6rem;
  font-weight: bold;
  color: #34495e;
  /* font-style: italic; */
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
