<template>
  <el-row id="app">
    <el-col style="width: 80px; height: 100vh;">
      <el-menu default-active="1-4-1" :collapse="false" style="width: 80px; height: 100%;">
        <el-menu-item index="1" style="padding-left: 19px; margin-top: 50px;">
          <el-popover placement="right" title="调试面板" width="260" height="400" trigger="click">
            <div id="register">
              扫描二维码或者手机访问:
              <br />
              <qrcode-vue :value="registerUrl" size="256" style="margin-top: 5px;"></qrcode-vue>
              <div>
                <span style="color: #777;" @click="click2Reg">{{registerUrl}}</span>
              </div>
            </div>
            <el-avatar slot="reference">
              <i class="iconfont icon-qrcode" style="font-size: 1.5rem; color: grey;"></i>
            </el-avatar>
          </el-popover>
        </el-menu-item>
        <el-menu-item index="2" style="padding-left: 25px;" @click="onNavTabClick('Proxy')">
          <i class="iconfont icon-mock" style="font-size: 1.8rem;"></i>
        </el-menu-item>
        <el-menu-item
          index="3"
          style="padding-left: 25px;"
          @click="onNavTabClick('MockRuleMgr')"
        >
          <i class="iconfont icon-rule" style="font-size: 1.8rem;"></i>
        </el-menu-item>
        <el-menu-item index="6" style="padding-left: 25px;" @click="onNavTabClick('Settings')">
          <i class="iconfont icon-setting" style="font-size: 1.8rem;"></i>
        </el-menu-item>
        <el-menu-item index="10" style="padding-left: 19px;">
          <debug-panel />
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col style="width: calc(100vw - 82px); height: calc(100vh - 10px); background: transparent;">
      <el-page-header @back="leftNavBarItemClick">
        <i class="navbar-btn" slot="title">{{$store.state.Common.navBarConfig.title}}</i>
        <i
          class="iconfont navbar-btn"
          v-bind:class="$store.state.Common.navBarConfig.rightIcon"
          @click="rightNavBarItemClick"
          slot="content"
          style="position: absolute; right: 15px;"
        ></i>
      </el-page-header>
      <transition
        mode="out-in"
        :enter-active-class="transitionEnterName"
        :leave-active-class="transitionLeaveName"
      >
        <keep-alive include="MockHome">
          <router-view></router-view>
        </keep-alive>
      </transition>
    </el-col>
  </el-row>
</template>

<script lang="ts" src="./BizMain.vue.ts"></script>

<style scoped>
#app {
  font-family: "Microsoft YaHei", 微软雅黑, "MicrosoftJhengHei", 华文细黑,
    STHeiti, MingLiu, monospace;
  background: transparent;
  letter-spacing: 1px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  /*border-radius: 8px;*/
  /*border: 1px solid lightgray;*/
}

#app::-webkit-scrollbar {
  display: none;
}

.el-menu--collapse {
  width: 80px;
}

.el-page-header {
  width: calc(100vw - 80px);
  padding: 15px;
  background: #3498db;
  color: white;
  -webkit-app-region: drag;
  text-align: center;
}

.navbar-btn {
  -webkit-app-region: no-drag;
  padding: 2px 10px;
  color: #f1f2f6;
  cursor: pointer;
}

.navbar-btn:hover {
  color: white;
  font-weight: bold;
  /*background: #ffffff50;*/
  /*border-radius: 40px;*/
}

.page-loading {
  position: absolute;
  top: calc(50% - 157px);
  left: calc(50% - 286px);
  z-index: -1;
}

.badge-box {
  position: relative;
}

.badge {
  color: #fff;
  line-height: 1;
  height: 12px;
  min-width: 14px;
  text-align: center;
  position: absolute;
  top: 7px;
  left: 20px;
  font-size: 12px;
  border-radius: 20px;
  padding: 2px;
  background: red;
}
</style>
