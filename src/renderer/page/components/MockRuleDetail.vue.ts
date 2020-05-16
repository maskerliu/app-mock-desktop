import { Message } from "element-ui";
import VJsonEditor from "v-jsoneditor";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MockRule, ProxyRequestRecord } from "../../../model/DataModels";
import { getMockRuleDetail, saveMockRule } from "../../../model/LocaAPIs";

@Component({
  name: "MockRuleDetail",
  components: {
    VJsonEditor,
  },
})
export default class MockRuleDetail extends Vue {
  jeOption: {} = {
    mode: "code",
    search: false,
    navigationBar: false,
    statusBar: false,
    mainMenuBar: false,
  };

  @Prop()
  ruleId: string;

  @Prop()
  isMock: boolean;

  public $refs!: {
    jsonEditor: VJsonEditor;
  };

  private rule: MockRule = null;
  private curRecord: ProxyRequestRecord = null;
  private showEditor: boolean = false;
  private showDeleteConfirm: boolean = false;

  created() {}

  mounted() {
    this.fetchMockRuleDetail();
  }

  fetchMockRuleDetail() {
    if (this.ruleId == null || this.ruleId == undefined) {
      return;
    }
    getMockRuleDetail(this.ruleId)
      .then((result) => {
        this.rule = result.data.data;
      })
      .catch((err) => {});
  }

  onEditClicked(request: ProxyRequestRecord) {
    this.showEditor = true;
    this.curRecord = request;
  }

  onSaveClicked() {
    for (let i: number = 0; i < this.rule.requests.length; ++i) {
      if (this.rule.requests[i].url === this.$refs.jsonEditor.value.url) {
        this.rule.requests.splice(i, 1, this.$refs.jsonEditor.value);
        break;
      }
    }
    saveMockRule(this.rule, false)
      .then((result) => {
        Message({ message: "更新成功", type: "success" });
        this.showEditor = false;
      })
      .catch((err) => {
        Message({ message: "更新失败", type: "warning" });
      });
  }

  onDeleteClicked(request: ProxyRequestRecord) {
    this.curRecord = request;
    this.showDeleteConfirm = true;
  }

  onDeleteConfirm() {
    let idx: number = -1;
    for (let i: number = 0; i < this.rule.requests.length; ++i) {
      if (this.rule.requests[i].url === this.curRecord.url) {
        idx = i;
        break;
      }
    }
    if (idx != -1) {
      this.rule.requests.splice(idx, 1);
      saveMockRule(this.rule, false)
        .then((result) => {
          this.showDeleteConfirm = false;
          Message({ message: "删除成功", type: "success" });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  @Watch("ruleId")
  onRuleIdChanged() {
    this.fetchMockRuleDetail();
  }

  @Watch("isMock")
  onIsMockChanged() {
    this.fetchMockRuleDetail();
  }
}
