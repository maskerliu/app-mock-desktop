'use strict';

const chalk = require("chalk");
const electron = require("electron");
const path = require("path");
const { say } = require("cfonts");
const { spawn } = require("child_process");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackHotMiddleware = require("webpack-hot-middleware");

const mainConfig = require("./webpack.main.config");
const rendererConfig = require("./webpack.renderer.config");
const webConfig = require("./webpack.web.config");

let electronProcess = null;
let manualRestart = false;
let hotMiddleware;

const exec = require("child_process").exec;
const os = require("os");
const platform = os.platform();

function logStats(proc, data) {
    let log = "";

    log += chalk.yellow(`┏ ${proc} Process ${new Array((19 - proc.length) + 1).join("-")}`);
    log += "\n\n";

    if (typeof data === "object") {
        data.toString({ colors: true, chunks: false }).split(/\r?\n/)
            .forEach(line => {
                log += "  " + line + "\n";
            });
    } else {
        log += `  ${data}\n`;
    }

    log += "\n" + chalk.yellow(`┗ ${new Array(28 + 1).join("-")}`) + "\n";

    console.log(log);
}

function startWeb() {
    return new Promise((resolve, reject) => {
        webConfig.entry.web = [path.join(__dirname, "dev-client")].concat(webConfig.entry.web);
        webConfig.mode = "development";
        const compiler = webpack(webConfig);
        hotMiddleware = webpackHotMiddleware(compiler, { log: false, heartbeat: 2500 });

        compiler.hooks.compilation.tap("compilation", compilation => {
            compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync("html-webpack-plugin-after-emit", (data, cb) => {
                hotMiddleware.publish({ action: "reload" });
                cb();
            });
        });

        compiler.hooks.done.tap("done", stats => {
            logStats("Web", stats);
        });

        const server = new WebpackDevServer(
            compiler,
            {
                contentBase: path.join(__dirname, "../"),
                quiet: true,
                before(app, ctx) {
                    app.use(hotMiddleware);
                    ctx.middleware.waitUntilValid(() => {
                        resolve()
                    });
                }
            }
        );

        server.listen(9081);
    })
}

function startRenderer() {
    return new Promise((resolve, reject) => {
        rendererConfig.entry.renderer = [path.join(__dirname, "dev-client")].concat(rendererConfig.entry.renderer);
        rendererConfig.mode = "development";
        const compiler = webpack(rendererConfig);
        hotMiddleware = webpackHotMiddleware(compiler, { log: false, heartbeat: 2500 });

        compiler.hooks.compilation.tap("compilation", compilation => {
            compilation.hooks.htmlWebpackPluginAfterEmit.tapAsync("html-webpack-plugin-after-emit", (data, cb) => {
                hotMiddleware.publish({ action: "reload" });
                cb();
            });
        });

        compiler.hooks.done.tap("done", stats => {
            logStats("Renderer", stats);
        });

        const server = new WebpackDevServer(
            compiler,
            {
                contentBase: path.join(__dirname, "../"),
                quiet: true,
                before(app, ctx) {
                    app.use(hotMiddleware);
                    ctx.middleware.waitUntilValid(() => {
                        resolve()
                    });
                }
            }
        );

        server.listen(9080)
    })
}

function startMain() {
    return new Promise((resolve, reject) => {
        mainConfig.entry.main = [path.join(__dirname, "../src/main/index.dev.ts")].concat(mainConfig.entry.main);
        mainConfig.mode = "development";
        const compiler = webpack(mainConfig);

        compiler.hooks.watchRun.tapAsync("watch-run", (compilation, done) => {
            logStats("Main", chalk.white("compiling..."));
            hotMiddleware.publish({ action: "compiling" });
            done();
        });

        compiler.watch({}, (err, stats) => {
            if (err) {
                console.log(err);
                return;
            }

            logStats("Main", stats);

            if (electronProcess && electronProcess.kill) {
                manualRestart = true;

                if (platform === "darwin") {
                    process.kill(electronProcess.pid);
                    electronProcess = null;
                    startElectron();

                    setTimeout(() => {
                        manualRestart = false
                    }, 5000);
                } else {
                    const pid = electronProcess.pid;
                    exec(`TASKKILL /F /IM electron.exe`, function (err, data) {
                        if (err) console.log(err);
                        else console.log("kill pid: " + pid + " success!");
                        electronProcess = null;
                        startElectron();
                        manualRestart = false
                    });
                }
            }

            resolve();
        })
    })
}

function startElectron() {
    var args = [
        "--inspect=5858",
        "--remote-debugging-port=9223", // add this line
        path.join(__dirname, "../dist/electron/main.js")
    ];

    // detect yarn or npm and process commandline args accordingly
    if (process.env.npm_execpath.endsWith("yarn.js")) {
        args = args.concat(process.argv.slice(3));
    } else if (process.env.npm_execpath.endsWith("npm-cli.js")) {
        args = args.concat(process.argv.slice(2));
    }

    electronProcess = spawn(electron, args);

    electronProcess.stdout.on("data", data => {
        electronLog(data, "blue");
    });
    electronProcess.stderr.on("data", data => {
        electronLog(data, "red");
    });

    electronProcess.on("close", () => {
        if (!manualRestart) process.exit();
    });
}

function electronLog(data, color) {
    let log = "";
    data = data.toString().split(/\r?\n/);
    data.forEach(line => {
        log += `  ${line}\n`;
    });
    if (/[0-9A-z]+/.test(log)) {
        console.log(
            chalk[color]("┏ Electron -------------------") +
            "\n\n" +
            chalk[color](log) +
            chalk[color]("┗ ----------------------------") +
            "\n"
        );
    }
}

function greeting() {
    const cols = process.stdout.columns;
    let text = "";

    if (cols > 104) text = "electron-vue";
    else if (cols > 76) text = "electron-|vue";
    else text = false;

    if (text) {
        say(text, {
            colors: ["green"],
            font: "simple3d",
            space: false
        })
    } else
        console.log(chalk.green("\n  electron-vue"));
    console.log(chalk.blue("  getting ready...") + "\n");
}

function init() {
    greeting();

    Promise.all([startWeb(), startRenderer(), startMain()])
        .then(() => {
            startElectron();
        })
        .catch(err => {
            console.error(err);
        })
}

init();
