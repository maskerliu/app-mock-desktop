import { Component, Vue, Prop } from "vue-property-decorator"
import { namespace, State, Mutation } from "vuex-class"

import { ProxyRequestRecord } from "../../../model/DataModels"

const ProxyRecords = namespace("ProxyRecords");

@Component({
    name: "ProxyRequestSnap",
    components: {

    },
})
export default class ProxyRequestSnap extends Vue {

    @Prop()
    source: ProxyRequestRecord;

    @State(state => state.ProxyRecords.curRecord)
    curRecord: ProxyRequestRecord;

    @ProxyRecords.Mutation("setCurRecord")
    setCurRecord: Function;

    @Prop()
    isSelected: boolean;

    created() {

    }

    destroyed() {

    }

    onItemClicked(): void {
        this.$store.commit("ProxyRecords/setCurRecord", this.source);
    }

}
