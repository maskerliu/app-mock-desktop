import { Component, Vue } from "vue-property-decorator"
import { namespace } from "vuex-class"

const Env = namespace("Env")

@Component({
    name: "DebugPanel",
})
export default class DebugPanel extends Vue {
    private env: string = null;

    mounted() {

    }

    createCrash() {

    }

    changeEnv() {

    }

    clearCache() {

    }
}