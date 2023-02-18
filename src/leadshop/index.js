import { install } from './install';
import storeMap from './store';
import utils from './utils';
import cloud from './utils/cloud.js';
import api from './utils/api.js';
import Vue from 'vue';

var components = {};

export default class heshop {
  /**
   * 组建列表
   * @type {Object}
   */
  components = {};
  /**
   * 初始化安装器
   * @return {[type]} [description]
   */
  static install() {}

  /**
   * 插件处理
   * @param  {[type]} files [description]
   * @return {[type]}       [description]
   */
  static plugin(files) {
    this.files = files;
  }

  /**
   * 处理Vuex
   * @param  {[type]} route [description]
   * @return {[type]}       [description]
   */
  static store(StoreMap = {}, getterMap = {}) {
    return storeMap(StoreMap, getterMap);
  }

  /**
   * 处理Vuex
   * @param  {[type]} route [description]
   * @return {[type]}       [description]
   */
  static layout(options) {
    if (options.layout) {
      heshop.component('__QNYUN__', '__layout', options.layout);
    }
    if (options.layout) {
      heshop.component('__QNYUN__', '__login', options.login);
    }
    if (options.layout) {
      heshop.component('__QNYUN__', '__home', options.home);
    }
  }

  static component(id, name, component = '') {
    if (id == 'components') {
      Vue.component(name, component);
    } else {
      let key = id + '_' + name;
      if (id && name && component) {
        components[key] = component;
      }
      if (id && name && component == '') {
        return components[key] || false;
      }
    }
  }

  /**
   * 错误处理
   * @return {[type]} [description]
   */
  static error() {}

  /**
   * 数据库初始化，并取得数据库类实例
   * @access public
   * @param  mixed       config 连接配置
   * @param  bool|string name   连接标识 true 强制重新连接
   * @return Connection
   * @throws Error
   */
  static connect(config = {}) {
    try {
      if (config.AppID == '') {
        throw new Error('AppID不能为空');
      }
      if (config.AppSecret == '') {
        throw new Error('AppSecret不能为空');
      }
      if (config.AppName == '') {
        throw new Error('AppSecret不能为空');
      }
      if (config.AuthSign == '') {
        config.AuthSign = false;
      }
      if (config.AppURL == '') {
        throw new Error('AppURL不能为空');
      }
      if (!config.AppConfig) {
        config.AppConfig = {
          whiteList: null,
          autoToken: null,
          defaultRoute: null
        };
      }
      if (!this.instance) {
        this.instance = [];
      }
      if (this.instance.indexOf(config.AppID) == -1) {
        this.instance[config.AppID] = this.get_proxy(config);
      }
      this.config = config;
      return this.instance[config.AppID];
    } catch (error) {
      console.error('请求报错提示', error);
    }
  }

  /**
   * 异步获取对应应用
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  static get_proxy(config) {
    var _Proxy = new Proxy(new cloud(config, this), {
      _upload: false,
      _validator: {},
      //此处不能使用()=> 否者会导致get方法内的this指向为basics从而this._validator获取失败
      get: function (target, property, receiver) {
        if (property in target) {
          return target[property];
        } else {
          if (property == 'then') {
            //获取所有参数值
            let data = null;
            //如果为文件类型则重置-否则文件无法上传
            if (this._upload) {
              data = this._validator;
              this._upload = false;
            } else {
              data = utils.copyData(this._validator);
            }
            //清空
            this._validator = {};
            //执行最终操作
            return argument => {
              //执行操作 receiver等于当前new cloud()实例
              let returned = new Promise((reslove, reject) => {
                new api(data, receiver)
                  .then(value => {
                    reslove(value);
                  })
                  .catch(error => {
                    reject(error);
                  });
              });
              //处理前置数据
              return returned.then(reverse => {
                return argument(reverse);
              });
            };
          } else if (property) {
            let self = this;
            if (property == 'upload') {
              self._upload = true;
            }
            if (property == 'file') {
              self._upload = true;
            }
            if (property == 'video') {
              self._upload = true;
            }
            //此处匿名函数不能使用()=>,会导致内部arguments指向的是上一层
            return function () {
              self._validator[property] = arguments || '';
              return _Proxy;
            };
          }
        }
      }
    });
    return _Proxy;
  }
}

heshop.install = install;
heshop.version = '0.0.2';

if (utils.inBrowser() && window.Vue) {
  window.Vue.use(heshop);
}
