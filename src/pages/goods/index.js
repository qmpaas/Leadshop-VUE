/*
 * @Author: qinuoyun
 * @Date:   2020-09-08 10:12:19
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2021-06-23 09:26:43
 */
import Heshop from '@/leadshop/index.js';

//加载页面

import confirmPopup from './components/confirmPopup.vue';
import chooseGroup from './components/chooseGroup.vue';
import groupPromote from './components/groupPromote.vue';

import selectService from './components/selectService.vue';
import chooseCategory from './components/chooseCategory.vue';
import promote from '@/components/promote.vue';
import promotetask from '@/components/promotetask.vue';
import emptyPopup from './components/emptyPopup.vue';
import groupManual from './components/group-manual.vue';
import editName from './components/editName';
import chooseCoupon from './components/chooseCoupon';
import groupTemplate from './components/groupTemplate';
import selectGroupTemplate from './components/selectGroupTemplate';
import chooseParameterTemplate from './components/chooseParameterTemplate';
//初始化变量
let modules = {};

modules.install = function () {
  Heshop.component('goods', 'selectService', selectService);
  Heshop.component('goods', 'chooseCategory', chooseCategory);
  Heshop.component('goods', 'promote', promote);
  Heshop.component('goods', 'promotetask', promotetask);
  Heshop.component('goods', 'emptyPopup', emptyPopup);
  Heshop.component('goods', 'editName', editName);

  //添加设置界面
  Heshop.component('goods', 'role', confirmPopup);
  Heshop.component('goods', 'groupPromote', groupPromote);
  Heshop.component('goods', 'chooseGroup', chooseGroup);
  Heshop.component('goods', 'groupManual', groupManual);
  Heshop.component('goods', 'chooseCoupon', chooseCoupon);
  Heshop.component('goods', 'groupTemplate', groupTemplate);
  Heshop.component('goods', 'selectGroupTemplate', selectGroupTemplate);
  Heshop.component('goods', 'chooseParameterTemplate', chooseParameterTemplate);
};

export default modules;
