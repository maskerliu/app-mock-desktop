import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { namespace, State } from "vuex-class";
import { ProxyRequestRecord } from "../../model/DataModels";

const ProxyRecords = namespace("ProxyRecords");

@Component({
  name: "ProxyRecordSnap",
  components: {},
})
export default class ProxyRecordSnap extends Vue {
  @Prop()
  source: ProxyRequestRecord;

  @State((state) => state.ProxyRecords.curRecord)
  curRecord: ProxyRequestRecord;

  @ProxyRecords.Mutation("setCurRecord")
  setCurRecord: Function;

  created() {}

  mounted() {}

  destroyed() {}

}
