import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location: any) {
    return originalPush.call(this, location).catch((err: any) => err);
};

const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location: any) {
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
            component: require('../../common/page/BaseProxy').default,
        },
        {
            path: '/mockRuleMgr',
            name: 'MockRuleMgr',
            component: require('../../common/page/BaseMockRuleMgr').default,
        },
        {
            path: '/demo',
            name: 'Demo',
            component: require('@/page/Demo').default,
        }
    ]
})
