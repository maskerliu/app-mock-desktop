<template>
  <div class="inspector-panel" v-if="wrapperRecord != null">
    <div class="request-path">
      <span class="request-url">Path:{{wrapperRecord.url}}</span>
      <el-button
        style="flex:1; margin: 0 5px;"
        size="small"
        type="primary"
        @click="addToMock"
      >一键添加mock</el-button>
    </div>
    <div class="inspector-row" style="height: 46vh; margin-top: 70px;">
      <h3 style="margin-left: 20px;">请求头</h3>
      <v-json-editor
        style="height: calc(46vh - 50px);"
        :options="headerOption"
        :plus="false"
        v-model="wrapperRecord.headers"
      />
    </div>
    <div class="inspector-row" style="height: 25vh;">
      <h3 style="margin-left: 20px;">请求参数</h3>
      <v-json-editor
        style="height: calc(25vh - 60px);"
        :options="headerOption"
        :plus="false"
        v-model="wrapperRecord.requestData"
      />
    </div>
    <div class="inspector-row" style="height: 25vh;">
      <h3 style="margin-left: 20px;">响应头</h3>
      <v-json-editor
        style="height: calc(25vh - 60px);"
        :options="headerOption"
        :plus="false"
        v-model="wrapperRecord.responseHeaders"
      />
    </div>
    <div class="inspector-row" style="height: calc(100vh - 65px);">
      <div style="position: relative; height: 40px;">
        <h3 style="margin-left: 20px;">响应数据</h3>
      </div>
      <v-json-editor
        ref="respJsonEditor"
        :options="responseOption"
        v-model="wrapperRecord.responseData"
        style="height: calc(100vh - 120px);"
      />
    </div>

    <el-dialog title="AddMockRule" :visible.sync="showAddMockRule" width="90%" top="20px">
      <add-mock-rule :show="showAddMockRule" :record="wrapperRecord"></add-mock-rule>
    </el-dialog>

    <el-dialog title="预览" :visible.sync="showPreview" width="40%" top="100px">
      <img style="width: 100%; border-radius: 8px;" :src="curImgSrc" v-show="!!curImgSrc" />
      <audio
        id="audioPlayer"
        style="width: 100%;"
        :src="curAudioSrc"
        controls="controls"
        v-show="!!curAudioSrc"
      ></audio>
      <video
        style="width:100%; object-fit: contain;"
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
  overflow-y: hidden;
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
  flex: 5;
}

.jsoneditor {
  border: 0 solid #e9e9ef;
}
.jsoneditor-menu {
  background-color: #3498db;
  border-bottom: 0;
}
.jsoneditor-box ::-webkit-scrollbar {
  display: none;
}
.jsoneditor-schema-error,
div.jsoneditor td,
div.jsoneditor textarea,
div.jsoneditor th,
div.jsoneditor-field,
div.jsoneditor-value {
  font-family: "Arial", "Microsoft YaHei", "黑体", "宋体", sans-serif;
}

.ace-jsoneditor .ace_gutter {
  /* visibility: hidden; */
}
</style>
