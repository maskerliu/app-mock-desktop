<template>
    <div>
        <mu-appbar style="width: 100%">
            <mu-button flat slot="left" @click="onClose" color="red">
                <mu-icon value="close"></mu-icon>
            </mu-button>
            <mu-select slot="left" v-model="curMockConfigName" style="margin: 6px 0 0 1px;" icon="important_devices"
                       @change="onMockConfigChanged">
                <mu-option v-for="config, idx in mockConfigs" :key="idx" :label="config.name" :value="config.id">
                </mu-option>
            </mu-select>
            <mu-button flat slot="left" @click="saveMockConfigClick">保存</mu-button>
            <mu-button flat slot="left" @click="saveAsMockConfigClick">另存为</mu-button>
            <mu-button flat slot="left" @click="deleteMockConfig">删除</mu-button>

            <mu-switch slot="right" v-model="curMockConfigStatus" label-left label="开启mock: "
                       @change="setMockConfig"></mu-switch>
            <mu-button slot="right" @click="clearAllConfigs" style="margin-left: 15px;" color="redA700">
                清空mock规则
            </mu-button>
        </mu-appbar>

        <mu-flex direction="row">
            <div class="preview" id="mockRecord"></div>
            <mu-flex direction="column" style="padding-top: 50px;">
                <mu-button fab small color="indigo400" @click="addMockRule">
                    <mu-icon value="keyboard_arrow_right"></mu-icon>
                </mu-button>
            </mu-flex>
            <div class="preview" id="mockRules"></div>
        </mu-flex>

        <mu-dialog title="" width="360" :open.sync="openConfigNameInput">
            <mu-form ref="configNameForm" :model="configNameForm">
                <mu-form-item prop="configName" :rules="configNameRules" style="margin-top: 40px;">
                    <mu-text-field full-width v-model="configNameForm.configName" prop="configName"
                                   placeholder="mock配置名"></mu-text-field>
                </mu-form-item>
                <mu-form-item style="width: 100%;text-align: center;">
                    <mu-button color="primary" @click="configNameInputDone">确认</mu-button>
                    <mu-button color="white" textColor="black" @click="openConfigNameInput = false">取消</mu-button>
                </mu-form-item>
            </mu-form>
        </mu-dialog>

        <mu-snackbar :color="snackbarConfig.color" position="top" :open.sync="snackbarConfig.open">
            {{snackbarConfig.message}}
        </mu-snackbar>
    </div>
</template>

