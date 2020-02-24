<template>
  <el-row :gutter="20">
    <el-col class="bg-border" style="width: 300px; margin-left: 15px;">
      <el-checkbox-group size="small" v-model="checkList" style="width: 100%; padding: 10px 0;">
        <el-checkbox-button label border size="medium" disabled>
          <i class="iconfont icon-filter" style="font-weight: blod;" />
        </el-checkbox-button>
        <el-checkbox-button label="请求" border>
          <i class="iconfont icon-network-data" style="font-weight: blod;" />
        </el-checkbox-button>
        <el-checkbox-button label="打点" border>
          <i class="iconfont icon-statistics" style="font-weight: blod;" />
        </el-checkbox-button>
      </el-checkbox-group>

      <el-input size="small" placeholder="延时时长" v-model="filterInput">
        <i slot="prefix" class="el-input__icon iconfont icon-delay"></i>
        <el-checkbox-button slot="append" size="medium" icon="el-icon-"></el-checkbox-button>
      </el-input>

      <el-input size="small" placeholder="筛选关键字" v-model="filterInput" style="margin-top: 10px;">
        <i slot="prefix" class="el-input__icon iconfont icon-search"></i>
        <el-button slot="append">
          <i icon="iconfont icon-filter"></i>
        </el-button>
      </el-input>

      <el-divider />

      <div class="record-snap-panel" ref="wrapper">
        <div v-for="item in records" :key="item.id">
          <proxy-request-snap
            :reqRecord="item"
            :isSelected="curRecord != null && item.id === curRecord.id"
            @click.native="onItemClicked(item)"
          ></proxy-request-snap>
          <!-- <proxy-stat-snap ></proxy-stat-snap> -->
        </div>

        <div ref="bottom"></div>
      </div>
    </el-col>
    <el-col class="bg-border" style="width: calc(100vw - 400px);">
      <h3>详情</h3>
      <proxy-request-detail :request="curRecord" v-show="curRecord !== null" />
      <!-- <proxy-stat-detail v-show="curRecord !== null" /> -->
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
  height: calc(100vh - 255px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin-bottom: 5px;
}

.record-snap-panel::-webkit-scrollbar {
  display: none;
}
</style>
