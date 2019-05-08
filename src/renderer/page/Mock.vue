<template>
    <mu-flex direction="column">
        <mu-appbar color="primary" title="移动客户端mock工具" style="width: 100%;">
            <mu-button ref="btnRegister" flat @click="qrcodePopoverConfig.open = !qrcodePopoverConfig.open" slot="left">
                注册
            </mu-button>
            <mu-popover :open.sync="qrcodePopoverConfig.open" :trigger="qrcodePopoverConfig.trigger">
                <div id="register">
                    扫描二维码或者手机访问:<br/>
                    <qrcode-vue :value="registerUrl" size="256"></qrcode-vue>
                    <div>
                        <span style="color: #777;" @click="click2Reg">{{registerUrl}}</span>
                    </div>
                </div>
            </mu-popover>
            <mu-button flat slot="left" @click="openMockConfig(curRecord)">mock配置</mu-button>

            <mu-button icon @click="showGuide" slot="right">
                <mu-icon value="info"></mu-icon>
            </mu-button>
            <span slot="right" style="margin-right: 15px;">v 0.0.3</span>
        </mu-appbar>
        <mu-flex direction='row' id="content" style="width: 100vw; height: calc(100vh - 64px);">
            <mu-flex class="url-container" fill direction='column'>
                <mu-flex fill direction="row" align-items="center"
                         style="width: 100%; min-height: 64px; padding: 15px;">
                    <mu-checkbox v-model="proxyRequest" @change="onSetProxyRequest"
                                 uncheck-icon="http" checked-icon="http" style="margin-left: 15px;"></mu-checkbox>
                    <mu-checkbox v-model="proxyStatistics" @change="onSetProxyStatistics"
                                 uncheck-icon="link" checked-icon="link" style="margin-left: 25px;"></mu-checkbox>
                    <mu-switch v-model="proxyDelay" label="延时模拟:" label-left style="margin-left: 25px;"
                               @change="onProxyDelayChange"></mu-switch>
                    <mu-text-field v-model="customDelay" v-show="proxyDelay" action-icon="done"
                                   style="width: 30%; margin:0 0 0 20px; min-height: 21px; padding: 0;"
                                   :action-click="onSetProxyDelay"></mu-text-field>
                </mu-flex>

                <mu-divider/>
                <mu-flex fill direction="row" align-items="center"
                         style="margin: 3px;width: 98%; box-shadow: 3px 3px 3px lightgrey;">
                    <mu-text-field full-width type="text" placeholder="筛选条件" icon="swap_vert"
                                   action-icon="clear" v-model="filterKeyword" :action-click="clearSearch"
                                   style="margin: 10px 0; padding: 5px 10px 0 45px;"></mu-text-field>
                    <mu-button icon color="red" @click="clearAllRequest">
                        <mu-icon value="delete_sweep"></mu-icon>
                    </mu-button>
                </mu-flex>

                <mu-list textline="two-line" style="width: 100%; height: calc(100vh - 112px);" id="reqList"
                         v-if="!!records">
                    <mu-list-item class="request-snap" avatar :ripple="false" button
                                  v-bind:class="{'mock': item.mock, 'statistic': item.type === 5008}"
                                  v-for="item in filterRecords" :key="item.id"
                                  @click="recordDetail(item)">
                        <span class="selected" v-if="curRecordId === item.id"></span>
                        <mu-list-item-content v-if="item.type === 5001">
                            <mu-list-item-title>
                                <strong class="request-snap-method">[{{item.method}}] </strong>
                                <strong class="request-snap-url">{{item.url}}</strong>
                            </mu-list-item-title>
                            <mu-list-item-sub-title>
                                <mu-badge :content="'[HTTP] ' + item.statusCode"
                                          v-if="!!item.responseData"
                                          :color="item.statusCode === 200 ? 'green300' : 'red400'"></mu-badge>
                                <mu-badge :content="'[BIZ] ' + item.responseData.code + ''" v-if="!!item.responseData"
                                          :color="parseInt(item.responseData.code) === 8000 ? 'green300' : 'red300'"></mu-badge>
                                <mu-badge :content="'耗时: ' + (item.time ? item.time : '--') + 'ms'"
                                          :color="(item.time && item.time < 200) ? 'green300': 'red200'"></mu-badge>
                            </mu-list-item-sub-title>
                        </mu-list-item-content>
                        <mu-list-item-content v-if="item.type === 5008">
                            <mu-list-item-title>
                                <strong style="color: #8e44ad;">打点</strong>
                            </mu-list-item-title>
                        </mu-list-item-content>
                        <mu-list-item-action>
                            <mu-list-item-after-text>{{item.startTime}}</mu-list-item-after-text>
                            <mu-button fab small color="success" @click="openMockConfig(item)"
                                       v-if="item.type === 5001">
                                <mu-icon value="add"></mu-icon>
                            </mu-button>
                        </mu-list-item-action>
                        <mu-linear-progress v-if="!!!item.responseData && item.type === 5001"></mu-linear-progress>
                    </mu-list-item>
                </mu-list>
            </mu-flex>
            <mu-flex class="inspect-container" direction="column" justify-content="start">
                <mu-tabs inverse :value.sync="tabActive" style="width: 100%;">
                    <mu-tab>代理</mu-tab>
                    <mu-tab>打点</mu-tab>
                    <mu-tab>响应构建</mu-tab>

                </mu-tabs>
                <div id="tab_content" style="width: 100%; height: calc(100vh - 130px);">
                    <Inspector v-if="tabActive === 0 && curRecord.type === 5001" :record="curRecord"></Inspector>
                    <Statistics v-if="tabActive === 1 && curRecord.type === 5008" :record="curRecord"></Statistics>
                    <RequestBuilder v-if="tabActive === 2"></RequestBuilder>

                </div>
            </mu-flex>
        </mu-flex>
        <mu-snackbar color="success" position="top" :open.sync="snackbarConfig.open">
            {{snackbarConfig.message}}
        </mu-snackbar>

        <mu-dialog title="本地服务端口" width="360" :open.sync="showPortSetting">
            <mu-text-field v-model="customPort" type="text" error-text="需重启后生效"></mu-text-field>
            <mu-button slot="actions" color="secondary" @click="showPortSetting = false">取消</mu-button>
            <mu-button slot="actions" color="primary" style="margin-left: 40px;" @click="onSavePortSetting">确认
            </mu-button>
        </mu-dialog>

        <mu-dialog title="版本更新" width="360" :open.sync="showUpdateTips">
            <span v-html="releaseNotes"></span>
            <p>{{message}}</p>
            <mu-linear-progress mode="determinate"
                                style="width: 100%; position: relative; margin-top: 15px;"
                                :value="downloadPercent" :size="15" color="green"></mu-linear-progress>
            <mu-button slot="actions" color="secondary" @click="showUpdateTips = false">取消</mu-button>
            <mu-button slot="actions" color="primary" style="margin-left: 40px;" @click="onUpdateNow">确认
            </mu-button>
        </mu-dialog>
    </mu-flex>

