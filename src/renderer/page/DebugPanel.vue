<template>
  <el-popover placement="right" title="调试面板" width="400" trigger="click">
    <el-form>
      <el-form-item label-width="80px" label="手动crash">
        <el-button size="mini" @click="createCrash">createCrash</el-button>
      </el-form-item>
      <el-form-item label-width="80px" label="环境切换">
        <el-radio-group size="mini" v-model="env" @change="changeEnv(env)">
          <el-radio-button label="测试"></el-radio-button>
          <el-radio-button label="灰度"></el-radio-button>
          <el-radio-button label="线上"></el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label-width="80px" label="清除缓存">
        <el-button size="mini" @click="clearCache">ClearCache</el-button>
      </el-form-item>
    </el-form>
    <el-avatar slot="reference">
      <i class="iconfont icon-debug" style="font-size: 1.8rem; color: red;"></i>
    </el-avatar>
  </el-popover>
</template>

<script lang="ts" src="./DebugPanel.vue.ts"></script>

<style scoped>
</style>
