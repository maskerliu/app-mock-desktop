import { Component, Vue } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation } from "vuex-class"

@Component({
    name: "AbstractPage",
    components: {

    },
})
export default class AbstractPage extends Vue {
    @Action("updateNavBarConfig")
    protected updateNavBarConfig: Function;
}
