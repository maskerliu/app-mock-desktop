<template>
  <el-row :gutter="20">
    <el-col class="bg-border" style="width: 300px; margin-left: 15px;">
      <el-checkbox-group
        size="mini"
        v-model="filterTypes"
        style="width: 100%; padding: 5px 5px; boder: 1px solid grey;"
      >
        <i
          class="iconfont icon-filter"
          style="font-weight: blod; color: grey;"
        />
        <el-tooltip effect="dark" content="请求" placement="bottom">
          <el-checkbox label="5010" style="padding: 5px 10px;">
            <i class="iconfont icon-api" style="font-weight: blod;" />
          </el-checkbox>
        </el-tooltip>

        <el-tooltip effect="dark" content="埋点" placement="bottom">
          <el-checkbox label="5020" style="padding: 5px 10px;">
            <i class="iconfont icon-maidian" style="font-weight: blod;" />
          </el-checkbox>
        </el-tooltip>
        <el-tooltip effect="dark" content="长连通道" placement="bottom">
          <el-checkbox label="5030" style="padding: 5px 10px;">
            <i class="iconfont icon-shuiguan" style="font-weight: blod;" />
          </el-checkbox>
        </el-tooltip>
      </el-checkbox-group>

      <el-input size="small" placeholder="延时时长" v-model="mockDelay">
        <i slot="prefix" class="el-input__icon iconfont icon-delay"></i>
        <span slot="append" style="padding-right: 10px;">ms</span>
        <el-checkbox slot="append" size="mini" v-model="isDelay"></el-checkbox>
      </el-input>

      <el-input
        size="small"
        placeholder="筛选关键字"
        v-model="filterInput"
        clearable
        style="margin-top: 10px;"
      >
        <i slot="prefix" class="el-input__icon iconfont icon-search"></i>
        <el-button
          slot="append"
          icon="iconfont icon-clear"
          @click="clearProxyRecrods()"
        ></el-button>
      </el-input>

      <el-divider />

      <virtual-list
        class="record-snap-panel"
        :size="50"
        :keeps="20"
        :data-key="'_idx'"
        :data-sources="filtedRecords"
        :data-component="proxyRecordSnap"
      />
    </el-col>
    <el-col
      style="width: calc(100vw - 400px); margin: 5px;"
      v-if="curRecord !== null"
    >
      <proxy-request-detail :record="curRecord" v-if="curRecord.type != 5020" />
      <proxy-stat-detail :record="curRecord" v-else />
    </el-col>
  </el-row>
</template>

<script lang="ts" src="./Proxy.vue.ts"></script>

<style scoped>
.bg-border {
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  margin: 5px;
}

.record-snap-panel {
  height: calc(100vh - 245px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin-bottom: 5px;
}
</style>
