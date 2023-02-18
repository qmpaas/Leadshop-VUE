import Cookies from 'js-cookie';
import utils from './utils.js';

/**
 * 默认
 * @type {Object}
 */
export const defaulter = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      method,
      headers,
      argument,
      data,
      keys,
      page,
      parameter = null;
    //路由判断
    let is_router = config.AppURL.indexOf('=') == -1 ? '?' : '&';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //请求类型
    method = argument[0] ? argument[0].toLowerCase() : 'get';
    //判断是否存在分页
    if (page) {
      if (page.page && page.size) {
        page = page;
      } else {
        page = {
          page: page[0],
          size: page[1]
        };
      }
      //删除最后一个元素，防止被拼接到地址栏
      keys.pop();
    }
    //处理URL信息
    url = '/api/' + config.AppName + '/' + keys.join('/');

    //判断你输出类型
    switch (method) {
      case 'post':
        //如果有三个参数
        if (Object.keys(argument).length === 2) {
          //默认数据情况
          data = argument[1];

          //处理分页信息
          if (page) {
            if (config.AppConfig.pagination === 'header') {
              headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
              parameter = { page: page.page };
            } else {
              parameter = { 'page[number]': page.page, 'page[size]': page.size };
            }
            url += is_router + utils.formateObjToParamStr(parameter);
          }
        }
        //如果有三个参数
        if (Object.keys(argument).length === 3) {
          //处理分页信息
          if (page) {
            if (config.AppConfig.pagination === 'header') {
              headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
            }
          }
          //第一个参数为
          if (Object.prototype.toString.call(argument[1]) === '[object Object]') {
            if (page) {
              if (config.AppConfig.pagination === 'header') {
                argument[1] = Object.assign(argument[1], { page: page.page });
              } else {
                argument[1] = Object.assign(argument[1], { 'page[number]': page.page, 'page[size]': page.size });
              }
            }
            url += is_router + utils.formateObjToParamStr(argument[1]);
          }
          //第二个作为提交数据
          if (Object.prototype.toString.call(argument[2]) === '[object Object]') {
            data = argument[2];
          }
        }
        break;
      case 'delete':
        if (Object.keys(argument).length >= 2) {
          //如果作为数组，则是批量删除
          if (Object.prototype.toString.call(argument[1]) === '[object Array]') {
            url += '/' + argument[1].toString();
          }
          //如果作为数字单个删除
          if (Object.prototype.toString.call(argument[1]) === '[object Number]') {
            url += '/' + argument[1];
          }
        }
        //如果作为参数，则作为条件
        if (Object.keys(argument).length === 3) {
          if (Object.prototype.toString.call(argument[2]) === '[object Object]') {
            url += is_router + utils.formateObjToParamStr(argument[2]);
          }
        }
        break;
      case 'get':
        // //处理分页信息
        // if (page) {
        //     if (config.AppConfig.pagination == 'header') {
        //         headers = { "Content-Type": "application/json", 'X-Pagination-Per-Page': page.size };
        //     } else {
        //         argument[1] = { 'page[number]': page.page, 'page[size]': page.size }
        //     }
        if (Object.keys(argument).length === 1) {
          //处理分页信息
          if (page) {
            if (config.AppConfig.pagination === 'header') {
              headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
              parameter = { page: page.page };
            } else {
              parameter = { 'page[number]': page.page, 'page[size]': page.size };
            }
            url += is_router + utils.formateObjToParamStr(parameter);
          }
        }
        if (Object.keys(argument).length >= 2) {
          //如果参数为数字，则获取单个
          if (Object.prototype.toString.call(argument[1]) === '[object Number]') {
            url += '/' + argument[1];
            if (page) {
              argument[2] = argument[2] || {};
              if (config.AppConfig.pagination === 'header') {
                headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
                argument[2] = Object.assign(argument[2], { page: page.page });
              } else {
                argument[2] = Object.assign(argument[2], { 'page[number]': page.page, 'page[size]': page.size });
              }
            }
          }
          //如果作为对象，则表示分页获取
          if (Object.prototype.toString.call(argument[1]) === '[object Object]') {
            if (argument[1].id) {
              if (Object.prototype.toString.call(argument[1].id) === '[object Array]') {
                url += '/' + argument[1].id.toString();
              } else {
                url += '/' + argument[1].id;
              }
              delete argument[1].id;
            }
            if (page) {
              if (config.AppConfig.pagination === 'header') {
                headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
                argument[1] = Object.assign(argument[1], { page: page.page });
              } else {
                argument[1] = Object.assign(argument[1], { 'page[number]': page.page, 'page[size]': page.size });
              }
            }
            url += is_router + utils.formateObjToParamStr(argument[1]);
          }
        }
        //如果有第三个参数，则作为获取条件
        if (Object.keys(argument).length === 3) {
          if (Object.prototype.toString.call(argument[2]) === '[object Object]') {
            url += is_router + utils.formateObjToParamStr(argument[2]);
          }
        }
        break;
      case 'put':
        if (Object.keys(argument).length >= 2) {
          //当为对象时就做为条件输出
          if (Object.prototype.toString.call(argument[1]) === '[object Object]') {
            if (argument[1].id) {
              if (Object.prototype.toString.call(argument[1].id) === '[object Array]') {
                url += '/' + argument[1].id.toString();
              } else {
                url += '/' + argument[1].id;
              }
              delete argument[1].id;
            }
            if (Object.keys(argument).length === 2) {
              data = argument[1];
            } else {
              url += is_router + utils.formateObjToParamStr(argument[1]);
            }
          }
          //当为数组时就作为更新内容
          if (Object.prototype.toString.call(argument[1]) === '[object Array]') {
            if (Object.prototype.toString.call(argument[1][0]) === '[object Number]') {
              url += '/' + argument[1].toString();
            } else {
              data = argument[1];
            }
          }
          //当为数字时就作为单条更新
          if (Object.prototype.toString.call(argument[1]) === '[object Number]') {
            url += '/' + argument[1];
          }
        }
        if (Object.keys(argument).length === 3) {
          data = argument[2];
        }
        break;
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
    //处理数据
  },
  afterEach(data, resolve) {
    //throw new Error("后置报错信息.exports输出");
    resolve(data);
  }
};

