import Vue from 'vue'
import Router from 'vue-router'

import Mock from '@/page/Mock'
import MockSetting from "@/page/MockSetting"
import Guide from '@/page/Guide'

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: Mock,
            meta: {
                keepAlive: true
            }
        },
        {
            path: '/mockSetting',
            name: 'mock-setting',
            component: MockSetting,
            meta: {
                keepAlive: false
            }
        },
        {
            path: '/mockGuide',
            name: 'mock-guide',
            component: Guide,
            meta: {
                keepAlive: false
            }
        }
    ]
})
