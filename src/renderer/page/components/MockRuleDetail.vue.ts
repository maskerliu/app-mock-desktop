import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { namespace } from 'vuex-class'

import { ProxyRequestRecord, ProxyStatRecord, MockRule } from "../../model/DataModels"

@Component({
    name: 'MockRuleDetail',
    components: {

    },
})
export default class MockRuleDetail extends Vue {

    @Prop()
    rule: MockRule;

    curRequest: ProxyRequestRecord = null;
    showEditor: boolean = false;
    showDeleteConfirm: boolean = false;

    created() {

    }

    onEditClicked(request: ProxyRequestRecord) {
        this.showEditor = true;
        this.curRequest = request;
    }

    onDeleteClicked(request: ProxyRequestRecord) {
        console.log(request);
        this.showDeleteConfirm = true;
    }

    onDeleteConfirm(request: ProxyRequestRecord) {

    }
}
