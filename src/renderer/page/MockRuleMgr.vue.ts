import { Component } from "vue-property-decorator"
import VirtualList from "vue-virtual-scroll-list"
import { Mutation } from "vuex-class"
import MockRuleDetail from "../../common/components/MockRuleDetail.vue"
import MockRuleSnap from "../../common/components/MockRuleSnap.vue"
import { eventBus } from "../../common/EventBus"
import BaseMockRuleMgr from "../../common/page/BaseMockRuleMgr.vue"

@Component({
  name: "MockRuleMgr",
  components: {
    VirtualList,
    MockRuleSnap,
    MockRuleDetail,
  },
})
export default class MockRuleMgr extends BaseMockRuleMgr {

  @Mutation("updateNavBarConfig")
  protected updateNavBarConfig: Function;

  mounted() {
    this.updateNavBarConfig({
      title: "Mock规则管理",
      leftItem: false,
      rightItem: false,
    });
    this.fetchPagedMockRules();
    eventBus.$on("updateMockRules", this.fetchPagedMockRules);
  }
}
