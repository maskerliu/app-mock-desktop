<template>
    <mu-dialog transition="slide-bottom" width="600" fullscreen
               :open="$store.getters.showMockConfig.show" :overlay-close="false" :esc-press-close="false" :padding="1">
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
            <v-jsoneditor class="preview" v-model="myRecord" :options="jsonEditorOptions0"
                          @input="jsonChange"></v-jsoneditor>
            <mu-flex direction="column" style="padding-top: 50px;">
                <mu-button fab small color="indigo400" @click="addMockRule">
                    <mu-icon value="keyboard_arrow_right"></mu-icon>
                </mu-button>
            </mu-flex>
            <v-jsoneditor class="preview" v-model="mockRules" :options="jsonEditorOptions1"></v-jsoneditor>
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
    </mu-dialog>
</template>

<script>
    import {
        reset,
        loadMockConfigs,
        saveMockConfig,
        updateMockConfig,
        removeMockConfig,
        loadMockRules
    } from "../model/LocalApi";
    import JSONEditor from 'jsoneditor'

    export default {
        name: "MockConfig",
        mounted() {
            this.getMockConfigs();
        },
        props: ['record'],
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
                myRecord: {},
                curRecord: {},
                mockConfigs: [],
                curMockConfigId: 0,
                curMockConfigName: null,
                curMockConfigStatus: false,
                jsonEditorOptions0: {
                    mode: 'text',
                    modes: ['text', 'view',],
                    search: false,
                    navigationBar: false
                },
                jsonEditorOptions1: {
                    mode: 'tree',
                    modes: [],
                    search: false,
                    navigationBar: false
                }
            }
        },
        methods: {
            init() {
                // let container = document.getElementById("preEditor");
                // this.preEditor = new JSONEditor(container, this.jsonEditorOptions0);
                //
                // container = document.getElementById("preEditor");
                // this.rulePreview = new JSONEditor(container, this.jsonEditorOptions1);

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
                this.$store.dispatch('updateShowMockConfig', {show: false});
            },
            addMockRule() {
                let path = this.curRecord.url;
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
                        statusCode: this.curRecord.statusCode,
                        responseHeader: this.curRecord.responseHeader,
                        responseData: this.curRecord.responseData
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
            },
            getMockConfigs() {
                loadMockConfigs().then(resp => {
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
                }).catch(err => {

                });
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
                    loadMockRules(this.curMockConfigId).then(resp => {
                        this.$set(this.mockRules, 'test', null);
                        delete this.mockRules['test'];
                        let rules = resp;
                        for (let key in rules) {
                            if (!!rules[key].mockData) {
                                rules[key].mockData = JSON.parse(rules[key].mockData);
                            }
                            this.$set(this.mockRules, key, rules[key]);
                        }
                    }).catch(err => {

                    });
                }
            },
            saveAsMockConfigClick() {
                this.openConfigNameInput = true;
            },
            deleteMockConfig() {
                if (this.curMockConfigId !== 0) {
                    removeMockConfig(this.curMockConfigId).then(resp => {
                        this.snackbarConfig = {open: true, message: resp.msg, color: resp.color};
                        if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                        this.snackbarConfig.timer = setTimeout(() => {
                            this.snackbarConfig.open = false;
                        }, 1000);

                        this.getMockConfigs();
                    }).catch(err => {

                    });
                }
            },
            setMockConfig() {
                if (this.curMockConfigId === 0) {
                    this.curMockConfigStatus = false;
                    return;
                }
                updateMockConfig(this.curMockConfigId, this.curMockConfigStatus)
                    .then(resp => {
                        this.snackbarConfig = {open: true, message: resp.msg, color: resp.color};
                        if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                        this.snackbarConfig.timer = setTimeout(() => {
                            this.snackbarConfig.open = false;
                        }, 1000);

                        this.getMockConfigs();
                    })
                    .catch(err => {

                    });
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

                saveMockConfig(config, this.mockRules)
                    .then(resp => {
                        this.snackbarConfig = {open: true, message: resp.msg, color: resp.color};
                        if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                        this.snackbarConfig.timer = setTimeout(() => {
                            this.snackbarConfig.open = false;
                        }, 1000);
                        this.getMockConfigs();
                    })
                    .catch(err => {
                    });
            },
            clearAllConfigs() {
                reset().then(resp => {
                    this.snackbarConfig = {open: true, message: resp.msg, color: resp.color};
                    if (this.snackbarConfig.timer) clearTimeout(this.snackbarConfig.timer);
                    this.snackbarConfig.timer = setTimeout(() => {
                        this.snackbarConfig.open = false;
                    }, 1000);
                    this.getMockConfigs();
                }).catch(err => {

                })

            },
            jsonChange(val) {
                this.curRecord = val;
            }
        },
        watch: {
            record(val) {
                this.myRecord = Object.assign({}, val);
                delete this.myRecord['id'];
                delete this.myRecord['requestHeader'];
                delete this.myRecord['mock'];
                delete this.myRecord['requestData'];
                delete this.myRecord['startTime'];
                delete this.myRecord['time'];
                this.curRecord = this.myRecord;
            }
        },
        computed: {},
        components: {}
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

