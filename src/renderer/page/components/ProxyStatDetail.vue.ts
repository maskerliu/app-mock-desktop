import { Component, Prop, Vue, Watch } from "vue-property-decorator"

import { ProxyStatRecord } from "../../../model/DataModels"
import { ipcRenderer, IpcRendererEvent } from "electron";
import { Message } from "element-ui";

@Component({
  name: "ProxyStatDetail",
  components: {},
})
export default class ProxyStatDetail extends Vue {

  @Prop()
  private record: ProxyStatRecord;

  private statRule: { desc: string, rule: string[], ruleDesc: string } = null;
  private visible: boolean = false;
  private curStat: any;
  private rowClassName: string = "normal-row";


  created() {
    ipcRenderer.on("on-get-stat-rule", (event: IpcRendererEvent, args: any) => {
      if (args.code != 8000) {
        Message.error(args.message);
        return;
      }

      if (args.data.data != null && args.data.data.length == 1) {
        let stat = args.data.data[0];
        let rules: string[] = stat.rule.split(/[,;，；]/);
        this.visible = true;
        this.statRule = {
          desc: stat.desc,
          rule: stat.rule.split(/[,;，；]/),
          ruleDesc: stat.ruleDesc
        }
        if (rules == null || rules.length == 0 || stat.rule == "") {
          this.rowClassName = "success-row"
        } else {
          this.rowClassName = this.argsVailidate(rules) ? "success-row" : "warning-row";
        }
      } else {
        Message.warning("未找到相关等级埋点");
      }
    });
  }

  mounted() {
    if (this.record.statistics.bps.length == 1) {
      this.onClicked(this.record.statistics.bps[0]);
    }
  }

  destroyed() {
    ipcRenderer.removeAllListeners("on-get-stat-rule");
  }

  onClicked(row: any) {
    this.curStat = row;
    ipcRenderer.send("on-get-stat-rule", {
      eventId: row["event_id"],
      keyword: row["elementId"] == "" ? row["pageId"] : row["elementId"]
    });
  }

  argsVailidate(rule: string[]): boolean {

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
        console.log(ruleKey.trim());
      }
    }
    return validate;
  }

  @Watch("record")
  onRecordChanged() {

    if (this.record.statistics.bps.length == 1) {
      this.onClicked(this.record.statistics.bps[0]);
    }

    this.visible = false;
    this.rowClassName = "normal-row";
  }

}
