import Layout from './../../components/layout/layout.vue';
import Aside from './../../components/layout/aside.vue';
const index = () => import(/* webpackChunkName: "promoter/promoter-index" */ './../../pages/promoter/index.vue');
const recruit = () => import(/* webpackChunkName: "promoter-recruit" */ './../../pages/promoter/recruit.vue');
const indexDetail = () =>
  import(/* webpackChunkName: "promoter/promoter-index-detail" */ './../../pages/promoter/index-detail.vue');
const indexDetailList = () =>
  import(/* webpackChunkName: "promoter/promoter-index-detail-list" */ './../../pages/promoter/index-detail-list.vue');
const level = () => import(/* webpackChunkName: "promoter/promoter-level" */ './../../pages/promoter/level.vue');
const levelEditor = () =>
  import(/* webpackChunkName: "promoter/promoter-level-editor"*/ './../../pages/promoter/level-editor.vue');
const goods = () => import(/* webpackChunkName: "promoter/promoter-goods" */ './../../pages/promoter/goods.vue');
const order = () => import(/* webpackChunkName: "promoter/promoter-order" */ './../../pages/promoter/order.vue');
const withdraw = () =>
  import(/* webpackChunkName: "promoter/promoter-withdraw" */ './../../pages/promoter/withdraw.vue');
const material = () =>
  import(/* webpackChunkName: "promoter/promoter-material" */ './../../pages/promoter/material.vue');
const materialEdit = () =>
  import(/* webpackChunkName: "promoter/promoter-material-edit" */ './../../pages/promoter/material-edit.vue');
const leaderboard = () =>
  import(/* webpackChunkName: "promoter/promoter-leaderboard" */ './../../pages/promoter/leaderboard.vue');
const dynamic = () => import(/* webpackChunkName: "promoter/promoter-dynamic" */ './../../pages/promoter/dynamic.vue');
const dynamicEdit = () =>
  import(/* webpackChunkName: "promoter/promoter-dynamic-edit" */ './../../pages/promoter/dynamic-edit.vue');
const promoteSite = () =>
  import(/* webpackChunkName: "promoter/promoter-setup" */ './../../pages/promoter/promote-site.vue');
const settlementSite = () =>
  import(/* webpackChunkName: "promoter/promoter-settlement-site" */ './../../pages/promoter/settlement-site.vue');
const pageSite = () =>
  import(/* webpackChunkName: "promoter/promoter-page-site" */ './../../pages/promoter/page-site.vue');
const manual = () => import(/* webpackChunkName: "promoter/promoter-manual" */ './../../pages/promoter/manual.vue');

