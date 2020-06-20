import { Component, Vue } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation, State } from "vuex-class"

import fs from "fs"
import axios from 'axios'

import AbstractPage from "./AbstractPage.vue"

@Component({
    name: "Spider",
    components: {},
})
export default class Spider extends AbstractPage {

    spiderUrl: string = "";
    spiderIcon: string = "el-icon-video-play";
    interval: any;

    public created(): void {
        this.updateNavBarConfig({
            title: "爬虫",
            leftItem: false,
            rightItem: false,
        });
    }

    onSpiderClick() {
        if (this.spiderIcon == "el-icon-video-play") {
            this.interval = setInterval(this.getRemotePage, 1000 * 1 * 10);
            this.spiderIcon = "el-icon-video-pause";
        } else {
            clearInterval(this.interval);
            this.spiderIcon = "el-icon-video-play";
        }



    }

    getRemotePage() {
        axios.get(this.spiderUrl).then((res: any) => {
            let status: string = res.data.indexOf("online") > 0 ? "online" : "offline";
            let date: Date = new Date();
            fs.writeFile(`./${date.toDateString()}.txt`, `${status} ${date.toLocaleString()} \n`, { 'flag': 'a' }, function (err) {
                if (!err) console.log("写入成功！");
            });
        }, (err: any) => {
            console.log(err);
        });
    }
}
