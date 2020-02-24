import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { namespace } from 'vuex-class'

import VJsonEditor from "v-jsoneditor"

import { ProxyRequestRecord } from "../../model/DataModels"

const AUDIO_RGX = new RegExp('(.mp3|.ogg|.wav)$');
const VIDEO_RGX = new RegExp('(.mp4)$');
const IMG_RGX = new RegExp("(.jpg|.jpeg|.png|.JPG|.gif|.GIF|.webp)$");

@Component({
    name: 'ProxyRequestDetail',
    components: {
        VJsonEditor
    },
})
export default class ProxyRequestDetail extends Vue {

    public $refs!: {
        respJsonEditor: VJsonEditor,
    };

    @Prop()
    request: ProxyRequestRecord = null;

    wrapperRecord: ProxyRequestRecord = null;

    tabActive: string = "0";
    curImgSrc: string = null;
    curAudioSrc: string = null;
    audioPlayer: any = null;
    showImgPreview: boolean = false;
    curVideoSrc: string = null;
    showVideoPreview: boolean = false;


    headerOption: any = {
        mode: "view",
        search: false,
    }

    responseOption: any = {
        mode: "view",
        modes: ["view", "code"],
        search: false
    }

    created() {

    }

    mounted() {
        this.init();
    }

    init() {
        this.audioPlayer = document.getElementById('audio-player');
        this.updateJsonEditor();
    }

    updateJsonEditor() {
        if (this.wrapperRecord == null) return;

        this.$refs.respJsonEditor.editor.set(this.wrapperRecord.responseData);
        if (this.$refs.respJsonEditor.editor.mode != "code") {
            this.$refs.respJsonEditor.editor.expandAll();
            this.addClickOnJsonEditor();
        }
    }

    addClickOnJsonEditor() {
        let as = document.getElementsByTagName('a');
        let self = this;
        for (let i = 0; i < as.length; ++i) {
            as[i].addEventListener('click', function (event) {
                event.preventDefault();
                let canShow = false;
                if (!!AUDIO_RGX.test(this.href)) {
                    self.curAudioSrc = this.href;
                    self.curImgSrc = null;
                    canShow = true;
                } else if (!!IMG_RGX.test(this.href)) {
                    self.curAudioSrc = null;
                    self.curImgSrc = this.href;
                    canShow = true;
                } else if (!!VIDEO_RGX.test(this.href)) {
                    self.curVideoSrc = this.href;
                    self.showVideoPreview = true;
                }
                self.showImgPreview = canShow;
            });
        }
    }

    closeImgPreview() {
        this.showImgPreview = false;
        this.curImgSrc = null;
        this.curAudioSrc = null;
        this.audioPlayer.pause();
    }

    addToMock() {
        // if (!!!this.record.responseData) {
        //     return;
        // }

        // this.record.responseData = this.jsonEditor.get();
        // this.$router.replace({ name: 'MockRuleMgr', params: this.record });
    }

    @Watch("request")
    onRecordChanged() {
        this.wrapperRecord = Object.assign({}, this.request);
    }
}
