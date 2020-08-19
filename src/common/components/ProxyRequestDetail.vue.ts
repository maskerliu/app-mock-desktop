// import { clipboard } from "electron"
import axios from "axios"
import { Component, Prop, Vue, Watch } from "vue-property-decorator"
import { State } from "vuex-class"
import { ProxyRequestRecord } from "../../model/DataModels"
import AddMockRule from "./AddMockRule.vue"
import JsonViewer from "./JsonViewer.vue"
import { Message } from "element-ui"

const AUDIO_RGX = new RegExp("(.mp3|.ogg|.wav|.m4a|.aac)$");
const VIDEO_RGX = new RegExp("(.mp4)$");
const IMG_RGX = new RegExp("(.jpg|.jpeg|.png|.JPG|.gif|.GIF|.webp)$");

@Component({
  name: "ProxyRequestDetail",
  components: {
    JsonViewer,
    AddMockRule,
  },
})
export default class ProxyRequestDetail extends Vue {
  @Prop()
  record: ProxyRequestRecord;

  @State((state) => state.Common.localServerConfig.apiDefineServer)
  apiDefineServer: string;

  $refs!: {
    inspectorPanel: any;
    respDataDiv: any;
  };

  apiDesc: string = null;
  wrapperRecord: ProxyRequestRecord = null;
  curImgSrc: string = null;
  curAudioSrc: string = null;
  audioPlayer: any = null;
  curVideoSrc: string = null;
  showPreview: boolean = false;
  showAddMockRule: boolean = false;

  created() {

  }

  mounted() {
    this.wrapperRecord = Object.assign({}, this.record);
    this.audioPlayer = document.getElementById("audioPlayer");
  }

  onItemClick(item: string) {
    let canShow = false;
    if (!!AUDIO_RGX.test(item)) {
      this.curAudioSrc = item;
      this.curImgSrc = null;
      canShow = true;
    } else if (!!IMG_RGX.test(item)) {
      this.curAudioSrc = null;
      this.curImgSrc = item;
      canShow = true;
    } else if (!!VIDEO_RGX.test(item)) {
      this.curVideoSrc = item;
      canShow = true;
    }
    this.showPreview = canShow;
  }

  closeImgPreview() {
    this.showPreview = false;
    this.curImgSrc = null;
    this.curAudioSrc = null;
    if (this.audioPlayer != null) {
      this.audioPlayer.pause();
    }
  }

  copyLink() {
    // clipboard.writeText(this.record.url);
  }

  addToMockRule() {
    this.showAddMockRule = true;
  }

  updated() {
    this.$refs.inspectorPanel.scrollTop = 0;
    this.$nextTick(() => {
      this.$refs.inspectorPanel.scrollTop = this.$refs.respDataDiv.getBoundingClientRect().top;
    });
  }

  getApiDefineInfo() {
    this.apiDesc = null;
    if (this.apiDefineServer == null) {
      Message.warning("请在设置中指定API定义服务地址");
      return;
    }

    axios({
      baseURL: this.apiDefineServer,
      url: "/api/moreApiInfo.json",
      method: "POST",
      data: {
        keyword: this.record.url.substr(1).split("?")[0],
        appId: -1,
        businessId: -1,
        version: "",
        pageNo: 1,
        pageSize: 10
      },
    }).then(resp => {
      if (resp.data.code == 200) {
        if (resp.data.data.data.length > 0) {
          this.apiDesc = resp.data.data.data[0].description;
        } else {
          this.apiDesc = null;
        }
      }
    }).catch(err => {
      // console.log(err);
    });
  }

  @Watch("record")
  onRecordChanged() {
    this.wrapperRecord = Object.assign({}, this.record);
    this.getApiDefineInfo();
  }

  @Watch("showPreview")
  onShowPreviewChanged() {
    if (!this.showPreview) {
      if (this.audioPlayer != null) {
        this.audioPlayer.pause();
      }
      this.curImgSrc = null;
      this.curAudioSrc = null;
      this.curVideoSrc = null;
    }
  }
}
