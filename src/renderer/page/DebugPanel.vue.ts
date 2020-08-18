import { webFrame } from "electron";
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { AppInfo } from "../../model/DataModels";

const AppEnv = namespace("AppEnv");

@Component({
  name: "DebugPanel",
})
export default class DebugPanel extends Vue {
  @AppEnv.State("appInfo")
  appInfo: AppInfo;

  env: string = "test";

  envs: {} = {
    "test": "测试",
    "uat": "灰度",
    "prod": "生产"
  }

  mounted() {
    this.env = this.envs[this.appInfo.env];
  }

  createCrash() {

  }

  changeEnv(env: string) {
    console.log(env);
    for (let key in this.envs) {
      console.log(key);
    }
  }

  clearCache() {
    webFrame.clearCache();
  }
}
