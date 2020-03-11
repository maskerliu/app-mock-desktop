import { Component, Vue } from "vue-property-decorator"
import { Action, Mutation, namespace } from 'vuex-class'
import { webFrame } from 'electron'

import MockRuleSnap from "./components/MockRuleSnap.vue"
import MockRuleDetail from "./components/MockRuleDetail.vue"

import { MockRule, ProxyRequestRecord } from "../../model/DataModels"
import AbstractPage from "./AbstractPage.vue"

const MockRules = namespace("MockRules");

import { Expose, Type, plainToClass } from "class-transformer"
import { response } from "express"

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

    @MockRules.Action("fetchPagedMockRules")
    private fetchPagedMockRules: Function;

    @MockRules.Action("saveMockRule")
    private saveMockRule: Function;

    @MockRules.Action("deleteMockRule")
    private deleteMockRule: Function;

    showEditMockRuleDialog: boolean = false;
    showDeleteMockRuleDialog: boolean = false;
    filterInput: string = null;
    curRule: MockRule = null;


    created() {
        this.fetchPagedMockRules();
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
        this.deleteMockRule(this.curRule._id);
    }

    onSaveMockRule() {
        if (this.curRule == null) return;
        this.saveMockRule(this.curRule);
        this.showEditMockRuleDialog = false;
    }

    onMockSwitchChanged(rule: MockRule) {
        console.log(rule);
        this.saveMockRule(rule);
    }
}