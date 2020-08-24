import { Component, Prop, Vue } from "vue-property-decorator";
import "./live2d.min.js";

@Component({
    name: "Demo",
    components: {

    },
})
export default class Live2d extends Vue {

    @Prop({ default: 1, type: Number })
    zIndex: number;

    messageTimer: any = null;
    mainShow: boolean = true;

    mounted() {
        this.loadModel();
    }

    loadModel() {
        let random: number = Math.floor((Math.random() * 7) % 7) + 1;
        let fileName: string = (Array(4).join('0') + random).slice(-4);
        (<any>window).loadlive2d("live2d-main", `/static/live2d/l2d_${fileName}/index.json`, null);
        // (<any>window).loadlive2d("live2d-main", `/static/live2d/c124_00/model.json`, null);

    }
}