<script>

    import JsonEditor from "jsoneditor"
    import GrapherJson from 'grapher-json-ui'
    import {ipcRenderer} from 'electron'

    export default {
        name: "MockSetting",
        mounted() {

            this.initJsonEditors();

            ipcRenderer.on('reset-reply', this.onReset);
            ipcRenderer.on('get-mock-configs-reply', this.onGetMockConfigs);
            ipcRenderer.on('save-mock-configs-reply', this.onSaveMockConfig);
            ipcRenderer.on('get-mock-rules-reply', this.onGetMockRules);
            ipcRenderer.on('set-mock-config-reply', this.onSetMockConfig);
            ipcRenderer.on('del-mock-config-reply', this.onDelMockConfig);

            this.getMockConfigs();
        },
        destroyed() {
            ipcRenderer.removeAllListeners('reset-reply');
            ipcRenderer.removeAllListeners('get-mock-configs-reply');
            ipcRenderer.removeAllListeners('save-mock-configs-reply');
            ipcRenderer.removeAllListeners('get-mock-rules-reply');
            ipcRenderer.removeAllListeners('set-mock-config-reply');
            ipcRenderer.removeAllListeners('del-mock-config-reply');
        },
        data() {
            return {
                snackbarConfig: {
                    color: 'success',
                    message: null,
                    open: false,
                    timeout: 3000
                },
                openConfigNameInput: false,
                configNameForm: {
                    configName: null
                },
                configNameRules: [
                    {validate: (val) => !!val, message: '配置名不能为空'},
                    {validate: (val) => val.length >= 3, message: '配置名长度大于3'}
                ],
                mockRules: {},
                mockConfigs: [],
                curMockConfigId: 0,
                curMockConfigName: null,
                curMockConfigStatus: false,
                jeRecord: null,
                jeRules: null,
            }
        },
        methods: {
            initJsonEditors() {
                let options = {
                    mode: 'tree',
                    modes: [],
                    search: false,
                    navigationBar: false
                };
                this.jeRecord = new JsonEditor(document.getElementById("mockRecord"), options);
                this.jeRecord.set(this.$route.params);
                this.jeRecord.expandAll();
                this.jeRules = new JsonEditor(document.getElementById("mockRules"), options);
            },
            onReset(event, resp) {
                this.snackbarConfig = {open: true, message: resp.msg, color: resp.color};
                if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                this.snackbarConfig.timer = setTimeout(() => {
                    this.snackbarConfig.open = false;
                }, 1000);
                this.getMockConfigs();
            },
            onGetMockConfigs(event, resp) {
                this.mockConfigs = resp;
                this.curMockConfigId = 0;
                this.curMockConfigName = null;
                this.curMockConfigStatus = false;
                for (let key in this.mockConfigs) {
                    let mockConfig = this.mockConfigs[key];
                    let status = mockConfig.status;
                    mockConfig.status = (status === 1);

                    if (mockConfig.status) {
                        this.curMockConfigId = mockConfig.id;
                        this.curMockConfigName = mockConfig.name;
                        this.curMockConfigStatus = true;
                        this.getMockRules();
                    }
                }
            },
            onSaveMockConfig(event, resp) {
                this.snackbarConfig = {open: true, message: resp.msg, color: resp.color};
                if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                this.snackbarConfig.timer = setTimeout(() => {
                    this.snackbarConfig.open = false;
                }, 1000);
                this.getMockConfigs();
            },
            onGetMockRules(event, resp) {
                let rules = resp;
                for (let key in rules) {
                    if (!!rules[key].mockData) {
                        rules[key].mockData = JSON.parse(rules[key].mockData);
                    }
                    this.$set(this.mockRules, key, rules[key]);
                    this.jeRules.set(this.mockRules);
                }
            },
            onSetMockConfig(event, resp) {
                this.snackbarConfig = {open: true, message: resp.msg, color: resp.color};
                if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                this.snackbarConfig.timer = setTimeout(() => {
                    this.snackbarConfig.open = false;
                }, 1000);
                this.getMockConfigs();
            },
            onDelMockConfig(event, resp) {
                this.snackbarConfig = {open: true, message: resp.msg, color: resp.color};
                if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                this.snackbarConfig.timer = setTimeout(() => {
                    this.snackbarConfig.open = false;
                }, 1000);

                this.getMockConfigs();
            },
            onMockConfigChanged(val) {
                for (let config of this.mockConfigs) {
                    if (config.id === val) {
                        this.curMockConfigId = config.id;
                        this.curMockConfigName = config.name;
                        this.curMockConfigStatus = config.status;

                        this.getMockRules();
                        break;
                    }
                }
            },
            onClose() {
                this.$router.go(-1);
            },
            addMockRule() {
                let path = this.jeRecord.get().url;
                if (!!!path) {
                    this.snackbarConfig = {open: true, message: '规则名[path]不能为空', color: 'red'};
                    if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                    this.snackbarConfig.timer = setTimeout(() => {
                        this.snackbarConfig.open = false;
                    }, 1000);
                    return;
                }
                let rule = {
                    path: path,
                    mockData: {
                        statusCode: this.jeRecord.get().statusCode,
                        responseHeader: this.jeRecord.get().responseHeader,
                        responseData: this.jeRecord.get().responseData
                    }
                };

                if (this.curMockConfigId !== 0) {
                    rule['configId'] = this.curMockConfigId;
                }

                if (this.mockRules[path]) {
                    rule.id = this.mockRules[path].id;
                }

                delete this.mockRules[path];
                this.$set(this.mockRules, path, rule);

                this.jeRules.set(this.mockRules);
            },
            getMockConfigs() {
                ipcRenderer.send('get-mock-configs');
            },
            saveMockConfigClick() {
                if (!!this.curMockConfigId) {
                    this.saveMockConfig();
                } else {
                    this.openConfigNameInput = true;
                }
            },
            getMockRules() {
                if (this.curMockConfigId !== 0) {
                    for (let key in this.mockRules) {
                        delete this.mockRules[key];
                    }

                    ipcRenderer.send('get-mock-rules', {configId: this.curMockConfigId});
                }
            },
            saveAsMockConfigClick() {
                this.openConfigNameInput = true;
            },
            deleteMockConfig() {
                if (this.curMockConfigId !== 0) {
                    ipcRenderer.send('del-mock-config', {configId: this.curMockConfigId});
                }
            },
            setMockConfig() {
                if (this.curMockConfigId === 0) {
                    this.curMockConfigStatus = false;
                    return;
                }
                ipcRenderer.send('set-mock-config', {configId: this.curMockConfigId, status: this.curMockConfigStatus});
            },
            configNameInputDone() {
                this.$refs.configNameForm.validate().then((result) => {
                    this.curMockConfigName = this.configNameForm.configName;
                    this.curMockConfigId = 0;
                    if (result) {
                        this.openConfigNameInput = false;
                        this.saveMockConfig();
                    }
                });
            },
            saveMockConfig() {
                let config = {};
                if (this.curMockConfigId !== 0) {
                    config.id = this.curMockConfigId;
                    for (let key in this.mockRules) {
                        this.mockRules[key].configId = this.curMockConfigId;
                    }
                }
                if (!!this.curMockConfigName) {
                    config.name = this.curMockConfigName;
                }

                ipcRenderer.send('save-mock-config', {config: config, rules: this.jeRules.get()});
            },
            clearAllConfigs() {
                ipcRenderer.send('reset');
            }
        },
        computed: {},
        components: {
            GrapherJson
        }
    }
</script>

<style scoped>

    .preview {
        width: 50vw;
        height: calc(100vh - 75px);
        overflow-y: auto;
        border-radius: 5px;
        border: 1px solid lightgrey;
        margin: 5px;
        box-shadow: 3px 3px 3px lightgrey;
    }

</style>

