import Heshop from '@heshop/heshop.js';

//加载页面
import downLoad from './components/download.vue';

//初始化变量
let modules = {};

modules.install = function () {
  Heshop.component('tabbar', 'downLoad', downLoad);
};

export default modules;
