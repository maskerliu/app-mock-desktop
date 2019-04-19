<template>
    <mu-flex direction="column">
        <mu-appbar color="primary" title="移动客户端mock工具" style="width: 100%;">
            <mu-button ref="button" flat @click="popoverConfig.open = !popoverConfig.open" slot="left">注册</mu-button>
            <mu-popover :open.sync="popoverConfig.open" :trigger="popoverConfig.trigger">
                <div id="register">
                    扫描二维码或者手机访问:<br/>
                    <qrcode-vue :value="registerUrl" size="256"></qrcode-vue>
                    <div>
                        <span style="color: #777;" @click="click2Reg">{{registerUrl}}</span>
                    </div>
                </div>
            </mu-popover>
            <mu-button flat slot="left" @click="openMockConfig">mock配置</mu-button>
            <mu-button icon @click="showHelp" slot="right">
                <mu-icon value="info"></mu-icon>
            </mu-button>
            <mu-button color="red" icon @click="clearCache" slot="right">
                <mu-icon value="clear_all"></mu-icon>
            </mu-button>
        </mu-appbar>
        <mu-flex direction='row' id="content" style="width: 100vw; height: calc(100vh - 64px);">
            <mu-flex class="url-container" fill direction='column'>
                <mu-flex fill direction="row" align-items="center"
                         style="margin: 3px;width: 98%; box-shadow: 3px 3px 3px lightgrey;">
                    <mu-text-field full-width type="text" placeholder="筛选条件" icon="swap_vert"
                                   action-icon="clear"
                                   style="margin: 10px 0; padding: 5px 10px 0 45px;"></mu-text-field>
                    <mu-button icon color="red" @click="clearAllRequest">
                        <mu-icon value="delete_sweep"></mu-icon>
                    </mu-button>
                </mu-flex>

                <mu-list textline="two-line" style="width: 100%; height: calc(100vh - 112px);" id="reqList"
                         v-if="!!records">
                    <mu-list-item class="request-snap" avatar :ripple="false" button
                                  v-bind:class="item.mock ? 'mock': ''"
                                  v-for="item in records" :key="item.id"
                                  @click="recordDetail(item)">
                        <span class="selected" v-if="curRecordId === item.id"></span>
                        <mu-list-item-content>
                            <mu-list-item-title>
                                <strong class="request-snap-method">[{{item.method}}] </strong>
                                <strong class="request-snap-url">{{item.url}}</strong>
                            </mu-list-item-title>
                            <mu-list-item-sub-title>
                                <mu-badge :content="item.statusCode + ''"
                                          v-if="!!item.responseData"
                                          :color="item.statusCode === 200 ? 'success' : 'red'"></mu-badge>
                                <mu-badge :content="'耗时: ' + (item.time ? item.time : '--') + 'ms'"
                                          color="orange"></mu-badge>
                            </mu-list-item-sub-title>
                        </mu-list-item-content>
                        <mu-list-item-action>
                            <mu-list-item-after-text>{{item.startTime}}</mu-list-item-after-text>
                            <mu-button fab small color="success" @click="openMockConfig">
                                <mu-icon value="add"></mu-icon>
                            </mu-button>

                        </mu-list-item-action>
                        <mu-linear-progress v-if="!!!item.responseData"></mu-linear-progress>
                    </mu-list-item>
                </mu-list>
            </mu-flex>
            <mu-flex class="inspect-container" direction="column" justify-content="start">
                <mu-tabs inverse :value.sync="tabActive" style="width: 100%;">
                    <mu-tab>Inspector</mu-tab>
                    <mu-tab>Request Builder</mu-tab>
                    <mu-tab>Tools</mu-tab>
                </mu-tabs>
                <div id="tab_content" style="width: 100%; height: calc(100vh - 130px);">
                    <Inspector v-if="tabActive === 0" v-bind:record="curRecord"></Inspector>
                    <RequestBuilder v-if="tabActive === 1"></RequestBuilder>
                    <Tools v-if="tabActive === 2"></Tools>
                </div>
            </mu-flex>
        </mu-flex>
        <mu-snackbar color="success" position="top" :open.sync="snackbarConfig.open">
            {{snackbarConfig.message}}
        </mu-snackbar>

        <MockConfig :record="curRecord"></MockConfig>
    </mu-flex>
</template>

