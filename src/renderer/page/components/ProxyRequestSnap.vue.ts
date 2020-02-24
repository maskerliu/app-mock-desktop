import { Component, Vue, Prop } from "vue-property-decorator"
import { namespace } from 'vuex-class'

import { ProxyRequestRecord } from "../../model/DataModels"

@Component({
    name: 'ProxyRequestSnap',
    components: {

    },
})
export default class ProxyRequestSnap extends Vue {

    @Prop()
    reqRecord: ProxyRequestRecord;

    @Prop()
    isSelected: boolean = false;

    created() {


    }
}