</template>

<script>
    import {getIp, register} from "../model/LocalApi"
    import {autoScrollList, generateUid, currentTime} from "@/common/utils"
    import {CmdCode} from '@/common/Codes'

    import Inspector from './Inspector'
    import RequestBuilder from './RequestBuilder'
    import Statistics from './Statistics'

    import QrcodeVue from 'qrcode.vue'

    import {ipcRenderer} from 'electron'

    export default {
        name: "Mock",
        mounted() {
            this.qrcodePopoverConfig.trigger = this.$refs.btnRegister.$el;

            ipcRenderer.on('open-port-setting', () => {
                this.showPortSetting = true;
            });
            ipcRenderer.on('get-local-server-reply', this.onGetLocalServer);


            ipcRenderer.on("update-check", (event, data) => {
                this.message = data;
            });
            ipcRenderer.on("update-available", (event, data) => {
                this.showUpdateTips = true;
                this.releaseNotes = data.releaseNotes;
                this.message="是否下载新版本？"
            });
            ipcRenderer.on("update-not-available", (event, data) => {
                this.message = data;
            });

            ipcRenderer.on("download-progress", (event, progress) => {
                this.downloadPercent = progress.percent || 0;
                console.log(this.downloadPercent);
            });

            ipcRenderer.on("update-now", (event, resp) => {
                this.showUpdateTips = true;
                this.message = "是否立刻重启更新？";
                this.downloadPercent = 100;
            });

            ipcRenderer.send("check-update");
            ipcRenderer.send('get-local-server');
        },
        destroyed() {
            ipcRenderer.removeAllListeners('open-port-setting');
            ipcRenderer.removeAllListeners('get-local-server-reply');
            ipcRenderer.removeAllListeners('update-check');
            ipcRenderer.removeAllListeners('update-available');
            ipcRenderer.removeAllListeners('update-not-available');
            ipcRenderer.removeAllListeners('download-progress');
            ipcRenderer.removeAllListeners('update-now');
        },
        data() {
            return {
                showPortSetting: false,
                customPort: 0,
                snackbarConfig: {
                    message: null,
                    open: false,
                    timeout: 3000
                },
                qrcodePopoverConfig: {
                    open: false,
                    trigger: null,
                },
                proxyRequest: true,
                proxyStatistics: false,
                proxyDelay: false,
                customDelay: 0,
                tabActive: 0,
                registerUrl: '',
                records: {},
                curRecord: {},
                curRecordId: 0,
                filepath: null,
                filterKeyword: null,
                message: '',
                downloadPercent: 0,
                showUpdateTips: false,
                releaseNotes: null
            }
        },
        methods: {
            onGetLocalServer(event, resp) {
                let uid = this.$cookies.isKey('uid') ? this.$cookies.get('uid') : generateUid();
                this.registerUrl = ['http://', resp.registerIp, ':', resp.customPort, '/mw/register?_=0__0&uid=', uid].join('');
                this.$options.sockets.onmessage = (stream) => {
                    this.handleMsg(stream.data);
                };
                this.customPort = resp.customPort;
            },
            onSavePortSetting() {
                ipcRenderer.send('port-setting-save', {customPort: this.customPort});
                this.showPortSetting = false;
            },
            onUpdateNow() {
                if (this.downloadPercent === 100) {
                    ipcRenderer.send("update-now");
                } else {
                    ipcRenderer.send("download-update");
                    this.showUpdateTips = false;
                }
            },
            click2Reg() {
                let uid = this.$cookies.isKey('uid') ? this.$cookies.get('uid') : generateUid();
                register(uid).then(resp => {

                }).catch(err => {

                });
            },
            openMockConfig(record) {
                this.curRecord = record;
                this.$router.push({name: 'mock-setting', params: this.curRecord});
            },
            clearSearch() {
                this.filterKeyword = null;
            },
            clearAllRequest() {
                this.records = {};
                this.curRecord = {};
            },
            onProxyDelayChange() {
                if (!this.proxyDelay) {
                    this.customDelay = 0;
                    ipcRenderer.send('set-proxy-delay', {delay: this.customDelay});
                }
            },
            onSetProxyDelay() {
                ipcRenderer.send('set-proxy-delay', {delay: this.customDelay});
            },
            onSetProxyRequest() {
                ipcRenderer.send('set-proxy-request', {proxyRequest: this.proxyRequest});
            },
            onSetProxyStatistics() {
                ipcRenderer.send('set-proxy-statistics', {proxyStatistics: this.proxyStatistics});
            },
            showGuide() {
                this.$router.push({name: 'mock-guide'});
            },
            handleMsg(data) {
                let msg = JSON.parse(data);
                switch (msg.code) {
                    case CmdCode.REGISTER_SUCCESS:
                        this.qrcodePopoverConfig.open = false;
                        this.snackbarConfig = {open: true, message: '设备[' + msg.data + ']注册成功'};
                        if (this.snackbarConfig.timer)
                            clearTimeout(this.snackbarConfig.timer);
                        this.snackbarConfig.timer = setTimeout(() => {
                            this.snackbarConfig.open = false;
                        }, 1000);
                        break;
                    case CmdCode.REQUEST_START:
                        msg.data.type = CmdCode.REQUEST;
                        this.requestStart(msg.data);
                        break;
                    case CmdCode.REQUEST_END:
                        msg.data.type = CmdCode.REQUEST;
                        this.requestEnd(msg.data);
                        break;
                    case CmdCode.STATISTICS:
                        msg.data.type = CmdCode.STATISTICS;
                        this.addStatistics(msg.data);
                        break;
                    default:
                        this.snackbarConfig = {open: true, message: 'unhandled code:' + msg.code};
                        if (this.snackbarConfig.timer)
                            clearTimeout(this.snackbarConfig.timer);
                        this.snackbarConfig.timer = setTimeout(() => {
                            this.snackbarConfig.open = false;
                        }, 1000);
                        console.log('unhandled code:', msg);
                }
            },
            requestStart(data) {
                let result = {
                    id: data.id,
                    url: data.url,
                    method: data.method,
                    requestHeader: Object.assign({}, data.headers),
                    requestData: Object.assign({}, data.requestData),
                    startTime: currentTime(),
                    type: data.type
                };

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
                    mock: data.mock,
                    type: data.type
                };

                if (!!!record) {
                    record = {};
                }

                let result = Object.assign({}, this.records[data.id], appendRecord);
                this.$set(this.records, data.id, result);
            },
            addStatistics(data) {
                let record = data.statistics;
                record.startTime = currentTime();
                record.type = CmdCode.STATISTICS;
                record.id = data.id;
                this.$set(this.records, data.id, record);
            },
            scrollToBottom() {
                let container = document.getElementById("reqList");
                if (!!container) {
                    container.scrollTop = container.scrollHeight;
                }
            },
            recordDetail(item) {
                switch (item.type) {
                    case CmdCode.STATISTICS:
                        this.tabActive = 1;
                        break;
                    case CmdCode.REQUEST:
                        this.tabActive = 0;
                        break;
                }
                this.curRecordId = !!item.id ? item.id : 0;
                this.curRecord = !!item ? item : {};
            }
        },
        computed: {
            filterRecords() {
                let filterRecords = {};

                if (!!!this.filterKeyword) {
                    return this.records;
                }
                for (let key in this.records) {
                    if (this.records[key].url.indexOf(this.filterKeyword) !== -1)
                        filterRecords[key] = this.records[key];
                }
                return filterRecords;
            }
        },
        watch: {
            records() {
                this.$nextTick(() => {
                    try {
                        this.scrollToBottom();
                    } catch (e) {

                    }
                });
            }
        },
        components: {
            Inspector, RequestBuilder, Statistics, QrcodeVue
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

    #update {
        width: 280px;
        height: 100px;
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

    .statistic {
        background: #f3e5f5;
    }

    .biz-success {
        background: #f1f8e9;
    }

    .biz-error {
        background: #ffccbc;
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
