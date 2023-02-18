import Vue from 'vue';

const service = Vue.prototype.$heshop;
const $message = Vue.prototype.$message.error;
import { transformPageHeaders } from './helpers.js';
import { reject } from 'lodash';

// 商品列表
export function goodsList({
  tabKey = 'all',
  page = 1,
  search = '',
  sort = {},
  time_start = 0,
  time_end = 0,
  cost_status = null,
  is_promoter = null,
  group = [],
  price_start = '',
  price_end = ''
}) {
  return new Promise(resolve => {
    service
      .search(
        'post',
        {
          include: 'goods'
        },
        {
          keyword: {
            tab_key: tabKey,
            search,
            sort,
            time_start,
            time_end,
            is_promoter,
            cost_status,
            group,
            price_start,
            price_end
          }
        }
      )
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 分销商品设置
// type all 所有商品 choose选择的商品
// id 商品id,多个用逗号隔开,type为choose时需要传
// tab_key 切换栏关键字 onsale上架 nosale下架 soldout售罄  all全部   type为all时需要传
// is_promoter 0不参与  1参与
export function promoterGoodsSetting(type = '', id = [], tab_key = '', is_promoter = null) {
  return new Promise((resolve, reject) => {
    service
      .promotergoods(
        'put',
        {
          type,
          id,
          tab_key
        },
        {
          is_promoter
        }
      )
      .then(resolve)
      .catch(reject);
  });
}

// 分销商列表
export function promoterList(page, keyword = {}) {
  return new Promise(resolve => {
    service
      .search(
        'post',
        {
          include: 'promoter'
        },
        {
          keyword: keyword
        }
      )
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination
        });
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 添加分销商
export function addPromoter(body = {}) {
  return new Promise((resolve, reject) => {
    service
      .promoter('post', body)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 分销商添加分销商搜索用户
export function userPromoter(search) {
  return new Promise((resolve, reject) => {
    service
      .promoter('get', {
        behavior: 'add_search',
        search: search
      })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 提现管理列表
export function financeList(
  page = 1,
  body = {
    keyword: '',
    begin_time: null,
    end_time: null,
    type: null, // 提现方式 1--自动打款 2--微信打款 3--支付宝打款 4--银行转账 5--打款到余额
    level: null
  }
) {
  return new Promise(resolve => {
    service
      .finance('get', body)
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination: pagination
        });
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 提现审核 status 1同意  2打款 3拒绝
export function finance(id, status, content) {
  id = parseInt(id);
  return new Promise((resolve, reject) => {
    service
      .finance('put', id, {
        status: status,
        content: content
      })
      .then(resolve)
      .catch(error => {
        reject(error);
      });
  });
}

// 分销订单
export function promoterOrderList(page = 1, keyword = {}) {
  return new Promise(resolve => {
    service
      .search(
        'post',
        {
          include: 'promoterorder'
        },
        keyword
      )
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination: pagination
        });
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 分销等级列表
export function promoterLevelList() {
  return new Promise(resolve => {
    service
      .promoterlevel('get')
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 删除分销等级
export function promoterLevelDel(id) {
  id = parseInt(id);
  return new Promise(resolve => {
    service
      .promoterlevel('delete', id)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 设置过的分销等级列表
export function promoterLevelOption() {
  return new Promise(resolve => {
    service
      .promoterlevel('get', {
        behavior: 'option'
      })
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 新建分销等级
export function createPromoterLevel(body = {}) {
  return new Promise((resolve, reject) => {
    service
      .promoterlevel('post', body)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 分销商等级详情
export function promoterLevelDetail(id) {
  id = parseInt(id);
  return new Promise(resolve => {
    service
      .promoterlevel('get', id)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 修改分销等级
export function promoterLevelEdit(id, body = {}) {
  id = parseInt(id);
  return new Promise((resolve, reject) => {
    service
      .promoterlevel('put', id, body)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 素材中心列表
export function promotermaterialList(page = 1, form) {
  return new Promise(resolve => {
    service
      .promotermaterial('get', form)
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination: pagination
        });
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 添加素材
export function createPromotermaterial(body = {}) {
  return new Promise(resolve => {
    service
      .promotermaterial('post', body)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 编辑素材
export function editPromotermaterial(id, body = {}) {
  return new Promise(resolve => {
    service
      .promotermaterial('put', id, body)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 素材详情
export function promotermaterialDetail(id) {
  return new Promise(resolve => {
    service
      .promotermaterial('get', id)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

//  删除素材
export function promotermaterialDel(id) {
  return new Promise(resolve => {
    service
      .promotermaterial('delete', id)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 空间动态列表
export function promoterzoneList(page = 1, keyword = {}) {
  return new Promise(resolve => {
    service
      .promoterzone('get', keyword)
      .page(page, 10)
      .then(response => {
        transformPageHeaders(response);
        const { data, pagination } = response;
        resolve({
          data: data,
          pagination: pagination
        });
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 创建空间动态
export function createPromoterzone(body) {
  return new Promise(resolve => {
    service
      .promoterzone('post', body)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 动态删除
export function delPromoterZone(id) {
  return new Promise(resolve => {
    service
      .promoterzone('delete', id)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 获取动态详情
export function promoterZoneDetail(id) {
  id = parseInt(id);
  return new Promise(resolve => {
    service
      .promoterzone('get', id)
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        $message(error.data.message);
      });
  });
}

// 编辑动态
export function editPromoterZone(id, body) {
  id = parseInt(id);
  return new Promise((resolve, reject) => {
    service
      .promoterzone('put', id, body)
      .then(resolve)
      .catch(error => {
        reject(error);
        $message(error.data.message);
      });
  });
}

// 保存结算设置
export function saveCommissionSetting(content = {}) {
  return new Promise((resolve, reject) => {
    service
      .setting('post', {
        keyword: 'commission_setting',
        content: content
      })
      .then(resolve)
      .catch(error => {
        reject(error);
      });
  });
}

// 获取结算设置
export function getCommissionSetting() {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        { include: 'setting' },
        {
          keyword: 'commission_setting'
        }
      )
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject();
      });
  });
}

// 获取分销设置
export function getPromoterSetting() {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        { include: 'setting' },
        {
          keyword: 'promoter_setting'
        }
      )
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject();
      });
  });
}

// 保存分销设置
export function savePromoterSetting(content = {}) {
  return new Promise((resolve, reject) => {
    service
      .setting('post', {
        keyword: 'promoter_setting',
        content: content
      })
      .then(resolve)
      .catch(error => {
        reject(error);
      });
  });
}

// 获取排行榜设置
export function getPromoterRank() {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        { include: 'setting' },
        {
          keyword: 'promoter_rank'
        }
      )
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject();
      });
  });
}

// 保存排行榜设置
export function savePromoterRank(content = {}) {
  return new Promise((resolve, reject) => {
    service
      .setting('post', {
        keyword: 'promoter_rank',
        content: content
      })
      .then(resolve)
      .catch(error => {
        reject(error);
      });
  });
}

// 设置招募令
export function saveRecruitMake(content = {}) {
  return new Promise((resolve, reject) => {
    service
      .setting('post', {
        keyword: 'promoter_recruit_make',
        content: content
      })
      .then(resolve)
      .catch(error => {
        reject(error);
      });
  });
}

// 获取招募令设置
export function getRecruitMake() {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        { include: 'setting' },
        {
          keyword: 'promoter_recruit_make'
        }
      )
      .then(response => {
        resolve(response.content);
      })
      .catch(error => {
        $message(error.data.message);
        reject();
      });
  });
}

// 审核,清退,拒绝和分配
export function auditApply(id, behavior = '', data = {}) {
  return new Promise((resolve, reject) => {
    service
      .promoter(
        'put',
        {
          id: id,
          behavior: behavior
        },
        data
      )
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject();
      });
  });
}

// 清退脱离,移交分销商搜索
export function transferDistributor(data = { uid: '', mobile: '' }) {
  return new Promise((resolve, reject) => {
    service
      .promoter('get', {
        behavior: 'transfer_search',
        from_uid: data.uid,
        mobile: data.mobile
      })
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 保存分销页面设置
export function savePageSetting(data = {}) {
  return new Promise((resolve, reject) => {
    service
      .setting('post', {
        keyword: 'promoter_page_setting',
        content: data
      })
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 获取分销页面设置
export function pageSetting() {
  return new Promise((resolve, reject) => {
    service
      .search(
        'post',
        {
          include: 'setting'
        },
        {
          keyword: 'promoter_page_setting'
        }
      )
      .then(response => {
        resolve(response.content);
      })
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 修改分销商等级
export function editLevel(uid, level) {
  return new Promise((resolve, reject) => {
    service
      .promoter('put', parseInt(uid), {
        level
      })
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 获取推广二维码
export function getQrcode(data) {
  return new Promise((resolve, reject) => {
    service
      .qrcode('post', data)
      .then(resolve)
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}

// 规格列表
export function groupList() {
  return new Promise((resolve, reject) => {
    service
      .group('get', { include: 'goods' })
      .then(response => {
        resolve(response);
      })
      .catch(error => {
        $message(error.data.message);
        reject(error);
      });
  });
}
