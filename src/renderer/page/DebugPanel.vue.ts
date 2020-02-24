import { Component, Vue } from "vue-property-decorator"
import { namespace } from 'vuex-class'
import { webFrame } from 'electron'

const Env = namespace('Env')

@Component({
    name: 'DebugPanel',
})
export default class DebugPanel extends Vue {
    @Env.State('env') env: any;

    mounted() {

    }

    createCrash() {

    }

    changeEnv() {

    }

    clearCache() {
        
    }
}