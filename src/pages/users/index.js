/*
 * @Author: qinuoyun
 * @Date:   2020-09-08 10:12:19
 * @Last Modified by:   qinuoyun
 * @Last Modified time: 2021-06-21 14:40:12
 */
import Heshop from '@/leadshop/index.js';
//加载页面
import users from './users.vue';
import userData from './userData.vue';
import usersExportHistory from './usersExportHistory.vue';
import modifyMobile from '@/pages/users/components/modifyMobile.vue';
import modifyRealname from '@/pages/users/components/modifyRealname.vue';
import chooseUser from './components/chooseUser.vue';
import chooseLabel from './components/chooseLabel';
import chooseCoupon from './components/chooseCoupon.vue';
import couponRecord from './components/couponRecord';
//初始化变量
let modules = {};
modules.install = function () {
  //添加设置界面
  Heshop.component('users', 'index', users);
  Heshop.component('users', 'userData', userData);
  Heshop.component('users', 'usersExportHistory', usersExportHistory);
  Heshop.component('users', 'modifyMobile', modifyMobile);
  Heshop.component('users', 'modifyRealname', modifyRealname);
  Heshop.component('users', 'chooseUser', chooseUser);
  Heshop.component('users', 'chooseLabel', chooseLabel);
  Heshop.component('users', 'chooseCoupon', chooseCoupon);
  Heshop.component('users', 'couponRecord', couponRecord);
};
export default modules;
