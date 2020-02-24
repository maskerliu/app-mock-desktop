import { Component, Vue } from "vue-property-decorator"
import { Action, namespace } from 'vuex-class'
import { webFrame } from 'electron'

import MockRuleSnap from "./components/MockRuleSnap.vue"
import MockRuleDetail from "./components/MockRuleDetail.vue"

import { MockRule } from "../model/DataModels"

const Env = namespace('Env')

@Component({
    name: 'MockRuleMgr',
    components: {
        MockRuleSnap,
        MockRuleDetail
    }
})
export default class MockRuleMgr extends Vue {

    @Action('updateNavBarConfig') updateNavBarConfig: any;

    @Env.State('env') env: any;

    filterInput: string = null;
    rules: MockRule[] = [];
    curRule: MockRule = null;

    mounted() {
        this.updateNavBarConfig("mock data manager");

        this.rules = [{
            id: "0x1000001",
            name: "首页",
            desc: "首页改版主流程",
            requests: [
                {
                    id: "00012",
                    method: "Get",
                    url: "/v1/userprofile",
                    time: 410,
                    statusCode: 200,
                    requestHeader: {
                        "array": [1, 2, 3],
                        "boolean": true,
                        "null": null,
                        "number": 123,
                        "object": { "a": "b", "c": "d" },
                        "string": "Hello World",
                        "X-Client": "android",
                    },
                    responseHeader: {
                        "X-Client": "android",
                        "X-Token": "sdflaf-adsfladfn02134-1324lakdf"
                    },
                    responseData: {
                        "code": 8000,
                        "name": "chris",
                        "gender": "female",
                        "uid": "dsfaldno183134",
                        "did": "13q9ru9q8124",
                        "X-Token8": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token9": "sdflaf-adsfladfn02134-1324lakdf",
                        "data": {
                            "X-Token0": "sdflaf-adsfladfn02134-1324lakdf",
                            "X-Token11": "sdflaf-adsfladfn02134-1324lakdf",
                            "thumb": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                            "X-Token1": "sdflaf-adsfladfn02134-1324lakdf",
                            "X-Token2": "sdflaf-adsfladfn02134-1324lakdf",
                            "X-Token3": "sdflaf-adsfladfn02134-1324lakdf",
                            "X-Token31": "sdflaf-adsfladfn02134-1324lakdf",
                        },
                        "test": [
                            1,
                            2,
                            4
                        ],
                        "thumb1": "http://a4.att.hudong.com/68/38/01300534501725138544388872742.jpg",
                        "X-Token33": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token29": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token10": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token12": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb2": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token28": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token19": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token01": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token21": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb3": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token18": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token39": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token30": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token32": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb4": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token48": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token49": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token40": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token41": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb14": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg"
                    }
                },
                {
                    id: "00012",
                    method: "Get",
                    url: "/v1/userprofile",
                    time: 410,
                    statusCode: 200,
                    requestHeader: {
                        "array": [1, 2, 3],
                        "boolean": true,
                        "null": null,
                        "number": 123,
                        "object": { "a": "b", "c": "d" },
                        "string": "Hello World",
                        "X-Client": "android",
                    },
                    responseHeader: {
                        "X-Client": "android",
                        "X-Token": "sdflaf-adsfladfn02134-1324lakdf"
                    },
                    responseData: {
                        "code": 8000,
                        "name": "chris",
                        "gender": "female",
                        "uid": "dsfaldno183134",
                        "did": "13q9ru9q8124",
                        "X-Token8": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token9": "sdflaf-adsfladfn02134-1324lakdf",
                        "data": {
                            "X-Token0": "sdflaf-adsfladfn02134-1324lakdf",
                            "X-Token11": "sdflaf-adsfladfn02134-1324lakdf",
                            "thumb": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                            "X-Token1": "sdflaf-adsfladfn02134-1324lakdf",
                            "X-Token2": "sdflaf-adsfladfn02134-1324lakdf",
                            "X-Token3": "sdflaf-adsfladfn02134-1324lakdf",
                            "X-Token31": "sdflaf-adsfladfn02134-1324lakdf",
                        },
                        "test": [
                            1,
                            2,
                            4
                        ],
                        "thumb1": "http://a4.att.hudong.com/68/38/01300534501725138544388872742.jpg",
                        "X-Token33": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token29": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token10": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token12": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb2": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token28": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token19": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token01": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token21": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb3": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token18": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token39": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token30": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token32": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb4": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token48": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token49": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token40": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token41": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb14": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg"
                    }
                }]
        },
        {
            id: "0x1000002",
            name: "首页",
            desc: "首页改版主流程",
            requests: [{
                id: "00012",
                method: "Get",
                url: "/v1/userprofile",
                time: 410,
                statusCode: 200,
                requestHeader: {
                    "array": [1, 2, 3],
                    "boolean": true,
                    "null": null,
                    "number": 123,
                    "object": { "a": "b", "c": "d" },
                    "string": "Hello World",
                    "X-Client": "android",
                },
                responseHeader: {
                    "X-Client": "android",
                    "X-Token": "sdflaf-adsfladfn02134-1324lakdf"
                },
                responseData: {
                    "code": 8000,
                    "name": "chris",
                    "gender": "female",
                    "uid": "dsfaldno183134",
                    "did": "13q9ru9q8124",
                    "X-Token8": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token9": "sdflaf-adsfladfn02134-1324lakdf",
                    "data": {
                        "X-Token0": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token11": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token1": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token2": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token3": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token31": "sdflaf-adsfladfn02134-1324lakdf",
                    },
                    "test": [
                        1,
                        2,
                        4
                    ],
                    "thumb1": "http://a4.att.hudong.com/68/38/01300534501725138544388872742.jpg",
                    "X-Token33": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token29": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token10": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token12": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb2": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token28": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token19": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token01": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token21": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb3": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token18": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token39": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token30": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token32": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb4": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token48": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token49": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token40": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token41": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb14": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg"
                }
            }, {
                id: "00012",
                method: "Get",
                url: "/v1/userprofile",
                time: 410,
                statusCode: 200,
                requestHeader: {
                    "array": [1, 2, 3],
                    "boolean": true,
                    "null": null,
                    "number": 123,
                    "object": { "a": "b", "c": "d" },
                    "string": "Hello World",
                    "X-Client": "android",
                },
                responseHeader: {
                    "X-Client": "android",
                    "X-Token": "sdflaf-adsfladfn02134-1324lakdf"
                },
                responseData: {
                    "code": 8000,
                    "name": "chris",
                    "gender": "female",
                    "uid": "dsfaldno183134",
                    "did": "13q9ru9q8124",
                    "X-Token8": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token9": "sdflaf-adsfladfn02134-1324lakdf",
                    "data": {
                        "X-Token0": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token11": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token1": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token2": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token3": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token31": "sdflaf-adsfladfn02134-1324lakdf",
                    },
                    "test": [
                        1,
                        2,
                        4
                    ],
                    "thumb1": "http://a4.att.hudong.com/68/38/01300534501725138544388872742.jpg",
                    "X-Token33": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token29": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token10": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token12": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb2": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token28": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token19": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token01": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token21": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb3": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token18": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token39": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token30": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token32": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb4": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token48": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token49": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token40": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token41": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb14": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg"
                }
            }, {
                id: "00012",
                method: "Get",
                url: "/v1/userprofile",
                time: 410,
                statusCode: 200,
                requestHeader: {
                    "array": [1, 2, 3],
                    "boolean": true,
                    "null": null,
                    "number": 123,
                    "object": { "a": "b", "c": "d" },
                    "string": "Hello World",
                    "X-Client": "android",
                },
                responseHeader: {
                    "X-Client": "android",
                    "X-Token": "sdflaf-adsfladfn02134-1324lakdf"
                },
                responseData: {
                    "code": 8000,
                    "name": "chris",
                    "gender": "female",
                    "uid": "dsfaldno183134",
                    "did": "13q9ru9q8124",
                    "X-Token8": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token9": "sdflaf-adsfladfn02134-1324lakdf",
                    "data": {
                        "X-Token0": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token11": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token1": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token2": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token3": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token31": "sdflaf-adsfladfn02134-1324lakdf",
                    },
                    "test": [
                        1,
                        2,
                        4
                    ],
                    "thumb1": "http://a4.att.hudong.com/68/38/01300534501725138544388872742.jpg",
                    "X-Token33": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token29": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token10": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token12": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb2": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token28": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token19": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token01": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token21": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb3": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token18": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token39": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token30": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token32": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb4": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token48": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token49": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token40": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token41": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb14": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg"
                }
            }, {
                id: "00012",
                method: "Get",
                url: "/v1/userprofile",
                time: 410,
                statusCode: 200,
                requestHeader: {
                    "array": [1, 2, 3],
                    "boolean": true,
                    "null": null,
                    "number": 123,
                    "object": { "a": "b", "c": "d" },
                    "string": "Hello World",
                    "X-Client": "android",
                },
                responseHeader: {
                    "X-Client": "android",
                    "X-Token": "sdflaf-adsfladfn02134-1324lakdf"
                },
                responseData: {
                    "code": 8000,
                    "name": "chris",
                    "gender": "female",
                    "uid": "dsfaldno183134",
                    "did": "13q9ru9q8124",
                    "X-Token8": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token9": "sdflaf-adsfladfn02134-1324lakdf",
                    "data": {
                        "X-Token0": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token11": "sdflaf-adsfladfn02134-1324lakdf",
                        "thumb": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                        "X-Token1": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token2": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token3": "sdflaf-adsfladfn02134-1324lakdf",
                        "X-Token31": "sdflaf-adsfladfn02134-1324lakdf",
                    },
                    "test": [
                        1,
                        2,
                        4
                    ],
                    "thumb1": "http://a4.att.hudong.com/68/38/01300534501725138544388872742.jpg",
                    "X-Token33": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token29": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token10": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token12": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb2": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token28": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token19": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token01": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token21": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb3": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token18": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token39": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token30": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token32": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb4": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg",
                    "X-Token48": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token49": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token40": "sdflaf-adsfladfn02134-1324lakdf",
                    "X-Token41": "sdflaf-adsfladfn02134-1324lakdf",
                    "thumb14": "http://a3.att.hudong.com/14/75/01300000164186121366756803686.jpg"
                }
            }]
        }];
    }

    onRuleClicked(rule: MockRule) {
        this.curRule = rule;
    }
}