<template>
    <div style="height: 100%; overflow-y: auto;">
        <div class="inspector-row">

            <p style="font-size: 1.0rem; color: #2c3e50; margin-left: 5px;"><strong>Path: </strong>{{record.url}}</p>
        </div>
        <div class="inspector-row">
            <h3>请求头</h3>
            <grapher-json class="preview" v-model="record.requestHeader" :editable="false"/>
        </div>
        <div class="inspector-row">
            <h3>请求参数</h3>
            <grapher-json class="preview" v-model="record.requestData" :editable="false"/>
        </div>
        <div class="inspector-row">
            <h3>响应头</h3>
            <grapher-json class="preview" v-model="record.responseHeader" :editable="false"/>
        </div>

        <div class="inspector-row">
            <h3>响应数据</h3>
            <mu-tabs inverse :value.sync="tabActive" indicator-color="primary">
                <mu-tab>JSON</mu-tab>
                <mu-tab>Plain TXT</mu-tab>
            </mu-tabs>
            <div class="preview">
                <div id="jsonEditor" v-show="tabActive === 0"></div>
                <pre v-show="tabActive === 1">{{record.responseData}}</pre>
            </div>
        </div>

        <mu-button small color="primary" style="position:absolute; top: 85px; right: 40px; z-index:101;" @click="addToMock">
            一键添加mock
        </mu-button>

        <div class="img-preview" v-show="showImgPreview">
            <img style="position: absolute; width: 100%; border-radius: 8px;" :src="curImgSrc" v-show="!!curImgSrc"/>
            <audio id="audio-player" style="position: absolute; width: 100%; top: 70px;" :src="curAudioSrc"
                   controls="controls" v-show="!!curAudioSrc"></audio>
            <mu-button fab small color="red" style="position:absolute; top: 5px; right: 5px;" @click="closeImgPreview">
                <mu-icon value="close"></mu-icon>
            </mu-button>
        </div>

    </div>
</template>

<script>

    import JsonEditor from "jsoneditor"

    import GrapherJson from 'grapher-json-ui'


    const AUDIO_RGX = new RegExp('(.mp3|.ogg|.wav)$');
    const IMG_RGX = new RegExp("(.jpg|.jpeg|.png|.JPG|.gif|.GIF)$");

    export default {
        name: "Inspector",
        props: {
            record: {
                type: Object,
                default() {
                    return null;
                }
            }
        },
        mounted() {
            this.init();
        },
        data() {
            return {
                jsonEditor: null,
                tabActive: 0,
                curImgSrc: null,
                curAudioSrc: null,
                audioPlayer: null,
                showImgPreview: false
            }
        },
        methods: {
            init() {
                if (!!this.jsonEditor) {
                    return;
                }
                let options = {
                    mode: 'view',
                    modes: ['tree', 'view'],
                    search: false,
                    navigationBar: false,
                    theme: 'jqueryui'
                };
                this.jsonEditor = new JsonEditor(document.getElementById("jsonEditor"), options);
                this.updateJsonEditor();
                this.audioPlayer = document.getElementById('audio-player');
            },
            updateJsonEditor() {
                this.jsonEditor.set(this.record.responseData);
                this.jsonEditor.expandAll();
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
                        }
                        self.showImgPreview = canShow;
                    });
                }
            },
            closeImgPreview() {
                this.showImgPreview = false;
                this.curImgSrc = null;
                this.curAudioSrc = null;
                this.audioPlayer.pause();
            },
            addToMock() {
                if (!!!this.record.responseData) {

                    return;
                }

                this.record.responseData = this.jsonEditor.get();
                this.$router.push({name: 'mock-setting', params: this.record});
            }
        },
        watch: {
            record() {
                this.updateJsonEditor();
            }
        },
        components: {
            GrapherJson
        }
    }
</script>

<style scoped>
    .inspector-row {
        width: 98%;
        background: #efefefef;
        border: 1px solid #efefefef;
        border-radius: 5px;
        box-shadow: 3px 3px 3px lightgray;
        margin: 15px 5px 0 5px;
        padding: 5px;
        font-size: 0.8rem;
        overflow-x: hidden;
    }

    .preview {
        background: white;
        padding: 10px;
        margin: 1px 0;
        font-size: 0.9rem;
    }

    .img-preview {
        position: absolute;
        top: 140px;
        right: 50px;
        width: 260px;
        height: 260px;
        border-radius: 10px;
        background: #3333;
        z-index:101;
    }
</style>
