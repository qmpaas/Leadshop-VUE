import axios from 'axios';

//用于判断是否刷新
window.isReresh = false;
window.RequestList = [];
const pending = new Map();
const addPending = config => {
  const url = [config.method, config.url].join('&');
  config.cancelToken =
    config.cancelToken ||
    new axios.CancelToken(cancel => {
      if (!pending.has(url)) {
        // 如果 pending 中不存在当前请求，则添加进去
        pending.set(url, cancel);
      }
    });
};

const clearPending = () => {
  for (const [url, cancel] of pending) {
    cancel(url);
  }
  pending.clear();
};

export default function server(options) {
  //设置初始化URL
  axios.defaults.baseURL = options.AppURL;
  //开启Session存储
  axios.defaults.withCredentials = true;
  // 此时超时配置的默认值是 `0`
  let cloud = axios.create();
  // 覆写库的超时默认值
  // 现在，在超时前，所有请求都会等待 2.5 秒
  cloud.defaults.timeout = 1000000;
  //重试次数
  cloud.defaults.retry = 1;

  cloud.interceptors.request.use(
    config => {
      let token = localStorage.getItem('Authorization') || '';
      if (token) {
        config.headers['Authorization'] = token;
      }
      config.headers['QM-APP-TYPE'] = options.AppType;
      config.headers['QM-APP-ID'] = options.AppID;
      config.headers['QM-APP-SECRET'] = options.AppSecret;
      config.headers['QM-APP-SECRET'] = options.AppSecret;
      //返回配置信息
      addPending(config);
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  cloud.interceptors.response.use(
    response => {
      if (response.status >= 200 && response.status < 300) {
        if (response.headers['x-pagination-total-count'] || response.headers['X-Pagination-Total-Count']) {
          return response;
        }
        return response.data;
      } else {
        return Promise.reject(response);
      }
    },
    async error => {
      switch (error.response.status) {
        //token过期，清除它,清除token信息并跳转到登录页面
        case 401: {
          let token = localStorage.getItem('Authorization');
          let refresh_token = localStorage.getItem('refresh_token');
          await clearPending();

          //判断Token是否存在
          if (token && refresh_token) {
            if (!window.isReresh) {
              window.isReresh = true;
              window.RequestList = [JSON.parse(JSON.stringify(error.config))];
              localStorage.removeItem('Authorization');
              cloud({
                url: options.AppConfig.loginReset,
                method: 'POST',
                data: { refresh_token }
              })
                .then(value => {
                  let Authorization = 'Bearer ' + value.access_token;
                  if (value.access_token && value.refresh_token) {
                    localStorage.setItem('Authorization', Authorization);
                    localStorage.setItem('refresh_token', value.refresh_token);
                  } else {
                    localStorage.removeItem('Authorization');
                    localStorage.removeItem('refresh_token');
                  }
                  location.reload();
                })
                .catch(() => {
                  localStorage.removeItem('Authorization');
                  localStorage.removeItem('refresh_token');
                  location.reload();
                });
            }
          } else {
            return Promise.reject(error.response);
          }
          return;
        }
        default:
          return Promise.reject(error.response);
      }
    }
  );
  return cloud;
}
