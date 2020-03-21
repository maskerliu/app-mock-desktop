# app-mock-desktop

> 旨在推动前后端研发分离的效率小工具，方便前端（移动/PC/FE）同学在研发过程透过代理方便地查看请求数据/伪造数据/覆盖边界，结合接口设计可在前后端并行开发中通过数据伪造功能实现对API接口实现依赖的解耦，加速研发流程。

### Build Setup

``` bash
# install dependencies
yarn

# serve with hot reload at localhost:9080
yarn run dev

# build electron application for production
npm run build

if problem try electron-rebuild for sqlite3.

```

### ***主体产品功能开发roadmap***
---
+ #### 工程框架重构 
    - 引入Typescript+Vuejs+ElementUI作为应用构建主体 :ok_hand: :heavy_check_mark:
    - 优化electron-vue脚手架，去除无用js向前兼容组件依赖 :ok_hand: :heavy_check_mark:
    - 优化webpack hot deploy在windows/mac环境下的重启实现 :ok_hand: :heavy_check_mark:
    - 升级Electron版本至8.1.0 :ok_hand: :heavy_check_mark:

+ #### 请求代理 2020.02.18
    - 主体功能实现，UI界面重绘 :ok_hand: :heavy_check_mark:
    - 主进程业务逻辑拆分： :ok_hand: :heavy_check_mark:

        由LocalServer拆分为ProxyService、MockService、PushService、WebService，服务依赖如下：
        > <kbd>LocalServer</kbd>
        >
        > <kbd>ProxyService </kbd>       <kbd>WebService</kbd>
        >
        > <kbd>PushService</kbd>  <kbd>MockService</kbd>
    
+ #### 数据伪造/本地化管理 2020.03.19
    + 引入PouchDB :ok_hand: :heavy_check_mark:
    + 完善MockService逻辑，增加延时设置支持 :ok_hand: :heavy_check_mark:
    + Mock数据管理页相关功能： 
        - 规则组创建/管理 :ok_hand: :heavy_check_mark:
        - 规则编辑/添加 :ok_hand: :heavy_check_mark:
        - 规则组代理开关 :ok_hand: :heavy_check_mark:
        - 规则组数据云备份/共享 :fist: :heavy_check_mark:

+ #### 设置面板 :clock3:
    + 多网卡IP选择 :clock3: :soon:
    + 本地服务端口自定义 :clock3: :x:

+ #### 数据模型测试数据自动化生成 :clock3: :x:

+ #### 多数据协议支撑 :clock3:
    + JSON :ok_hand: :heavy_check_mark:
    + protobuf :clock3: :x:
    + thrift :clock3: :x:
    + 私有协议plugin支撑 :clock3: :x: