<template>
  <div class="coupon-select">
    <div class="coupon-select__search">
      <el-autocomplete
        placeholder="输入优惠券名称搜索"
        v-model="form.name"
        :trigger-on-focus="false"
        :disabled="loading"
        clearable
        @clear="getList(1)"
        class="le-coupon-page_search"
        size="small"
        :fetch-suggestions="querySearch"
        @select="getList(1)"
        @keyup.enter.native="getList(1)"
      >
        <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
      </el-autocomplete>
    </div>
    <el-table
      ref="couponTable"
      :data="list"
      tooltip-effect="dark"
      cell-class-name="le-table-row"
      v-loading="loading"
      class="le-table"
      @selection-change="selectionChange"
      height="368px"
      :row-key="rowKey"
    >
      <el-table-column
        type="selection"
        :selectable="
          row => {
            return row.over_num ? true : false;
          }
        "
        width="50"
      ></el-table-column>
      <el-table-column label="优惠券名称" prop="name"></el-table-column>
      <el-table-column label="优惠内容" width="200px">
        <template slot-scope="scope">
          <template v-if="Number(scope.row.min_price) === 0"> 无门槛使用，减{{ scope.row.sub_price }} </template>
          <template v-else> 满{{ scope.row.min_price }}减{{ scope.row.sub_price }} </template>
        </template>
      </el-table-column>
      <el-table-column label="剩余可发放量" prop="over_num"> </el-table-column>
      <el-table-column prop="status" label="发放数量">
        <template slot-scope="scope">
          <el-input-number
            @change="changeNumber($event, scope.row)"
            class="le-input-number"
            v-model="scope.row.num"
            :min="1"
            @keyup.native="positiveInteger"
            :max="99999"
          ></el-input-number>
        </template>
      </el-table-column>
    </el-table>
    <div class="coupon-select__page flex justify-end">
      <el-pagination
        @current-change="getList"
        background
        layout="prev, pager, next,jumper"
        :current-page="pagination.current"
        :page-count="pagination.count"
        :disabled="loading"
      ></el-pagination>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      keyword: '',
      loading: true,
      form: {
        name: '',
        sort: 4,
        status: 1
      },
      list: [],
      pagination: {
        current: 1,
        count: 1
      },
      chooseList: [],
      selected: {},
      choose: []
    };
  },
  props: {
    value: {
      type: Array
    }
  },
  methods: {
    getList: function (current) {
      let _this = this;
      this.loading = true;
      _this.$heshop
        .coupon('get', _this.form)
        .page(current, 5)
        .then(function (response) {
          let { headers, data } = response;
          data.map(function (item) {
            return (item.num = 1);
          });
          _this.list = data;
          _this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
          _this.choose = [];
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
          _this.loading = false;
        })
        .catch(function (error) {
          console.error(error);
          _this.$message.error(error.data.message);
        });
    },
    querySearch(queryString, cb) {
      let _this = this;
      this.$heshop
        .coupon('get', {
          name: queryString,
          sort: 4,
          status: 1
        })
        .page(1, 5)
        .then(function (response) {
          let _array = response.data.map(function (item) {
            return {
              value: item.name
            };
          });
          cb(_array);
        })
        .catch(function (error) {
          console.error(error);
          _this.$message.error(error.data.message);
        });
    },
    rowKey: function (row) {
      return row.id;
    },
    selectionChange: function (list) {
      if (list.length >= this.choose.length) {
        list.forEach(v => {
          if (typeof this.selected[v.id] === 'undefined') {
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
    changeNumber: function (num, row) {
      for (let key in this.selected) {
        if (this.selected[key].id === row.id) {
          this.selected[key].num = num;
        }
      }
    },
    positiveInteger: function (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
    },
    affirm: function (e) {
      let { handleClose } = e;
      let data = JSON.parse(JSON.stringify(this.selected));
      let selected = [];
      for (let key in data) {
        if (data[key].num > data[key].over_num) {
          this.$message({
            type: 'error',
            message: '发放优惠券超出限制'
          });
          return;
        }
        selected.push({
          info: {
            id: data[key].id,
            name: data[key].name,
            over_num: data[key].over_num
          },
          number: data[key].num
        });
      }
      handleClose();
      this.$emit('input', selected);
    }
  },
  mounted() {
    let selected = JSON.parse(JSON.stringify(this.value));
    selected.forEach(v => {
      this.selected[v.info.id] = {
        id: v.info.id,
        name: v.info.name,
        num: v.number
      };
    });
    this.getList(1);
  }
};
</script>
<style lang="less" scoped>
.coupon-select {
  .le-table {
    /deep/ .le-table-row {
      height: 64px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
    }

    .le-input-number /deep/ {
      height: 28px;
      width: 116px;

      /deep/ .el-input {
        margin: 0 !important;
        width: 116px;

        .el-input__inner {
          height: 28px !important;
          padding: 0 29px;
          width: 116px;
        }
      }
    }
  }

  .coupon-select__search {
    margin-bottom: 16px;

    .le-coupon-page_search /deep/ .el-input {
      width: 367px;
    }
  }

  .coupon-select__page {
    padding-top: 24px;
  }
}
</style>
