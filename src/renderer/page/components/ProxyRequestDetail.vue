<template>
  <div class="inspector-panel" v-if="wrapperRecord != null">
    <div class="request-path">
      <span class="request-url"><b>Path:</b> {{ wrapperRecord.url }}</span>
      <el-button
        style="margin: 0 5px;"
        size="small"
        icon="el-icon-copy-document"
        @click="copyLink"
      ></el-button>
      <el-button
        style="margin: 0 5px;"
        size="small"
        type="primary"
        icon="el-icon-plus"
        @click="addToMockRule"
      ></el-button>
    </div>
    <div class="inspector-row" style="margin-top: 70px; padding-bottom: 15px;">
      <h3>请求头</h3>
      <json-viewer
        style="margin-top: 40px;"
        :closed="true"
        :data="wrapperRecord.headers == null ? {} : wrapperRecord.headers"
      ></json-viewer>
    </div>
    <div class="inspector-row" style="padding-bottom: 15px;">
      <h3>请求参数</h3>
      <json-viewer
        style="margin-top: 40px;"
        :data="
          wrapperRecord.requestData == null ? {} : wrapperRecord.requestData
        "
      ></json-viewer>
    </div>
    <div class="inspector-row" style="padding-bottom: 15px;">
      <h3>响应头</h3>
      <json-viewer
        style="margin-top: 40px;"
        :closed="true"
        :data="
          wrapperRecord.responseHeaders == null
            ? {}
            : wrapperRecord.responseHeaders
        "
      ></json-viewer>
    </div>
    <div class="inspector-row" style="height: calc(100vh - 65px);">
      <h3>响应数据</h3>
      <json-viewer
        style="margin-top: 40px; height: calc(100vh - 105px);"
        :data="wrapperRecord.responseData"
        :deep="5"
      ></json-viewer>
    </div>

    <el-dialog
      title="添加Mock规则"
      :visible.sync="showAddMockRule"
      width="90%"
      top="50px"
    >
      <add-mock-rule :record="wrapperRecord" :lock-scroll="true"></add-mock-rule>
    </el-dialog>

    <el-dialog
      title="预览"
      :visible.sync="showPreview"
      top="100px"
      align="center"
    >
      <img
        style="max-width: 100%; max-height: 60vh; border-radius: 8px;"
        :src="curImgSrc"
        v-show="!!curImgSrc"
      />
      <audio
        id="audioPlayer"
        style="width: 100%; max-width:100%; max-height: 60vh;"
        :src="curAudioSrc"
        controls="controls"
        v-show="!!curAudioSrc"
      ></audio>
      <video
        style="max-width:100%; max-height: 60vh; object-fit: contain;"
        :src="curVideoSrc"
        v-show="!!curVideoSrc"
        controls="controls"
      ></video>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./ProxyRequestDetail.vue.ts"></script>

<style>
.inspector-panel {
  position: relative;
  height: calc(100vh - 62px);
  overflow-y: auto;
}

.inspector-panel::-webkit-scrollbar {
  display: none;
}

.inspector-row {
  width: calc(100% -10px);
  background: #ffffff;
  border: 1px solid #efefefef;
  border-radius: 8px;
  margin-top: 10px;
  padding: 0 5px;
  font-size: 0.8rem;
  overflow-x: hidden;
  user-select: text;
}

.inspector-row h3 {
  position: absolute;
  padding: 10px 20px;
  z-index: 99;
  margin: 0 0 0 -5px;
  width: 100%;
  background: #f1f1f180;
}

.request-path {
  display: flex;
  background: #f1f1f180;
  position: fixed;
  z-index: 100;
  height: 50px;
  width: calc(100vw - 422px);
  align-items: center;
  border: 0;
  border-radius: 0px;
  box-shadow: 2px 4px 6px #00000080;
}

.request-url {
  font-size: 0.9rem;
  color: #2980b9;
  display: inline-block;
  margin-left: 120px;
  word-wrap: break-word;
  white-space: nowrap;
  display: inline;
  overflow: hidden;
  text-overflow: ellipsis;
  user-select: text;
  flex: 5;
}
</style>
