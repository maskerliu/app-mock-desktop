import { clipboard, remote } from "electron";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { ProxyRequestRecord } from "../../../model/DataModels";
import AddMockRule from "./AddMockRule.vue";
import JsonViewer from "./JsonViewer.vue";

const { Menu, MenuItem } = remote;
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
  record: ProxyRequestRecord = null;

  wrapperRecord: ProxyRequestRecord = null;

  tabActive: string = "0";
  curImgSrc: string = null;
  curAudioSrc: string = null;
  audioPlayer: any = null;
  curVideoSrc: string = null;
  showPreview: boolean = false;
  showAddMockRule: boolean = false;

  headerOption: any = {
    mode: "code",
    search: false,
    navigationBar: false,
    statusBar: false,
    mainMenuBar: false,
  };

  responseOption: any = {
    mode: "view",
    modes: ["view", "code"],
    search: false,
  };

  created() {
    const menu = new Menu();
    menu.append(
      new MenuItem({
        label: "预览",
        click() {
          console.log("预览");
        },
      })
    );
    menu.append(new MenuItem({ type: "separator" }));
    menu.append(
      new MenuItem({
        label: "播放",
        click() {
          console.log("播放");
        },
      })
    );
    window.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        menu.popup({ window: remote.getCurrentWindow() });
      },
      false
    );
  }

  mounted() {
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
    clipboard.writeText(this.record.url);
  }

  addToMockRule() {
    this.showAddMockRule = true;
  }

  @Watch("record")
  onRecordChanged() {
    this.wrapperRecord = Object.assign({}, this.record);
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
