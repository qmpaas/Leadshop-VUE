export default {
  namespaced: true,
  state: {
    goodsData: [],
    pageInfo: {
      size: 7,
      total: 0,
      current: 1
    }
  },
  mutations: {
    /**
     * 设置图片
     * @param {[type]} state [description]
     * @param {[type]} data  [description]
     */
    setGoodsData(state, data) {
      state.goodsData = data;
    },
    /**
     * 设置分页
     * @param {[type]} state [description]
     * @param {[type]} data  [description]
     */
    setPageInfo(state, data) {
      state.pageInfo = data;
    }
  },
  actions: {
    /**
     * 登录
     * @param  {[type]} options.commit   [description]
     * @param  {[type]} options.userName [description]
     * @param  {[type]} options.password [description]
     * @return {[type]}                  [description]
     */
    handleGoods({ commit }, { current, keyword }) {
      keyword.tab_key = 'onsale';
      let $heshop = this._vm.$heshop;
      return new Promise((resolve, reject) => {
        $heshop
          .livegoods('GET', { status: 2, limit: 7, page: current })
          .then(data => {
            let total = data.total;
            commit('setPageInfo', { size: 7, total, current: current });
            commit('setGoodsData', data.list);
            resolve(data.list);
          })
          .catch(error => {
            console.error('错误提示', error);
            reject();
          });
      });
    },
    /**
     * [handleGoods description]
     * @param  {[type]} options.commit [description]
     * @return {[type]}                [description]
     */
    handleSearch() {
      return new Promise((resolve, reject) => {});
    }
  }
};
