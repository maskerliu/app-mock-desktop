import { Component, Vue } from "vue-property-decorator";
import { Action } from "vuex-class";
import SockJS from "sockjs-client";

@Component({
    name: "Demo",
    components: {

    },
})
export default class Demo extends Vue {

    @Action("unInit") unInit: Function;

    input: string = "";

    sockjs = new SockJS(`${process.env.SERVER_BASE_URL}/echo`);

    mounted() {
        this.sockjs.onopen = () => { this.print('[*] open', this.sockjs.protocol); };
        this.sockjs.onmessage = (e: any) => { this.print('[.] message', e.data); };
        this.sockjs.onclose = () => { this.print('[*] close'); };
    }

    destroyed() {
        this.sockjs.close();
    }

    print(m, p?) {
        p = (p === undefined) ? '' : JSON.stringify(p);
        console.log(m + ' ' + p);
    }

    closePushClient() {
        this.unInit();
        this.print('[ ] sending', this.input);
        this.sockjs.send(this.input);
        this.input = '';
    }

}