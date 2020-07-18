<template>
  <el-row :gutter="24" style="overflow-y: scroll;">
    <el-col :span="8" style="padding: 15px 20px;">
      <el-form
        label-width="100px"
        size="small"
        style="margin: 15px;"
        label-position="top"
      >
        <el-form-item label="举牌的内容">
          <el-input type="textarea" rows="8" v-model="genTxt"></el-input>
        </el-form-item>
        <el-form-item label="举牌队形">
          <el-radio-group v-model="shape">
            <el-radio-button
              v-for="item in shapes"
              :key="item"
              :label="item"
            ></el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button style="width: 40%;" @click="genUpup">生成</el-button>
          <el-button style="width: 40%;" @click="saveUpup">导出</el-button>
        </el-form-item>
      </el-form>

      <img
        style="-webkit-user-select: none; max-width: 3750px;"
        :src="dataUrl"
      />
    </el-col>
    <el-col :span="16" style="margin: 5px 0;">
      <canvas class="draw-container" ref="drawContainer"></canvas>
    </el-col>
  </el-row>
</template>

<script lang="ts" src="./UpupU.vue.ts"></script>

<style scoped>
.draw-container {
  background: #ffffff00;
  width: calc(100% - 30px);
  height: calc(100vh - 60px);
  margin: 0 15px;
  display: block;
}

.single-char {
  text-align: center;
  font-size: 16px;
  width: calc(20vw - 28px);
  height: calc(20vw - 28px);
  margin: 15px 20px 0 0;
  background: #f1f1f1;
  border: 2px dotted #e0e0e0;
  border-radius: 8px;
}

</style>
