export default {
  namespaced: true,
  state: {
    menuList: {}
  },
  mutations: {
    /**
     * 设置分类
     * @param {[type]} state [description]
     * @param {[type]} data  [description]
     */
    setmenuList(state, { key, data }) {
      state.menuList[key] = data;
    }
  }
};
