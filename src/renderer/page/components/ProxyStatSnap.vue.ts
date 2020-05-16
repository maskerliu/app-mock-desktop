import { Component, Prop, Vue } from "vue-property-decorator";
import { ProxyStatRecord } from "../../../model/DataModels";

@Component({
  name: "ProxyStatSnap",
  components: {},
})
export default class ProxyStatSnap extends Vue {
  @Prop()
  statRecord: ProxyStatRecord;

  @Prop()
  isSelected: boolean = false;

  created() {}
}
