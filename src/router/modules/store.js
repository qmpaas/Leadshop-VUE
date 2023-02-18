import Aside from '../../components/layout/aside';

export default {
  path: '/store/store',
  component: Aside, // Parent router-view
  name: 'store',
  meta: { title: '店铺' },
  redirect: '/store/color',
  children: [
    {
      path: '/store/color',
      component: () => import(/* webpackChunkName: "store-themeColor" */ '../../pages/store/themeColor'),
      name: 'store_themeColor',
      meta: {
        keepAlive: true,
        title: '主题色',
        parentMenu: '/store/store',
        icon: 'le-icon-zhutise'
      }
    },
    {
      path: '/store/index',
      component: () => import(/* webpackChunkName: "store-index" */ '../../pages/store/store'),
      name: 'store_index',
      meta: {
        keepAlive: true,
        title: '店铺首页',
        parentMenu: '/store/store',
        icon: 'le-icon-home'
      }
    },
    {
      path: '/finish/tabbar',
      component: () => import(/* webpackChunkName: "finish-tabbar" */ '../../pages/tabbar/index.vue'),
      name: 'finish_tabbar',
      meta: {
        keepAlive: true,
        title: '底部导航',
        parentMenu: '/store/store',
        icon: 'le-icon-bottom'
      }
    },
    {
      path: '/finish/index',
      component: () => import(/* webpackChunkName: "finish-index" */ '../../pages/pages/index'),
      name: 'finish_index',
      meta: {
        keepAlive: true,
        title: '微页面',
        parentMenu: '/store/store',
        icon: 'le-icon-pages'
      }
    },
    {
      path: '/finish/float-window',
      component: () => import(/* webpackChunkName: "finish-floatWindow" */ './../../pages/store/float-window.vue'),
      name: 'finish_index',
      meta: {
        keepAlive: true,
        title: '悬浮窗',
        parentMenu: '/store/store',
        icon: 'le-icon-dianpu-xuanfuchuang'
      }
    },
    {
      path: '/finish/screen',
      component: () => import(/* webpackChunkName: "finish-screen" */ '../../pages/store/screen'),
      name: 'finish_screen',
      meta: {
        keepAlive: true,
        title: '开屏广告',
        parentMenu: '/store/store',
        icon: 'le-icon-dianpu-kaipingguanggao'
      }
    }
  ]
};
