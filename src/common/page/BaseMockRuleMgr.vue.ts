import Message from "element-ui/packages/message"
import { Component, Watch, Vue } from "vue-property-decorator"
import VirtualList from "vue-virtual-scroll-list"
import { namespace } from "vuex-class"
import { MockRule } from "../../model/DataModels"
import {
  deleteMockRule,
  saveMockRule,
  searchMockRules
} from "../../model/LocaAPIs"
import { eventBus } from "../EventBus"
import MockRuleDetail from "../components/MockRuleDetail.vue"
import MockRuleSnap from "../components/MockRuleSnap.vue"
import { throttle } from "../Utils"

const MockRules = namespace("MockRules");

@Component({
  name: "BaseMockRuleMgr",
  components: {
    VirtualList,
    MockRuleSnap,
    MockRuleDetail,
  },
})
export default class BaseMockRuleMgr extends Vue {
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

  @MockRules.Mutation("setCurRule")
  private setCurRule!: Function;

  @MockRules.State("curRule")
  private curRule: MockRule;

  created() { this.setCurRule(null); }

  mounted() {
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


  @Watch("searchKeyword", { immediate: false, deep: false })
  throttlesearchKeywordChange = throttle((val: string) => {
    this.fetchPagedMockRules();
  }, 1000);
}
