<template>
    <div v-if="!!record" style="height: 100%; overflow-y: auto;">
        <div class="inspector-row">
            <mu-text-field v-model="record.url" label="Url" full-width disabled></mu-text-field>
        </div>
        <div class="inspector-row" v-if="!!record.requestHeader">
            <h3>请求头</h3>
            <tree-view :data="record.requestHeader" :options="{maxDepth: 3}"></tree-view>
        </div>
        <div class="inspector-row" v-if="!!record.requestData">
            <h3>请求参数</h3>
            <tree-view :data="record.requestData"></tree-view>
        </div>
        <div class="inspector-row" v-if="!!record.responseHeader">
            <h3>响应头</h3>
            <tree-view :data="record.responseHeader"></tree-view>
        </div>

        <div class="inspector-row" v-if="!!record.responseData">
            <h3>响应数据</h3>
            <mu-tabs inverse :value.sync="tabActive">
                <mu-tab>JSON</mu-tab>
                <mu-tab>Plain TXT</mu-tab>
            </mu-tabs>
            <div class="preview">
                <tree-view :data="record.responseData" v-if="tabActive === 0"></tree-view>
                <pre v-if="tabActive === 1">{{record.responseData}}</pre>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Inspector",
        props: {
            record: {
                type: Object,
                default() {
                    return {}
                }
            }
        },
        data() {
            return {
                tabActive: 0,
            }
        },
        methods: {},
        components: {}
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
    }
</style>
