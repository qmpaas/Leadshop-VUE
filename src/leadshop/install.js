import Vuex from 'vuex';
import popups from './popups/index.js';
import auth from './utils/auth.js';
import link from './components/link/index.vue';
import icon from './components/icon/index.vue';

export let _Vue;

export function install(Vue) {
  if (install.installed && _Vue === Vue) {
    return;
  }
  install.installed = true;
  _Vue = Vue;
  //加载状态管理器
  Vue.use(Vuex);
  //加载组件
  Vue.component('heLink', link);
  //设置图标
  Vue.component('heIcon', icon);
  //处理弹窗指令
  Vue.directive('popup', popups.popup);
  //处理权限指令
  Vue.directive('auth', auth.auth);
  /**
   * 删除多余数据
   * @param  {[type]} str   [description]
   * @param  {String} value [description]
   * @return {[type]}       [description]
   */
  function ltrim(str, value = ' ') {
    str = str.toString();
    let leng = value.length;
    if (leng < 1) {
      return str;
    }
    let init = str.slice(0, leng);
    if (init == value) {
      return str.slice(leng);
    } else {
      return str;
    }
  }

  /**
   * 获取跳转链接，用于新开页跳转
   * @param  {[type]} item [description]
   * @return {[type]}      [description]
   */
  function getMenusLink(value) {
    let href = ltrim(value, '/');
    href = href.split('/');
    return {
      module: href[0],
      page: href[1]
    };
  }

  //处理扩展函数
  Vue.mixin({
    /**
     * 初始化权限信息
     * @return {[type]} [description]
     */
    beforeCreate() {
      if (this.$options.authorize) {
      }
    },
    methods: {
      /**
       * 路由跳转
       * @param  {[type]} href  [description]
       * @param  {Object} query [description]
       * @return {[type]}       [description]
       */
      $navigateTo(path, query = {}) {
        return this.$router.push({ path, query });
      },
      /**
       * 操作权限校验
       * @param check 需要校验的操作名
       * @param type 校验类型，通过 permission 校验，还是通过 role 校验。
       * 如未设置，则自动识别，如匹配到当前路由 permission 则 type = permission，否则 type = role
       * @returns {boolean} 是否校验通过
       */
      $auth(check, type) {}
    }
  });
}
