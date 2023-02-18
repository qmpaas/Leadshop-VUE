import Vuex from 'vuex';

const initStore = (StoreMap = {}, getterMap = {}) => {
  // 执行Vuex
  return new Vuex.Store({
    modules: StoreMap,
    state: {},
    mutations: {},
    actions: {},
    getters: getterMap
  });
};

export default initStore;
