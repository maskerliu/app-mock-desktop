<template>
  <el-row id="app">
    <el-col style="width: 70px; height: 100vh;">
      <el-menu :default-active="curActivedNavMenuIdx" :collapse="false" style="width: 100%; height: 100%;">
        <el-menu-item index="0" style="padding-left: 15px; margin-top: 50px;">
          <el-popover placement="right" title="" width="260" height="400" v-model="showQrCodeDialog">
            <div id="register">
              扫描二维码或者手机访问：
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
        <el-menu-item index="Proxy" style="padding-left: 20px;" @click="onNavTabClick('Proxy')">
          <i class="iconfont icon-mock" style="font-size: 1.8rem;"></i>
        </el-menu-item>
        <el-menu-item
          index="MockRuleMgr"
          style="padding-left: 20px;"
          @click="onNavTabClick('MockRuleMgr')"
        >
          <i class="iconfont icon-rule" style="font-size: 1.8rem;"></i>
        </el-menu-item>
        <el-menu-item index="Settings" style="padding-left: 20px;" @click="onNavTabClick('Settings')">
          <i class="iconfont icon-setting" style="font-size: 1.8rem;"></i>
        </el-menu-item>
        <el-menu-item index="4" style="padding-left: 15px;">
          <debug-panel />
        </el-menu-item>
      </el-menu>
    </el-col>
    <el-col style="width: calc(100vw - 70px); height: calc(100vh - 10px); background: transparent;">
      <div class="header">
        <div class="header-title" @click="leftNavBarItemClick">
          <i class="el-icon-back" v-if="navBarConfig.leftItem"></i>
          <span class="navbar-btn">{{navBarConfig.title}}</span>
        </div>
        <div class="header-content">
          <div class="el-icon-switch-button" style="color: #e74c3c; font-size: 1.1rem; font-weight: bold;" @click="onClose()"></div>
          <!-- <el-button circle type="danger" size="small" icon="el-icon-switch-button" @click="onClose">
          </el-button> -->
        </div>
      </div>
      <transition
        mode="out-in"
        :enter-active-class="transitionEnterName"
        :leave-active-class="transitionLeaveName"
      >
        <keep-alive include="Proxy">
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

.navbar-btn {
  -webkit-app-region: no-drag;
  padding: 2px 10px;
  color: #f1f2f6;
  cursor: pointer;
}

.navbar-btn:hover {
  color: white;
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

.header {
  display: flex;
  align-items: center;
  padding: 15px;
  background: #3498db;
  color: white;
  -webkit-app-region: drag;
}
.header-title {
  flex: 1;
}
.header-content {
  display: flex;
  align-items: center;
}

</style>
