<template>
  <div>
    <el-form ref="form" :model="form" label-width="200px" size="small" style="margin: 15px;">
      <el-form-item label="网卡选择">
        <el-select v-model="curServerIP" placeholder="请选择" size="small" style="width: 100%;">
          <el-option v-for="(item, idx) in ips" :key="idx" :label="item.address" :value="item.address">
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.address }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="本地Http端口">
        <el-input v-model="curServerPort" size="small"></el-input>
      </el-form-item>
      <el-form-item label="本地WebSocket端口">
        <el-input v-model="curWebsocketPort" size="small"></el-input>
      </el-form-item>
      <el-form-item label="云端规则同步服务地址">
        <el-input v-model="ruleSyncServer" size="small"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSave">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" src="./Settings.vue.ts"></script>

<style>
</style>
