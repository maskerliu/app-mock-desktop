import { Component, Vue } from "vue-property-decorator"
import { Action, Mutation, namespace } from "vuex-class"
import { webFrame } from "electron"

import AbstractPage from "./AbstractPage.vue"
import MockRuleSnap from "./components/MockRuleSnap.vue"
import MockRuleDetail from "./components/MockRuleDetail.vue"

import { MockRule, ProxyRequestRecord } from "../../model/DataModels"
import { saveMockRule, deleteMockRule, getPagedMockRules } from "../../model/LocaAPIs"

@Component({
    name: "MockRuleMgr",
    components: {
        MockRuleSnap,
        MockRuleDetail
    }
})
export default class MockRuleMgr extends AbstractPage {

    private rules: Array<MockRule>=[];
    private showEditMockRuleDialog: boolean = false;
    private showDeleteMockRuleDialog: boolean = false;
    private filterInput: string = null;
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

    fetchPagedMockRules(){
        getPagedMockRules(this.curPageKey).then((result) => {
            this.rules = result.data.data.data;
        }).catch(err => {
            console.log(err);
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
            console.log(result);
            this.fetchPagedMockRules();
        }).catch(err => {
            console.log(err);
        });
    }

    onSaveMockRule() {
        if (this.curRule == null) return;
        saveMockRule(this.curRule)
            .then((result => {
                this.fetchPagedMockRules();
            }))
            .catch(err => {

            });
        this.showEditMockRuleDialog = false;
    }

    onMockSwitchChanged(rule: MockRule) {
        saveMockRule(this.curRule).then(result => {
            this.fetchPagedMockRules();
        }).catch(err => {
            console.log(err);
        });
    }
}