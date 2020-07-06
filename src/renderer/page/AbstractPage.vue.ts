import { Component, Vue } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation, State } from "vuex-class"

@Component({
  name: "AbstractPage",
  components: {},
})
export default class AbstractPage extends Vue {
  @Mutation("updateNavBarConfig")
  protected updateNavBarConfig: Function;
}
