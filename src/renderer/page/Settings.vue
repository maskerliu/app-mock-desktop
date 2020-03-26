<template>
  <div>
    <el-form ref="form" :model="form" label-width="200px" size="small" style="margin: 15px;">
      <el-form-item label="网卡选择">
        <el-select v-model="curServerIP" placeholder="请选择" size="small" style="width: 100%;">
          <el-option
            v-for="(item, idx) in ips"
            :key="idx"
            :label="item.address"
            :value="item.address"
          >
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
      <el-form-item label="规则数据同步地址">
        <el-input v-model="ruleSyncServer" size="small"></el-input>
      </el-form-item>
      <el-form-item label="数据序列化插件" :inline="true">
        <el-radio-group v-model="serialPlugin">
          <el-radio :label="3">JSON</el-radio>
          <el-radio :label="6">Protobuf</el-radio>
          <el-radio :label="10">自定义</el-radio>
        </el-radio-group>
        <el-input
          v-model="ruleSyncServer"
          size="small"
          v-show="serialPlugin == 10"
          style="width: auto;"
        >
          <el-button
            slot="append"
            size="mini"
            type="success"
            icon="iconfont icon-folder-open"
            @click="onOpenFileDialog()"
          ></el-button>
        </el-input>
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
