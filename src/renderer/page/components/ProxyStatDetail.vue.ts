import { Component, Prop, Vue, Watch } from "vue-property-decorator"

import { ProxyStatRecord } from "../../../model/DataModels"
import { get } from "../../../model/BasicLocalAPI"
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

  public $refs!: {
    statsTable: any;
  };


  created() {
    ipcRenderer.on("on-get-stat-rule", (event: IpcRendererEvent, args: any) => {
      if (args.code != 8000) {
        Message.error(args.message);
        return;
      }

      if (args.data.data != null && args.data.data.length >= 1) {
        let stat = args.data.data[0];
        let rules: string[] = stat.rule.split(/[,;，；]/);
        this.statRule = {
          desc: stat.name + stat.desc,
          rule: stat.rule.split(/[,;，；]/),
          ruleDesc: stat.ruleDesc
        }
        if (rules == null || rules.length == 0 || stat.rule == "") {
          this.rowClassName = "success-row"
        } else {
          this.rowClassName = this.argsVailidate(rules) ? "success-row" : "error-row";
        }
      } else {
        this.rowClassName = "warning-row";
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

  tableRowClassName({ row, rowIndex }) {
    if (rowIndex === 1) {
      return 'warning-row';
    } else if (rowIndex === 3) {
      return 'success-row';
    }
    return '';
  }

  onClicked(row: any) {
    this.curStat = row;
    let pageId = row["pageId"] == "" ? row["page"] : row["pageId"];
    let elementId = row["elementId"] == "" ? row["arg1"] : row["elementId"];
    if (row["elementId"] == "" && pageId == "") {
      this.rowClassName = "warning-row";
      Message.warning("未找到相关等级埋点");
    } else {


      get("/api/stat/queryStats", "https://app.yupaopao.com", {
        eventId: row["event_id"],
        keyword: elementId == "" ? pageId : elementId
      }).then(resp => {
        if (resp.data.code != 8000) {
          Message.error(resp.data.message);
          return;
        }

        if (resp.data.data.data != null && resp.data.data.data.length >= 1) {
          let stat = resp.data.data.data[0];
          let rules: string[] = stat.rule.split(/[,;，；]/);
          this.statRule = {
            desc: stat.name + stat.desc,
            rule: stat.rule.split(/[,;，；]/),
            ruleDesc: stat.ruleDesc
          }
          if (rules == null || rules.length == 0 || stat.rule == "") {
            this.rowClassName = "success-row"
          } else {
            this.rowClassName = this.argsVailidate(rules) ? "success-row" : "error-row";
          }
        } else {
          this.rowClassName = "warning-row";
          Message.warning("未找到相关等级埋点");
        }
      }).catch(err => {
        Message.warning(err);
      });
    }
  }

  onExpandChagned(row: any, expandedRows: any) {
    // console.log(row, expandedRows)
    // let $table = this.$refs.statsTable;
    // expandedRows.map((item: any) => {
    //   $table.toggleRowExpansion(item, false)
    // })
    // $table.toggleRowExpansion(row)

    // this.curStat = row;
    // let pageId = row["pageId"] == "" ? row["page"] : row["pageId"];
    // let elementId = row["elementId"] == "" ? row["arg1"] : row["elementId"];
    // if (row["elementId"] == "" && pageId == "") {
    //   this.rowClassName = "warning-row";
    //   Message.warning("未找到相关等级埋点");
    // } else {
    //   ipcRenderer.send("on-get-stat-rule", {
    //     eventId: row["event_id"],
    //     keyword: elementId == "" ? pageId : elementId
    //   });
    // }
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
    this.statRule = null;
  }

}
