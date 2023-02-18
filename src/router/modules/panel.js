export default {
  path: '/panel/index',
  name: 'panel',
  meta: {
    parentMenu: '/panel/index',
    title: '首页',
    index: '1'
  },
  component: () => import(/* webpackChunkName: "panel/index" */ '../../pages/panel/index.vue')
};
