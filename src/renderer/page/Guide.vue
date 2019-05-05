<template>
    <div style="background: #ecf0f1;">
        <mu-appbar style="width: 100%;" title="使用帮助">
            <mu-button flat slot="right" @click="onClose" color="red">
                <mu-icon value="close"></mu-icon>
            </mu-button>
        </mu-appbar>

        <div direction="column"
             style="width: 700px; height: calc(100vh - 64px); padding: 15px; margin:0 auto; overflow-y: auto; ">

            <div class="introduce-image">
                <img :src="imgs[12]" style="width: 80px;"/>
                <br/>
                <span class="tu-note"><strong>AppMock 0.0.3</strong></span>
            </div>

            <h3>简介</h3>
            <p class="introduce">
                AppMock是一款可以通过请求代理转发，方便你在日常终端研发过程中可视化查看API数据返回情况，伪造请求数据返回以模拟特定场景
                Case的一款小工具，希望能助力您的研发，提升您的研发效率。
            </p>
            <p class="introduce" style="color: #c0392b; font-size: 1.1rem;">Note. 使用时，您的应用与AppMock必须处于同一局域网络环境内</p>
            <h3>1. 接入与注册</h3>
            <h4>1.1 应用接入</h4>
            <p class="introduce">
                您的应用需对网络请求框架做一个简单改造，在所有需要接入AppMock的请求URL的Host的改为AppMock提供的Host（如何获取AppMock
                Host详见1.2），同时将需代理请求的源Host塞入Header中Host字段,即完成应用端改造。
            </p>
            <div class="introduce-image">
                <img :src="imgs[7]" style="width: 600px;"/>
                <br/>
                <span class="tu-note">图1-1 android okhttp接入示例</span>
            </div>
            <h4>1.2 代理Host地址获取</h4>
            <p class="introduce">
                点击进入AppMock，点击注册，如图1-2所示，提供了AppMock代理Host地址，
                打开接入带扫码Mock功能版本App，通过设置->Dev->Mock->扫码获取Mock地址->注册成功，开始愉快地使用Mock吧 ：）</p>
            <br>
            <div class="introduce-image">
                <img :src="imgs[0]" style="width: 200px;"/>
                <br/>
                <span class="tu-note">图1-2 获取代理地址</span>
            </div>
            <br>
            <h4>1.3 代理端口设置</h4>
            <p class="introduce">
                点击菜单（快捷键mac：Command&p；widnows：ctrl&p）如图1-3所示，输入自己想要使用的端口好，保存后应用自动重启按新端口注册新服务</p>
            <br>
            <div class="introduce-image">
                <img :src="imgs[10]" style="width: 200px;"/>
                <img :src="imgs[11]" style="width: 200px;"/>
                <br/>
                <span class="tu-note">图1-3 获取代理地址</span>
            </div>
            <br>
            <h3>2. Mock主界面/功能</h3>
            <h4>2.1 请求代理</h4>
            <p class="introduce">
                接入完成后您的应用中触发的网络请求会通过AppMock代理转发，并在AppMock中主界面展示，如图2-1所示，左侧区域显示您当前请求概
                览，点击具体条目右侧Inspect会展示该请求详情，包括请求Path，Request Header，Get/POST请求参数，以及响应数据，当前只支
                持Content-Type为类文本响应的可视化展示，若需要类似Protobuf/Thrift之类的二进制序列化协议支持，请自行拓展代理反序列化
                部分实现。
            </p>
            <div class="introduce-image">
                <img :src="imgs[1]" style="width: 600px;"/>
                <br/>
                <span class="tu-note">图2-1 应用主界面</span>
            </div>
            <p class="introduce">
                请求阅览时，为了方便同学们对返回数据中的图片/音频链接资源的可视化预览，加入了快捷预览功能，如图2-2所示，您可以点击返回数
                据中的图片/音频链接快速浏览当前数据是否正确。
            </p>
            <br>
            <div class="introduce-image">
                <img :src="imgs[3]" style="width: 300px;"/>
                <img :src="imgs[4]" style="width: 300px;"/>
                <br/>
                <span class="tu-note">图2-2 功能展示</span>
            </div>
            <br>
            <h4>2.2 请求Mock</h4>
            <p class="introduce">
                当您需要对某些请求存在临时修改部分返回值以测试其在您的应用中的展示/逻辑流转时，可通过配置mock或图2-3中请求概览上的+按钮
                来实现，点击后进入添加mock规则页面（图-6所示）。
            </p>
            <div class="introduce-image">
                <img :src="imgs[2]" style="width: 250px;"/>
                <br/>
                <span class="tu-note">图2-3 请求概览</span>
            </div>
            <p class="introduce">
                在Mock规则配置页面，完成需要Mock的字段调整后点击>按钮推入Mock规则，点击工具栏保存按钮，您添加的一条或多条Mock规则数据
                会保存为一个Mock规则组，当然，您需要为这个规则组取一个名字（图2-4）。您可以定义多个Mock规则组，可以选择您需要的规则组进
                行Mock，选中对应Mock规则组后点击右侧开关打开即可生效，此时回到主界面，触发Mock规则的请求您会发现在请求概览栏中被标记为浅黄色，您的Mock数据已经生效。
            </p>
            <br>
            <div class="introduce-image">
                <img :src="imgs[5]" style="width: 600px;"/>
                <br/>
                <span class="tu-note">图2-4 配置Mock</span>
            </div>
            <br>
            <div class="introduce-image">
                <img :src="imgs[6]" style="width: 200px;"/>
                <br/>
                <span class="tu-note">图2-5 设置Mock规则组名</span>
            </div>
            <br>
            <h4>2.3 打点预览</h4>
            <p class="introduce">
                用户行为打点记录可通过图2-6中红线标记的按钮点击打开，终端上的打点记录会出现在概览中，点击详情，可以进一步看到此次打点的具体内容（如图2-7所示）。
            </p>
            <div class="introduce-image">
                <img :src="imgs[8]" style="width: 300px;"/>
                <br/>
                <span class="tu-note">图2-6 打点概览</span>
            </div>
            <br/>
            <div class="introduce-image">
                <img :src="imgs[9]" style="width: 400px;"/>
                <br/>
                <span class="tu-note">图2-7 打点预览</span>
            </div>
        </div>
    </div>
