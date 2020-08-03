import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch((err: any) => err);
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalPush.call(this, location).catch((err: any) => err);
};

export default new VueRouter({
    routes: [
        {
            path: '/'
        },
        {
            path: '/proxy',
            name: 'Proxy',
            component: require('@/page/Proxy').default,
        },
        {
            path: '/mockRuleMgr',
            name: 'MockRuleMgr',
            component: require('@/page/MockRuleMgr').default,
        },
        {
            path: '/spider',
            name: 'Spider',
            component: require('@/page/Spider').default,
        },
        {
            path: '/upupu',
            name: 'UpupU',
            component: require('@/page/UpupU').default,
        },
        {
            path: '/settings',
            name: 'Settings',
            component: require('@/page/Settings').default,
        }
    ]
})
