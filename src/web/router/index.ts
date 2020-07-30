import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location: any) {
    return originalPush.call(this, location).catch((err: any) => err);
};

const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location: any) {
    return originalPush.call(this, location).catch((err: any) => err);
};

export default new Router({
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
            component: require('../../common/page/BaseMockRuleMgr').default,
        }
    ]
})
