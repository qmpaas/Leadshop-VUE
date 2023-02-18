<template>
  <div class="le-main">
    <div class="le-card flex">
      <img class="le-img" :src="good.image" alt="">
      <div class="le-name">{{ good.name }}</div>
    </div>
    <el-form class="le-card" label-width="118px" inline>
      <el-form-item label="评价来源">
        <el-select placeholder="请选择" v-model="type">
          <el-option label="全部" value=" "></el-option>
          <el-option label="评论库抓取" value="repository"></el-option>
          <el-option label="API抓取" value="api"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="评价状态">
        <el-select placeholder="请选择" v-model="status">
          <el-option label="全部" value=" "></el-option>
          <el-option label="显示" value="display"></el-option>
          <el-option label="隐藏" value="hidden"></el-option>
          <el-option label="置顶" value="top"></el-option>
        </el-select>
      </el-form-item>
      <div style="margin-left: 50px">
        <el-button type="primary" @click="getList">筛选</el-button>
        <el-button @click="empty">清空</el-button>
      </div>
    </el-form>
    <div class="le-card">
      <div class="le-batch">
        <el-checkbox
          :indeterminate="indeterminate"
          @change="allCheckEvent"
          v-model="allCheck">当页全选
        </el-checkbox>
        <el-button :disabled="selected.length === 0" @click="batchEdit(2)">批量置顶</el-button>
        <el-button :disabled="selected.length === 0" @click="batchEdit(1)">批量显示</el-button>
        <el-button :disabled="selected.length === 0" @click="batchEdit(0)">批量隐藏</el-button>
        <el-button :disabled="selected.length === 0" @click="batchDel()">批量删除</el-button>
      </div>
      <el-table
        :data="list"
        ref="goodsTable"
        @selection-change="handleSelectionChange"
        cell-class-name="le-cell-table"
        class="le-table">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="评价等级">
          <template slot-scope="scope">
            <div>{{ scope.row.star >= 4 ? '好评' : scope.row.star > 2 ? '中评' : '差评' }}</div>
            <el-rate :colors="colors" :low-threshold="2" disabled v-model="scope.row.star"></el-rate>
          </template>
        </el-table-column>
        <el-table-column label="评价内容" width="312px">
          <template slot-scope="scope">
            <div>{{ scope.row.content }}</div>
            <div class="flex flex-wrap">
              <el-image
                :preview-src-list="scope.row.images"
                class="le-image"
                :key="index"
                v-for="(item, index) in scope.row.images"
                :src="item"
              ></el-image>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" prop="ai_nickname">
        </el-table-column>
        <el-table-column label="商品规格" prop="show_goods_param"></el-table-column>
        <el-table-column label="评价时间">
          <template slot-scope="scope">
            {{ $moment(scope.row.created_time * 1000).format(`YYYY-MM-DD hh:mm:ss`) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="editStatus(scope.row, 2)"
              v-if="scope.row.status !== 2">置顶
            </el-button>
            <el-button
              type="text"
              @click="editStatus(scope.row, 1)"
              v-else>取消置顶
            </el-button>
            <span class="le-line">|</span>
            <el-button
              type="text"
              @click="editStatus(scope.row, 0)"
              v-if="scope.row.status !== 0">隐藏
            </el-button>
            <el-button
              type="text"
              @click="editStatus(scope.row, 1)"
              v-else>显示
            </el-button>
            <span class="le-line">|</span>
            <el-button type="text" @click="del(scope.row, scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-between le-footer">
        <div class="le-batch">
          <el-checkbox
            :indeterminate="indeterminate"
            @change="allCheckEvent"
            v-model="allCheck">当页全选
          </el-checkbox>
          <el-button :disabled="selected.length === 0" @click="batchEdit(2)">批量置顶</el-button>
          <el-button :disabled="selected.length === 0" @click="batchEdit(1)">批量显示</el-button>
          <el-button :disabled="selected.length === 0" @click="batchEdit(0)">批量隐藏</el-button>
          <el-button :disabled="selected.length === 0" @click="batchDel()">批量删除</el-button>
        </div>
        <el-pagination
          @current-change="getList"
          layout="prev, pager, next, jumper"
          background
          :pager-count="5"
          :current-page.sync="pagination.current"
          :page-count="pagination.count"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'view-reviews',
  data() {
    return {
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      good: {
        image: ''
      },
      list: [],
      status: ' ',
      type: ' ',
      pagination: {
        current: 1,
        count: 1
      },
      selected: [],
      allCheck: false,
      indeterminate: false
    };
  },
  mounted() {
    try {
      this.good = JSON.parse(decodeURIComponent(this.$route.query.good));
      this.type = this.$route.query.type;
      this.getList();
    } catch (err) {
      this.$router.back();
    }
  },
  methods: {
    getList() {
      this.$heshop
        .plugin('get', {
          include: 'evaluate',
          model: 'evaluate',
          status: this.status,
          type: this.type,
          goods_id: this.good.id
        }).page(this.pagination.current, 10).then(response => {
        const {headers, data} = response;
        this.list = data;
        this.pagination = {
          current: +headers['x-pagination-current-page'],
          count: +headers['x-pagination-page-count']
        };
      });
    },
    editStatus(item, status) {
      let str = '';
      if (status === 2) {
        str = '确认置顶该评价？';
      } else if (status === 0) {
        str = '确认隐藏该评价？';
      } else if (status === 1) {
        if (item.status === 2) {
          str = "确认取消置顶该评价？";
        } else if (item.status === 0) {
          str = "确认显示该评价？";
        }
      }
      this.$confirm(str, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        this.$heshop.plugin("put", {
          include: "evaluate",
          model: "evaluate",
          ids: [item.id]
        }, {
          status: status
        }).then(() => {
          let message = '';
          if (status === 2) {
            message = '置顶成功';
          } else if (status === 0) {
            message = '隐藏成功';
          } else if (status === 1) {
            if (item.status === 2) {
              message = "取消置顶成功";
            } else if (item.status === 0) {
              message = "显示成功";
            }
          }
          item.status = status;
          this.$message({
            type: "success",
            message: message
          });
        })
      });
    },
    del(item, index) {
      this.$confirm("确认删除该评价？", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        this.$heshop.plugin("delete", [item.id], {
          include: "evaluate",
          model: "evaluate",
          behavior: "evaluate",
          ids: [item.id]
        }).then(() => {
          this.$delete(this.list, index);
          this.$message({
            type: "success",
            message: "删除成功"
          })
        })
      })
    },
    empty() {
      this.status = " ";
      this.type = " ";
      this.getList();
    },
    handleSelectionChange(value) {
      this.selected = value;
      this.allCheck = this.selected.length === this.list.length;
      this.indeterminate = this.selected.length > 0 && this.selected.length < this.list.length;
    },
    allCheckEvent() {
      if (this.allCheck) {
        this.list.forEach(row => {
          this.$refs.goodsTable.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.goodsTable.clearSelection();
      }
    },
    batchEdit(status) {
      let str = '';
      if (status === 2) {
        str = '确认批量置顶选中评价？';
      } else if (status === 0) {
        str = '确认批量隐藏该评价？';
      } else if (status === 1) {
        str = '确认批量显示该评价？';
      }
      this.$confirm(str, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        const ids = this.selected.map((item) => {
          return item.id;
        });
        this.$heshop.plugin("put", {
          include: "evaluate",
          model: "evaluate",
          ids: ids
        }, {
          status: status
        }).then(() => {
          let message = '';
          if (status === 2) {
            message = '批量置顶成功';
          } else if (status === 0) {
            message = '批量隐藏成功';
          } else if (status === 1) {
            message = "批量显示成功";
          }
          this.selected.forEach((item) => {
            item.status = status;
          });
          this.$message({
            type: "success",
            message: message
          });
        })
      });
    },
    batchDel() {
      this.$confirm("确认批量删除选中评价？", {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        const ids = this.selected.map((item) => {
          return item.id;
        });
        this.$heshop.plugin("delete",ids, {
          include: "evaluate",
          model: "evaluate",
          behavior: "evaluate",
          ids,
        }).then(() => {
          this.$message({
            type: "success",
            message: "批量删除成功"
          });
          this.getList();
        });
      });
    }
  }
};
</script>

<style scoped lang="less">
.le-card {
  &:not(:last-child) {
    margin-bottom: 24px;
  }

  .el-select {
    width: 200px;

    /deep/ .el-input {
      width: 100%;
    }
  }

  .le-img {
    width: 48px;
    height: 48px;
  }

  .le-name {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
    margin-left: 12px;
  }

  .le-table {
    margin: 16px 0;
  }

  /deep/ .le-cell-table {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
    vertical-align: top;
    padding: 16px 0;

    .cell {
      padding-left: 10px;
    }
  }

  .le-image {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    margin: 0 8px 8px 0;
  }

  .el-button--text {
    padding: 0;
  }

  .le-line {
    color: #623ceb;
    display: inline-block;
    margin: 0 10px;
  }
}

.le-batch {
  padding-left: 10px;

  .el-checkbox {
    margin-right: 8px;
  }
}
</style>
