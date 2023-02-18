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
      @sort-change="sort"
      v-loading="loading"
      @selection-change="handleChange"
      height="368px"
      row-key="id"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column label="优惠券名称" prop="name"></el-table-column>
      <el-table-column label="优惠内容" width="200px">
        <template slot-scope="scope">
          <template v-if="Number(scope.row.min_price) === 0"> 无门槛使用，减{{ scope.row.sub_price }} </template>
          <template v-else> 满{{ scope.row.min_price }}减{{ scope.row.sub_price }} </template>
        </template>
      </el-table-column>
      <el-table-column label="已领取/剩余">
        <template slot-scope="scope"> {{ scope.row.obtain_num }}/{{ scope.row.over_num }} </template>
      </el-table-column>
      <el-table-column label="已使用" prop="use_num" sortable="custom"></el-table-column>
      <el-table-column prop="stocks" label="用券时间" width="200px">
        <template slot-scope="scope">
          <template v-if="scope.row.expire_type === 1">领取后{{ scope.row.expire_day }}天内</template>
          <template v-else-if="scope.row.expire_type === 2">
            {{ scope.row.begin_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}-<br />
            {{ scope.row.end_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <div class="le-table-status le-status-success" v-if="scope.row.status === 1">上架中</div>
          <div class="le-table-status le-status-gray" v-else-if="scope.row.status === 0">下架中</div>
          <div class="le-table-status le-status-caveat" v-else-if="scope.row.status === 2">已结束</div>
        </template>
      </el-table-column>
    </el-table>
    <div class="coupon-select__page flex justify-end">
      <el-pagination
        @current-change="getList"
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
  components: {},
  inject: ['self'],
  data() {
    return {
      select: 0,
      keyword: '',
      loading: true,
      form: {
        name: '',
        sort: 4,
        status: -1
      },
      list: [],
      pagination: {
        current: 1,
        count: 1
      },
      choose: [],
      selected: {}
    };
  },
  props: {
    limit: {
      type: Number,
      default: 1
    },
    value: {
      type: Array
    },
    dialogVisible: {
      type: Boolean
    }
  },
  watch: {
    dialogVisible: {
      handler(val) {
        if (val) {
          this.selected = {};
          let selected = JSON.parse(JSON.stringify(this.self.selectData));
          selected.forEach(v => {
            this.selected[v.id] = v;
          });
          this.getList(1);
        }
      },
      immediate: true
    }
  },
  methods: {
    sort: function (e) {
      if (e.order === 'ascending') {
        this.form.sort = 1;
      } else if (e.order === 'descending') {
        this.form.sort = 2;
      } else {
        this.form.sort = 4;
      }
      this.getList(1);
    },
    getList: function (current) {
      let _this = this;
      this.loading = true;
      this.$heshop
        .coupon('get', this.form)
        .page(current, 5)
        .then(function (response) {
          let { headers, data } = response;
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
                  _this.$refs['couponTable'].toggleRowSelection(row, true);
                }
              }
            });
          });
          _this.loading = false;
        })
        .catch(function (error) {
          console.error(error);
          _this.loading = false;
          _this.$message.error(error.data.message);
        });
    },
    handleChange(list) {
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
      let selected = [];
      for (let i in this.selected) {
        if (this.selected.hasOwnProperty(i)) {
          selected.push(this.selected[i]);
        }
      }
      this.self.selectData = selected;
    },
    querySearch(queryString, cb) {
      let _this = this;
      this.$heshop
        .coupon('get', {
          name: queryString,
          sort: 4,
          status: -1
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
    }
  }
};
</script>
<style lang="less" scoped>
@import './style.less';
</style>
