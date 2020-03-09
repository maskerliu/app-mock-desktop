import { Component, Vue, Prop } from "vue-property-decorator"
import { namespace } from 'vuex-class'

import { MockRule } from "../../../model/DataModels"

@Component({
    name: 'MockRuleSnap',
    components: {

    },
})
export default class MockRuleSnap extends Vue {

    @Prop()
    rule: MockRule;

    @Prop()
    isSelected: boolean = false;

    showEditor: boolean = false;

    created() {

    }

    onEditClicked() {

    }

    onDeleteClicked() {

    }

}
