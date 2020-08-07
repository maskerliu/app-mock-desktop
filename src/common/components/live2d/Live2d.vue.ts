import axios from "axios";
import "./live2d.min.js";
import { Prop } from "vue-property-decorator";
import { Component, Vue } from "vue-property-decorator";

// TODO: 各配置独立文件
const tips = {
    copy: [
        {
            selector: "document",
            text: ["你都复制了些什么呀，转载要记得加上出处哦！"],
        },
    ],
    visibilitychange: [
        {
            selector: "document",
            text: ["哇，你终于回来了～"],
        },
    ],
    click: [
        {
            selector: ".veditor",
            text: ["要吐槽些什么呢？", "一定要认真填写喵～", "有什么想说的吗？"],
        },
        {
            selector: ".vsubmit",
            text: ["输入验证码就可以提交评论啦～"],
        },
    ],
    mouseover: [
        {
            selector: "#live2d #live2d-main",
            text: ["(ノ≧∇≦)ノ", "biubiu / / /"],
        },
        {
            selector: "#live2d-tool .fa-comment",
            text: ["猜猜我要说些什么？", "欣赏一些有意思的短句？"],
        },
        {
            selector: "#live2d-tool .fa-user-circle",
            text: ["想看看我的朋友们吗？"],
        },
        {
            selector: "#live2d-tool .fa-street-view",
            text: ["变装！"],
        },
        {
            selector: "#live2d-tool .fa-camera-retro",
            text: ["一起拍照留念？"],
        },
        {
            selector: "#live2d-tool .fa-info-circle",
            text: ["(＾Ｕ＾)ノ~ＹＯ"],
        },
        {
            selector: "#live2d-tool .fa-times",
            text: ["就要说再见了吗？"],
        },
    ],
};

@Component({
    name: "Demo",
    components: {

    },
})
export default class Live2d extends Vue {
    @Prop({ default: "https://live2d.fghrsh.net/api", type: String })
    apiPath: string;

    @Prop({ default: 1, type: Number })
    zIndex: number;

    messageTimer: any = null;
    mainShow: boolean = true;
    tips: {} = tips;
    tipText: string = "";
    tipShow: boolean = false;
    toolShow: boolean = false;
    modelId: number = 1;
    modelTexturesId: number = 53;

    mounted() {
        // this.modelId = this.model[0];
        // this.modelTexturesId = this.model[1];
        this.loadModel();
        this.$nextTick(function () {
            this.loadEvent();
        });
    }

    loadModel() {
        // const url = `${this.apiPath}/get/?id=${this.modelId}-${this.modelTexturesId}`;
        // const callback = console.log(`Live2D 模型 ${this.modelId}-${this.modelTexturesId} 加载完成`);
        (<any>window).loadlive2d("live2d-main", "/static/live2d/ShizukuTalk/shizuku-48/index.json", null);
    }

    loadEvent() {
        for (const event in this.tips) {
            for (const obj of this.tips[event]) {
                const selector = obj.selector;
                let dom = null;

                if (selector === "document") {
                    dom = document;
                } else if (document.querySelector(selector)) {
                    dom = document.querySelector(selector);
                }

                if (dom == null) continue;
                dom.addEventListener(event, () => {
                    const arr = obj.text;
                    const msg = arr[Math.floor(Math.random() * arr.length)];
                    this.showMessage(msg, 2000);
                });
            }
        }
    }

    showMessage(msg = "", timeout = 6000) {
        if (this.messageTimer) {
            clearTimeout(this.messageTimer);
            this.messageTimer = null;
        } else {
            this.tipShow = true;
        }
        this.tipText = msg;
        this.messageTimer = setTimeout(() => {
            this.tipShow = false;
            this.messageTimer = null;
        }, timeout);
    }

}