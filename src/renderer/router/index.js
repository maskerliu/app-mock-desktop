import Vue from 'vue'
import Router from 'vue-router'

import Mock from '@/page/Mock'
import MockConfig from "@/page/MockConfig";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'landing-page',
            component: Mock
        },
        {
            path: '/mockConfig',
            name: 'mock-config',
            component: MockConfig
        }
    ]
})
