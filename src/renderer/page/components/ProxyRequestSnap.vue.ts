import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { namespace, State } from "vuex-class";
import { ProxyRequestRecord } from "../../../model/DataModels";

const ProxyRecords = namespace("ProxyRecords");
const COLORS: string[] = [
  "#00a8ff",
  "#9c88ff",
  "#fbc531",
  "#4cd137",
  "#487eb0",
  "#e84118",
  "#7f8fa6",
  "#273c75",
  "#353b48",
  "#dcdde1",
];

@Component({
  name: "ProxyRequestSnap",
  components: {},
})
export default class ProxyRequestSnap extends Vue {
  @Prop()
  source: ProxyRequestRecord;

  @State((state) => state.ProxyRecords.curRecord)
  curRecord: ProxyRequestRecord;

  @ProxyRecords.Mutation("setCurRecord")
  setCurRecord: Function;

  timelineColor: string = "#eb2f06";

  created() {}

  mounted() {}

  destroyed() {}

  @Watch("source")
  onSourceChanged() {
    this.timelineColor = COLORS[this.source.timestamp % 10];
  }
}
