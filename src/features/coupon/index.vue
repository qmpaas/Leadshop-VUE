<template>
  <div class="le-main">
    <el-breadcrumb class="he-link-text" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <a href="#/plugins/features">营销玩法</a>
      </el-breadcrumb-item>
      <el-breadcrumb-item> 优惠券管理</el-breadcrumb-item>
    </el-breadcrumb>
    <button class="he-btn he-primary-btn le-new-add" @click="router()">新建优惠券</button>
    <el-form class="le-card" :inline="true" label-width="110px" :model="form" @submit.native.prevent>
      <el-form-item label="优惠券名称" class="le-search-input">
        <el-input
          placeholder="输入优惠券名称搜索"
          v-model="form.name"
          @clear="getList(1)"
          clearable
          @keyup.enter.native="getList(1)"
        ></el-input>
      </el-form-item>
      <el-form-item label="创建时间" class="le-search-date">
        <el-date-picker type="datetime" v-model="form.begin_time" value-format="timestamp" placeholder="开始时间">
        </el-date-picker>
        <span class="le-go">至</span>
        <el-date-picker v-model="form.end_time" value-format="timestamp" type="datetime" placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠券状态" class="le-search-select">
        <el-select placeholder="请选择" v-model="form.status">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="上架中" :value="1"></el-option>
          <el-option label="下架中" :value="0"></el-option>
          <el-option label="已结束" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <div class="le-button">
        <button class="he-btn he-primary-btn" @click="getList(1)">筛选</button>
        <button class="he-btn he-clear-btn" @click="emptyForm">清空</button>
      </div>
    </el-form>
    <div class="le-card le-table">
      <el-table
        :row-key="rowKey"
        :data="list"
        height="688"
        empty-text="暂无优惠券"
        v-loading="tableLoading"
        @sort-change="sort"
        :default-sort="{ prop: 'created_time', order: 'descending' }"
        cell-class-name="le-table-row"
      >
        <el-table-column label="优惠券名称" prop="name" min-width="200px"></el-table-column>
        <el-table-column label="优惠内容" prop="content" min-width="200px">
          <template slot-scope="scope">
            <template v-if="Number(scope.row.min_price) === 0"> 无门槛使用，减{{ scope.row.sub_price }}</template>
            <template v-else> 满{{ scope.row.min_price }}减{{ scope.row.sub_price }}</template>
          </template>
        </el-table-column>
        <el-table-column label="已领取/剩余" width="200px">
          <template slot-scope="scope"> {{ scope.row.obtain_num }}/{{ scope.row.over_num }}</template>
        </el-table-column>
        <el-table-column label="已使用" prop="use_num" sortable="custom" width="200px"></el-table-column>
        <el-table-column label="用券时间" width="200px">
          <template slot-scope="scope">
            <template v-if="scope.row.expire_type === 1">领取后{{ scope.row.expire_day }}天内</template>
            <template v-else-if="scope.row.expire_type === 2">
              {{ scope.row.begin_time | timeFormat('yyyy.mm.dd hh:MM:ss') }} -<br />
              {{ scope.row.end_time | timeFormat('yyyy.mm.dd hh:MM:ss') }}
            </template>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="150px">
          <template slot-scope="scope">
            <div class="le-table-status le-status-success" v-if="scope.row.status === 1">上架中</div>
            <div class="le-table-status le-status-gray" v-else-if="scope.row.status === 0">下架中</div>
            <div class="le-table-status le-status-caveat" v-else-if="scope.row.status === 2">已结束</div>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="200" sortable="custom" prop="created_time">
          <template slot-scope="scope">
            {{ scope.row.created_time | timeFormat('yyyy.mm.dd hh:MM:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="编辑" width="200px">
          <template slot-scope="scope">
            <div class="le-table-edit flex align-center">
              <template v-if="scope.row.status !== 2">
                <span class="le-button-text" @click="router(scope.row.id)">编辑</span>
                <span class="le-line-text"></span>
              </template>
              <template v-if="scope.row.status === 1">
                <span class="le-button-text" @click="downCoupon(scope.row)">下架</span>
                <span class="le-line-text"></span>
                <span
                  class="le-button-text"
                  module="goods"
                  title="推广"
                  :id="scope.$index + '_coupon'"
                  :hide_footer="true"
                  type="text"
                  v-popup.promote="{ data: scope.row, promoteType: 'coupon' }"
                  width="791"
                  >推广</span
                >
                <span class="le-line-text"></span>
                <span class="le-button-text" @click="replace(scope.row)">发放</span>
              </template>
              <template v-if="scope.row.status === 0">
                <span class="le-button-text" @click="putCoupon(scope.row)">上架</span>
                <span class="le-line-text"></span>
              </template>
              <template v-if="scope.row.status === 2 || scope.row.status === 0">
                <template v-if="scope.row.status === 2">
                  <span class="le-button-text" @click="router(scope.row.id, 1)">查看</span>
                  <span class="le-line-text"></span>
                </template>
                <span class="le-button-text" @click="delCoupon(scope.row.id, scope.$index)">删除</span>
              </template>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="le-pagination flex justify-end">
        <el-pagination
          :disabled="tableLoading"
          @current-change="pageChange"
          :current-page="pagination.current"
          :page-count="pagination.count"
          background
          layout="prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  components: {},
  data() {
    return {
      form: {
        name: '',
        status: -1,
        begin_time: null,
        end_time: null,
        sort: 4
      },
      pagination: {
        current: 1,
        count: 1
      },
      tableLoading: false,
      list: []
    };
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.getList(this.$route.query.current ? parseInt(this.$route.query.current) : 1);
  },
  methods: {
    rowKey: function name(row) {
      return row.id;
    },
    getList: function (current) {
      this.tableLoading = true;
      let _this = this;
      let form = JSON.parse(JSON.stringify(this.form));
      for (let key in form) {
        if (!form[key] && form[key] !== 0) {
          delete form[key];
        } else {
          if (key === 'begin_time' || key === 'end_time') {
            form[key] = form[key] + '';
            form[key] = parseInt(form[key].substring(0, form[key].length - 3));
          }
        }
      }
      this.$heshop
        .coupon('get', form)
        .page(current, 10)
        .then(function (response) {
          let { headers, data } = response;
          _this.list = data;
          _this.tableLoading = false;
          _this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
        })
        .catch(function (error) {
          console.error(error);
          _this.$message.error(error.data.message);
          _this.tableLoading = false;
        });
    },
    emptyForm: function () {
      this.form = {
        name: '',
        status: -1,
        begin_time: null,
        end_time: null,
        sort: 4
      };
      this.getList(1);
    },
    sort: function (e) {
      if (e.prop === 'use_num') {
        if (e.order === 'ascending') {
          this.form.sort = 1;
        } else if (e.order === 'descending') {
          this.form.sort = 2;
        } else {
          this.form.sort = 4;
        }
      } else if (e.prop === 'created_time') {
        if (e.order === 'ascending') {
          this.form.sort = 3;
        } else {
          this.form.sort = 4;
        }
      }
      this.getList(this.pagination.current);
    },
    router: function (id, examine) {
      let query = {};
      id ? (query.id = id) : null;
      // 查看下架优惠券
      examine ? (query.examine = examine) : null;
      this.$router.push({
        path: '/features/coupon/detail',
        query
      });
    },
    replace: function (row) {
      this.$router.push({
        path: '/features/coupon/send',
        query: {
          id: row.id
        }
      });
    },
    pageChange: function (current) {
      this.getList(current);
    },
    delCoupon: function (id, index) {
      let _this = this;
      this.$confirm('是否确认删除优惠券？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(function () {
          _this.$heshop
            .coupon('delete', id)
            .then(function () {
              _this.$delete(_this.list, index);
              _this.$message.success('删除成功');
            })
            .catch(function (error) {
              _this.$message.error(error.data.message);
            });
        })
        .catch(function () {});
    },
    putCoupon: function (row) {
      let _this = this;
      this.$confirm('是否确认上架优惠券？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(function () {
          _this.$heshop
            .coupon(
              'put',
              {
                id: row.id,
                behavior: 'status'
              },
              {
                status: 1
              }
            )
            .then(function () {
              row.status = 1;
              _this.$message.success('上架成功');
            })
            .catch(function (error) {
              _this.$message.error(error.data.message);
            });
        })
        .catch(function () {});
    },
    downCoupon: function (row) {
      let _this = this;
      this.$confirm('优惠券下架后，用户不可再领取，但已领取过的用户，仍可继续使用优惠券，是否确认下架？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(function () {
          _this.$heshop
            .coupon(
              'put',
              {
                id: row.id,
                behavior: 'status'
              },
              {
                status: 0
              }
            )
            .then(function () {
              row.status = 0;
              _this.$message.success('下架成功');
            })
            .catch(function (error) {
              _this.$message.error(error.data.message);
            });
        })
        .catch(function () {});
    }
  }
};
</script>

<style lang="less" scoped="true">
@import './css/index.less';

.el-breadcrumb__item {
  font-size: 12px;
}
</style>