</template>

<script>

    import Logo from '@/assets/guide/logo.png'
    import Guide_1 from '@/assets/guide/1.png'
    import Guide_2 from '@/assets/guide/2.png'
    import Guide_3 from '@/assets/guide/3.png'
    import Guide_4 from '@/assets/guide/4.png'
    import Guide_5 from '@/assets/guide/5.png'
    import Guide_6 from '@/assets/guide/6.png'
    import Guide_7 from '@/assets/guide/7.png'
    import Guide_8 from '@/assets/guide/8.png'
    import Guide_9 from '@/assets/guide/9.png'
    import Guide_10 from '@/assets/guide/10.png'
    import Guide_11 from '@/assets/guide/11.png'
    import Guide_12 from '@/assets/guide/12.png'

    export default {
        name: "Guide",
        data() {
            return {
                imgs: [
                    Guide_1, Guide_2, Guide_3, Guide_4, Guide_5,
                    Guide_6, Guide_7, Guide_8, Guide_9, Guide_10,
                    Guide_11, Guide_12, Logo,
                ]
            }
        },
        methods: {
            onClose() {
                this.$router.go(-1);
            }
        }
    }
</script>

<style scoped>

    h3, h4 {
        color: #2c3e50;
    }

    .introduce {
        text-align: left;
        color: #2c3e50;
    }

    .introduce-image {
        width: 100%;
        text-align: center;
    }

    .tu-note {
        font-size: 0.8rem;
        color: #555;
        font-style: italic;
        margin-top: 5px;
    }
</style>
