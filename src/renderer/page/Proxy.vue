<template>
  <el-row :gutter="20">
    <el-col class="bg-border" style="width: 300px; margin-left: 15px;">
      <el-checkbox-group size="mini" v-model="proxyTypes" style="width: 100%; padding: 10px 0;">
        <el-checkbox-button label disabled>
          <i class="iconfont icon-filter" style="font-weight: blod;" />
        </el-checkbox-button>
        <el-checkbox-button label="5001">
          <i class="iconfont icon-network-data" style="font-weight: blod;" />
        </el-checkbox-button>
        <el-checkbox-button label="5008">
          <i class="iconfont icon-statistics" style="font-weight: blod;" />
        </el-checkbox-button>
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
        <el-button slot="append" icon="iconfont icon-clear" @click="clearProxyRecrods()"></el-button>
      </el-input>

      <el-divider />

      <div class="record-snap-panel" ref="wrapper">
        <div>
          <div v-for="(item, idx) in filtedRecords" :key="idx">
            <proxy-request-snap
              v-loading="item.type !== 5004"
              :reqRecord="item"
              :isSelected="curRecord != null && item.id === curRecord.id"
              @click.native="onItemClicked(item)"
              v-if="item.type === 5002 || item.type === 5004"
            ></proxy-request-snap>
            <proxy-stat-snap
              :statRecord="item"
              :isSelected="curRecord != null && item.id === curRecord.id"
              @click.native="onItemClicked(item)"
              v-if="item.type === 5008"
            ></proxy-stat-snap>
          </div>

          <div ref="bottom"></div>
        </div>
      </div>
    </el-col>
    <el-col style="width: calc(100vw - 400px); margin: 5px;">
      <proxy-request-detail :record="curRecord" v-show="curRecord !== null" />
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

.record-snap-panel::-webkit-scrollbar {
  display: none;
}
</style>
