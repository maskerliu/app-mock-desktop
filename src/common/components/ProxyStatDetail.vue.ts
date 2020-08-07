import Message from "element-ui/packages/message";
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { State } from "vuex-class";
import { get } from "../../model/BasicLocalAPI";
import { ProxyStatRecord } from "../../model/DataModels";


@Component({
  name: "ProxyStatDetail",
  components: {},
})
export default class ProxyStatDetail extends Vue {

  @Prop()
  private record: ProxyStatRecord;

  @State((state) => state.Common.statRuleServer)
  private statRuleServer: string;

  private statRule: { desc: string, rule: string[], ruleDesc: string } = null;
  private curStat: any;

  private rows: any[] = [];

  public $refs!: {
    statsTable: any;
  };


  created() {

  }

  mounted() {
    this.rows = [];
    if (this.record.statistics.bps.length == 1) {
      this.onClicked(this.record.statistics.bps[0], 0);
    }
  }

  destroyed() {

  }

  tableRowClassName({ row, rowIndex }) {
    return this.rows[rowIndex] == null ? "normal-row" : this.rows[rowIndex].rowClassName;
  }

  onClicked(row: any, index: number) {
    Vue.set(this.rows, index, {});
    Vue.set(this.rows[index], "rowClassName", "normal-row");
    this.curStat = row;
    let pageId = row["pageId"] == "" ? row["page"] : row["pageId"];
    let elementId = row["elementId"] == "" ? row["arg1"] : row["elementId"];
    elementId = row.event_id == 2001 ? "" : elementId;
    let keyword = row.event_id == 2001 ? pageId : elementId;

    if (elementId == "" && pageId == "") {
      Vue.set(this.rows[index], "rowClassName", "warning-row");
      Message.warning("未找到相关等级埋点");
    } else if (this.statRuleServer == null) {
      Message.warning("请在设置中指定埋点管理服务地址");
    } else {
      get("/api/stat/queryStats", this.statRuleServer, {
        eventId: row["event_id"],
        keyword: keyword
      }).then(resp => {
        if (resp.data.code != 8000) {
          Message.error(resp.data.message);
          return;
        }

        this.$refs.statsTable.toggleRowExpansion(row, true);

        if (resp.data.data.data == null || resp.data.data.data.length != 1) {
          Vue.set(this.rows[index], "rowClassName", "warning-row");
          Message.warning("未找到相关等级埋点");
          return;
        }


        let stat = resp.data.data.data[0];
        let rules: string[] = stat.rule.split(/[,;，；]/);

        Vue.set(this.rows[index], "statRule", {
          desc: stat.name + stat.desc,
          rule: stat.rule.split(/[,;，；]/),
          ruleDesc: stat.ruleDesc
        });
        if (stat.rule == null || stat.rule == "" || rules.length == 1) {
          Vue.set(this.rows[index], "rowClassName", "success-row");
        } else {
          Vue.set(this.rows[index], "rowClassName", this.argsVailidate(rules) ? "success-row" : "error-row");
        }
      }).catch(err => {
        Message.warning(err);
      });
    }
  }

  argsVailidate(rule: string[]): boolean {

    if (this.curStat.args.length == 0) return true;

    let tmp: string[] = this.curStat.args.split(",");

    let args: Map<string, string> = new Map<string, string>();
    for (let pair of tmp) {
      let keyvalue = pair.split("=");
      args.set(keyvalue[0], keyvalue[1]);
    }

    let validate = true;
    for (let ruleKey of rule) {
      if (!args.has(ruleKey.trim()) || args.get(ruleKey.trim()) == null) {
        validate = false;
      }
    }
    return validate;
  }

  @Watch("record")
  onRecordChanged() {
    if (this.record.statistics.bps.length == 1) {
      this.onClicked(this.record.statistics.bps[0], 0);
    }
    this.statRule = null;
  }

}
