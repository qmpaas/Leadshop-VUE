import Aside from '../../components/layout/aside';
import Layout from '../../components/layout/layout';

export default {
  path: '/goods/goods',
  component: Aside, // Parent router-view
  name: 'goods',
  meta: { title: '商品', index: '2' },
  redirect: '/goods/index',
  children: [
    {
      path: '/goods/index',
      component: () => import(/* webpackChunkName: "goods/index" */ '../../pages/goods/goods.vue'),
      name: 'goods_index',
      meta: {
        keepAlive: true,
        parentMenu: '/goods/goods',
        title: '商品管理',
        icon: 'le-icon-goods-tube',
        index: '2-1'
      }
    },
    {
      path: '/goods/create-goods',
      component: () => import(/* webpackChunkName: "goods/createGoods" */ '../../pages/goods/create-goods.vue'),
      name: 'goods_createGoods',
      meta: {
        keepAlive: true,
        title: '发布商品',
        parentMenu: '/goods/goods',
        icon: 'le-icon-share',
        index: '2-2'
      }
    },
    {
      path: '/goods/group',
      component: () => import(/* webpackChunkName: "goods/group" */ '../../pages/goods/group.vue'),
      name: 'goods_group',
      meta: {
        keepAlive: true,
        title: '商品分类',
        parentMenu: '/goods/goods',
        icon: 'le-icon-container',
        index: '2-3'
      }
    },
    {
      path: '/goods/groupTemplate',
      component: () => import(/* webpackChunkName: "goods/groupTemplate" */ '../../pages/goods/groupTemplate.vue'),
      name: 'goods_groupTemplate',
      meta: {
        keepAlive: true,
        title: '规格模板',
        parentMenu: '/goods/goods',
        icon: 'le-icon-shangpin-guige',
        index: '2-4'
      }
    },
    {
      path: '/goods/parameterTemplate',
      component: () =>
        import(/* webpackChunkName: "goods/parameterTemplate" */ '../../pages/goods/parameterTemplate.vue'),
      name: 'goods_parameterTemplate',
      meta: {
        keepAlive: true,
        title: '参数模板',
        parentMenu: '/goods/goods',
        icon: 'le-icon-shangpin-canshumoban',
        index: '2-9'
      }
    },
    {
      path: '/goods/parameterTemplateEdit',
      component: () =>
        import(/* webpackChunkName: "goods/parameterTemplateEdit" */ '../../pages/goods/parameterTemplateEdit.vue'),
      name: 'goods_parameterTemplateEdit',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '参数模板',
        parentMenu: '/goods/goods',
        icon: 'le-icon-shangpin-canshumoban',
        index: '2-9-1',
        activeMenu: '/goods/parameterTemplate'
      }
    },
    {
      path: '/goods/gallery',
      component: () => import(/* webpackChunkName: "goods/gallery" */ '../../pages/goods/gallery/index.vue'),
      name: 'goods_gallery',
      meta: {
        keepAlive: true,
        title: '素材管理',
        parentMenu: '/goods/goods',
        icon: 'le-icon-folder',
        index: '2-5'
      }
    },
    {
      path: '/goods/collect',
      component: Layout,
      meta: {
        title: '商品采集',
        parentMenu: '/goods/goods',
        icon: 'le-icon-shangpin-caiji',
        index: '2-6'
      },
      children: [
        {
          path: '/setup/interfaceSet',
          component: () => import(/* webpackChunkName: "goods/interfaceSet" */ '../../pages/setup/interfaceSet'),
          name: 'setup_interfaceSet',
          hidden: false,
          meta: {
            keepAlive: true,
            subset: true,
            title: '接口设置',
            parentMenu: '/goods/goods'
          }
        },
        {
          path: '/goods/collect/edit',
          component: () => import(/* webpackChunkName: "goods/collect-edit" */ '../../pages/goods/collect/edit'),
          name: 'goods_collect_edit',
          hidden: false,
          meta: {
            subset: true,
            title: '批量采集',
            parentMenu: '/goods/goods'
          }
        },
        {
          path: '/goods/collect/list',
          component: () => import(/* webpackChunkName: "goods/collect-list" */ '../../pages/goods/collect/list'),
          name: 'goods_collect_list',
          hidden: false,
          meta: {
            subset: true,
            title: '采集记录',
            parentMenu: '/goods/goods'
          }
        }
      ]
    },
    {
      path: '/goods/service',
      component: () => import(/* webpackChunkName: "goods/service" */ '../../pages/goods/service'),
      name: 'goods_service',
      meta: {
        keepAlive: true,
        title: '商品服务',
        parentMenu: '/goods/goods',
        icon: 'le-icon-service',
        index: '2-7'
      }
    },
    {
      path: '/goods/groupPublish',
      component: () => import(/* webpackChunkName: "goods/group-publish" */ '../../pages/goods/groupPublish'),
      name: 'goods_groupPublish',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '商品服务',
        parentMenu: '/goods/goods',
        icon: 'le-icon-groupPublish',
        activeMenu: '/goods/group',
        index: '2-8'
      }
    },
    {
      path: '/goods/servicePublish',
      component: () => import(/* webpackChunkName: "goods/service-publish" */ '../../pages/goods/servicePublish'),
      name: 'goods_servicePublish',
      hidden: true,
      meta: {
        keepAlive: true,
        title: '商品服务',
        parentMenu: '/goods/goods',
        icon: 'le-icon-servicePublish',
        activeMenu: '/goods/service',
        index: '2-8-1'
      }
    },
    {
      path: '/goods/goodsExportHistory',
      component: () =>
        import(/* webpackChunkName: "goods/goodsExportHistory" */ '../../pages/goods/goodsExportHistory'),
      name: 'goods_goodsExportHistory',
      hidden: true,
      meta: {
        activeMenu: '/goods/index',
        keepAlive: true,
        title: '导出记录',
        parentMenu: '/goods/goods',
        icon: 'le-icon-goodsExportHistory'
      }
    }
  ]
};
