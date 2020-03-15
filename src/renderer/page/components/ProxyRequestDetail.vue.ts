import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { Action, namespace } from 'vuex-class'

import VJsonEditor from "v-jsoneditor"
import AddMockRule from "./AddMockRule.vue"

import { ProxyRequestRecord } from "../../../model/DataModels"

const AUDIO_RGX = new RegExp('(.mp3|.ogg|.wav|.m4a|.aac)$');
const VIDEO_RGX = new RegExp('(.mp4)$');
const IMG_RGX = new RegExp("(.jpg|.jpeg|.png|.JPG|.gif|.GIF|.webp)$");

@Component({
    name: 'ProxyRequestDetail',
    components: {
        VJsonEditor,
        AddMockRule
    },
})
export default class ProxyRequestDetail extends Vue {


    @Action('sendMessage')
    public sendMessage: Function;

    $refs!: {
        respJsonEditor: VJsonEditor
    };

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
        mainMenuBar: false
    }

    responseOption: any = {
        mode: "view",
        modes: ["view", "code"],
        search: false
    }

    created() {

    }

    mounted() {
        this.audioPlayer = document.getElementById('audioPlayer');
    }

    addJsonEditorClickListensers() {
        this.$refs.respJsonEditor.editor.expandAll();
        let as = document.getElementsByTagName('a');
        let self = this;

        for (let i = 0; i < as.length; ++i) {
            as[i].addEventListener('click', function (this, event) {
                event.preventDefault();
                let canShow = false;
                if (!!AUDIO_RGX.test(as[i].href)) {
                    self.curAudioSrc = as[i].href;
                    self.curImgSrc = null;
                    canShow = true;
                } else if (!!IMG_RGX.test(as[i].href)) {
                    self.curAudioSrc = null;
                    self.curImgSrc = as[i].href;
                    canShow = true;
                } else if (!!VIDEO_RGX.test(as[i].href)) {
                    self.curVideoSrc = as[i].href;
                    canShow = true;
                }
                self.showPreview = canShow;
            });
        }
    }

    closeImgPreview() {
        this.showPreview = false;
        this.curImgSrc = null;
        this.curAudioSrc = null;
        if (this.audioPlayer != null) {
            this.audioPlayer.pause();
        }
    }

    addToMock() {
        this.showAddMockRule = true;
        // if (!!!this.record.responseData) {
        //     return;
        // }

        // this.record.responseData = this.jsonEditor.get();
        // this.$router.replace({ name: 'MockRuleMgr', params: this.record });
    }

    @Watch("record")
    onRecordChanged() {
        this.wrapperRecord = Object.assign({}, this.record);
        setTimeout(this.addJsonEditorClickListensers, 100);
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
