import { Message } from "element-ui";
import VJsonEditor from "v-jsoneditor";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { MockRule, ProxyRequestRecord } from "../../../model/DataModels";
import {
  getMockRuleDetail,
  saveMockRule,
  searchMockRules,
} from "../../../model/LocaAPIs";

@Component({
  name: "Settings",
  components: {
    VJsonEditor,
  },
})
export default class AddMockRule extends Vue {
  @Prop()
  record: ProxyRequestRecord;

  private keyword: string = null;
  private searchLoading: boolean = false;
  private searchResults: Array<MockRule> = null;
  private curRule: MockRule = null;
  private wrapperRecord: ProxyRequestRecord = null;
  private isSaving: boolean = false;

  $refs!: {
    recordJsonEditor: VJsonEditor;
  };

  jeOption: {} = {
    mode: "code",
    search: false,
    navigationBar: false,
    statusBar: false,
    mainMenuBar: false,
  };

  created() {
    this.wrapperRecord = Object.assign({}, this.record);
    this.curRule = new MockRule();
  }

  querySearchAsync(keyword: string) {
    searchMockRules(keyword)
      .then((result) => {
        this.searchResults = result.data.data;
      })
      .catch((err) => {});
  }

  onRuleSelected(item: MockRule) {
    this.keyword = item.name;
    this.curRule = item;

    getMockRuleDetail(this.curRule._id)
      .then((result) => {
        this.curRule = result.data.data;
      })
      .catch((err) => {});
  }

  addRule() {
    let isContains = false;

    if (this.curRule == null) return;

    if (this.curRule.requests == null) {
      Vue.set(this.curRule, "requests", []);
    }
    for (let i = 0; i < this.curRule.requests.length; ++i) {
      let request = this.curRule.requests[i];
      if (request.url === this.record.url) {
        Vue.set(this.curRule.requests, i, Object.assign({}, this.wrapperRecord));
        delete this.curRule.requests[i].id;
        isContains = true;
        break;
      }
    }

    if (!isContains) this.curRule.requests.push(this.record);
  }

  onDeleteClicked(record: ProxyRequestRecord) {
    let index = this.curRule.requests.indexOf(record);
    if (index > -1) this.curRule.requests.splice(index, 1);
  }

  onSave() {
    this.isSaving = true;
    if (this.curRule === null || this.curRule._id === null) {
      this.isSaving = false;
    } else {
      saveMockRule(this.curRule, false)
        .then((result) => {
          Message({ message: "保存成功", type: "success" });
          this.isSaving = false;
        })
        .catch((err) => {
          Message({ message: "保存失败", type: "warning" });
          this.isSaving = false;
        });
    }
  }

  @Watch("record")
  onRecordChanged() {
    this.wrapperRecord = Object.assign({}, this.record);
  }
}
