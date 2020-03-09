import { Component, Vue } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation } from "vuex-class"

import AbstractPage from "./AbstractPage.vue"

@Component({
    name: 'Settings',
    components: {
        
    },
})
export default class Settings extends AbstractPage {
    
    created() {
        this.updateNavBarConfig({
            title: "设置",
            leftItem: false,
            rightItem: false,
        });
    }
}
