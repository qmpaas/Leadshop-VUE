<template>
  <div class="le-matter">
    <el-button type="primary" module="goods" v-popup.groupTemplate title="新增规格模板" width="788" action="getGroup"
      >新增规格模板
    </el-button>
    <el-form class="le-card le-search" label-width="96px" @submit.native.prevent>
      <el-form-item label="规格搜索">
        <el-input
          placeholder="输入规格名称搜索"
          v-model="name"
          clearable
          @clear="getList(1)"
          @keydown.enter.native="getList(1)"
        ></el-input>
      </el-form-item>
      <el-button type="primary" class="le-search-btn" @click="getList(1)">筛选 </el-button>
      <el-button @click="empty">清空</el-button>
    </el-form>
    <div class="le-card le-list">
      <div class="le-operating">
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
          >当页全选
        </el-checkbox>
        <el-button :disabled="checkList.length === 0" @click="delAll">删除 </el-button>
      </div>
      <el-table
        :data="list"
        class="le-table"
        ref="templateTable"
        v-loading="loading"
        :row-key="rowKey"
        row-class-name="le-table-row"
        @selection-change="selectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="规格名" prop="param_name" min-width="260px"></el-table-column>
        <el-table-column label="规格值" min-width="746px">
          <template slot-scope="scope">
            {{ scope.row.param_data.join(';  ') }}
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="210px">
          <template slot-scope="scope">
            <div class="le-table-edit flex align-center">
              <span
                class="le-button-text"
                module="goods"
                :id="'group_template_' + scope.row.id"
                v-popup.groupTemplate="{ item: scope.row, index: scope.$index }"
                title="编译规格模板"
                width="788"
                >编辑</span
              >
              <span class="le-line-text"></span>
              <span class="le-button-text" @click="delItem(scope.row.id, scope.$index)">删除</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="le-operating flex justify-between">
        <div class="">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"
            >当页全选
          </el-checkbox>
          <el-button :disabled="checkList.length === 0" @click="delAll">删除 </el-button>
        </div>
        <el-pagination
          :disabled="loading"
          @current-change="getList"
          :current-page="pagination.current"
          :page-count="pagination.count"
          background
          layout="prev, pager, next, jumper"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      name: '',
      pagination: {
        current: 1,
        count: 1
      },
      list: [],
      checkList: [],
      checkAll: false,
      isIndeterminate: false
    };
  },
  methods: {
    rowKey: function (row) {
      return row.id;
    },
    getList: function (current) {
      let _this = this;
      this.loading = true;
      this.$heshop
        .goodstemplate('get', {
          name: this.name
        })
        .page(current, 15)
        .then(function (response) {
          let { headers, data } = response;
          _this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
          _this.list = data;
          _this.loading = false;
        })
        .catch(function (error) {
          _this.$message.error(error.data.message);
          _this.loading = false;
        });
    },
    getGroup: function () {
      this.getList(this.pagination.current);
    },
    handleCheckAllChange: function () {
      this.isIndeterminate = false;
      this.checkList = this.list;
      this.list.forEach(item => {
        this.$refs.templateTable.toggleRowSelection(item, this.checkAll);
      });
    },
    selectionChange: function (list) {
      this.checkList = list;
      this.isIndeterminate = this.checkList.length > 0 && this.checkList.length < this.list.length;
      if (this.checkList.length === this.list.length) {
        this.checkAll = true;
      }
      if (this.checkList.length === 0) {
        this.checkAll = false;
      }
    },
    empty: function () {
      this.name = '';
      this.getList(1);
    },
    delItem: function (id, index) {
      let _this = this;
      this.$confirm('是否确认删除此条规格模板？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(function () {
          _this.$heshop
            .goodstemplate('delete', id)
            .then(function () {
              _this.$delete(_this.list, index);
              if (_this.pagination.current > 1 && _this.list.length === 0) {
                let page = _this.pagination.current - 1;
                _this.getList(page);
              } else if (_this.pagination.current >= 1 && _this.list.length !== 0 && _this.pagination.count !== 1) {
                _this.getList(_this.pagination.current);
              }
              _this.$message.success('删除成功');
            })
            .catch(function (error) {
              _this.$message.error(error.data.message);
            });
        })
        .catch(function () {});
    },
    delAll: function () {
      let _this = this;
      let newArr = this.checkList.map(function (item) {
        return item.id;
      });
      this.$confirm('是否确认删除选中规格模板？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(function () {
          _this.$heshop
            .goodstemplate('delete', newArr)
            .then(function () {
              let num = _this.list.length - newArr.length;
              if (_this.pagination.current > 1 && num === 0) {
                let page = _this.pagination.current - 1;
                _this.getList(page);
              } else if (_this.pagination.current >= 1 && num !== 0 && _this.pagination.count !== 1) {
                _this.getList(_this.pagination.current);
              }
              _this.$message.success('删除成功');
              _this.checkList = [];
            })
            .catch(function (error) {
              _this.$message.error(error.data.message);
            });
        })
        .catch(function () {});
    }
  },
  mounted() {
    this.getList(1);
  }
};
</script>

<style lang="scss" scoped>
.le-card {
  background: #ffffff;
  border-radius: 16px;
  margin-top: 24px;
}

.le-search {
  padding: 24px 0;
}

.le-search-btn {
  margin-left: 96px;
}

.le-list {
  padding: 24px;
}

.le-table /deep/ {
  .le-table-row {
    width: 658px;
    height: 35px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 20px;
    color: rgba(0, 0, 0, 0.85);

    td {
      padding: 15px 0;
    }
  }

  .has-gutter .el-table-column--selection {
    opacity: 0;
  }

  .le-table-edit {
    color: #623ceb;
    max-width: 178px;

    .le-button-text {
      cursor: pointer;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
    }

    .le-line-text {
      height: 14px;
      width: 1px;
      background-color: #623ceb;
      margin: 0 10px;
    }
  }
}

.le-operating {
  padding-left: 14px;

  .el-button {
    margin-left: 15px;
  }
}

.le-operating:first-child {
  padding-bottom: 16px;
}

.le-operating:last-child {
  padding-top: 16px;
}
</style>
