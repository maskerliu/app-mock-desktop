import { Component, Vue } from "vue-property-decorator";
import { Action, namespace } from "vuex-class";
import BizMain from "./page/BizMain.vue";

const Env = namespace("Env");

@Component({
  name: "App",
  components: {
    BizMain,
  },
})
export default class App extends Vue {
  @Action("init") init: Function;

  canRender: boolean = false;

  created() {
    this.canRender = true;
    this.init();
  }

  destroyed() {
    
  }
}
