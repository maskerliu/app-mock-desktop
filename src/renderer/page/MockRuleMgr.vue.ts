import { Component, Vue, Watch } from "vue-property-decorator"
import { Action, Mutation, namespace } from "vuex-class"
import { webFrame } from "electron"
import { throttle } from 'lodash'
import { Message } from "element-ui"

import AbstractPage from "./AbstractPage.vue"
import MockRuleSnap from "./components/MockRuleSnap.vue"
import MockRuleDetail from "./components/MockRuleDetail.vue"

import { MockRule, ProxyRequestRecord, BizCode } from "../../model/DataModels"
import { saveMockRule, deleteMockRule, searchMockRules } from "../../model/LocaAPIs"

@Component({
    name: "MockRuleMgr",
    components: {
        MockRuleSnap,
        MockRuleDetail
    }
})
export default class MockRuleMgr extends AbstractPage {

    private rules: Array<MockRule> = [];
    private showEditMockRuleDialog: boolean = false;
    private showDeleteMockRuleDialog: boolean = false;
    private searchKeyword: string = null;
    private curRule: MockRule = null;
    private curPageKey: string = null;

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
        searchMockRules(this.searchKeyword).then((result) => {
            this.rules = result.data.data;
        }).catch(err => {
            // Message({ message: err.message, type: 'error' });
        });
    }

    onRuleClicked(rule: MockRule) {
        this.curRule = rule;
    }

    onEditMockRule(rule: MockRule) {
        if (rule == null) {
            this.curRule = new MockRule();
        } else {
            this.curRule = rule;
        }

        this.showEditMockRuleDialog = true;
    }

    onDeleteMockRule(rule: MockRule) {
        if (rule == null) return;
        this.curRule = rule;
        this.showDeleteMockRuleDialog = true;
    }

    onDeleteMockRuleConfirmed() {
        this.showDeleteMockRuleDialog = false;
        deleteMockRule(this.curRule._id).then(result => {
            this.fetchPagedMockRules();
        }).catch(err => {
            console.log(err);
        });
    }

    onUploadMockRule() {
        
    }

    onSaveMockRule() {
        if (this.curRule == null) return;
        saveMockRule(this.curRule, true)
            .then((result => {
                Message({ message: "规则更新成功", type: "success" });
                this.fetchPagedMockRules();
            }))
            .catch(err => {
                Message({ message: err.message, type: 'error' });
            });
        this.showEditMockRuleDialog = false;
    }

    onMockSwitchChanged(rule: MockRule) {
        saveMockRule(rule, true).then(result => {
            Message({ message: "规则更新成功", type: "success" });
            this.fetchPagedMockRules();
        }).catch(err => {
            Message({ message: err.message, type: 'error' });
        });
    }

    @Watch('searchKeyword', { immediate: false, deep: true })
    throttlesearchKeywordChange = throttle(function (val: string) {
        this.fetchPagedMockRules();
    }, 1000);
}