import { Component, Vue } from "vue-property-decorator"
import BizMain from './page/BizMain.vue'
import { namespace } from 'vuex-class'

const Env = namespace('Env')

@Component({
    name: 'App',
    components: {
        BizMain,
    },
})
export default class App extends Vue {
    @Env.Action('init') init;

    canRender: boolean = false;

    created() {
        this.canRender = true;
        // this.init().then(res => {
        //     console.log(res)
            
        // }).catch(() => {
        //     this.canRender = true
        // })
    }
}
