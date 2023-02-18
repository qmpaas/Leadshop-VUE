const plugins = {
  namespaced: true,
  state: {
    /**
     * 插接列表信息
     * @type {Boolean}
     */
    pluginsList: {}
  },
  mutations: {
    /**
     * 设置插件列表数据
     * @param {[type]} state [description]
     * @param {[type]} data  [description]
     */
    setPlugins(state, data) {
      state.pluginsList = data;
    }
  },
  getters: {
    /**
     * 判断是否安装
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    is_install: state => name => {
      return state.todos.find(todo => todo.name === name);
    },
    /**
     * 获取插件配置信息
     * @param  {[type]} state) [description]
     * @return {[type]}        [description]
     */
    manifest:
      state =>
      (name, keys = '') => {
        if (state.pluginsList[name]) {
          if (keys) {
            return state.pluginsList[name][keys];
          } else {
            return state.pluginsList[name];
          }
        } else {
          return false;
        }
      }
  },
  actions: {
    /**
     * 读取异步配置信息
     * @param  {[type]} options.commit [description]
     * @return {[type]}                [description]
     */
    getPlugins: function ({ commit }) {
      let $heshop = this._vm.$heshop;
      $heshop
        .plugin('get', { include: 'empty', model: 'empty' })
        .then(function (res) {
          commit('setPlugins', res);
        })
        .catch(function (err) {
          console.error(err);
        });

      // let $storageKey = 'ndfWxbOhLIIHVZeR';
      // if (localStorage.getItem($storageKey)) {
      //   let data = localStorage.getItem($storageKey);
      //   commit('setPlugins', JSON.parse(data));
      // } else {
      //   $heshop
      //     .plugin('get', { include: 'empty', model: 'empty' })
      //     .then(function(res) {
      //       commit('setPlugins', res);
      //       localStorage.setItem($storageKey, JSON.stringify(res));
      //     })
      //     .catch(function() {
      //     });
      // }
    },
    /**
     * 商品购物
     * @return {[type]} [description]
     */
    onGoods: function ({ commit }) {},
    /**
     * 完成下单
     * @return {[type]} [description]
     */
    onOrder: function ({ commit }) {},
    /**
     * 每日签到
     * @return {[type]} [description]
     */
    onSignin: function ({ commit }) {},
    /**
     * 连续签到
     * @return {[type]} [description]
     */
    onSustain: function ({ commit }) {},
    /**
     * 分享转发
     * @return {[type]} [description]
     */
    onShare: function ({ state, commit }) {
      let config = state.pluginsList['task']['share'];
      let $heshop = this._vm.$heshop;
      return new Promise((resolve, reject) => {
        $heshop
          .plugin(
            'post',
            { include: 'task', model: 'task' },
            {
              number: 1,
              keyword: 'share'
            }
          )
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /**
     * 商品浏览
     * @return {[type]} [description]
     */
    onBrowse: function ({ state, commit }) {
      let config = state.pluginsList['task']['share'];
      let $heshop = this._vm.$heshop;
      return new Promise((resolve, reject) => {
        $heshop
          .plugin(
            'post',
            { include: 'task', model: 'task' },
            {
              number: 1,
              keyword: 'browse'
            }
          )
          .then(res => {
            resolve(res);
          })
          .catch(err => {
            reject(err);
          });
      });
    },
    /**
     * 要求好友
     * @return {[type]} [description]
     */
    onInvite: function () {},
    /**
     * 完善信息
     * @return {[type]} [description]
     */
    onPerfect: function () {},
    /**
     * 绑定手机
     * @return {[type]} [description]
     */
    onBinding: function () {}
  }
};

export default plugins;
