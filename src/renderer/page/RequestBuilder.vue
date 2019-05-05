<template>

    <div fill style="width: 100%; padding: 10px; height: 100%; overflow-y: auto;">
        <mu-flex fill style="width: 100%;" direction="row">
            <mu-select label="业务" style="width: 40%; margin-right: 10px;" v-model="validateForm.biz">
                <mu-option v-for="biz in bizs" :key="biz.id" :label="biz.name"
                           :value="biz.id"></mu-option>
            </mu-select>
            <mu-auto-complete label="接口名" :data="apisForSelect" v-model="apiPath" full-width avatar
                              action-icon="search" :action-click="showApiDefine">
                <template slot-scope="scope">
                    <mu-list-item-action>
                        <mu-avatar color="primary">
                            {{scope.item.substring(0, 1)}}
                        </mu-avatar>
                    </mu-list-item-action>
                    <mu-list-item-content v-html="scope.highlight"></mu-list-item-content>
                </template>
            </mu-auto-complete>
        </mu-flex>
        <div class="model-def" id="je-api-def"></div>
        <div class="model-def" id="je-model-def"></div>
        <!--<v-jsoneditor class="model-def" v-model="apiDef" :options="jsonEditorOptions0"></v-jsoneditor>-->
        <!--<v-jsoneditor class="model-def" style="height: 55%;" v-model="mockData"-->
                      <!--:options="jsonEditorOptions1"></v-jsoneditor>-->
    </div>
</template>

<script>

    import JsonEditor from "jsoneditor"
    import ModelFactory from '@/common/ModelFactory'

    export default {
        name: "RequestBuilder",
        mounted() {
            this.getDataModels();
            this.initJsonEditor();
        },
        data() {
            return {
                pathRules: [
                    {validate: (val) => !!val, message: '必须填写请求名'},
                    {validate: (val) => val.length >= 3, message: '用户名长度大于3'}
                ],
                validateForm: {
                    path: null,
                    biz: null
                },
                jsonEditorOptions0: {
                    mode: 'view',
                    modes: null,
                    search: false,
                    navigationBar: false,
                    statusBar: false
                },
                jsonEditorOptions1: {
                    mode: 'view',
                    modes: ['view', 'text'],
                    search: false,
                    navigationBar: false,
                    statusBar: false
                },
                models: {},
                modelFactory: null,
                bizs: [],
                apisForSelect: [],
                apisDefine: null,
                apiPath: null,
                apiDef: null,
                mockData: null,
                jeApiDef: null,
                jeModelDef: null
            }
        },
        methods: {
            initJsonEditor() {
                let options = {
                    mode: 'tree',
                    modes: [],
                    search: false,
                    navigationBar: false
                };
                this.jeApiDef = new JsonEditor(document.getElementById('je-api-def'), options);
                this.jeModelDef = new JsonEditor(document.getElementById('je-model-def'), options);
            },
            getDataModels() {
                this.$http.get('http://localhost:9080/static/biz.json')
                    .then(resp => {
                        this.bizs = resp;
                    })
                    .catch(err => {

                    });

                this.$http.get('http://localhost:9080/static/apis.json')
                    .then(resp => {
                        this.apisDefine = resp;
                        for (let path in resp) {
                            this.apisForSelect.push(path);
                        }
                    })
                    .catch(err => {

                    });

                this.$http.get('http://localhost:9080/static/models.json')
                    .then(resp => {
                        this.modelFactory = new ModelFactory(resp);
                    })
                    .catch(err => {
                    });
            },
            showApiDefine() {
                this.jeApiDef.set(this.apisDefine[this.apiPath]);
                this.jeModelDef.set(this.modelFactory.generateDataByApi(this.apisDefine[this.apiPath]));
            }
        }
    }
</script>

<style scoped>

    .model-def {
        width: 100%;
        margin-top: 15px;
        overflow-y: auto;
    }

</style>
