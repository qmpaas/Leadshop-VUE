<template>
  <div class="le-matter">
    <el-breadcrumb class="he-link-text" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <he-link href="plugins/features">营销玩法</he-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="he-link">
        <he-link href="features/coupon/index">优惠券管理</he-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{ $route.query.isEdit ? '编辑成功' : '新建成功' }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="le-success flex flex-direction align-center" v-loading="loading">
      <template v-if="!loading">
        <img class="le-success-icon" src="./image/coupon-success-icon.png" />
        <div class="le-success-text">优惠券{{ $route.query.isEdit ? '编辑' : '创建' }}成功</div>
        <el-button
          class="le-success-btn"
          module="goods"
          title="推广"
          :hide_footer="true"
          v-popup.promote="{ data: detail, promoteType: 'coupon' }"
          width="791"
        >
          立即推广
        </el-button>
        <div class="le-table-edit flex align-center">
          <span class="le-button-text" @click="router('/features/coupon/detail')">继续添加</span>
          <span class="le-line-text"></span>
          <span class="le-button-text" @click="router('/features/coupon/index')">优惠券管理</span>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: 'success',
  data() {
    return {
      detail: {},
      loading: true
    };
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    router: function (path) {
      this.$router.replace({
        path
      });
    },
    getDetail: function () {
      let _this = this;
      this.$heshop
        .coupon('get', parseInt(this.$route.query.id))
        .then(function (response) {
          _this.detail = response;
          _this.loading = false;
        })
        .catch(function (error) {
          _this.loading = false;
          _this.$message.error(error.data.message);
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import './css/success.less';
</style>
