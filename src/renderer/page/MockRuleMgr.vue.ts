import { Component, Vue, Watch } from "vue-property-decorator"
import { Action, Mutation, namespace, State } from "vuex-class"
import { webFrame } from "electron"
import { throttle } from 'lodash'
import { Message } from "element-ui"
import VirtualList from "vue-virtual-scroll-list"

import AbstractPage from "./AbstractPage.vue"
import MockRuleSnap from "./components/MockRuleSnap.vue"
import MockRuleDetail from "./components/MockRuleDetail.vue"

import { MockRule, ProxyRequestRecord, BizCode } from "../../model/DataModels"
import { saveMockRule, deleteMockRule, searchMockRules, uploadMockRule } from "../../model/LocaAPIs"

const MockRules = namespace("MockRules");

@Component({
    name: "MockRuleMgr",
    components: {
        VirtualList,
        MockRuleSnap,
        MockRuleDetail,
    }
})
export default class MockRuleMgr extends AbstractPage {
    private mockRuleSnap: any = MockRuleSnap;
    private rules: Array<MockRule> = [];
    private searchKeyword: string = null;

    @MockRules.Mutation("setShowEditMockRuleDialog")
    private setShowEditMockRuleDialog!: Function;

    @MockRules.Mutation("setShowDeleteMockRuleDialog")
    private setShowDeleteMockRuleDialog!: Function;

    @MockRules.Mutation("setCurRule")
    private setCurRule!: Function;

    @State(state => state.MockRules.showEditMockRuleDialog)
    private showEditMockRuleDialog: boolean;

    @State(state => state.MockRules.showDeleteMockRuleDialog)
    private showDeleteMockRuleDialog: boolean;

    @State(state => state.MockRules.curRule)
    private curRule: MockRule;

    

    

    created() {

    }

    mounted() {
        this.updateNavBarConfig({
            title: "Mock规则管理",
            leftItem: false,
            rightItem: false,
        });
        this.fetchPagedMockRules();
    }

    fetchPagedMockRules() {
        searchMockRules(this.searchKeyword).then((result: any) => {
            this.rules = result.data.data;
        }).catch(err => {
            // Message({ message: err.message, type: 'error' });
        });
    }

    onRuleClicked(rule: MockRule) {
        this.setCurRule(rule);
    }

    onDeleteMockRuleConfirmed() {
        this.showDeleteMockRuleDialog = false;
        deleteMockRule(this.curRule._id).then((result: any) => {
            this.fetchPagedMockRules();
        }).catch((err: any) => {
            console.log(err);
        });
    }

    onSaveMockRule() {
        if (this.curRule == null) return;
        saveMockRule(this.curRule, true)
            .then((result => {
                Message({ message: "规则更新成功", type: "success" });
                this.fetchPagedMockRules();
            }))
            .catch(err => {
                Message({ message: err.message, type: "error" });
            });
        this.showEditMockRuleDialog = false;
    }

    @Watch('searchKeyword', { immediate: false, deep: true })
    throttlesearchKeywordChange = throttle(function (val: string) {
        this.fetchPagedMockRules();
    }, 1000);
}