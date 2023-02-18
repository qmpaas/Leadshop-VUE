import Aside from '../../components/layout/aside';

export default {
  path: '/users/users',
  component: Aside, // Parent router-view
  name: 'users',
  meta: { title: '用户' },
  redirect: '/users/index',
  children: [
    {
      path: '/users/index',
      component: () => import(/* webpackChunkName: "users/users" */ '../../pages/users/users'),
      name: 'users_index',
      meta: {
        keepAlive: true,
        title: '用户管理',
        parentMenu: '/users/users',
        icon: 'le-icon-user-manage'
      }
    },
    {
      path: '/users/userLabel',
      component: () => import(/* webpackChunkName: "users/userLabel" */ '../../pages/users/userLabel'),
      name: 'users_label',
      meta: {
        keepAlive: true,
        title: '用户标签',
        parentMenu: '/users/users',
        icon: 'le-icon-yonghu-biaoqian'
      }
    },
    {
      path: '/users/usersExportHistory',
      component: () =>
        import(/* webpackChunkName: "users/usersExportHistory" */ '../../pages/users/usersExportHistory'),
      name: 'users_usersExportHistory',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '导出记录',
        parentMenu: '/users/users',
        activeMenu: '/users/index',
        icon: ''
      }
    },
    {
      path: '/users/user/:id',
      component: () => import(/* webpackChunkName: "users/userData" */ '../../pages/users/userData'),
      name: 'users_userData',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '用户详情',
        parentMenu: '/users/users',
        activeMenu: '/users/index',
        hidden: true,
        icon: 'le-icon-user-manage'
      }
    },
    {
      path: '/users/editLabel',
      component: () => import(/* webpackChunkName: "users/editLabel" */ '../../pages/users/editLabel'),
      name: 'users_editLabel',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '用户详情',
        parentMenu: '/users/users',
        activeMenu: '/users/userLabel',
        hidden: true,
        icon: 'le-icon-user-manage'
      }
    }
  ]
};
