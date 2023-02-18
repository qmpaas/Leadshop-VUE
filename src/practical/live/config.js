import Layout from './layout.vue';

export default {
  version: '1.0.0',
  path: '/plugins/details',
  component: Layout,
  hidden: true,
  name: 'integral',
  meta: {
    title: '小程序直播',
    parentMenu: '/plugins/plugins'
  },
  children: [
    {
      path: '/practical/live/index',
      component: () => import(/* webpackChunkName: "plugins/practical/live/index" */ '@/practical/live/index'),
      name: 'live-index',
      meta: {
        title: '直播间',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        hidden: false
      }
    },
    {
      path: '/practical/live/liveGoods',
      name: 'live-demo',
      component: () => import(/* webpackChunkName: "plugins/practical/live/liveGoods" */ '@/practical/live/liveGoods'),
      meta: {
        title: '直播商品',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        hidden: false
      }
    },
    {
      path: '/practical/live/createRoom',
      name: 'live-create-room',
      component: () =>
        import(/* webpackChunkName: "plugins/practical/live/createRoom" */ '@/practical/live/createRoom'),
      meta: {
        title: `创建直播间`,
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        hidden: true,
        extendMenu: '/practical/live/index',
        editor: 'roomid'
      }
    },
    {
      path: '/practical/live/addGood',
      name: 'live-create-room',
      component: () => import(/* webpackChunkName: "plugins/practical/live/addGood" */ '@/practical/live/addGood'),
      meta: {
        title: '添加商品',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        hidden: true,
        extendMenu: '/practical/live/index'
      }
    },
    {
      path: '/practical/live/addLiveGood',
      name: 'live-create-room',
      component: () =>
        import(/* webpackChunkName: "plugins/practical/live/addLiveGood" */ '@/practical/live/addLiveGood'),
      meta: {
        title: '添加直播商品',
        keepAlive: false,
        activeMenu: '/plugins/practical',
        parentMenu: '/plugins/plugins',
        hidden: true,
        extendMenu: '/practical/live/liveGoods'
      }
    }
  ]
};
