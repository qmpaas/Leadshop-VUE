import Layout from './layout.vue';

export default {
  version: '1.0.0',
  path: '/practical/evaluation',
  component: Layout,
  hidden: true,
  name: 'evaluation',
  meta: {
    title: '评价助手',
    parentMenu: '/plugins/plugins'
  },
  children: [
    {
      path: '/practical/evaluation/index',
      component: () => import(/* webpackChunkName: "plugins/practical/evaluation/index" */ './index'),
      meta: {
        title: '商品列表',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins'
      }
    },
    {
      path: '/practical/evaluation/api-grab',
      component: () => import(/* webpackChunkName: "plugins/practical/evaluation/api-grab" */ './api-grab'),
      hidden: true,
      meta: {
        title: 'API抓取',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        extendMenu: '/practical/evaluation/index'
      }
    },
    {
      path: '/practical/evaluation/library-grab',
      component: () => import(/* webpackChunkName: "plugins/practical/evaluation/library-grab" */ './library-grab'),
      hidden: true,
      meta: {
        title: '评论库抓取',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        extendMenu: '/practical/evaluation/index'
      }
    },
    {
      path: '/practical/evaluation/view-reviews',
      component: () => import(/* webpackChunkName: "plugins/practical/evaluation/view-reviews" */ './view-reviews'),
      hidden: true,
      meta: {
        title: '查看评价',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        extendMenu: '/practical/evaluation/index'
      }
    },
    {
      path: '/practical/evaluation/stock',
      component: () => import(/* webpackChunkName: "plugins/practical/evaluation/stock" */ './stock'),
      meta: {
        title: '评价库',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins'
      }
    },
    {
      path: '/practical/evaluation/add-evaluation',
      component: () => import(/* webpackChunkName: "plugins/practical/evaluation/add-evaluation" */ './add-evaluation'),
      hidden: true,
      meta: {
        title: '添加评价',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        extendMenu: '/practical/evaluation/stock'
      }
    },
    {
      path: '/practical/evaluation/evaluation-list',
      component: () =>
        import(/* webpackChunkName: "plugins/practical/evaluation/evaluation-list" */ './evaluation-list'),
      hidden: true,
      meta: {
        title: '评价列表',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        extendMenu: '/practical/evaluation/stock'
      }
    }
  ]
};
