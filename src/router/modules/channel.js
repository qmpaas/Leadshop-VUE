import Aside from '../../components/layout/aside';
import Layout from '../../components/layout/layout';

export default {
  path: '/channel/channel',
  component: Aside,
  name: 'channel',
  meta: { title: '渠道' },
  redirect: '/channel/weChat-info',
  children: [
    {
      path: '/channel/weChat-info',
      component: Layout,
      meta: {
        keepAlive: true,
        title: '公众号',
        parentMenu: '/channel/channel',
        icon: 'le-icon-weixin2'
      },
      children: [
        {
          path: '/channel/weChat-info',
          component: () => import(/* webpackChunkName: "channel/weChatInfo" */ '../../pages/channel/weChat-info'),
          meta: {
            title: '信息配置',
            parentMenu: '/channel/channel'
          }
        },
        {
          path: '/channel/weChat-pay',
          component: () => import(/* webpackChunkName: "channel/weChatPay" */ '../../pages/channel/weChat-pay'),
          meta: {
            keepAlive: true,
            title: '支付配置',
            parentMenu: '/channel/channel'
          }
        },
        {
          path: '/channel/weChat-deploy',
          component: () => import(/* webpackChunkName: "channel/weChatDeploy" */ '../../pages/channel/weChat-deploy'),
          hidden: true,
          meta: {
            keepAlive: true,
            title: '公众号',
            parentMenu: '/channel/channel'
          }
        }
      ]
    },
    {
      path: '/channel/applets-info',
      component: Layout,
      meta: {
        keepAlive: true,
        title: '小程序',
        parentMenu: '/channel/channel',
        icon: 'le-icon-xiaochengxu'
      },
      children: [
        {
          path: '/channel/applets-info',
          component: () => import(/* webpackChunkName: "channel/appletsInfo" */ '../../pages/channel/applets-info'),
          meta: {
            title: '信息配置',
            parentMenu: '/channel/channel'
          }
        },
        {
          path: '/channel/applets-pay',
          component: () => import(/* webpackChunkName: "channel/appletsPay" */ '../../pages/channel/applets-pay'),
          meta: {
            keepAlive: true,
            title: '支付配置',
            parentMenu: '/channel/channel'
          }
        }
      ]
    }
  ]
};
