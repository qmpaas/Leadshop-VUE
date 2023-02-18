import Layout from '../../components/layout/layout';
import Aside from '../../components/layout/aside.vue';

export default {
  path: '/order/order',
  component: Aside, // Parent router-view
  name: 'order',
  meta: { title: '订单', index: '4' },
  redirect: '/order/index',
  children: [
    {
      path: '/order/index',
      component: () => import(/* webpackChunkName: "order/order-index" */ '../../pages/order/order'),
      name: 'order_index',
      meta: {
        keepAlive: true,
        title: '订单管理',
        parentMenu: '/order/order',
        icon: 'le-icon-orders',
        index: '4-1'
      }
    },
    {
      path: '/order/orderExportHistory',
      component: () =>
        import(/* webpackChunkName: "order/order-orderExportHistory" */ '../../pages/order/orderExportHistory.vue'),
      name: 'order_orderExportHistory',
      hidden: true,
      meta: {
        activeMenu: '/order/index',
        keepAlive: true,
        title: '导出记录',
        parentMenu: '/order/order',
        icon: ''
      }
    },
    {
      path: '/order/after',
      component: () => import(/* webpackChunkName: "order/order-after" */ '../../pages/order/after'),
      name: 'order_after',
      meta: {
        keepAlive: true,
        title: '售后管理',
        parentMenu: '/order/order',
        icon: 'le-icon-after-sales'
      }
    },
    {
      path: '/order/afterOrderExportHistory',
      component: () =>
        import(
          /* webpackChunkName: "order/order-afterOrderExportHistory" */ '../../pages/order/afterOrderExportHistory'
        ),
      name: 'order_afterOrderExportHistory',
      hidden: true,
      meta: {
        activeMenu: '/order/after',
        keepAlive: true,
        title: '导出记录',
        parentMenu: '/order/order',
        icon: ''
      }
    },
    {
      path: '/order/remark',
      component: () => import(/* webpackChunkName: "order/order-remark" */ '../../pages/order/remark'),
      name: 'order_remark',
      meta: {
        keepAlive: true,
        title: '评价管理',
        parentMenu: '/order/order',
        icon: 'le-icon-star-gray'
      }
    },
    {
      path: '/order/bulkShipping',
      component: () => import(/* webpackChunkName: "order/order-bulkShipping" */ '../../pages/order/bulkShipping'),
      name: 'order_bulkShipping',
      meta: {
        keepAlive: true,
        title: '批量发货',
        parentMenu: '/order/order',
        icon: 'le-icon-dingdan-piliangfahuo'
      }
    },
    {
      path: '/order/freightTemplate',
      component: Layout,
      meta: {
        keepAlive: true,
        title: '配送管理',
        parentMenu: '/order/order',
        icon: 'le-icon-distribution'
      },
      children: [
        {
          path: '/order/logisticsSettings',
          component: () =>
            import(/* webpackChunkName: "order/order-logisticsSettings" */ '../../pages/order/logisticsSettings'),
          name: 'order_logisticsSettings',
          hidden: false,
          meta: {
            keepAlive: true,
            subset: true,
            title: '物流设置',
            parentMenu: '/order/order'
          }
        },
        {
          path: '/order/waybill',
          component: () => import(/* webpackChunkName: "order/order-waybill" */ '../../pages/order/waybill.vue'),
          name: 'order_waybill',
          hidden: false,
          meta: {
            keepAlive: false,
            subset: true,
            title: '电子面单',
            parentMenu: '/order/order'
          }
        },
        {
          path: '/order/waybill-edit',
          component: () =>
            import(/* webpackChunkName: "order/order-waybillEdit" */ '../../pages/order/waybill-edit.vue'),
          name: 'order_waybillEdit',
          hidden: true,
          meta: {
            keepAlive: false,
            subset: true,
            title: '电子面单',
            parentMenu: '/order/order'
          }
        },
        {
          path: '/order/freightTemplate',
          component: () =>
            import(/* webpackChunkName: "order/order-freightTemplate" */ '../../pages/order/freightTemplate'),
          name: 'order_freightTemplate',
          hidden: false,
          meta: {
            keepAlive: true,
            subset: true,
            title: '运费模板',
            parentMenu: '/order/order'
          }
        },
        {
          path: '/order/shippingRules',
          component: () =>
            import(/* webpackChunkName: "order/goods-order-shippingRules" */ '../../pages/order/shippingRules'),
          name: 'order_shippingRules',
          hidden: false,
          meta: {
            keepAlive: true,
            subset: true,
            title: '包邮规则',
            parentMenu: '/order/order'
          }
        }
      ]
    },
    {
      path: '/order/afterDetail',
      component: () => import(/* webpackChunkName: "order/order-afterDetail" */ '../../pages/order/afterDetail'),
      name: 'order_afterDetail',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '售后订单详情',
        parentMenu: '/order/order',
        activeMenu: '/order/after',
        icon: 'le-icon-after-sales'
      }
    },
    {
      path: '/order/orderDetail',
      component: () => import(/* webpackChunkName: "order/order-orderDetail" */ '../../pages/order/orderDetail'),
      name: 'order_orderDetail',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '订单详情',
        parentMenu: '/order/order',
        activeMenu: '/order/index',
        icon: 'le-icon-star-gray'
      }
    },
    {
      path: '/order/freightPublish',
      component: () => import(/* webpackChunkName: "order/order-freightPublish" */ '../../pages/order/freightPublish'),
      name: 'order_freightPublish',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '新建模板',
        parentMenu: '/order/order',
        activeMenu: '/order/freightTemplate',
        icon: 'le-icon-star-gray'
      }
    },
    {
      path: '/order/shippingPublish',
      component: () =>
        import(/* webpackChunkName: "order/order-shippingPublish" */ '../../pages/order/shippingPublish'),
      name: 'order_shippingPublish',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '新建规则',
        parentMenu: '/order/order',
        activeMenu: '/order/shippingRules',
        icon: 'le-icon-star-gray'
      }
    }
  ]
};
