<template>
  <div class="le-matter le-couponRecord">
    <div class="le-couponRecord-head flex">
      状态
      <el-select v-model="status" placeholder="请选择" class="le-couponRecord-select" @change="getCoupon(1)">
        <el-option :value="-1" label="全部"></el-option>
        <el-option :value="0" label="未使用"></el-option>
        <el-option :value="1" label="已使用"></el-option>
        <el-option :value="3" label="已到期"></el-option>
      </el-select>
      <el-input
        v-model="search"
        class="le-couponRecord-input"
        placeholder="输入优惠券名称搜索"
        clearable
        @clear="getCoupon(1)"
        @keyup.enter.native="getCoupon(1)"
      >
        <el-button slot="append" icon="el-icon-search" @click="getCoupon(1)"></el-button>
      </el-input>
    </div>
    <el-table
      :data="list"
      height="368px"
      class="le-couponRecord-table"
      ref="couponTable"
      v-loading="loading"
      header-cell-class-name="le-couponRecord-table-header-cell"
      row-class-name="le-couponRecord-table-row"
    >
      <el-table-column label="优惠券名称" prop="coupon.name"></el-table-column>
      <el-table-column label="优惠内容">
        <template slot-scope="scope">
          <template v-if="Number(scope.row.coupon.min_price) === 0">
            无门槛使用，减{{ scope.row.coupon.sub_price }}
          </template>
          <template v-else> 满{{ scope.row.coupon.min_price }}减{{ scope.row.coupon.sub_price }} </template>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="nickname" width="105px">
        <template slot-scope="scope">
          <div class="le-table-status le-status-success" v-if="scope.row.status === 0">未使用</div>
          <div class="le-table-status le-status-gray" v-else-if="scope.row.status === 1">已使用</div>
          <div class="le-table-status le-status-caveat" v-else-if="scope.row.status === 3">已到期</div>
        </template>
      </el-table-column>
      <el-table-column label="领取时间" prop="nickname">
        <template slot-scope="scope">
          {{ scope.row.created_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="使用时间" prop="nickname">
        <template slot-scope="scope">
          <div v-if="scope.row.use_time">
            {{ scope.row.use_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}
          </div>
          <div v-else>- -</div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" width="180px">
        <template slot-scope="scope">
          <div v-if="scope.row.order_sn" class="le-order-sn">
            {{ scope.row.order_sn }}
          </div>
          <div v-else>- -</div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="105px">
        <template slot-scope="scope" v-if="scope.row.status !== 1">
          <el-button type="text" class="le-delete" @click="del(scope.row.id, scope.$index)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end le-couponRecord-pagination">
      <el-pagination
        :current-page="pagination.current"
        :page-count="pagination.count"
        :pager-count="5"
        @current-change="getCoupon"
        background=""
        layout="prev, pager, next, jumper"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'couponRecord',
  props: {
    value: {
      type: Number
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      search: '',
      status: -1,
      pagination: {
        current: 1,
        count: 1
      }
    };
  },
  methods: {
    getCoupon: function (page) {
      let _this = this;
      this.loading = true;
      this.$heshop
        .coupon('get', {
          behavior: 'user',
          status: this.status,
          name: this.search,
          uid: this.value
        })
        .page(page, 5)
        .then(function (response) {
          let { data, headers } = response;
          _this.list = data;
          _this.loading = false;
          _this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
        });
    },
    del: function (id, index) {
      let _this = this;
      this.$confirm('是否确认删除优惠券？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(function () {
          _this.$heshop
            .coupon('delete', id, {
              behavior: 'user'
            })
            .then(function () {
              _this.$delete(_this.list, index);
              _this.$message.success('删除成功');
              if (_this.list.length > 0) {
                _this.getCoupon(_this.pagination.current);
              } else {
                let current = _this.pagination.current;
                current = current - 1;
                _this.getCoupon(current);
              }
            })
            .catch(function (error) {
              _this.$message.error(error.data.message);
            });
        })
        .catch(function () {});
    },
    affirm: function (e) {
      let { handleClose } = e;
      handleClose();
    }
  },
  mounted() {
    this.getCoupon(1);
  }
};
</script>
<style scoped lang="scss">
.le-couponRecord {
  .le-couponRecord-head {
    line-height: 32px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;

    .le-couponRecord-select /deep/ {
      width: 160px;
      margin-left: 14px;

      .el-input,
      .el-select-dropdown {
        width: 160px;
      }
    }
  }

  .le-couponRecord-input /deep/ {
    margin-bottom: 16px;
    width: 245px;
    margin-left: 16px;

    .el-input-group__append {
      width: 45px;

      .el-button {
        padding: 9px 15px;
      }
    }
  }

  .le-input-number /deep/ {
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

  .le-couponRecord-table /deep/ {
    .le-table-status {
      width: 68px;
      height: 28px;
      line-height: 26px;
      text-align: center;
      background: #ffffff;
      border-radius: 4px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }

    .le-status-success {
      color: #53c41a;
      border: 1px solid #53c41a;
    }

    .le-status-gray {
      color: rgba(0, 0, 0, 0.65);
      border: 1px solid #bebebe;
    }

    .le-status-caveat {
      border: 1px solid #fbad15;
      color: #fbad15;
    }

    .le-couponRecord-table-row {
      height: 64px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
    }

    .le-couponRecord-table-header-cell {
      height: 48px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #595959;
    }
  }

  .le-couponRecord-pagination {
    padding: 24px 0 0 0;
  }

  .le-delete {
    padding: 0;
  }
  .le-order-sn {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #623ceb;
  }
}
</style>
