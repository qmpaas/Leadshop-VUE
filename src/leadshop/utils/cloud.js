import request from './request';
import listToTree from './listToTree.js';
import utils from './utils.js';
import Cookie from 'js-cookie';

class cloud {
  //构造函数
  constructor(config, self) {
    this.self = self;
    this.utils = utils;
    this.AppID = config.AppID;
    this.AppName = config.AppName;
    this.AppAlias = config.AppAlias || '';
    this.AppURL = config.AppURL;
    this.AppConfig = this.extend(
      {
        whiteList: null,
        pagination: 'header',
        autoToken: null,
        defaultRoute: null,
        loginURL: null,
        loginPage: '/login',
        loginReset: null
      },
      config.AppConfig
    );
    this.AppSecret = config.AppSecret;
    this.AuthSign = config.AuthSign || false;
    this.authorization = true;
    this.server = request(this, self.instance);
  }

  /**
   * 获取Token
   * @param  {[type]} files [description]
   * @return {[type]}       [description]
   */
  getToken() {
    return Cookie.get('token') || '';
  }

  /**
   * 树结构处理
   * @param  {[type]} optiens [description]
   * @return {[type]}         [description]
   */
  toTree(optiens) {
    return new listToTree(optiens);
  }

  /**
   * 执行数据搜索
   * @param  {[type]} key   搜索的字段
   * @param  {[type]} value 搜索的数值
   * @return {[type]}       [description]
   */
  arraySearch(rawData, key, value, is_full = true) {
    const greaterThanTen = rawData.filter(element => {
      if (is_full) {
        if (value instanceof Array) {
          return value.includes(element[key]);
        } else {
          return element[key] == value;
        }
      } else {
        let str = ['', ...value, ''].join('.*'); //转化成正则格式的字符串
        let reg = new RegExp(str); //正则
        return reg.test(element[key]); //去匹配待查询的字符串
      }
    });
    if (is_full && greaterThanTen.length) {
      if (value instanceof Array) {
        return greaterThanTen;
      } else {
        return greaterThanTen[0];
      }
    } else {
      return greaterThanTen;
    }
  }

  /**
   * 对象覆盖合并
   * @param  {[type]} obj1 [description]
   * @param  {[type]} obj2 [description]
   * @return {[type]}      [description]
   */
  extend(obj1, obj2) {
    for (let obj in obj2) {
      obj1[obj] = obj2[obj];
    }
    return obj1;
  }

  /**
   * 设置默认值
   * @param {[type]} key   [description]
   * @param {[type]} value [description]
   */
  setDefault(key, value) {
    try {
      if (key) {
        return key;
      } else {
        return value;
      }
    } catch (error) {
      return value;
    }
  }

  /**
   * 获取对应组件
   * @param  {[type]} id   [description]
   * @param  {[type]} name [description]
   * @return {[type]}      [description]
   */
  components(id, name) {
    return this.self.component(id, name);
  }
}

export default cloud;