export default {
  path: '/promoter/promoter',
  component: Aside,
  name: 'promoter',
  meta: { title: '??????' },
  redirect: '/promoter/index',
  children: [
    {
      path: '/promoter/index',
      component: Layout,
      meta: {
        keepAlive: true,
        title: '?????????',
        parentMenu: '/promoter/promoter',
        icon: 'le-icon-qudao-maijiashenfen'
      },
      children: [
        {
          path: '/promoter/index',
          name: 'promoter-index',
          component: index,
          meta: {
            title: '????????????',
            parentMenu: '/promoter/promoter'
          }
        },
        {
          path: '/promoter/recruit',
          name: 'promoter-recruit',
          component: recruit,
          meta: {
            title: '????????????',
            parentMenu: '/promoter/promoter'
          }
        }
      ]
    },
    {
      path: '/promoter/index-detail/:id',
      name: 'promoter-index-detail',
      component: indexDetail,
      hidden: true,
      meta: {
        title: '???????????????',
        parentMenu: '/promoter/promoter',
        activeMenu: '/promoter/index'
      }
    },
    {
      path: '/promoter/index-detail-list',
      name: 'promoter-index-detail-list',
      component: indexDetailList,
      hidden: true,
      meta: {
        title: '???????????????',
        parentMenu: '/promoter/promoter',
        activeMenu: '/promoter/index'
      }
    },
    {
      path: '/promoter/level',
      name: 'promoter-level',
      component: level,
      meta: {
        keepAlive: true,
        title: '????????????',
        parentMenu: '/promoter/promoter',
        icon: 'le-icon-container'
      }
    },
    {
      path: '/promoter/level-editor',
      name: 'promoter-level-editor',
      component: levelEditor,
      hidden: true,
      meta: {
        title: '?????????????????????',
        parentMenu: '/promoter/promoter',
        activeMenu: '/promoter/level'
      }
    },
    {
      path: '/promoter/goods',
      name: 'promoter-goods',
      component: goods,
      meta: {
        keepAlive: true,
        title: '????????????',
        parentMenu: '/promoter/promoter',
        icon: 'le-icon-goods-tube'
      }
    },
    {
      path: '/promoter/order',
      name: 'promoter-order',
      component: order,
      meta: {
        keepAlive: true,
        title: '????????????',
        parentMenu: '/promoter/promoter',
        icon: 'le-icon-orders'
      }
    },
    {
      path: '/promoter/withdraw',
      name: 'promoter-withdraw',
      component: withdraw,
      meta: {
        keepAlive: true,
        title: '????????????',
        parentMenu: '/promoter/promoter',
        icon: 'le-icon-qudao-guanli-zhifupeizhi'
      }
    },
    {
      path: '/promoter/material',
      component: Layout,
      meta: {
        keepAlive: true,
        title: '????????????',
        parentMenu: '/promoter/promoter',
        icon: 'le-icon-share'
      },
      children: [
        {
          path: '/promoter/material',
          name: 'promoter-material',
          component: material,
          meta: {
            title: '????????????',
            parentMenu: '/promoter/promoter'
          }
        },
        {
          path: '/promoter/leaderboard',
          name: 'promoter-leaderboard',
          component: leaderboard,
          meta: {
            title: '?????????',
            parentMenu: '/promoter/promoter'
          }
        },
        {
          path: '/promoter/dynamic',
          name: 'promoter-dynamic',
          component: dynamic,
          meta: {
            title: '????????????',
            parentMenu: '/promoter/promoter'
          }
        },
        {
          path: '/promoter/material-edit',
          name: 'promoter-material-edit',
          component: materialEdit,
          hidden: true,
          meta: {
            title: '??????????????????',
            parentMenu: '/promoter/promoter',
            activeMenu: '/promoter/material'
          }
        },
        {
          path: '/promoter/dynamic-edit',
          name: 'promoter-dynamic-edit',
          component: dynamicEdit,
          hidden: true,
          meta: {
            title: '??????????????????',
            parentMenu: '/promoter/promoter',
            activeMenu: '/promoter/dynamic'
          }
        }
      ]
    },
    {
      path: '/promoter/setup',
      name: 'promoter-setup',
      component: Layout,
      meta: {
        keepAlive: true,
        title: '????????????',
        parentMenu: '/promoter/promoter',
        icon: 'le-icon-setup'
      },
      children: [
        {
          path: '/promoter/setup',
          name: 'promoter-setup',
          component: promoteSite,
          meta: {
            title: '????????????',
            parentMenu: '/promoter/promoter'
          }
        },
        {
          path: '/promoter/settlement-site',
          name: 'promoter-settlement-site',
          component: settlementSite,
          meta: {
            title: '????????????',
            parentMenu: '/promoter/promoter'
          }
        },
        {
          path: '/promoter/page-site',
          name: 'promoter-page-site',
          component: pageSite,
          meta: {
            title: '????????????',
            parentMenu: '/promoter/promoter'
          }
        },
        {
          path: '/promoter/manual',
          name: 'promoter-manual',
          component: manual,
          hidden: true,
          meta: {
            title: '?????????????????????',
            parentMenu: '/promoter/promoter',
            activeMenu: '/promoter/setup'
          }
        }
      ]
    }
  ]
};
