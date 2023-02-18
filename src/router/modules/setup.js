import Aside from '../../components/layout/aside';
import Layout from '../../components/layout/layout';

export default {
  path: '/setup/setup',
  component: Aside, // Parent router-view
  name: 'setup',
  meta: { title: '设置' },
  redirect: '/setup/index',
  children: [
    {
      path: '/setup/index',
      component: () => import(/* webpackChunkName: "setup/setup-index" */ '../../pages/setup/setup'),
      name: 'setup_index',
      meta: {
        keepAlive: true,
        title: '基础设置',
        parentMenu: '/setup/setup',
        icon: 'le-icon-setup'
      }
    },
    {
      path: '/setup/system',
      component: () => import(/* webpackChunkName: "setup/setup-system" */ '../../pages/setup/system'),
      name: 'setup_system',
      meta: {
        keepAlive: true,
        title: '系统设置',
        parentMenu: '/setup/setup',
        icon: 'le-icon-qudao-guanli'
      }
    },
    {
      path: '/setup/features',
      component: () => import(/* webpackChunkName: "setup/setup-features" */ '../../pages/setup/features'),
      name: 'setup_features',
      meta: {
        keepAlive: true,
        title: '功能相关',
        parentMenu: '/setup/setup',
        icon: 'le-icon-container'
      }
    },
    {
      path: '/setup/address',
      component: () => import(/* webpackChunkName: "setup/setup-address" */ '../../pages/setup/address'),
      name: 'setup_address',
      meta: {
        keepAlive: true,
        title: '退货地址',
        parentMenu: '/setup/setup',
        icon: 'le-icon-positioning'
      }
    },
    {
      path: '/setup/addressPublish',
      component: () => import(/* webpackChunkName: "setup/setup-addressPublish" */ '../../pages/setup/addressPublish'),
      name: 'setup_addressPublish',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '新增地址',
        parentMenu: '/setup/setup',
        icon: 'le-icon-addressPublish'
      }
    },
    {
      path: '/setup/smsRemind',
      component: Layout,
      name: 'setup_smsRemind',
      meta: {
        keepAlive: true,
        title: '消息提醒',
        parentMenu: '/setup/setup',
        icon: 'le-icon-message'
      },
      children: [
        {
          path: '/setup/smsRemind',
          component: () => import(/* webpackChunkName: "setup/setup-smsRemind" */ '../../pages/setup/smsRemind'),
          meta: {
            keepAlive: true,
            title: '短信',
            parentMenu: '/setup/setup'
          }
        },
        {
          path: '/setup/appletsRemind',
          component: () =>
            import(/* webpackChunkName: "setup/setup-appletsRemind" */ '../../pages/setup/appletsRemind'),
          meta: {
            keepAlive: true,
            title: '小程序',
            parentMenu: '/setup/setup'
          }
        },
        {
          path: '/setup/wechatRemind',
          component: () => import(/* webpackChunkName: "setup/setup-wechatRemind" */ '../../pages/setup/wechatRemind'),
          meta: {
            keepAlive: true,
            title: '公众号',
            parentMenu: '/setup/setup'
          }
        }
      ]
    }
  ]
};
