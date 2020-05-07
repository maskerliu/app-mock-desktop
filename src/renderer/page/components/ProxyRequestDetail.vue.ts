import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { Action, namespace } from 'vuex-class'

import { remote } from "electron"

import JsonViewer from "./JsonViewer.vue"
import AddMockRule from "./AddMockRule.vue"

import { ProxyRequestRecord } from "../../../model/DataModels"

const { Menu, MenuItem } = remote
const AUDIO_RGX = new RegExp('(.mp3|.ogg|.wav|.m4a|.aac)$');
const VIDEO_RGX = new RegExp('(.mp4)$');
const IMG_RGX = new RegExp("(.jpg|.jpeg|.png|.JPG|.gif|.GIF|.webp)$");

@Component({
    name: 'ProxyRequestDetail',
    components: {
        JsonViewer,
        AddMockRule
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
        mainMenuBar: false
    }

    responseOption: any = {
        mode: "view",
        modes: ["view", "code"],
        search: false
    }

    created() {
        const menu = new Menu()
        menu.append(new MenuItem({ label: 'MenuItem1', click() { console.log('item 1 clicked') } }))
        menu.append(new MenuItem({ type: 'separator' }))
        menu.append(new MenuItem({ label: 'MenuItem2', type: 'checkbox', checked: true }))
        window.addEventListener('contextmenu', (e) => {
            e.preventDefault()
            menu.popup({ window: remote.getCurrentWindow() })
        }, false);
    }

    mounted() {
        this.audioPlayer = document.getElementById('audioPlayer');
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
        // setTimeout(() => { this.$refs.respJsonEditor.editor.expandAll(); }, 100);
        // setTimeout(this.addJsonEditorClickListensers, 100);
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
