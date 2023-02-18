<template>
  <div>
    <el-form-item label="发放优惠券">
      <div class="le-coupon">
        <div
          class="le-coupon-item flex align-center justify-between"
          v-for="(item, index) in value.coupon"
          :key="index"
        >
          <span>{{ item.info.name }}</span>
          <el-input-number
            class="le-input-number"
            v-model="item.number"
            :min="1"
            @keyup.native="positiveInteger"
            :max="999999"
          ></el-input-number>
          <i class="le-icon le-icon-cha2" @click="value.coupon.splice(index, 1)"></i>
        </div>
      </div>
      <div class="flex">
        <el-button class="le-coupon-btn" module="goods" v-popup.chooseCoupon="coupon" title="选择优惠券" width="857">
          选择优惠券
        </el-button>
        <div class="flex align-center">
          <he-link href="features/coupon/detail" target="_blank">
            <span class="le-text-btn le-new">新建</span>
          </he-link>
          <span class="le-line"></span>
          <span class="le-text-btn le-refresh">刷新</span>
        </div>
      </div>
      <div class="he-tips" style="padding-left: 0; clear: both">购买此商品支付成功后，将自动发放优惠券</div>
    </el-form-item>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object
    }
  },
  computed: {
    coupon: {
      get: function () {
        return this.value.coupon;
      },
      set: function (val) {
        this.value.coupon = val;
      }
    }
  },
  methods: {
    positiveInteger: function (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
    }
  }
};
</script>

<style scoped lang="scss">
.le-coupon-btn {
  border: 1px solid #623ceb;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #623ceb;
  margin-right: 5px;
}

.le-coupon-btn:hover {
  background: #ffffff;
}

.le-text-btn {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #623ceb;
  line-height: 22px;
  padding: 0 10px;
  cursor: pointer;
}

.le-line {
  width: 1px;
  height: 13px;
  background: #623ceb;
}

.le-coupon {
  .le-coupon-item {
    width: 368px;
    height: 56px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-bottom: 15px;
    padding: 0 15px;
    position: relative;

    /deep/ .le-input-number {
      height: 28px;
      width: 116px;

      .el-input {
        margin: 0 !important;
        width: 116px;

        .el-input__inner {
          height: 28px !important;
          padding: 0 29px;
          width: 116px;
        }
      }
    }

    .le-icon-cha2 {
      position: absolute;
      right: -6px;
      top: -6px;
      cursor: pointer;
      color: #b2b2b2;
      font-size: 16px;
      line-height: 1;
    }
  }
}
</style>