/**
 * 用户登录
 * @type {Object}
 */
export const login = {
  beforeEach(value, resolve, config) {
    //设置唯一Key
    let keys = Object.keys(value);
    let argument = value[keys[0]];
    let url = config.AppConfig.loginURL || 'login';
    resolve({
      url: url,
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: argument[1]
    });
  },
  afterEach(value, resolve) {
    let Authorization = value.token_type + ' ' + value.access_token;
    localStorage.setItem('Authorization', Authorization);
    localStorage.setItem('refresh_token', value.refresh_token);
    resolve(value);
  }
};

/**
 * 用户退出
 * @type {Object}
 */
export const logout = {
  beforeEach(value, resolve, config) {
    localStorage.clear();
    resolve(false);
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * POST
 * @type {Object}
 */
export const POST = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    //路由判断
    let is_router = config.AppURL.indexOf('=') === -1 ? '?' : '&';
    method = 'POST';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //处理URL信息
    url = argument[0];
    //默认数据情况
    data = argument[1];
    //如果有三个参数
    if (Object.keys(argument).length === 3) {
      //第一个参数为
      if (Object.prototype.toString.call(argument[1]) === '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[1]);
      }
      //第二个作为提交数据
      if (Object.prototype.toString.call(argument[2]) === '[object Object]') {
        data = argument[2];
      }
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * GET
 * @type {Object}
 */
export const GET = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    //路由判断
    let is_router = config.AppURL.indexOf('=') === -1 ? '?' : '&';
    method = 'GET';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //判断是否存在分页
    if (page) {
      if (page.page && page.size) {
        page = page;
      } else {
        page = {
          page: page[0],
          size: page[1]
        };
      }
      //删除最后一个元素，防止被拼接到地址栏
      keys.pop();
    }
    //处理URL信息
    url = argument[0];
    //处理分页信息
    if (page) {
      if (config.AppConfig.pagination === 'header') {
        headers = { 'Content-Type': 'application/json', 'X-Pagination-Per-Page': page.size };
        argument[1] = { page: page.page };
      } else {
        argument[1] = { 'page[number]': page.page, 'page[size]': page.size };
      }
    }
    if (Object.keys(argument).length >= 2) {
      //如果参数为数字，则获取单个
      if (Object.prototype.toString.call(argument[1]) === '[object Number]') {
        url += '/' + argument[1];
      }
      //如果作为对象，则表示分页获取
      if (Object.prototype.toString.call(argument[1]) === '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[1]);
      }
    }
    //如果有第三个参数，则作为获取条件
    if (Object.keys(argument).length === 3) {
      if (Object.prototype.toString.call(argument[2]) === '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[2]);
      }
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * 用户退出
 * @type {Object}
 */
export const PUT = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    //路由判断
    let is_router = config.AppURL.indexOf('=') === -1 ? '?' : '&';
    method = 'POST';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //处理URL信息
    url = argument[0];
    if (Object.keys(argument).length >= 2) {
      //当为对象时就做为条件输出
      if (Object.prototype.toString.call(argument[1]) === '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[1]);
      }
      //当为数组时就作为更新内容
      if (Object.prototype.toString.call(argument[1]) === '[object Array]') {
        data = argument[1];
      }
      //当为数字时就作为单条更新
      if (Object.prototype.toString.call(argument[1]) === '[object Number]') {
        url += '/' + argument[1];
      }
    }
    if (Object.keys(argument).length === 3) {
      data = argument[2];
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * 用户退出
 * @type {Object}
 */
export const DELETE = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    //路由判断
    let is_router = config.AppURL.indexOf('=') === -1 ? '?' : '&';
    method = 'POST';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];
    page = value['page'] || null;
    //处理URL信息
    url = argument[0];
    if (Object.keys(argument).length >= 2) {
      //如果作为数组，则是批量删除
      if (Object.prototype.toString.call(argument[1]) === '[object Array]') {
        url += '/' + JSON.stringify(argument[1]);
      }
      //如果作为数字单个删除
      if (Object.prototype.toString.call(argument[1]) === '[object Number]') {
        url += '/' + argument[1];
      }
    }
    //如果作为参数，则作为条件
    if (Object.keys(argument).length == 3) {
      if (Object.prototype.toString.call(argument[2]) === '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[2]);
      }
    }
    //格式化数据，如果为null设置为空
    data = data || '';
    headers = headers || { 'Content-Type': 'application/json' };
    resolve({ url, method, headers, data });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * 用户注册
 * @type {Object}
 */
export const register = {
  beforeEach(value, resolve) {
    //throw new Error("测试API件或无module.exports输出");
    resolve(value);
  },
  afterEach(value, resolve) {
    //throw new Error("后置报错信息.exports输出");
    resolve(value);
  }
};

/**
 * 重置Token
 * @type {Object}
 */
export const reset = {
  beforeEach(data, resolve) {
    //throw new Error("测试API件或无module.exports输出");
    resolve(data);
  },
  afterEach(data, resolve) {
    //throw new Error("后置报错信息.exports输出");
    resolve(data);
  }
};

/**
 * 文件上传
 * @type {Object}
 */
export const upload = {
  beforeEach(value, resolve) {
    //设置唯一Key
    let keys = Object.keys(value);
    let argument = value[keys[0]];
    let group_id = argument[1] || 1;
    var oFReader = new FileReader();
    oFReader.readAsDataURL(argument[0][0]);
    oFReader.onload = function (oFREvent) {
      resolve({
        url: 'api/leadmall/gallery',
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        data: {
          type: 1,
          group_id: group_id,
          content: oFREvent.target.result
        }
      });
    };
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * 文件 下载
 * @type {Object}
 */
export const download = {
  beforeEach(value, resolve) {
    let keys = Object.keys(value);
    let argument = value[keys[0]];
    let url = 'api/leadmall/download';
    if (Object.keys(argument).length > 0) {
      let str = '';
      Object.keys(argument[0]).forEach(item => {
        str += `&${item}=${argument[0][item]}`;
      });
      url += str;
    }
    resolve({
      url: url,
      method: 'get',
      responseType: 'blob',
      headers: { 'Content-Type': 'application/json; application/octet-stream' }
    });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

export const uploadV2 = {
  beforeEach(value, resolve) {
    //设置唯一Key
    let keys = Object.keys(value);
    let argument = value[keys[0]];
    resolve({
      url: 'api/leadmall/gallery',
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      data: argument[0]
    });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

export const video = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    //路由判断
    let is_router = config.AppURL.indexOf('=') === -1 ? '?' : '&';
    method = 'POST';
    //设置唯一Key
    keys = Object.keys(value);
    //处理参数信息
    argument = value[keys[0]];

    url = 'api/leadmall/gallery';

    if (Object.keys(argument).length === 2) {
      if (Object.prototype.toString.call(argument[1]) === '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[1]);
      }
    }

    resolve({
      url: url,
      method: method,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: argument[0]
    });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

export const file = {
  beforeEach(value, resolve, config) {
    //初始化变量
    let url,
      headers,
      method,
      argument,
      data,
      keys,
      page = null;
    //路由判断
    let is_router = config.AppURL.indexOf('=') === -1 ? '?' : '&';
    method = 'POST';
    //设置唯一Key
    keys = Object.keys(value);
    argument = value[keys[0]];

    url = 'api/leadmall/appconfig';

    if (Object.keys(argument).length === 2) {
      if (Object.prototype.toString.call(argument[1]) === '[object Object]') {
        url += is_router + utils.formateObjToParamStr(argument[1]);
      }
    }
    resolve({
      url: url,
      method: method,
      headers: { 'Content-Type': 'multipart/form-data' },
      data: argument[0]
    });
  },
  afterEach(value, resolve) {
    resolve(value);
  }
};

/**
 * 支付
 * @type {Object}
 */
export const pay = {
  beforeEach(data, resolve) {
    resolve(data);
  },
  afterEach(data, resolve) {
    resolve(data);
  }
};
