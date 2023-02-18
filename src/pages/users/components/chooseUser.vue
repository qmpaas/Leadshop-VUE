<template>
  <div class="le-matter le-chooseUser">
    <el-input
      v-model="search"
      class="le-chooseUser-input"
      :disabled="loading"
      placeholder="请输入用户ID/昵称搜索"
      clearable
      @clear="getUsers(1)"
      @keyup.enter.native="getUsers(1)"
    >
      <el-button slot="append" icon="el-icon-search" @click="getUsers(1)"></el-button>
    </el-input>
    <el-table
      :data="list"
      height="333px"
      class="le-chooseUser-table"
      ref="usersTable"
      v-loading="loading"
      @selection-change="selection"
      header-cell-class-name="le-chooseUser-table-header-cell"
      row-class-name="le-chooseUser-table-row"
    >
      <el-table-column type="selection" width="45"> </el-table-column>
      <el-table-column label="用户ID" width="120" prop="id"></el-table-column>
      <el-table-column label="用户昵称" prop="nickname">
        <template slot-scope="scope">
          <he-icon size="18px" v-if="scope.row.oauth.type === 'weapp'" type="le-icon-xiaochengxu"></he-icon>
          <he-icon size="18px" v-else-if="scope.row.oauth.type === 'wechat'" type="le-icon-wehcat"></he-icon>
          {{ scope.row.nickname }}
        </template>
      </el-table-column>
    </el-table>
    <div class="flex justify-end le-chooseUser-pagination">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :disabled="loading"
        :pager-count="5"
        :current-page="pagination.current"
        :page-count="pagination.count"
        @current-change="getUsers"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'chooseUser',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      list: [],
      loading: true,
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
    getUsers: function (current) {
      let _this = this;
      this.loading = true;
      this.$heshop
        .search(
          'post',
          { include: 'users' },
          {
            keyword: {
              search: this.search
            }
          }
        )
        .page(current, 5)
        .then(function (response) {
          let { data, headers } = response;
          _this.list = data;
          _this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
          _this.choose = [];
          _this.loading = false;
          _this.$nextTick(() => {
            _this.list.forEach(row => {
              for (var i in _this.selected) {
                if (row.id === _this.selected[i].id) {
                  _this.$refs.usersTable.toggleRowSelection(row, true);
                }
              }
            });
          });
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
    affirm: function (e) {
      let { handleClose } = e;
      handleClose();
      let selected = [];
      for (var i in this.selected) {
        selected.push(this.selected[i]);
      }
      this.value.item = selected;

      // this.$emit('input', this.value);
    }
  },
  mounted() {
    this.getUsers(1);
    this.selected = {};
    let selected = JSON.parse(JSON.stringify(this.value.item));
    selected.forEach(v => {
      this.selected[v.id] = v;
    });
  }
};
</script>
<style scoped lang="scss">
.le-chooseUser {
  .le-chooseUser-input /deep/ {
    margin-bottom: 16px;
    width: 367px;

    .el-input-group__append {
      width: 45px;

      .el-button {
        padding: 9px 15px;
      }
    }
  }

  .le-chooseUser-table /deep/ {
    .le-chooseUser-table-row {
      height: 57px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
    }

    .le-chooseUser-table-header-cell {
      height: 48px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #595959;
    }
  }

  .le-chooseUser-pagination {
    padding: 24px 0 0 0;
  }
}
</style>
