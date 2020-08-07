import Message from "element-ui/packages/message";
import { Component, Prop, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { MockRule } from "../../model/DataModels";
import { saveMockRule, uploadMockRule } from "../../model/LocaAPIs";
import { eventBus } from "../EventBus";

const MockRules = namespace("MockRules");

@Component({
  name: "MockRuleSnap",
  components: {},
})
export default class MockRuleSnap extends Vue {
  @Prop()
  source: MockRule;

  @MockRules.State("curRule")
  private curRule: MockRule;

  @MockRules.Mutation("setCurRule")
  private setCurRule!: Function;

  @MockRules.Mutation("setShowEditMockRuleDialog")
  private setShowEditMockRuleDialog!: Function;

  @MockRules.Mutation("setShowDeleteMockRuleDialog")
  private setShowDeleteMockRuleDialog!: Function;

  created() {}

  onClick() {
    this.setCurRule(this.source);
  }

  onEdit() {
    this.setCurRule(this.source);
    this.setShowEditMockRuleDialog(true);
  }

  onDelete() {
    this.setCurRule(this.source);
    this.setShowDeleteMockRuleDialog(true);
  }

  onUpload() {
    uploadMockRule(this.source)
      .then((result: any) => {
        console.log("upload mock rule");
      })
      .catch((err: any) => {
        console.log(err);
      });
  }

  onMockSwitchChanged() {
    saveMockRule(this.source, true)
      .then((result) => {
        Message({ message: "规则更新成功", type: "success" });
        // this.fetchPagedMockRules();
        eventBus.$emit("updateMockRules");
      })
      .catch((err) => {
        Message({ message: err.message, type: "error" });
      });
  }
}
