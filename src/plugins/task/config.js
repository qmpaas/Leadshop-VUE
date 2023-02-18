import Layout from './layout.vue';

export default {
  version: '1.0.0',
  path: '/plugins/details',
  component: Layout,
  hidden: true,
  name: 'task',
  meta: {
    title: '积分商城',
    parentMenu: '/plugins/plugins'
  },
  children: [
    {
      path: '/plugins/task/index',
      component: () => import(/* webpackChunkName: "plugins/tools/task/index" */ '@/plugins/task/index'),
      meta: {
        title: '积分商品',
        keepAlive: false,
        activeMenu: '/plugins/tools',
        parentMenu: '/plugins/plugins'
      }
    },
    {
      path: '/plugins/task/add',
      component: () => import(/* webpackChunkName: "plugins/tools/task/add" */ '@/plugins/task/add'),
      hidden: true,
      meta: {
        title: '添加商品',
        keepAlive: false,
        activeMenu: '/plugins/tools',
        parentMenu: '/plugins/plugins',
        extendMenu: '/plugins/task/index'
      }
    },
    {
      path: '/plugins/task/edit',
      component: () => import(/* webpackChunkName: "plugins/tools/task/edit" */ '@/plugins/task/edit'),
      hidden: true,
      meta: {
        title: '编辑商品',
        keepAlive: false,
        activeMenu: '/plugins/tools',
        parentMenu: '/plugins/plugins',
        extendMenu: '/plugins/task/index'
      }
    },
    {
      path: '/plugins/task/order',
      component: () => import(/* webpackChunkName: "plugins/tools/task/order" */ '@/plugins/task/order'),
      meta: {
        title: '兑换记录',
        keepAlive: false,
        activeMenu: '/plugins/tools',
        parentMenu: '/plugins/plugins'
      }
    },
    {
      path: '/plugins/task/record',
      component: () => import(/* webpackChunkName: "plugins/tools/task/record" */ '@/plugins/task/record'),
      meta: {
        title: '积分收支',
        keepAlive: false,
        activeMenu: '/plugins/tools',
        parentMenu: '/plugins/plugins'
      }
    },
    {
      path: '/plugins/task/setting',
      component: () => import(/* webpackChunkName: "plugins/tools/task/setting" */ '@/plugins/task/setting'),
      meta: {
        title: '基础设置',
        keepAlive: false,
        activeMenu: '/plugins/tools',
        parentMenu: '/plugins/plugins'
      }
    }
  ]
};
