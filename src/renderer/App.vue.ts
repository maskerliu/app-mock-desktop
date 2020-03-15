import { Component, Vue } from "vue-property-decorator"
import BizMain from "./page/BizMain.vue"
import { namespace, Action } from "vuex-class"

const Env = namespace("Env")

@Component({
    name: "App",
    components: {
        BizMain,
    },
})
export default class App extends Vue {
    // @Env.Action("init") init;

    @Action("init") init: Function;

    canRender: boolean = false;

    created() {
        this.canRender = true;
        this.init();
        // this.init().then(res => {
        //     console.log(res)

        // }).catch(() => {
        //     this.canRender = true
        // })
    }

    destroyed() {
        console.log("destroy");
    }
}
