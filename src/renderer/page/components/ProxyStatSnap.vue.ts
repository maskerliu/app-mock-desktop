import { Component, Vue, Prop } from "vue-property-decorator"
import { namespace } from "vuex-class"

import { ProxyStatRecord } from "../../../model/DataModels"

@Component({
    name: "ProxyStatSnap",
    components: {

    },
})
export default class ProxyStatSnap extends Vue {

    @Prop()
    statRecord: ProxyStatRecord;

    @Prop()
    isSelected: boolean = false;
    
    created() {

    }
}
