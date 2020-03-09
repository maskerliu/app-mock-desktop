import { Component, Vue } from "vue-property-decorator"
import { Action, Mutation, namespace } from 'vuex-class'
import { webFrame } from 'electron'

import MockRuleSnap from "./components/MockRuleSnap.vue"
import MockRuleDetail from "./components/MockRuleDetail.vue"

import { MockRule, ProxyRequestRecord } from "../../model/DataModels"
import AbstractPage from "./AbstractPage.vue"

const MockRules = namespace("MockRules");

import { Expose, Type, plainToClass } from "class-transformer"

@Component({
    name: 'MockRuleMgr',
    components: {
        MockRuleSnap,
        MockRuleDetail
    }
})
export default class MockRuleMgr extends AbstractPage {

    @MockRules.Getter("mockRules")
    private rules: Array<MockRule>;

    @MockRules.Action("addRule")
    private addRule: Function;

    filterInput: string = null;
    curRule: MockRule = null;


    created() {
        let ruleJson = {
            id: "0x1000001",
            name: "首页-feed流",
            desc: "首页feed流-弱网",
            requests: [
                {
                    "type": 5001,
                    "id": 112,
                    "method": "POST",
                    "url": "/search/v1/search/uploadUserLocation",
                    "statusCode": 200,
                    "time": 80,
                    "headers": {
                        "x-udid": "202001021335289c33fb5f84512904e86a12a399d1c147016c0d1d92b484bc",
                        "x-client-time": "1583486698351",
                        "x-sign": "4a57b234994d18668ad3ded23028220b",
                        "x-accesstoken": "ar0ib5S_-4fOufYzhBr9bhHE6IHMk0fXWWKDSV5ifWsenX6l0i655EIny-mUOQ0GzknVwy4uJQ5_GVYnWN9-_gvGlX3PVhjWcJnUrRq3PS9Av5Nxq90VgXUttqqWcxhcR757qFiFOqTOjTuqhpwQbwu1k3WQMSZ30iM7YdvhA8M",
                        "x-network": "wifi",
                        "x-user-agent": "mapi/1.0 (Android 28;com.yupaopao.yuer 3.1.1;Xiaomi MIX+2;wywk)",
                        "framework_trace_id": "92ceb210bc3946c6bd8c12c1340750c2",
                        "x-authentication": "2f48fcd5032bc244b5810e35ef406b9d",
                        "authorization": "Bearer ar0ib5S_-4fOufYzhBr9bhHE6IHMk0fXWWKDSV5ifWsenX6l0i655EIny-mUOQ0GzknVwy4uJQ5_GVYnWN9-_gvGlX3PVhjWcJnUrRq3PS9Av5Nxq90VgXUttqqWcxhcR757qFiFOqTOjTuqhpwQbwu1k3WQMSZ30iM7YdvhA8M",
                        "host": "https://api.bxyuer.com:443",
                        "content-type": "application/json; charset=utf-8",
                        "content-length": "105",
                        "connection": "Keep-Alive",
                        "accept-encoding": "gzip",
                        "user-agent": "okhttp/3.12.1"
                    },
                    "requestData": {
                        "lon": "121.399337",
                        "currentCity": "上海",
                        "userId": "36a599af73498c533bdbefccf7f411b7",
                        "lat": "31.165354"
                    },
                    "responseHeaders": {
                        "content-length": "60",
                        "content-type": "application/json;charset=UTF-8",
                        "date": "Fri, 06 Mar 2020 09:24:58 GMT"
                    },
                    "responseData": {
                        "code": "8000",
                        "msg": "SUCCESS",
                        "result": true,
                        "success": true
                    }
                },
                {
                    "type": 5001,
                    "id": 118,
                    "method": "GET",
                    "url": "/config/v2/badge/list",
                    "statusCode": 200,
                    "time": 110,
                    "headers": {
                        "x-udid": "202001021335289c33fb5f84512904e86a12a399d1c147016c0d1d92b484bc",
                        "x-client-time": "1583486947326",
                        "x-sign": "4388d5ddf986108aa055f5dbb9175782",
                        "x-accesstoken": "ar0ib5S_-4fOufYzhBr9bhHE6IHMk0fXWWKDSV5ifWsenX6l0i655EIny-mUOQ0GzknVwy4uJQ5_GVYnWN9-_gvGlX3PVhjWcJnUrRq3PS9Av5Nxq90VgXUttqqWcxhcR757qFiFOqTOjTuqhpwQbwu1k3WQMSZ30iM7YdvhA8M",
                        "x-network": "wifi",
                        "x-user-agent": "mapi/1.0 (Android 28;com.yupaopao.yuer 3.1.1;Xiaomi MIX+2;wywk)",
                        "framework_trace_id": "4064f0c9a5a24bd6a357323756f3b492",
                        "x-authentication": "6115ff39750be5db9fc13295859de5d7",
                        "authorization": "Bearer ar0ib5S_-4fOufYzhBr9bhHE6IHMk0fXWWKDSV5ifWsenX6l0i655EIny-mUOQ0GzknVwy4uJQ5_GVYnWN9-_gvGlX3PVhjWcJnUrRq3PS9Av5Nxq90VgXUttqqWcxhcR757qFiFOqTOjTuqhpwQbwu1k3WQMSZ30iM7YdvhA8M",
                        "host": "https://api.hibixin.com:443",
                        "connection": "Keep-Alive",
                        "accept-encoding": "gzip",
                        "user-agent": "okhttp/3.12.1"
                    },
                    "requestData": {},
                    "responseHeaders": {
                        "content-length": "725",
                        "content-type": "application/json;charset=UTF-8",
                        "date": "Fri, 06 Mar 2020 09:29:07 GMT"
                    },
                    "responseData": {
                        "code": "8000",
                        "msg": "SUCCESS",
                        "success": true,
                        "result": [
                            {
                                "tagId": "friends",
                                "version": "1580890539000",
                                "type": 4,
                                "depends": [],
                                "showText": null,
                                "showCount": 0,
                                "countMax": 99,
                                "countSuf": "+",
                                "icon": ""
                            },
                            {
                                "tagId": "fans",
                                "version": "1578939911000",
                                "type": 4,
                                "depends": [],
                                "showText": null,
                                "showCount": 0,
                                "countMax": 99,
                                "countSuf": "+",
                                "icon": ""
                            },
                            {
                                "tagId": "mycomments",
                                "version": "0",
                                "type": 2,
                                "depends": [],
                                "showText": null,
                                "showCount": 0,
                                "countMax": 99,
                                "countSuf": "+",
                                "icon": ""
                            },
                            {
                                "tagId": "mylike",
                                "version": "0",
                                "type": 2,
                                "depends": [],
                                "showText": null,
                                "showCount": 0,
                                "countMax": 99,
                                "countSuf": "+",
                                "icon": ""
                            },
                            {
                                "tagId": "index.me",
                                "version": "1580890539000",
                                "type": 4,
                                "depends": [],
                                "showText": "",
                                "showCount": 0,
                                "countMax": 0,
                                "countSuf": "",
                                "icon": ""
                            }
                        ],
                        "tid": null
                    }
                },
                {
                    "type": 5001,
                    "id": 122,
                    "method": "GET",
                    "url": "/content/home/position?tabId=2",
                    "statusCode": 200,
                    "time": 78,
                    "headers": {
                        "x-udid": "202001021335289c33fb5f84512904e86a12a399d1c147016c0d1d92b484bc",
                        "x-client-time": "1583486948476",
                        "x-sign": "4388d5ddf986108aa055f5dbb9175782",
                        "x-accesstoken": "ar0ib5S_-4fOufYzhBr9bhHE6IHMk0fXWWKDSV5ifWsenX6l0i655EIny-mUOQ0GzknVwy4uJQ5_GVYnWN9-_gvGlX3PVhjWcJnUrRq3PS9Av5Nxq90VgXUttqqWcxhcR757qFiFOqTOjTuqhpwQbwu1k3WQMSZ30iM7YdvhA8M",
                        "x-network": "wifi",
                        "x-user-agent": "mapi/1.0 (Android 28;com.yupaopao.yuer 3.1.1;Xiaomi MIX+2;wywk)",
                        "framework_trace_id": "7aa9dce85e1343a2b65a2763c52330d8",
                        "x-authentication": "0102037f531bcc2731dd5cd5e5ba190c",
                        "authorization": "Bearer ar0ib5S_-4fOufYzhBr9bhHE6IHMk0fXWWKDSV5ifWsenX6l0i655EIny-mUOQ0GzknVwy4uJQ5_GVYnWN9-_gvGlX3PVhjWcJnUrRq3PS9Av5Nxq90VgXUttqqWcxhcR757qFiFOqTOjTuqhpwQbwu1k3WQMSZ30iM7YdvhA8M",
                        "host": "https://api.bxyuer.com:443",
                        "connection": "Keep-Alive",
                        "accept-encoding": "gzip",
                        "user-agent": "okhttp/3.12.1"
                    },
                    "requestData": {
                        "tabId": "2"
                    },
                    "responseHeaders": {
                        "content-length": "80",
                        "content-type": "application/json;charset=UTF-8",
                        "date": "Fri, 06 Mar 2020 09:29:08 GMT"
                    },
                    "responseData": {
                        "code": "8000",
                        "msg": "SUCCESS",
                        "success": true,
                        "result": [],
                        "tid": null,
                        "ext": null
                    }
                }
            ]
        };


        let rule: MockRule = plainToClass(MockRule, ruleJson);
        this.addRule(rule);

        ruleJson = {
            id: "0x1000002",
            name: "首页",
            desc: "首页改版主流程",
            requests: []
        };
        rule = plainToClass(MockRule, ruleJson, { excludeExtraneousValues: true });
        this.addRule(rule);
    }

    mounted() {
        this.updateNavBarConfig({
            title: "Mock规则管理",
            leftItem: false,
            rightItem: false,
        });
    }

    onRuleClicked(rule: MockRule) {
        this.curRule = rule;
    }
}