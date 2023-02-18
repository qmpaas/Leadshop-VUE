export default {
  namespaced: true,
  state: {
    store_setting: {},
    basic_setting: {},
    goods_setting: {},
    trade_setting: {},
    store_storage: {},
    user_setting: {},
    copyright_information: {},
    version: null,
    auth: false,
    isAuth: false
  },
  mutations: {
    setStore: function (state, data) {
      state.store_setting = data;
    },
    setStorage: function (state, data) {
      state.store_storage = data;
    },
    setBasic: function (state, data) {
      state.basic_setting = data;
    },
    setGoods: function (state, data) {
      state.goods_setting = data;
    },
    setUser: function (state, data) {
      state.user_setting = data;
    },
    setTrade: function (state, data) {
      state.trade_setting = data;
    },
    setCopyright(state, data) {
      state.copyright_information = data;
    },
    setIsAuth(state, data) {
      state.isAuth = data;
    }
  },
  getters: {
    getStore: function (state) {
      return state.store_setting;
    },
    getBasic: function (state) {
      return state.basic_setting;
    },
    getStorage: function (state) {
      return state.store_storage;
    },
    getGoods: function (state) {
      return state.goods_setting;
    },
    getUser: function (state) {
      return state.user_setting;
    },
    getTrade: function (state) {
      return state.trade_setting;
    },
    getVersion: function (state) {
      return state.version;
    },
    getAuth(state) {
      return state.auth;
    },
    getCopyright(state) {
      return state.copyright_information;
    }
  },
  actions: {
    getSettingInfo({ commit }) {
      let $heshop = this._vm.$heshop;
      new Promise(function (resolve, reject) {
        $heshop
          .search(
            'post',
            {
              include: 'setting'
            },
            {
              keyword: 'setting_collection'
            }
          )
          .then(function (res) {
            let { basic_setting, goods_setting, store_setting, trade_setting, user_setting } = res.content;
            if (!store_setting.logo) {
              store_setting.logo = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/home.png';
            }
            commit('setStore', store_setting);
            commit('setBasic', basic_setting);
            commit('setGoods', goods_setting);
            commit('setUser', user_setting);
            commit('setTrade', trade_setting);
          });
      });
      new Promise(function (resolve, reject) {
        $heshop
          .search(
            'post',
            {
              include: 'setting'
            },
            {
              keyword: 'storage_limit'
            }
          )
          .then(function (res) {
            if (res) {
              commit('setStorage', res.content);
            }
          });
      });
      new Promise(function (resolve, reject) {
        $heshop
          .search(
            'post',
            {
              include: 'setting'
            },
            {
              keyword: 'copyright_information'
            }
          )
          .then(function (res) {
            if (res) {
              commit('setCopyright', res.content);
            }
          });
      });
    },
    getVersion: function ({ state, commit }) {
      let $heshop = this._vm.$heshop;
      $heshop
        .cloud('get')
        .then(function (res) {
          state.version = res.version.next_version;
          state.auth = res.auth;
          commit('setIsAuth', true);
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  }
};