<script>
    import {getIp, register} from "../model/LocalApi"
    import {autoScrollList, generateUid, currentTime} from "@/common/utils"
    import {CmdCode} from '@/common/Codes'

    import Inspector from './Inspector'
    import RequestBuilder from './RequestBuilder'
    import Tools from './Tools'

    import QrcodeVue from 'qrcode.vue'
    import MockConfig from './MockConfig'

    let listCount = 0;

    export default {
        name: "Mock",
        mounted() {
            this.popoverConfig.trigger = this.$refs.button.$el;
            this.init();
        },
        data() {
            return {
                snackbarConfig: {
                    message: null,
                    open: false,
                    timeout: 3000
                },
                popoverConfig: {
                    open: false,
                    trigger: null,
                },
                isLooping: false,
                tabActive: 0,
                registerUrl: '',
                records: {},
                curRecord: null,
                curRecordId: 0,
                filepath: null
            }
        },
        methods: {
            init() {
                getIp().then(resp => {
                    let uid = this.$cookies.isKey('uid') ? this.$cookies.get('uid') : generateUid();
                    this.registerUrl = ['http://', resp.ip, '/mw/register?_=0__0&uid=', uid].join('');
                    this.filepath = resp.path;
                    this.$options.sockets.onmessage = (stream) => {
                        this.handleMsg(stream.data);
                    };
                }).catch(err => {
                    this.registerUrl = err;
                });
            },
            click2Reg() {
                let uid = this.$cookies.isKey('uid') ? this.$cookies.get('uid') : generateUid();
                register(uid).then(resp => {

                }).catch(err => {

                });
            },
            openMockConfig() {
                this.$store.dispatch('updateShowMockConfig', {show: true});
            },
            clearAllRequest() {
                this.records = {};
                this.curRecord = {};
            },
            clearCache() {

            },
            showHelp() {
            },
            handleMsg(data) {
                let msg = JSON.parse(data);
                switch (msg.code) {
                    case CmdCode.REGISTER_SUCCESS:
                        this.popoverConfig.open = false;
                        this.snackbarConfig = {open: true, message: '设备[' + msg.data + ']注册成功'};
                        if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                        this.snackbarConfig.timer = setTimeout(() => {
                            this.snackbarConfig.open = false;
                        }, 1000);
                        break;
                    case CmdCode.REQUEST_START:
                        this.requestStart(msg.data);
                        break;
                    case CmdCode.REQUEST_END:
                        this.requestEnd(msg.data);
                        break;
                    default:
                        console.log('unhandled code:', msg);
                }
            },
            requestStart(data) {
                let result = {};
                result.id = data.id;
                result.url = data.url;
                result.method = data.method;
                result.requestHeader = Object.assign({}, data.headers);
                result.requestData = Object.assign({}, data.requestData);
                result.startTime = currentTime();
                this.$set(this.records, data.id, result);
                this.scrollToBottom();
            },
            requestEnd(data) {
                let record = this.records[data.id];
                let appendRecord = {
                    statusCode: data.statusCode,
                    responseHeader: data.headers,
                    responseData: JSON.parse(data.responseData),
                    time: data.time,
                    delay: data.delay,
                    mock: data.mock
                };

                if (!!!record) {
                    record = {};
                }

                let result = Object.assign({}, this.records[data.id], appendRecord);
                this.$set(this.records, data.id, result);
            },
            scrollToBottom() {
                let container = document.getElementById("reqList");
                container.scrollTop = container.scrollHeight;
            },
            recordDetail(item) {
                console.log(item);
                this.tabActive = 0;
                this.curRecordId = !!item.id ? item.id : 0;
                this.curRecord = !!item ? item : {};
                console.log(this.records);
            }
        },
        watch: {
            records() {
                this.$nextTick(() => {
                    this.scrollToBottom();
                })
            }
        },
        components: {
            Inspector, RequestBuilder, Tools, QrcodeVue, MockConfig
        }
    }
</script>

<style scoped>

    .container {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    .mu-linear-progress {
        position: absolute;
        right: 0;
        top: 0;
    }

    .url-container {
        width: calc(40vw - 5px);
        height: calc(100vh - 74px);
        min-width: 400px;
        max-width: 400px;
        margin: 5px;
        border-radius: 5px;
        border: 1px solid lightgray;
        box-shadow: 5px 5px 5px lightgray;
    }

    .inspect-container {
        width: calc(100vw - 420px);
        height: calc(100vh - 74px);
        margin: 5px;
        border-radius: 5px;
        border: 1px solid lightgray;
        box-shadow: 5px 5px 5px lightgray;
    }

    #register {
        width: 300px;
        height: 350px;
        background-color: white;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 5px 5px 5px lightgray;
        text-align: center;
    }

    .request-snap {
        border-top: 1px solid lightgray;
    }

    .request-snap-method {
        font-size: 0.8rem;
        color: #2980b9;
    }

    .request-snap-url {
        font-size: 0.8rem;
        color: #34495e;
        font-style: italic;
    }

    .mock {
        background: #fffde7;
    }

    .selected {
        position: absolute;
        width: 6px;
        height: 100%;
        background: #16a085;
        left: 0;
        top: 0;
    }

</style>
