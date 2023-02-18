import Main from '../components/layout/main.vue';
import Package from '../components/layout/package.vue';
import promoter from './modules/promoter';
import setup from './modules/setup';
import order from './modules/order';
import users from './modules/users';
import goods from './modules/goods';
import panel from './modules/panel';
import plugins from './modules/plugins';
import store from './modules/store';
import channel from './modules/channel';

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * hidden: (false) 设为true后在左侧菜单不会显示该页面选项
 * alwaysShow 是否显示根级菜单
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 *  activeMenu:激活菜单
 * }
 */

export default [
  //下面是多级导航
  {
    path: '/',
    component: Main,
    redirect: '/panel/index',
    name: 'leadshop',
    children: [panel, goods, order, users, promoter, store, channel, plugins, setup]
  },
  {
    path: '/package',
    component: Package,
    name: 'package',
    meta: {
      title: '装修'
    },
    redirect: '/package/index',
    children: [
      {
        path: '/package/index',
        component: () => import(/* webpackChunkName: "package-index" */ '../pages/package/index'),
        name: 'package_index',
        meta: {
          title: '微页面',
          parentMenu: 'package',
          icon: ''
        }
      }
    ]
  },
  {
    path: '/changelog',
    component: () => import(/* webpackChunkName: "store/changelog" */ '../pages/store/changelog')
  },
  {
    path: '/update',
    component: () => import(/* webpackChunkName: "store/update" */ '../pages/store/update')
  },
  {
    path: '/login/index',
    name: 'login',
    meta: {
      title: 'Login - 登录'
    },
    component: () => import(/* webpackChunkName: "login/index" */ '../pages/login/index.vue')
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import(/* webpackChunkName: "error/401" */ '../pages/error/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import(/* webpackChunkName: "error/500" */ '../pages/error/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import(/* webpackChunkName: "error/404" */ '../pages/error/404.vue')
  }
];
