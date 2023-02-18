import Vue from 'vue';
import Vuex from 'vuex';
import account from './account.js';
import finish from './finish.js';
import photo from './photo.js';
import picture from './picture.js';
import video from './video.js';
import goods from './goods.js';
import setting from './setting';
import menus from './menus';

import plugins from './plugins';
import liveGoods from './liveGoods';

import getters from './getters.js';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { account, finish, picture, photo, video, goods, setting, menus, plugins, liveGoods },
  state: {},
  mutations: {},
  actions: {},
  getters: getters
});
