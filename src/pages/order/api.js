import Vue from 'vue';
import { transformPageHeaders } from './helper.js';
const service = Vue.prototype.$heshop;
const $message = Vue.prototype.$message;

// 电子面单列表
export function waybillList(page = 1) {
  return new Promise((resolve, reject) => {
    service
      .waybill('get')
      .page(page, 5)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(error => {
        reject(error);
        $message(error.data.message);
      });
  });
}

// 删除电子面单
export function deleteWaybill(id) {
  return new Promise(resolve => {
    service
      .waybill('delete', id)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 新建电子面单
export function createWaybill(form = {}) {
  return new Promise(resolve => {
    service
      .waybill('post', form)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 更新电子面单
export function putWaybill(form = {}) {
  return new Promise(resolve => {
    service
      .waybill('put', form)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 获取地区
export function getArea() {
  function getDistrict(district) {
    for (let i = 0; i < district.length; i++) {
      district[i].label = district[i].name;
      district[i].value = district[i].name;
      if (district[i].list) {
        district[i].children = district[i].list;
        getDistrict(district[i].children);
      }
    }
  }
  return new Promise(resolve => {
    import('./components/district.json').then(response => {
      getDistrict(response.default);
      resolve(response.default);
    });
  });
}

// 获取物流公司列表
export function expressJson() {
  return new Promise(resolve => {
    service
      .search('post', { include: 'setting' }, { keyword: 'expressjson' })
      .then(response => {
        response = response.map(item => {
          return { value: item.name, label: item.code, is_waybill: item.is_waybill };
        });
        resolve(response);
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 获取电子面单详情
export function waybillDetail(id) {
  return new Promise(resolve => {
    service
      .waybill('get', id)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}
