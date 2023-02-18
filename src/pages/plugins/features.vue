<!--
 * @Description:
 * @Author: fjt
 * @Date: 2021-04-27 15:56:00
 * @LastEditTime: 2021-05-26 16:43:54
 * @LastEditors: fjt
-->
<template>
  <div class="le-matter">
    <div class="le-pay-item flex" @click="router">
      <div class="le-item-icon">
        <img src="./image/coupon.png" alt="" />
      </div>
      <div>
        <div class="le-item-name">优惠券</div>
        <div class="le-item-desc">买家持优惠券享受减免优惠</div>
      </div>
      <div class="__btn" @click.stop="toUrl('coupon')">详情</div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  name: 'features',
  methods: {
    router: function () {
      this.$router.push({
        path: '/features/coupon/index'
      });
    },
    toUrl(keyword) {
      this.$router.push({ path: '/plugins/details', query: { keyword: keyword } });
    }
  }
};
</script>
<style lang="less" scoped="true">
.le-matter {
  height: 680px;
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;

  .le-pay-item {
    width: 302px;
    height: 72px;
    background: #f3f5f7;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    position: relative;

    /**
     *  #F3F5F7
     */
    .__btn {
      position: absolute;
      width: 40px;
      height: 28px;
      background: #ffffff;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      text-align: center;
      line-height: 26px;
      right: 12px;
      top: 32px;
      display: block;
    }

    &:hover {
      .__btn {
        display: block;
      }
    }

    .le-item-icon {
      width: 40px;
      height: 40px;
      border-radius: 8px;
      margin-right: 12px;
    }

    .le-item-name {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      line-height: 20px;
    }

    .le-item-desc {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 20px;
    }
  }
}
</style>
