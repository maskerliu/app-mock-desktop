<template>
  <el-row id="app">
    <el-col style="width: 70px; height: 100vh;">
      <el-menu
        :default-active="curActivedNavMenuIdx"
        :collapse="false"
        style="width: 100%; height: 100%;"
      >
        <el-menu-item
          index="0"
          style="padding-left: 20px;margin-top: 50px;"
          @click="onShowQrCode"
        >
          <i class="iconfont icon-qrcode" style="font-size: 1.8rem;"></i>
        </el-menu-item>
        <el-tooltip effect="dark" content="代理" placement="right">
          <el-menu-item
            index="Proxy"
            style="padding-left: 20px;"
            @click="onNavTabClick('Proxy')"
          >
            <i class="iconfont icon-mock" style="font-size: 1.8rem;"></i>
          </el-menu-item>
        </el-tooltip>
        <el-tooltip effect="dark" content="Mock规则管理" placement="right">
          <el-menu-item
            index="MockRuleMgr"
            style="padding-left: 20px;"
            @click="onNavTabClick('MockRuleMgr')"
          >
            <i class="iconfont icon-rule" style="font-size: 1.8rem;"></i>
          </el-menu-item>
        </el-tooltip>
        <el-tooltip effect="dark" content="Demo" placement="right">
          <el-menu-item
            index="Demo"
            style="padding-left: 20px;"
            @click="onNavTabClick('Demo')"
          >
            <i class="iconfont icon-lab" style="font-size: 1.8rem;"></i>
          </el-menu-item>
        </el-tooltip>
      </el-menu>
    </el-col>
    <el-col
      style="width: calc(100vw - 70px); height: calc(100vh - 10px); background: transparent;"
    >
      <div class="header">
        <div class="header-title" @click="leftNavBarItemClick">
        </div>
        <div class="header-content"></div>
        <div class="header-right"></div>
      </div>
      <router-view></router-view>
    </el-col>

    <el-dialog
      title="扫描二维码或者手机访问："
      :visible="showQrCodeDialog"
      @close="updateShowQrCodeDialog(false)"
      width="300px"
      
    >
      <div id="register">
        <qrcode-vue
          :value="registerUrl"
          size="256"
          style="margin-top: 5px;"
        ></qrcode-vue>
        <br />
        <div>
          <span style="color: #777; user-select: text;">{{ registerUrl }}</span>
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script lang="ts" src="./App.vue.ts"></script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
}
::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}

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
}

.navbar-btn {
  -webkit-app-region: no-drag;
  padding: 2px 10px;
  color: #f1f2f6;
  cursor: pointer;
}

.navbar-btn:hover {
  color: white;
}

.header {
  display: flex;
  align-items: center;
  height: 20px;
  padding: 15px;
  background: #8e44ad;
  color: white;
  -webkit-app-region: drag;
}

.header-title {
  flex: 2;
}

.header-content {
  flex: 7;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.header-right {
  align-items: right;
  flex-wrap: nowrap;
  justify-content: flex-end;
}

.header-right-btn {
  -webkit-app-region: no-drag;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  margin-left: 10px;
  padding: 2.5px 1.5px 3px 3px;
  border-radius: 4rem;
  border: 1px solid #d1d1d1;
}

.header-right-btn:hover {
  border-radius: 4rem;
  border: 1px solid white;
}
</style>
