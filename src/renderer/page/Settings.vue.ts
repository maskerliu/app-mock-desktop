import { Component, Vue } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation } from "vuex-class"

@Component({
    name: 'Settings',
    components: {
        
    },
})
export default class Settings extends Vue {
    @Action('updateNavBarConfig')
    public updateNavBarConfig: Function;

    created() {
        this.updateNavBarConfig({
            title: "设置",
            leftItem: false,
            rightItem: false,
        });
    }
}
