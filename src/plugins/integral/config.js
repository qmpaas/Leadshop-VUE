/*
 * @Author: qinuoyun
 * @Date:   2021-04-20 16:04:27
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2021-04-20 16:51:35
 */
import Layout from './layout.vue'

export default {
    version: '1.0.0',
    path: '/plugins/details',
    component: Layout,
    hidden: true,
    name: 'integral',
    meta: {
        title: '积分商城',
        parentMenu: '/plugins/plugins',
    },
    children: [{
        path: '/plugins/integral/index',
        component: () => import('@/plugins/integral/index'),
        hidden: true,
        meta: {
            title: '积分商城1',
            keepAlive: true,
            activeMenu: '/plugins/tools',
            parentMenu: '/plugins/plugins'
        }
    }, {
        path: '/plugins/integral/demo',
        component: () => import('@/plugins/integral/demo'),
        hidden: true,
        meta: {
            title: '积分商城2',
            keepAlive: true,
            activeMenu: '/plugins/tools',
            parentMenu: '/plugins/plugins'
        }
    }, {
        path: '/plugins/integral/test',
        component: () => import('@/plugins/integral/test'),
        hidden: true,
        meta: {
            title: '积分商城3',
            keepAlive: true,
            activeMenu: '/plugins/tools',
            parentMenu: '/plugins/plugins'
        }
    }]
}