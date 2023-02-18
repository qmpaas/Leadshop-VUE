/*
 * @Author: qinuoyun
 * @Date:   2020-09-08 10:12:19
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2021-06-21 14:40:09
 */
import Heshop from '@/leadshop/index.js';

//加载页面
import panel from './index.vue';
import promote from '@/components/promote.vue';
import changePassword from '../../components/changePassword.vue';

//初始化变量
let modules = {};

modules.install = function () {
  //添加设置界面
  Heshop.component('index', 'index', panel);
  Heshop.component('goods', 'promote', promote);
  Heshop.component('index', 'changePassword', changePassword);
};

export default modules;
