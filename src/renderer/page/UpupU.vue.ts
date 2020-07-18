import { Component, Vue, Prop } from "vue-property-decorator"
import { Action, namespace, Getter, Mutation, State } from "vuex-class"

import { remote } from "electron"

import fs from "fs"
import axios from 'axios'

import { Wave } from "../common/Wave"

import AbstractPage from "./AbstractPage.vue"

@Component({
    name: "UpupU",
    components: {},
})
export default class UpupU extends AbstractPage {

    private wave: Wave;
    private genTxt: string = null;
    private shape: string = "排排站";
    private shapes: Array<string> = ["排排站", "45度的仰望",];
    private context: CanvasRenderingContext2D = null;

    private dataUrl: string = null;

    public $refs!: {
        drawContainer: HTMLCanvasElement;
    };

    public created(): void {
        this.updateNavBarConfig({
            title: "举牌小人",
            leftItem: false,
            rightItem: false,
        });


    }

    public mounted() {

        // this.wave = new Wave(this.$refs.drawContainer.getContext('2d'), this.$refs.drawContainer.width, this.$refs.drawContainer.height);
        // this.wave.run();

        this.context = this.$refs.drawContainer.getContext('2d');
        this.$refs.drawContainer.width = this.$refs.drawContainer.scrollWidth;
        this.$refs.drawContainer.height = this.$refs.drawContainer.scrollHeight;
    }


    public genUpup(): void {
        this.context.setTransform(1, 0, 0, 1, 0, 0);
        this.context.fillStyle = "red";
        this.context.clearRect(0, 0, this.$refs.drawContainer.width, this.$refs.drawContainer.height);
        this.context.save();
        if (this.genTxt == null) return;

        switch (this.shape) {
            case "排排站":
                this.drawUpupWithPaiPaiZhan();
                break;
            case "45度的仰望":
                this.drawUpupWith45();
                break;
        }
    }

    public saveUpup(): void {
        this.dataUrl = this.$refs.drawContainer.toDataURL("image/png");
        remote.dialog.showSaveDialog({
            title: "保存文件",
            defaultPath: "",
            properties: ['createDirectory'],
            filters: [
                { name: 'webp', extensions: ["webp"] },
                { name: 'png', extensions: ["png", "PNG"] },
                { name: 'jpg', extensions: ["jpg", "jpeg"] },
                { name: 'All Files', extensions: ['*'] }
            ]
        }).then(result => {
            let base64Data = this.dataUrl.replace(/^data:image\/(png|jpg|webp)+;base64,/, "");
            let dataBuffer = new Buffer(base64Data, 'base64');
            fs.writeFile(result.filePath, dataBuffer, (err) => {
                console.log(err);
            });

        }).catch(err => {
            console.log(err)
        });

    }

    private drawUpupWithPaiPaiZhan(): void {
        let strs: string[] = this.genTxt.split("\n");
        for (let i: number = 0; i < strs.length; ++i) {
            for (let j: number = 0; j < strs[i].length; ++j) {
                let char: string = strs[i].substr(j, 1);
                if (char == " ") continue;
                let img = new Image();
                img.src = `./static/jupaixiaoren/QP4a5rvW_${Math.floor(Math.random() * 39) + 1}.png`;
                img.onload = () => {
                    this.context.beginPath()
                    // this.context.scale(0.8, 0.8);
                    this.context.translate(img.width * j + (i % 2 == 1 ? img.width / 2 : 0), 50 * i);
                    this.context.drawImage(img, 0, 0);
                    this.context.fillStyle = "#ffffff";
                    this.context.font = '18px Arial';
                    this.context.textAlign = 'center';
                    this.context.textBaseline = 'middle';
                    this.context.translate(-7, 10);
                    this.context.transform(1, Math.tan(Math.PI / 180 * 20), -Math.tan(Math.PI / 180 * 45), 1, 0, 0);
                    this.context.fillText(strs[i].substr(j, 1), 46, 3);
                    this.context.closePath();
                    this.context.setTransform(1, 0, 0, 1, 0, 0);
                }
            }
        }
    }

    private drawUpupWith45() {
        let strs: string[] = this.genTxt.split("\n");
        for (let i: number = 0; i < strs.length; ++i) {
            for (let j: number = 0; j < strs[i].length; ++j) {
                let char: string = strs[i].substr(j, 1);
                if (char == " ") continue;
                let img = new Image();
                img.src = `./static/jupaixiaoren/QP4a5rvW_${Math.floor(Math.random() * 39) + 1}.png`;
                img.onload = () => {
                    this.context.beginPath()
                    this.context.translate((img.width - 20) * j + img.width / 2, 100 * i + 30 * j);
                    this.context.drawImage(img, 0, 0);
                    this.context.fillStyle = "#ffffff";
                    this.context.font = '18px Arial';
                    this.context.textAlign = 'center';
                    this.context.textBaseline = 'middle';
                    this.context.translate(-7, 10);
                    this.context.transform(1, Math.tan(Math.PI / 180 * 20), -Math.tan(Math.PI / 180 * 45), 1, 0, 0);
                    this.context.fillText(strs[i].substr(j, 1), 46, 3);
                    this.context.closePath();
                    this.context.setTransform(1, 0, 0, 1, 0, 0);
                }
            }
        }
    }

}
