// import { clipboard } from "electron"
import { Component, Prop, Vue, Watch } from "vue-property-decorator"
import { ProxyRequestRecord } from "../../model/DataModels"
import AddMockRule from "./AddMockRule.vue"
import JsonViewer from "./JsonViewer.vue"

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

  $refs!: {
    inspectorPanel: any;
    respDataDiv: any;
  };

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
