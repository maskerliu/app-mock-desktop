<template>
  <div class="inspector-panel" v-if="wrapperRecord != null">
    <div class="inspector-row">
      <p style="font-size: 1.0rem; color: #2c3e50; margin-left: 5px;">
        <strong>
          Path:
          <span style="font-size: 0.9rem; font-style: italic; color: #2980b9;">{{wrapperRecord.url}}</span>
        </strong>
      </p>
    </div>
    <div class="inspector-row" style="height: 30vh;">
      <h3>请求头</h3>
      <v-json-editor :options="headerOption" :plus="false" v-model="wrapperRecord.requestHeader" />
    </div>
    <div class="inspector-row" style="height: 30vh;">
      <h3>请求参数</h3>
      <v-json-editor :options="headerOption" :plus="false" v-model="wrapperRecord.requestData" />
    </div>
    <div class="inspector-row" style="height: 30vh;">
      <h3>响应头</h3>
      <v-json-editor :options="headerOption" :plus="false" v-model="wrapperRecord.responseHeader" />
    </div>
    <div class="inspector-row" style="height: 90vh;">
      <div style="position: relative; height: 40px;">
        <h3 style="padding-top: 8px;">响应数据</h3>
        <el-button
          style="position: absolute; top: 0px; right: 5px;"
          size="small"
          type="primary"
          @click="addToMock"
        >一键添加mock</el-button>
      </div>
      <v-json-editor
        ref="respJsonEditor"
        :options="responseOption"
        v-model="wrapperRecord.responseData"
        style="height: calc(90vh - 80px);"
      />
    </div>

    <div class="preview-panel" v-show="showImgPreview">
      <img
        style="position: absolute; width: 100%; border-radius: 8px;"
        :src="curImgSrc"
        v-show="!!curImgSrc"
      />
      <audio
        id="audio-player"
        style="position: absolute; width: 100%; top: 70px;"
        :src="curAudioSrc"
        controls="controls"
        v-show="!!curAudioSrc"
      ></audio>
      <el-button
        type="danger"
        size="small"
        circle
        plain
        icon="el-icon-close"
        style="position: absolute; top:5px; right: 5px;"
        @click="closeImgPreview"
      ></el-button>
    </div>

    <el-dialog title="提示" :visible.sync="showVideoPreview" width="30%">
      <div style="width: 411px; height: 731px;">
        <video
          style="width: 100%; height: 100%; object-fit: contain;"
          :src="curVideoSrc"
          controls="controls"
        ></video>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" src="./ProxyRequestDetail.vue.ts"></script>

<style>
.inspector-panel {
  height: calc(100vh - 135px);
  overflow-y: auto;
}
.inspector-panel::-webkit-scrollbar {
  display: none;
}
.inspector-row {
  width: calc(100% -10px);
  background: #fafafa;
  border: 1px solid #efefefef;
  border-radius: 8px;
  margin-top: 10px;
  padding: 0 5px;
  font-size: 0.8rem;
  overflow-x: hidden;
}

.preview-panel {
  position: absolute;
  top: 40px;
  right: 20px;
  width: 260px;
  border-radius: 10px;
  background: #3333;
  z-index: 101;
}
.jsoneditor {
  border: 0 solid #e9e9ef;
}
.jsoneditor-menu {
  background-color: #dfdfdf;
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
</style>
