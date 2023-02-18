<template>
  <div class="le-matter le-user-label">
    <div class="le-head flex">
      <div class="le-card flex align-center" @click="setType(1)" :class="keyword.type === 1 ? 'active' : ''">
        <he-icon size="48px" class="le-head-icon" type="le-icon-shoudongbiaoqian"></he-icon>
        <div class="flex-sub">
          <div class="le-head-title">手动标签</div>
          <div class="le-head-desc">需手动给用户添加的标签</div>
        </div>
      </div>
      <div class="le-card flex align-center" @click="setType(2)" :class="keyword.type === 2 ? 'active' : ''">
        <he-icon size="48px" class="le-head-icon" type="le-icon-zidongbiaoqian"></he-icon>
        <div class="flex-sub">
          <div class="le-head-title">自动标签</div>
          <div class="le-head-desc">满足条件的用户，被自动加上标签</div>
        </div>
      </div>
    </div>
    <div class="le-body le-card" v-loading="bodyLoading">
      <el-input
        placeholder="请输入标签名搜索"
        clearable
        class="le-input-search"
        v-model="keyword.name"
        @clear="getList(1)"
        @keyup.enter.native="getList(1)"
      >
        <el-button slot="append" icon="el-icon-search" @click="getList(1)"></el-button>
      </el-input>
      <el-button class="le-add-button" type="primary" @click="routerGo">新建标签</el-button>
      <el-table
        class="le-table"
        :data="list"
        :height="660"
        header-cell-class-name="le-table-header-cell"
        :default-sort="{ prop: 'created_time', order: 'descending' }"
        @sort-change="sortlist"
        row-class-name="le-table-row"
      >
        <el-table-column label="标签名" prop="name"></el-table-column>
        <el-table-column sortable="custom" label="用户数" prop="users_number"></el-table-column>
        <el-table-column v-if="keyword.type === 2" label="打标条件" prop="name">
          <template slot-scope="scope">
            <div class="le-table-row-type">
              {{ scope.row.conditions_status === 1 ? '满足所有条件' : '满足任一条件' }}
            </div>
            <div class="le-table-row-conditions">{{ scope.row.conditions_setting | conditions }}</div>
          </template>
        </el-table-column>
        <el-table-column sortable="custom" label="创建时间" prop="created_time">
          <template slot-scope="scope">
            {{ scope.row.created_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="le-table-edit flex align-center">
              <span class="le-button-text" @click="routerGo(scope.row)">编辑</span>
              <span class="le-line-text"></span>
              <span class="le-button-text" @click="delLabel(scope.row)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="le-body-footer flex justify-end">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          :current-page="pagination.current"
          :page-count="pagination.count"
          @current-change="getList"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'userLabel',
  data() {
    return {
      list: [],
      bodyLoading: false,
      pagination: {
        current: 1,
        count: 1
      },
      keyword: {
        sort: {
          created_time: 'DESC'
        },
        type: 1,
        name: ''
      }
    };
  },
  methods: {
    getList: function (current) {
      let _this = this;
      _this.bodyLoading = true;
      this.$heshop
        .search('post', { include: 'label' }, this.keyword)
        .page(current, 10)
        .then(function (response) {
          let { data, headers } = response;
          _this.list = data;
          _this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
          _this.bodyLoading = false;
        })
        .catch(function (error) {
          console.error(error);
        });
    },
    sortlist: function (e) {
      this.keyword.sort = {};
      this.keyword.sort[e.prop] = e.order === 'ascending' ? 'ASC' : e.order === 'descending' ? 'DESC' : null;
      this.getList(this.pagination.current);
    },
    setType: function (e) {
      this.list = [];
      this.keyword.type = e;
      this.getList(1);
    },
    routerGo: function (e) {
      let query = {
        type: this.keyword.type
      };
      if (e.id) query.id = e.id;
      this.$router.push({
        path: '/users/editLabel',
        query: query
      });
    },
    delLabel: function (row) {
      let _this = this;
      this.$confirm('彻底删除后标签无法恢复，确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(function () {
          _this.$heshop.userlabel('delete', row.id).then(function () {
            _this.getList(_this.pagination.current);
          });
        })
        .catch(function () {});
    }
  },
  filters: {
    conditions: function (e) {
      let str = '';
      for (let key in e) {
        if (e[key].checked) {
          // 指定消费时间
          if (key === 'shopping_time') {
            str += '指定消费时间/';
          }
          // 指定消费次数
          if (key === 'shopping_number') {
            str += '指定消费次数/';
          }
          // 指定消费金额
          if (key === 'shopping_amount') {
            str += '指定消费金额/';
          }
          // 购买指定商品
          if (key === 'shopping_goods') {
            str += '购买指定商品/';
          }
          // 购买指定分类
          if (key === 'shopping_group') {
            str += '购买指定分类/';
          }
        }
      }
      return str.slice(0, str.length - 1);
    }
  },
  mounted() {
    this.keyword.type = this.$route.query.type ? parseInt(this.$route.query.type) : 1;
    this.getList(1);
  }
};
</script>

<style scoped lang="scss">
@import './css/userLabel.less';
</style>
