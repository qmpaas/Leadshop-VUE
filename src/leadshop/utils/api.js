import * as extend from './extend';
import cache from './cache';

class api {
  /**
   * 执行API方法
   * @param  {[type]} data   [description]
   * @param  {[type]} server [description]
   * @return {[type]}        [description]
   */
  constructor(data, cloud) {
    //处理cloud
    this.cloud = cloud;
    //执行异步处理
    return new Promise((reslove, reject) => {
      //得到数据-复制错误判断，解决异常错误问题
      this.post(data)
        .then(value => {
          return this.afterEach(value)
            .then(reverse => {
              reslove(reverse);
            })
            .catch(error => {
              reject(error);
            });
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  /**
   * 前置操作
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  beforeEach(value) {
    return new Promise((resolve, reject) => {
      try {
        this.basics.beforeEach(value, resolve, this.cloud);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 后置操作
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  afterEach(value) {
    return new Promise((resolve, reject) => {
      try {
        this.basics.afterEach(value, resolve);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * 提交接口
   * @return {[type]} [description]
   */
  post(data) {
    //此处执行POST提交方法
    return new Promise((reslove, reject) => {
      //设置唯一Key
      let keys = Object.keys(data);
      //设置事件名
      let action = keys[0] || 'defaulter';
      //处理基础事件
      this.basics = extend[action] || extend['defaulter'];
      //处理Server
      let server = this.cloud.server;
      /**
       * 获取前置操作结果
       * @param  {Function} data).then(data [description]
       * @return {[type]}                   [description]
       */

      this.beforeEach(data)
        .then(value => {
          if (value) {
            let options = {
              url: value.url,
              method: value.method,
              responseType: value.responseType || '',
              headers: value.headers,
              data: value.data,
              adapter: value.responseType
                ? ''
                : cache({
                    time: 1000
                  })
            };
            this.cloud
              .server(options)
              .then(response => {
                reslove(response);
              })
              .catch(error => {
                reject(error);
              });
          } else {
            reslove(true);
          }
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}

export default api;
