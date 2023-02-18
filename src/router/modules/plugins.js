import Aside from '../../components/layout/aside';
import task from '../../plugins/task/config';
import coupon from '../../features/coupon/config';
import live from '../../practical/live/config';
import evaluation from '../../practical/evaluation/config';

export default {
  path: '/plugins/plugins',
  component: Aside, // Parent router-view
  name: 'plugins',
  meta: { title: '应用' },
  redirect: '/plugins/features',
  children: [
    {
      path: '/plugins/features',
      component: () => import(/* webpackChunkName: "plugins/features" */ '../../pages/plugins/features'),
      name: 'setup_features',
      meta: {
        keepAlive: true,
        title: '营销玩法',
        parentMenu: '/plugins/plugins',
        icon: 'le-icon-yingyong-yingxiaowanfa'
      }
    },
    {
      path: '/plugins/tools',
      component: () => import(/* webpackChunkName: "plugins/tools" */ '../../pages/plugins/tools'),
      name: 'plugins_tools',
      hidden: false,
      meta: {
        keepAlive: true,
        title: '用户维护',
        parentMenu: '/plugins/plugins',
        icon: 'le-icon-setup'
      }
    },
    {
      path: '/plugins/practical',
      component: () => import(/* webpackChunkName: "plugins/practical" */ '../../pages/plugins/practical'),
      name: 'plugins_tools',
      meta: {
        keepAlive: true,
        title: '实用工具',
        parentMenu: '/plugins/plugins',
        icon: 'le-icon-after-sales'
      }
    },
    {
      path: '/plugins/details',
      component: () => import(/* webpackChunkName: "plugins/details" */ '../../pages/plugins/details'),
      name: 'plugins_tools',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '详情',
        parentMenu: '/plugins/plugins',
        icon: 'le-icon-setup',
        activeMenu: '/plugins/tools'
      }
    },
    task,
    coupon,
    live,
    evaluation
  ]
};
