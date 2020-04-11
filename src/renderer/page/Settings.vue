<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      label-width="200px"
      size="small"
      style="margin: 15px;"
    >
      <el-form-item label="网卡选择">
        <el-select
          v-model="curServerIP"
          placeholder="请选择"
          size="small"
          style="width: 100%;"
        >
          <el-option
            v-for="(item, idx) in ips"
            :key="idx"
            :label="item.address"
            :value="item.address"
          >
            <span style="float: left">{{ item.name }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.address
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="代理Http服务端口">
        <el-input v-model="curProxyHttpPort" size="small"></el-input>
      </el-form-item>
      <el-form-item label="代理长连服务端口">
        <el-input v-model="curProxySocketPort" size="small"></el-input>
      </el-form-item>
      <el-form-item label="本地推送服务端口">
        <el-input v-model="curPushSocketPort" size="small"></el-input>
      </el-form-item>
      <el-form-item label="规则数据同步地址">
        <el-input
          v-model="ruleSyncServer"
          size="small"
          placeholder="http://sync.xxx.com/sync:xxxx"
        >
          <el-button
            slot="append"
            icon="iconfont icon-cloud-sync"
            :loading="true"
          ></el-button>
        </el-input>
      </el-form-item>
      <el-form-item label="数据序列化插件" :inline="true">
        <el-radio-group v-model="serialPlugin">
          <el-radio :label="3" style="height: 30px; margin-top: 10px;"
            >JSON</el-radio
          >
          <br />
          <el-radio :label="6" style="height: 34px; margin-top: 10px;"
            >Protobuf
            <el-select
              v-model="pbFiles"
              v-show="serialPlugin == 6"
              multiple
              placeholder="选择Protobuf数据模型定义文件"
              style="width: 500px; margin: -11px 5px;"
            >
              <el-option
                v-for="item in pbFiles"
                :key="item.name"
                :label="item.name"
                :value="item"
              >
              </el-option>
            </el-select>
            <el-button
              size="mini"
              v-show="serialPlugin == 6"
              type="success"
              icon="iconfont icon-folder-open"
              @click="onOpenFileDialog()"
            ></el-button>
          </el-radio>
          <br />
          <el-radio :label="10" style="height: 34px; margin-top: 15px;"
            >自定义
            <el-input
              v-model="ruleSyncServer"
              size="small"
              placeholder="选择自定义序列化协议的JS实现插件"
              v-show="serialPlugin == 10"
              style="width: 500px; margin: -10px 5px;"
            >
              <el-button
                slot="append"
                size="mini"
                type="success"
                icon="iconfont icon-folder-open"
                @click="onOpenFileDialog()"
              ></el-button>
            </el-input>
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="onSave">更新</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" src="./Settings.vue.ts"></script>

<style></style>
