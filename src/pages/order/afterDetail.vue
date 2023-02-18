<template>
  <div class="le-matter" v-loading="loading">
    <el-breadcrumb class="he-link-text" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="he-link">
        <he-link href="order/after">售后订单</he-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item> 订单详情 </el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="le-line"> </el-row>
    <el-row>
      <el-col :span="8">
        <el-card class="le-form-card he-do-info">
          <div class="he-status">
            {{ detail.type === 0 ? '仅退款' : detail.type === 1 ? '退货退款' : detail.type === 2 ? '换货' : '' }}
            {{ detail.status | orderStatus }}
          </div>
          <div class="he-do-info__item">
            <span class="he-label"> 售后订单号: </span>
            <span class="he-value">
              {{ detail.after_sn }}
            </span>
          </div>
          <div class="he-do-info__item">
            <span class="he-label"> 申请时间: </span>
            <span class="he-value">
              {{ detail.created_time | getTime }}
            </span>
          </div>
          <div class="he-do-info__item">
            <span class="he-label"> 买家: </span>
            <span class="he-value">
              {{ detail.user.nickname }}
            </span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16">
        <div class="le-card le-description flex">
          <div class="le-menu">
            <div :class="{ 'le-item__active': type === 1 }" @click="type = 1" class="le-menu__item">售后说明</div>
            <div
              :class="{ 'le-item__active': type === 2 }"
              @click="type = 2"
              class="le-menu__item"
              v-if="detail.status === 101 || detail.status === 102 || detail.status === 201"
            >
              拒绝理由{{ detail.status === 201 ? '（第一次）' : '' }}
            </div>
            <div
              v-if="detail.status === 201"
              :class="{ 'le-item__active': type === 3 }"
              @click="type = 3"
              class="le-menu__item"
            >
              拒绝理由（第二次）
            </div>
          </div>
          <div class="le-content">
            <template v-if="type === 1">
              <div class="le-content__note" style="word-break: break-all">
                {{ detail.user_note }}
              </div>
              <div v-if="detail.images">
                <el-image
                  style="width: 80px; height: 80px; border-radius: 8px; margin-right: 8px"
                  :src="item"
                  :preview-src-list="detail.images"
                  v-for="(item, index) in detail.images"
                  :key="index"
                >
                  <div slot="error" class="image-slot">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </template>
            <div class="le-content__note" v-if="type === 2">
              {{ detail.refuse_reason }}
            </div>
            <div class="le-content__note" v-if="type === 3">
              {{ detail.second_refuse_reason }}
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <template
      v-if="
        detail.status == 122 || detail.status == 132 || ((detail.type == 2 || detail.type == 1) && detail.status == 200)
      "
    >
      <el-row class="le-buyer-return-flow le-card he-info he-user-freight">
        <el-col :span="6" class="he-form__line">
          <div class="he-title">买家退货物流</div>
          <div class="he-info__content">
            <div class="he-info__item">
              <span class="he-label"> 发货方式: </span>
              <span class="he-value">自己联系快递</span>
            </div>
            <div class="he-info__item">
              <span class="he-label"> 物流公司: </span>
              <span class="he-value">
                {{ detail.user_freight_info.logistics_company }}
              </span>
            </div>
            <div class="he-info__item">
              <span class="he-label"> 快递单号: </span>
              <span class="he-value">
                {{ detail.user_freight_info.freight_sn }}
              </span>
            </div>
            <div class="he-info__item">
              <span class="he-label"> 退货时间: </span>
              <span class="he-value">
                {{ detail.user_freight_info.time }}
              </span>
            </div>
          </div>
        </el-col>
        <el-col
          :span="detail.user_freight_info.images.length > 0 ? 14 : 18"
          class="he-info__box le-logistics-details"
          :class="detail.user_freight_info.images.length > 0 ? 'he-form__line' : ''"
        >
          <div class="he-title">物流详情</div>
          <div class="he-info__content">
            <div style="padding: 0" class="le-desc" v-if="buyerFlow.state !== 0">
              {{ buyerFlow.message }}
            </div>
            <logistics-step :list="buyerFlow.list" v-else></logistics-step>
          </div>
        </el-col>
        <el-col :span="4" class="he-info__box" v-if="detail.user_freight_info.images.length > 0">
          <div class="he-title">快递凭证</div>
          <div class="he-info__content" style="width: 178px">
            <el-image
              style="width: 80px; height: 80px; border-radius: 8px; margin-right: 8px"
              :src="item"
              :preview-src-list="detail.user_freight_info.images"
              v-for="(item, index) in detail.user_freight_info.images"
              :key="index"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
        </el-col>
      </el-row>
    </template>
    <template v-if="detail.type == 2 && detail.status == 200">
      <el-row class="le-buyer-return-flow le-card he-info">
        <el-col :span="6" class="" :class="detail.merchant_freight_info.type == 1 ? 'he-form__line' : ''">
          <div class="he-title">卖家换货物流</div>
          <div
            class="he-info__content"
            :style="{
              height: detail.merchant_freight_info.type == 1 ? '200px' : ''
            }"
          >
            <div class="he-info__item">
              <span class="he-label"> 发货方式: </span>
              <span class="he-value">{{
                detail.merchant_freight_info.type === 1
                  ? '自己联系快递'
                  : detail.merchant_freight_info.type === 2
                  ? '无需物流'
                  : '电子面单'
              }}</span>
            </div>
            <div
              style="display: inline-block"
              v-if="detail.merchant_freight_info.type === 1 || detail.merchant_freight_info.type === 3"
            >
              <div class="he-info__item">
                <span class="he-label"> 物流公司: </span>
                <span class="he-value">
                  {{ detail.merchant_freight_info.logistics_company }}
                </span>
              </div>
              <div class="he-info__item">
                <span class="he-label"> 快递单号: </span>
                <span class="he-value">
                  {{ detail.merchant_freight_info.freight_sn }}
                </span>
              </div>
              <div class="he-info__item">
                <span class="he-label"> 换货时间: </span>
                <span class="he-value">
                  {{ detail.exchange_time | getTime }}
                </span>
              </div>
            </div>
          </div>
        </el-col>
        <el-col :span="18" class="he-info__box le-logistics-details" v-if="detail.merchant_freight_info.type == 1">
          <div class="he-title">物流详情</div>
          <div class="he-info__content">
            <div style="padding: 0" class="le-desc" v-if="exchangeFlow.state !== 0">
              {{ exchangeFlow.message }}
            </div>
            <logistics-step v-else :list="exchangeFlow.list"></logistics-step>
          </div>
        </el-col>
      </el-row>
    </template>
    <el-row class="le-line"></el-row>
    <el-row class="he-info">
      <el-col>
        <el-card class="le-form-card">
          <el-row class="el-row--flex">
            <el-col :span="8" class="he-info__box he-form__line">
              <div class="he-title">售后信息</div>
              <div class="he-info__content">
                <div class="he-info__item">
                  <span class="he-label"> 售后类型: </span>
                  <span class="he-value">
                    {{
                      detail.type === 0 ? '仅退款' : detail.type === 1 ? '退货退款' : detail.type === 2 ? '换货' : ''
                    }}
                  </span>
                </div>
                <div class="he-info__item">
                  <span class="he-label"> 售后商品数: </span>
                  <span class="he-value">
                    {{ detail.return_number }}
                  </span>
                </div>
                <template v-if="detail.order_type == 'task' && detail.return_score_type">
                  <div class="he-info__item" v-if="detail.type !== 2">
                    <span class="he-label"> 退还积分: </span>
                    <span class="he-value"> {{ detail.actual_score }}积分 </span>
                  </div>
                </template>
                <div class="he-info__item" v-if="detail.type !== 2">
                  <span class="he-label"> 退款金额: </span>
                  <span class="he-value">
                    ￥{{ detail.return_amount }}
                    {{ Number(detail.return_freight) > 0 ? `（包含运费￥${detail.return_freight}）` : '' }}
                  </span>
                </div>
                <div class="he-info__item">
                  <span class="he-label"> 收货状态: </span>
                  <span class="he-value">
                    {{ detail.order.status === 203 ? '已收货' : '未收到货' }}
                  </span>
                </div>
                <div class="he-info__item" v-if="detail.type !== 2">
                  <span class="he-label"> 退款理由: </span>
                  <span class="he-value">
                    {{ detail.return_reason }}
                  </span>
                </div>
                <div class="he-info__item" v-if="detail.type === 2">
                  <span class="he-label"> 问题描述: </span>
                  <span class="he-value" style="word-break: break-all">
                    {{ detail.user_note }}
                  </span>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="he-info__box he-form__line">
              <div class="he-title">订单信息</div>
              <div class="he-info__content">
                <div class="he-info__item">
                  <span class="he-label"> 订单号: </span>
                  <span @click="router(detail.order.id)" class="he-value he-order-number">
                    {{ detail.order.order_sn }}
                  </span>
                </div>
                <div class="he-info__item flex align-center">
                  <span class="he-label"> 单价/数量: </span>
                  <el-popover v-if="detail.order_type === 'task'" placement="top-start" trigger="hover">
                    <template v-for="(good, index) in detail.goods">
                      {{ good.goods_score }}积分+￥{{ good.pay_amount }}/×{{ good.goods_number }}
                    </template>
                    <span class="he-value he-line-1" style="display: block" slot="reference">
                      <template v-for="(good, index) in detail.goods">
                        {{ good.goods_score }}积分+￥{{ good.pay_amount }}/×{{ good.goods_number }}
                      </template>
                    </span>
                  </el-popover>
                  <el-popover v-else placement="top-start" trigger="hover">
                    <template v-for="(good, index) in detail.goods">
                      ￥{{ good.pay_amount }}/×{{ good.goods_number }}
                    </template>
                    <span class="he-value he-line-1" style="display: block" slot="reference">
                      <template v-for="(good, index) in detail.goods">
                        ￥{{ good.pay_amount }}/×{{ good.goods_number }}
                      </template>
                    </span>
                  </el-popover>
                </div>
                <div class="he-info__item">
                  <span class="he-label"> 实付金额: </span>
                  <span class="he-value" v-if="detail.order_type == 'task'">
                    {{ detail.return_score }}积分+￥{{ detail.return_amount }}
                  </span>
                  <span class="he-value" v-else> ￥{{ detail.return_amount }} </span>
                </div>
                <div class="he-info__item" v-if="detail.order.status >= 202 && detail.order.freight">
                  <span class="he-label"> 发货状态: </span>
                  <span class="he-value"> 已发货 </span>
                  <span
                    :hide_cancel="true"
                    :id="detail.id + '_logistics_information'"
                    :width="detail.order.freight.type === 1 ? 740 : 285"
                    class="he-logistics"
                    module="order"
                    title="物流信息"
                    top="35vh"
                    type="text"
                    v-popup.logisticsInformation="{
                      ...detail,
                      freight: detail.order.freight
                    }"
                  >
                    物流信息
                  </span>
                </div>
              </div>
            </el-col>
            <el-col :span="8" class="he-info__box" style="padding-right: 50px">
              <div class="he-title">售后过程</div>
              <div class="he-info__content" style="height: 100px; overflow: auto">
                <ul class="he-timeline" style="padding-top: 10px; padding-left: 10px">
                  <li :key="index" class="he-timeline-item" v-for="(item, index) in detail.process">
                    <div class="he-timeline-item__tail" v-if="index !== detail.process.length - 1"></div>
                    <div class="he-timeline-item__node"></div>
                    <div class="he-timeline-item__wrapper">
                      <span class="he-label">
                        {{ item.label }}
                      </span>
                      <span class="he-content">
                        {{ item.content }}
                      </span>
                    </div>
                  </li>
                </ul>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <el-row class="le-line"> </el-row>
    <el-row>
      <el-col>
        <el-card class="le-form-card">
          <el-table :data="detail.goods" style="width: 100%" :span-method="arraySpanMethod">
            <el-table-column label="商品" min-width="350">
              <template slot-scope="scope">
                <div class="el-row--flex">
                  <img :src="scope.row.goods_image" class="he_goods__pic" />
                  <div class="le_goods__goodsinfo">
                    <div class="he_goods__name">
                      {{ scope.row.goods_name }}
                    </div>
                    <div class="he-goods__attr">
                      {{ scope.row.show_goods_param }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="单价" width="280">
              <template slot-scope="scope">
                <div class="he-price-number" v-if="detail.order_type == 'task'">
                  {{ scope.row.goods_score }}积分+￥{{ scope.row.goods_price }}
                </div>
                <div class="he-price-number" v-else>￥{{ scope.row.goods_price }}</div>
              </template>
            </el-table-column>
            <el-table-column label="数量" width="280">
              <template slot-scope="scope">
                <div class="he-price-number">×{{ scope.row.goods_number }}</div>
              </template>
            </el-table-column>
            <el-table-column label="实付金额" width="280">
              <template slot-scope="scope">
                <div class="he-total-amount">￥{{ scope.row.pay_amount }}</div>
              </template>
            </el-table-column>
            <el-table-column label="已退金额" v-if="detail.type !== 2" width="280">
              <template slot-scope="scope">
                <div class="he-total-amount">
                  {{ detail.status == 201 ? '--' : '￥' + (detail.actual_refund ? detail.actual_refund : '0.00') }}
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <div
      class="le-cardpin"
      v-if="
        detail.status === 100 ||
        detail.status === 102 ||
        detail.status === 122 ||
        detail.status === 111 ||
        detail.status === 132 ||
        (detail.status >= 200 && detail.type === 2)
      "
    >
      <template v-if="detail.status === 100 || detail.status === 102">
        <el-button
          action="onReload"
          class="he-click"
          module="order"
          sure_btn="拒绝售后"
          title="售后申请"
          top="30vh"
          v-popup.refuseToSell="{ item: detail }"
          width="704"
        >
          拒绝
        </el-button>
        <el-button
          class="he-click"
          module="order"
          sure_btn="同意售后"
          title="售后申请"
          top="30vh"
          type="primary"
          v-if="detail.type === 0"
          v-popup.agreeAfterSale="{ item: detail }"
          width="344"
          action="onReload"
        >
          同意
        </el-button>
        <el-button
          class="he-click"
          module="order"
          sure_btn="同意并发送退货地址"
          title="售后申请"
          top="30vh"
          type="primary"
          v-if="detail.type === 1 || detail.type === 2"
          v-popup.receiveRefund="{ item: detail }"
          width="707"
          action="onReload"
        >
          同意
        </el-button>
      </template>
      <el-button
        class="he-click"
        module="order"
        sure_btn="确认收货并退款"
        top="30vh"
        type="primary"
        v-popup.onlyRefund="{ item: detail }"
        v-show="detail.status === 122"
        width="600"
        action="onReload"
      >
        收货并退款
      </el-button>
      <el-button
        action="onReload"
        class="he-click"
        module="order"
        sure_btn="确定退款"
        title="退款"
        top="30vh"
        type="primary"
        v-popup.onlyRefund="{ item: detail }"
        v-show="detail.status === 111"
        width="600"
      >
        退款
      </el-button>
      <el-button
        action="onReload"
        class="he-click"
        module="order"
        title="确认收货并发货"
        top="30vh"
        type="primary"
        v-popup.receiveExchange="detail"
        v-show="detail.status === 132"
        width="664"
      >
        收货并换货
      </el-button>
      <el-button
        v-if="detail.status >= 200 && detail.type === 2"
        type="primary"
        title="修改物流"
        width="664"
        module="order"
        top="20vh"
        :id="'receive_wuliu'"
        action="onReload"
        class="he-click"
        v-popup.exchangeModifyLogistics="{ item: detail }"
        >修改物流
      </el-button>
    </div>
  </div>
</template>
<script>
import logisticsStep from './components/logisticsStep';

export default {
  name: 'afterDetail',
  data() {
    return {
      loading: false,
      detail: {
        goods: [],
        buyer: {
          name: ''
        },
        user: {
          nickname: ''
        },
        order: {
          status: null
        },
        merchant_freight_info: {}
      },
      type: 1,
      buyerFlow: {
        list: [],
        state: 0
      },
      exchangeFlow: {
        list: []
      }
    };
  },
  mounted() {
    let id = this.$getQueryVariable('id');
    if (!id) {
      id = this.$getQueryVariable('order_goods_id');
      this.getDetail(parseInt(id), 'order_goods');
    } else {
      this.getDetail(parseInt(id));
    }
  },
  methods: {
    getDetail: function (id, behavior = '') {
      this.loading = true;
      let _this = this;
      this.$heshop
        .orderafter('get', id, { behavior })
        .then(res => {
          this.loading = false;
          this.detail = res;
          if (res.status == 122 || res.status == 132 || ((res.type == 2 || res.type == 1) && res.status == 200)) {
            this.$heshop
              .express('post', {
                no: res.user_freight_info.freight_sn,
                mobile: res.return_address.mobile,
                name: res.user_freight_info.logistics_company,
                code: res.user_freight_info.code
              })
              .then(function (res) {
                _this.buyerFlow.state = res.state;
                _this.buyerFlow.list = res.list;
                _this.buyerFlow.message = res.message;
              })
              .catch(function () {
                //  Don't do
              });
          }
          // 换货 订单完成 有物流
          if (res.type == 2 && res.status == 200 && res.merchant_freight_info.type == 1) {
            this.$heshop
              .express('post', {
                no: res.merchant_freight_info.freight_sn,
                mobile: res.return_address.mobile,
                name: res.merchant_freight_info.logistics_company,
                code: res.merchant_freight_info.code
              })
              .then(function (res) {
                _this.exchangeFlow.list = res.list;
                _this.exchangeFlow.state = res.state;
                _this.exchangeFlow.message = res.message;
              })
              .catch(function () {
                //  Don't do
              });
          }
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.data.message);
        });
    },
    cancelItem(e) {
      this.$heshop
        .order('put', { id: e.id, behavior: 'cancel' })
        .then(() => {
          this.getDetail(e.id);
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    confirmReceipt(e) {
      this.$heshop
        .order('put', { id: e.id, behavior: 'received' })
        .then(() => {
          this.getDetail(e.id);
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    copyTrackingNumber: function (id) {
      let input = document.getElementById(id);
      input.select();
      document.execCommand('copy');
      this.$message.success('复制成功');
    },
    chooseType: function (index) {
      this.type = index;
    },
    router: function (id) {
      this.$router.push({
        path: '/order/orderDetail',
        query: {
          id: id
        }
      });
    },
    onReload: function () {
      let id = this.$getQueryVariable('id');
      this.getDetail(parseInt(id));
    },
    arraySpanMethod({ columnIndex }) {
      if (columnIndex === 4) {
        return {
          rowspan: this.detail.goods.length,
          colspan: 1
        };
      }
    }
  },
  computed: {
    isPay: function () {
      return function (data) {
        return data === 201 || data === 202 || data === 203 || data === 204;
      };
    }
  },
  filters: {
    getAddress: function (data) {
      if (data) {
        return `${data.province}${data.city}${data.district}${data.address}`;
      } else {
        return '';
      }
    },
    getPayType: function (type) {
      switch (type) {
        case 1:
          return '微信支付';
        case 2:
          return '支付宝支付';
        default:
          return '— —';
      }
    },
    getTime: function (time) {
      time = new Date(time * 1000);
      let y = time.getFullYear();
      let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
      let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
      let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
      let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
      let s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
      return `${y}-${m}-${d} ${h}:${mm}:${s}`;
    },
    getDay: function (time) {
      time = new Date(time * 1000);
      let y = time.getFullYear();
      let m = time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
      let d = time.getDate() < 10 ? '0' + time.getDate() : time.getDate();
      return `${y}-${m}-${d}`;
    },
    getHour: function (time) {
      time = new Date(time * 1000);
      let h = time.getHours() < 10 ? '0' + time.getHours() : time.getHours();
      let mm = time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes();
      let s = time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds();
      return `${h}:${mm}:${s}`;
    },
    orderStatus: function (status) {
      switch (status) {
        case 100:
          return '待审核';
        case 101:
          return '已拒绝';
        case 102:
          return '待审核';
        case 111:
          return '待卖家退款';
        case 121:
          return '待买家退货';
        case 122:
          return '待卖家收货并退款';
        case 131:
          return '待买家发货';
        case 132:
          return '待卖家收货并发货';
        case 133:
          return '卖家已换货';
        case 200:
          return '已完成';
        case 201:
          return '已完成(已拒绝)';
      }
    }
  },
  components: {
    logisticsStep
  }
};
</script>
<style lang="scss" scoped="">
@import './afterDetail.less';

.le-form-card {
  border-radius: 16px;
  box-shadow: none !important;
}

.he-link-text {
  font-size: 12px;
  font-weight: 400;
  line-height: 12px;
}

.he-do-info {
  height: 184px;
  padding: 12px 20px;

  .he-status {
    font-size: 20px;
    font-weight: 500;
    color: #623ceb;
    opacity: 0.85;
    margin-bottom: 15px;
  }

  .he-goSetting {
    font-size: 14px;
    font-weight: 500;
    color: #623ceb;
    line-height: 22px;
    padding: 0;
    margin-left: 21px;
  }

  .he-received-text {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    line-height: 22px;
    opacity: 0.85;
  }

  .he-cancel {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    opacity: 0.85;
    margin-bottom: 20px;
  }

  .he-do-btn {
    padding: 10px 24px;
    font-size: 12px;
    font-weight: 400;
    margin-top: 17px;
  }

  .he-prompt {
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    opacity: 0.85;
    margin-bottom: 18px;
  }

  .he-do-info__item {
    .he-label {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
      opacity: 0.45;
    }

    .he-value {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
      opacity: 0.85;
      margin-left: 9px;
    }
  }
}

.he_goods__pic {
  width: 80px;
  height: 80px;
  margin-right: 12px;
}

.he_goods__name {
  width: 100%;
  font-size: 14px;
  font-weight: 500;
  color: #010101;
  opacity: 0.85;
}

.he-goods__attr {
  font-size: 12px;
  font-weight: 500;
  color: #010101;
  opacity: 0.65;
}

.he-total-amount,
/deep/ .has-gutter .cell {
  text-align: center;
}

.he-price-number,
.he-total-amount {
  font-size: 14px;
  font-weight: 500;
  color: #000000;
  opacity: 0.85;
  text-align: center;
}

.he-note /deep/ .el-card__body {
  .he-note__edit {
    width: 14px;
    height: 14px;
    display: inline-block;
    margin-right: 12px;
    cursor: pointer;
  }

  .he-note__text {
    font-size: 16px;
    font-weight: 400;
    color: #fbad15;
  }
}

.he-all-price {
  margin-top: 24px;

  .he-label {
    display: inline-block;
    text-align: right;
    width: 175px;
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    line-height: 22px;
    opacity: 0.45;
  }

  .he-amount-price {
    font-weight: bold !important;
    color: #f5212d !important;
  }

  .he-money {
    width: 121px;
    display: inline-block;
    text-align: right;
    font-size: 14px;
    font-weight: 500;
    color: #000000;
    line-height: 22px;
    opacity: 0.85;
    margin-right: 23px;
  }

  .he-money:before {
    content: '￥';
  }
}

.he-info {
  .he-form__line {
    border-right: 1px solid #dcdfe6;
  }

  /deep/ .el-card__body {
    padding: 24px 0;
  }

  .he-title {
    font-size: 16px;
    font-weight: 500;
    color: #000000;
    opacity: 0.85;
    margin-bottom: 15px;
  }

  .he-info__box {
    padding-left: 24px;
  }

  .he-info__item {
    .he-label {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
      opacity: 0.45;
    }

    .he-value {
      font-size: 14px;
      font-weight: 500;
      color: #000000;
      line-height: 22px;
      opacity: 0.85;
      margin-left: 9px;
    }

    .he-order-number {
      font-weight: 500;
      color: #623ceb;
      cursor: pointer;
    }

    .he-logistics {
      color: #623ceb;
      cursor: pointer;
      font-size: 14px;
      margin-left: 10px;
    }
  }
}

.he-timeline {
  list-style: none;
  margin: 0;
  padding: 0;

  .he-timeline-item {
    position: relative;
    padding-bottom: 20px;
    height: 60px;

    .he-timeline-item__node {
      top: 6px;
      left: -1px;
      width: 10px;
      height: 10px;
      position: absolute;
      background: #623ceb;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .he-timeline-item__tail {
      position: absolute;
      left: 3px;
      top: 18px;
      height: 33px;
      border-left: 2px solid #623ceb;
    }

    .he-timeline-item__wrapper {
      position: relative;
      padding-left: 20px;

      .he-content {
        font-size: 14px;
        font-weight: 400;
        color: #000000;
        opacity: 0.85;
        margin-left: 7px;
      }

      .he-label {
        font-size: 12px;
        font-weight: 400;
        color: #623ceb;
        width: 33px;
        display: inline-block;
        text-align: center;
        line-height: 18px;
        height: 20px;
        border: 1px solid #623ceb;
        border-radius: 10px;
        background: #ffffff;
      }
    }
  }
}

.copy-tracking-number {
  background-color: #ffffff;
  border: none;
  opacity: 0;
  position: absolute;
  z-index: -10;
}

.he-button {
  padding: 0 20px;
  font-size: 14px;
  font-weight: 500;
  color: #623ceb;
  opacity: 0.85;
}

/deep/ .el-table thead th {
  height: 40px;
  padding: 0;
  margin: 0px;
  background-color: #f5f7fa;
}

.he-courier-certificate {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 8px;
}

/deep/ .is-always-shadow {
  box-shadow: none;
}

.le-matter /deep/ .el-tabs--card > .el-tabs__content {
  box-shadow: none;
}

.el-menu-vertical-demo {
  width: 119px;
  height: 125px;
}

.el-menu-item {
  height: 38px;
  line-height: 38px;
}

.el-menu-item:focus {
  background-color: #ffffff;
}

.el-menu-item:hover {
  background-color: #ffffff;
}
</style>
