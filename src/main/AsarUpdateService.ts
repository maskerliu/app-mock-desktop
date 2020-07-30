import { app, BrowserWindow, dialog } from "electron";
import EAU from "electron-asar-hot-updater";
import ProgressBar from "electron-progressbar";

class AsarUpdateService {

    private mainWindow: BrowserWindow = null;
    private versionCheckServer: string = null;

    constructor() {

    }

    private init() {
        EAU.init({
            api: this.versionCheckServer,
            server: false,
            debug: false,
            formatRes: (resp: any) => {
                return resp;
            }
        });
    }

    public setParentWindow(parent: BrowserWindow) {
        this.mainWindow = parent;
    }

    public setVersionCheckServer(url: string) {
        this.versionCheckServer = url;
        this.init();
        this.check();
    }

    public check() {
        if (process.env.NODE_ENV === 'development' || this.versionCheckServer == null || this.versionCheckServer == "")
            return false;

        EAU.check((err: any, last: any, body: any) => {
            if (err) {
                if (err === 'no_update_available') { return false; }
                if (err === 'version_not_specified' && process.env.NODE_ENV === 'development') { return false; }
                return false;
            }

            EAU.progress((state: any) => {
                console.log(state);
            });
            dialog.showMessageBox({
                type: "info",
                buttons: ["确认", "取消"],
                title: "是否更新?",
                message: `是否立刻更新至 ${last}`,
                detail: body.info,
                defaultId: 0,
            }).then(optResult => {
                switch (optResult.response) {
                    case 0:
                        var progressBar = new ProgressBar({
                            indeterminate: false,
                            text: 'Preparing data...',
                            detail: 'Wait...',
                            style: {
                                bar: { 'background-color': '#fff', 'height': '10px' },
                                value: { 'background-color': '#2CD3A9', 'height': '10px' }
                            },
                            browserWindow: {
                                parent: this.mainWindow
                            }
                        });

                        progressBar.on('completed', function () {
                            console.info('completed...')
                            progressBar.detail = 'Task completed. Exiting...'
                        }).on('aborted', function (value) {
                            console.info(`aborted... ${value}`)
                        }).on('progress', function (value) {
                            progressBar.detail = `Value ${value} out of ${progressBar.getOptions().maxValue}...`
                        });

                        EAU.progress((state: any) => {
                            if (!progressBar.isCompleted()) {
                                progressBar.value = 100 * state.percent;
                            }
                        });

                        EAU.download((downloadErr: any) => {
                            progressBar.value = 100;
                            progressBar.close();
                            if (downloadErr) {
                                dialog.showErrorBox("error", downloadErr);
                                return false;
                            }

                            if (process.platform == "darwin") {
                                dialog.showMessageBox({
                                    type: "info",
                                    buttons: ["确认", "取消"],
                                    title: "更新完成",
                                    message: "",
                                    detail: "请重启应用",
                                    defaultId: 0
                                }).then((returnVal) => {
                                    switch (returnVal.response) {
                                        case 0:
                                            app.relaunch();
                                            break;
                                        default:
                                            break;
                                    }
                                });
                            }
                            app.quit();
                            return true;
                        });
                        break;
                    case 1:
                        break;
                    default:
                        break;
                }
            })
        });
    }
}

export default new AsarUpdateService()