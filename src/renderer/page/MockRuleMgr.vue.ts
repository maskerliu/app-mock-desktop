import { Message } from "element-ui";
import { throttle } from "lodash";
import { Component, Watch } from "vue-property-decorator";
import VirtualList from "vue-virtual-scroll-list";
import { namespace } from "vuex-class";
import { MockRule } from "../../model/DataModels";
import {
  deleteMockRule,
  saveMockRule,
  searchMockRules,
} from "../../model/LocaAPIs";
import { eventBus } from "../common/EventBus";
import AbstractPage from "./AbstractPage.vue";
import MockRuleDetail from "./components/MockRuleDetail.vue";
import MockRuleSnap from "./components/MockRuleSnap.vue";

const MockRules = namespace("MockRules");

@Component({
  name: "MockRuleMgr",
  components: {
    VirtualList,
    MockRuleSnap,
    MockRuleDetail,
  },
})
export default class MockRuleMgr extends AbstractPage {
  private mockRuleSnap: any = MockRuleSnap;
  private rules: Array<MockRule> = [];
  private searchKeyword: string = null;
  private wrapperRule: MockRule = null;

  @MockRules.Mutation("setShowEditMockRuleDialog")
  private setShowEditMockRuleDialog!: Function;

  @MockRules.Mutation("setShowDeleteMockRuleDialog")
  private setShowDeleteMockRuleDialog!: Function;

  @MockRules.State("showEditMockRuleDialog")
  private showEditMockRuleDialog: boolean;

  @MockRules.State("showDeleteMockRuleDialog")
  private showDeleteMockRuleDialog: boolean;

  @MockRules.State("curRule")
  private curRule: MockRule;

  created() { }

  mounted() {
    this.updateNavBarConfig({
      title: "Mock规则管理",
      leftItem: false,
      rightItem: false,
    });
    this.fetchPagedMockRules();

    eventBus.$on("updateMockRules", this.fetchPagedMockRules);
  }

  destroyed() {
    eventBus.$off("updateMockRules", this.fetchPagedMockRules);
  }

  fetchPagedMockRules() {
    searchMockRules(this.searchKeyword)
      .then((result: any) => {
        this.rules = result.data.data;
      })
      .catch((err) => {
        Message({ message: err.message, type: "error" });
      });
  }

  onAddMockRule() {
    this.wrapperRule = new MockRule();
    this.setShowEditMockRuleDialog(true);
  }

  onDeleteMockRuleConfirmed() {
    this.setShowDeleteMockRuleDialog(false);
    deleteMockRule(this.curRule._id)
      .then((result: any) => {
        this.fetchPagedMockRules();
      })
      .catch((err: any) => {
        Message({ message: err.message, type: "error" });
      });
  }

  onSaveMockRule() {
    if (this.wrapperRule == null) return;
    saveMockRule(this.wrapperRule, true)
      .then((result: any) => {
        Message({ message: "规则更新成功", type: "success" });
        this.fetchPagedMockRules();
      })
      .catch((err) => {
        Message({ message: err.message, type: "error" });
      });
    this.setShowEditMockRuleDialog(false);
  }

  @Watch("curRule")
  onCurRuleChanged() {
    this.wrapperRule = this.curRule;
  }

  @Watch("searchKeyword", { immediate: false, deep: true })
  throttlesearchKeywordChange = throttle(function (val: string) {
    this.fetchPagedMockRules();
  }, 1000);
}
