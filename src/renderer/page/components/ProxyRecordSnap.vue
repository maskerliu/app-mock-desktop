<template>
  <div
    class="record-snap-item"
    v-bind:style="{ background: source.isMock ? '#ffeaa755' : 'white' }"
    v-loading="source.type != 5012 && source.type != 5020"
    @click="setCurRecord(source)"
  >
    <span
      class="item-selected"
      v-if="curRecord != null && curRecord.id == source.id"
    ></span>
    <div class="item-timeline" v-bind:style="{ background: timelineColor }">
      {{ source.timestamp }}
    </div>
    <div v-if="source.type == 5020">
      <strong class="request-snap-method">[打点]</strong>
      <div
        class="request-snap-url"
        v-for="(item, idx) in source.statistics.bps.slice(0, 2)"
        :key="idx"
      >
        <span class="stat-snap-pid">{{
          item.pageId == "" ? item.page : item.pageId
        }}</span>
        <span
          class="stat-snap-eid"
          v-if="item.elementId != '' || item.arg1 != ''"
          ><br />{{ item.elementId == "" ? item.arg1 : item.elementId }}</span
        >
        <strong class="stat-snap-type"
          >[{{ item.elementId == '' && item.arg1 == '' ? "PV" : "事件" }}]</strong
        >
      </div>
    </div>
    <div v-else>
      <div style="display: block;">
        <strong class="request-snap-method">[{{ source.method }}]</strong>
        <span class="request-snap-url">{{ source.url }}</span>
      </div>

      <div style="width: 100%; margin-top: 10px;">
        <el-tag
          size="mini"
          :type="source.statusCode === 200 ? 'success' : 'danger'"
          effect="plain"
        >
          <span class="request-snap-status">
            <b style="color: #2980b9;">[HTTP]</b>
            {{ source.statusCode }}
          </span>
        </el-tag>
        <el-tag
          size="mini"
          :type="
            parseInt(source.responseData.code) === 8000 ? 'success' : 'danger'
          "
          effect="plain"
          v-if="source.responseData != null"
        >
          <span class="request-snap-status">
            <b style="color: #2980b9;">[BIZ]</b>
            {{ source.responseData.code }}
          </span>
        </el-tag>
        <span class="request-snap-status">
          <b style="color: #2980b9;">耗时:</b>
          <span
            v-bind:style="{ color: source.time > 500 ? '#e74c3c' : '#2ecc71' }"
            >{{ source.time ? source.time : "--" }} ms</span
          >
        </span>
      </div>
      <i
        class="el-icon-arrow-right"
        style="position: absolute;top: 30px; right: 10px; font-size: 1.2rem; color: grey;"
      ></i>
    </div>
    <i class="divider"></i>
  </div>
</template>

<script lang="ts" src="./ProxyRecordSnap.vue.ts"></script>

<style>
.record-snap-item {
  position: relative;
  height: 50px;
  padding: 10px 15px;
}

.item-selected {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #89898948;
  left: 0;
  top: 0;
  z-index: 99;
}

.item-timeline {
  position: absolute;
  width: 12px;
  height: 100%;
  left: 0;
  top: 0;
  font-size: 0.5rem;
  font-weight: bold;
  padding-top: 10px;
  color: white;
}

.divider {
  position: absolute;
  bottom: 1px;
  width: 100%;
  height: 1px;
  background: #ececec;
}

.record-snap-item:hover {
  background: #ececec;
  cursor: pointer;
}

.stat-snap-pid {
  max-width: 100px;
  font-size: 0.6rem;
  color: #8c7ae6;
}

.stat-snap-eid {
  max-width: 100px;
  font-size: 0.6rem;
  color: #e1b12c;
  margin-top: 5px;
}

.stat-snap-type {
  font-size: 0.6rem;
  color: #c23616;
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
</style>
