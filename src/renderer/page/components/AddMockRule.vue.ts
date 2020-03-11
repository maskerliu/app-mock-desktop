import { Component, Vue, Prop, Watch } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation } from "vuex-class"

import { MockRule, ProxyRequestRecord } from "../../../model/DataModels"

import VJsonEditor from "v-jsoneditor"

const MockRules = namespace("MockRules");

@Component({
    name: 'Settings',
    components: {
        VJsonEditor,
    },
})
export default class AddMockRule extends Vue {

    @MockRules.Action("searchMockRules")
    private searchMockRules: Function;

    @Prop()
    show: boolean;
    @Prop()
    record: ProxyRequestRecord;

    keyword: string = null;
    visible: boolean = false;
    rules: Array<MockRule> = null;
    curRule: MockRule = null;
    wrapperRecord: ProxyRequestRecord = null;
    timeout: any = null;
    isSaving: boolean = false;

    $refs!: {
        respJsonEditor: VJsonEditor
    };

    jeOption: {} = {
        mode: "code",
        search: false,
        navigationBar: false,
        statusBar: false,
        mainMenuBar: false
    };

    created() {
        this.wrapperRecord = Object.assign({}, this.record);

        this.curRule = {
            _id: "#ypp031349101",
            name: "首页feed流-异网",
            desc: "网络异常下的页面兜底",
            requests: []
        }
    }

    querySearchAsync() {

        this.searchMockRules(this.keyword);
        // var restaurants = this.rules;
        // var results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;

        // clearTimeout(this.timeout);
        // this.timeout = setTimeout(() => {
        //     cb(results);
        // }, 3000 * Math.random());
    }

    createStateFilter(queryString) {
        // return (state) => {
        //     return (state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
        // };
    }

    handleSelect(item: MockRule) {
        console.log(item);
    }

    addRule() {
        let isContains = false;
        for (let i = 0; i < this.curRule.requests.length; ++i) {
            let request = this.curRule.requests[i];
            if (request.url === this.record.url) {
                this.curRule.requests[i] = Object.assign({}, this.record);
                isContains = true;
                break;
            }
        }

        if (!isContains) this.curRule.requests.push(this.record);
    }

    onDeleteClicked(record: ProxyRequestRecord) {
        let index = this.curRule.requests.indexOf(record);
        if (index > -1) this.curRule.requests.splice(index, 1);
    }

    onSave() {
        this.isSaving = true;
        if (this.curRule === null || this.curRule._id === null) {

        } else {

        }
    }

    @Watch("record")
    onRecordChanged() {
        this.wrapperRecord = Object.assign({}, this.record);
    }
}
