<template>
  <div class="le-matter le-chooseCoupon">
    <el-input
      @clear="getCoupon(1)"
      @keyup.enter.native="getCoupon(1)"
      class="le-chooseCoupon-input"
      clearable=""
      placeholder="输入优惠券名称搜索"
      v-model="search"
    >
      <el-button @click="getCoupon(1)" icon="el-icon-search" slot="append"> </el-button>
    </el-input>
    <el-table
      :data="list"
      @selection-change="selection"
      class="le-chooseCoupon-table"
      header-cell-class-name="le-chooseCoupon-table-header-cell"
      height="328px"
      ref="couponTable"
      row-class-name="le-chooseCoupon-table-row"
      v-loading="loading"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column label="优惠券名称" prop="name"> </el-table-column>
      <el-table-column label="优惠内容" prop="content" width="220">
        <template slot-scope="scope">
          <template v-if="Number(scope.row.min_price) === 0"> 无门槛使用，减{{ scope.row.sub_price }} </template>
          <template v-else> 满{{ scope.row.min_price }}减{{ scope.row.sub_price }} </template>
        </template>
      </el-table-column>
      <el-table-column label="剩余可发放量" prop="over_num"> </el-table-column>
      <el-table-column label="发放数量" width="150">
        <template slot-scope="scope">
          <el-input-number
            @change="changeNumber($event, scope.row)"
            :max="scope.row.over_num"
            :min="1"
            class="le-input-number"
            v-model="scope.row.num"
            @keyup.native="positiveInteger"
          >
          </el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end le-chooseCoupon-pagination">
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
  name: 'chooseCoupon',
  props: {
    value: {
      type: [Object, Array],
      default: {
        coupons: [],
        row: {}
      }
    }
  },
  data() {
    return {
      list: [],
      loading: false,
      search: '',
      pagination: {
        current: 1,
        count: 1
      },
      choose: [],
      selected: []
    };
  },
  methods: {
    getCoupon: function (page) {
      let _this = this;
      this.loading = true;
      this.$heshop
        .coupon('get', { sort: 4, name: this.search, type: 'can_use' })
        .page(page, 5)
        .then(function (response) {
          let { data, headers } = response;
          _this.list = data.map(v => {
            v.num = 1;
            return v;
          });
          _this.$nextTick(() => {
            _this.list.forEach(row => {
              for (let i in _this.selected) {
                if (row.id === _this.selected[i].id) {
                  row.num = _this.selected[i].num;
                  _this.$refs['couponTable'].toggleRowSelection(row, true);
                }
              }
            });
          });
          _this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
          _this.choose = [];
          _this.loading = false;
        });
    },
    selection: function (list) {
      if (list.length >= this.choose.length) {
        list.forEach(v => {
          if (typeof this.selected[v.id] == 'undefined') {
            this.selected[v.id] = v;
          }
        });
      } else {
        let delete_list = [];
        this.choose.forEach(v => {
          let index = list.findIndex(function (item) {
            return item.id === v.id;
          });
          if (index === -1) {
            delete_list.push(v.id);
          }
        });
        delete_list.forEach(v => {
          delete this.selected[v];
        });
      }
      this.choose = list;
    },
    changeNumber: function (num, e) {
      if (typeof this.selected[e.id] !== 'undefined') {
        this.selected[e.id].num = num;
      }
    },
    positiveInteger: function (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
    },
    affirm: function (e) {
      let { handleClose } = e;
      let selected = this.selected.filter(v => v);
      this.value.coupons = selected;
      handleClose();
    }
  },
  mounted() {
    this.getCoupon(1);
  }
};
</script>
<style lang="scss" scoped="">
.le-chooseCoupon {
  .le-chooseCoupon-input /deep/ {
    margin-bottom: 16px;
    width: 367px;

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

  .le-chooseCoupon-table /deep/ {
    .le-chooseCoupon-table-row {
      height: 56px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
    }

    .le-chooseCoupon-table-header-cell {
      height: 48px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #595959;
    }
  }

  .le-chooseCoupon-pagination {
    padding: 24px 0 0 0;
  }
}
</style>
