<template>
  <el-dialog
    title="选择商品"
    :visible.sync="dialogVisible"
    width="879px"
    :before-close="
      done => {
        done();
      }
    "
  >
    <div class="task-dialog">
      <div class="__search">
        <el-autocomplete
          placeholder="请输入商品名称搜索"
          v-model="keyword.search"
          :trigger-on-focus="false"
          class="le-goodspage_search"
          size="small"
          :fetch-suggestions="handleQuerySearch"
          @select="handleGoodsGet"
          @keyup.enter.native="handleGoodsGet"
        >
          <el-button slot="append" icon="el-icon-search" @click="handleGoodsGet"></el-button>
        </el-autocomplete>
      </div>
      <div class="__lists">
        <el-table
          ref="multipleTable"
          :data="goodsData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
          row-key="id"
        >
          <el-table-column type="selection" width="55" :reserve-selection="true" :selectable="handleSelectEnable">
          </el-table-column>
          <el-table-column prop="name" label="商品描述">
            <template slot-scope="scope">
              <div class="__goods_cover">
                <img :src="scope.row.slideshow[0]" />
                <div class="__goods_title">
                  <p>{{ scope.row.name | capitalize }}</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="date" label="状态" width="130">
            <template slot-scope="scope">
              <div class="__tag is_sale" v-if="scope.row.is_sale">销售中</div>
              <div class="__tag is_shelves" v-if="!scope.row.is_sale">下架中</div>
            </template>
          </el-table-column>
          <el-table-column prop="reduce_stocks" label="库存" width="130"> </el-table-column>
        </el-table>
      </div>
      <div class="__paging">
        <el-pagination
          @current-change="handleGoodsGet"
          layout="prev, pager, next,jumper"
          background
          :page-size="pageInfo.size"
          :current-page="pageInfo.current"
          :total="pageInfo.total"
        ></el-pagination>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/javascript">
export default {
  /**
   * 对外接口
   * @type {Object}
   */
  props: {
    limit: {
      type: [String, Number],
      default: 10
    },
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: ''
    }
  },
  data() {
    return {
      /**
       * 处理选择的数据
       * @type {Object}
       */
      selectData: [],
      /**
       * 是否显示弹窗
       * @type {Boolean}
       */
      dialogVisible: false,
      /**
       * 搜索字段
       * @type {String}
       */
      keyword: { search: '' },
      /**
       * 商品数据
       * @type {Array}
       */
      goodsData: [],
      /**
       * 分页信息
       * @type {Object}
       */
      pageInfo: {
        size: 7,
        total: 0,
        current: 1
      }
    };
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {
    dialogVisible(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.multipleTable.clearSelection();
          this.selectData = JSON.parse(JSON.stringify(this.value));
          this.toggleSelection(this.selectData);
        });
      }
    }
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {},
  filters: {
    capitalize: function (value) {
      if (value.length >= 32) {
        return value.slice(0, 29) + '...';
      } else {
        return value;
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.handleGoodsGet(1);
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    /**
     * 处理选择
     * @param  {[type]} rows [description]
     * @return {[type]}      [description]
     */
    handleToggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    /**
     * [selectEnable description]
     * @param  {[type]} row      [description]
     * @param  {[type]} rowIndex [description]
     * @return {[type]}          [description]
     */
    handleSelectEnable(row, rowIndex) {
      if (this.value && this.value.some(item => item.id === row.id)) {
        // 禁用
        return false;
      } else {
        // 不禁用
        return true;
      }
    },
    /**
     * 处理搜索功能
     * @param  {[type]}   queryString [description]
     * @param  {Function} cb          [description]
     * @return {[type]}               [description]
     */
    handleQuerySearch(queryString, cb) {
      //处理关键字
      let keyword = this.keyword;
      //执行API方法
      this.$heshop
        .search('POST', { include: 'goods' }, { keyword })
        .page(1, 5)
        .then(data => {
          let _array = [];
          data.data.map(iten => {
            _array.push({
              value: iten.name
            });
          });
          cb(_array);
        })
        .catch(error => {
          this.$message.error('抱歉，网络开小差了');
        });
    },
    /**
     * 处理选择功能
     * @param  {[type]} value [description]
     * @return {[type]}       [description]
     */
    handleSelectionChange(value) {
      this.selectData = value;
    },
    /**
     * 确认关闭按钮
     * @return {[type]} [description]
     */
    handleConfirm() {
      if (this.selectData.length > this.limit) {
        this.$message.error('最多添加' + this.limit + '件商品');
      } else {
        this.$emit('input', this.selectData);
        this.$emit('confirm', this.selectData);
        this.dialogVisible = false;
      }
    },
    /**
     * 处理商品获取功能
     * @param  {Number} current [description]
     * @return {[type]}         [description]
     */
    handleGoodsGet(current = 1) {
      let keyword = this.keyword;
      this.$heshop
        .search('POST', { include: 'goods', task_in: 1 }, { keyword })
        .page(current, 5)
        .then(data => {
          let size = parseInt(data.headers['x-pagination-per-page']);
          let total = parseInt(data.headers['x-pagination-total-count']);
          let current = parseInt(data.headers['x-pagination-current-page']);
          this.pageInfo = { size, total, current };
          this.goodsData = data.data;
        })
        .catch(error => {
          this.$message.error('抱歉，网络开小差了');
        });
    }
  }
};
</script>
<style type="text/css" lang="less" scoped>
.task-dialog {
  .__search {
    margin-bottom: 16px;

    .el-input.el-input--mini.el-input-group {
      width: 368px;
    }

    .el-input-group__append {
      .el-button--mini {
        padding: 9px 16px;
      }
    }
  }

  .__lists {
    /deep/ .el-table th > .cell {
      font-size: 14px;
      font-weight: 400;
      color: #595959;
    }

    /deep/ .el-table .el-table__header th.is-leaf {
      padding-left: 4px;
    }

    .__tag {
      width: 68px;
      height: 28px;
      background: #ffffff;
      border: 1px solid #53c41a;
      border-radius: 4px;
      font-size: 12px;
      text-align: center;
      line-height: 28px;
      font-weight: 400;
      color: #53c41a;
    }

    .__tag.is_shelves {
      border: 1px solid #bebebe;
      color: #8c8c8c;
    }
  }

  .__paging {
    margin-top: 24px;
    text-align: right;

    /deep/.el-pagination {
      .el-input--mini .el-input__inner {
        height: 28px;
        line-height: 28px;
      }
    }
  }

  .__goods_cover {
    display: flex;
    position: relative;
    min-width: 330px;

    img {
      width: 48px;
      height: 48px;
      background: #f2f2f2;
      margin-right: 12px;
    }

    .__goods_title {
      display: table;
      height: 48px;
      width: 230px;

      p {
        display: table-cell;
        vertical-align: middle;
        line-height: 16px;
      }
    }
  }
}
</style>
