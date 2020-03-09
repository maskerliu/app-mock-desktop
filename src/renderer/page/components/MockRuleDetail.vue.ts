import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { namespace } from 'vuex-class'

import VJsonEditor from "v-jsoneditor"

import { ProxyRequestRecord, ProxyStatRecord, MockRule } from "../../../model/DataModels"

@Component({
    name: 'MockRuleDetail',
    components: {
        VJsonEditor,
    },
})
export default class MockRuleDetail extends Vue {
    jeOption: {} = {
        mode: "code",
        search: false,
        navigationBar: false,
        statusBar: false,
        mainMenuBar: false
    };
    
    @Prop()
    rule: MockRule;

    curRecord: ProxyRequestRecord = null;
    showEditor: boolean = false;
    showDeleteConfirm: boolean = false;

    created() {

    }

    onEditClicked(request: ProxyRequestRecord) {
        this.showEditor = true;
        this.curRecord = request;
    }

    onDeleteClicked(request: ProxyRequestRecord) {
        console.log(request);
        this.showDeleteConfirm = true;
    }

    onDeleteConfirm(request: ProxyRequestRecord) {

    }
}
