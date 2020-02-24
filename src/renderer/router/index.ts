import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const originalReplace = Router.prototype.replace;
Router.prototype.replace = function replace(location) {
    return originalPush.call(this, location).catch(err => err);
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
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/mockRuleMgr',
            name: 'MockRuleMgr',
            component: require('@/page/MockRuleMgr').default,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/settings',
            name: 'Settings',
            component: require('@/page/Settings').default,
            meta: {
                keepAlive: true
            }
        }
    ]
})
