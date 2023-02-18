<template>
  <div class="task-goodsList">
    <div class="__goods_tools">
      <el-checkbox
        :indeterminate="indeterminate"
        @change="handleCheckAllChange"
        class="le_goods__header-checkbox"
        v-model="allCheck"
        >当页全选
      </el-checkbox>
      <popconfirm
        :disabled="checkList.length === 0"
        @confirm="putOffShelf(1)"
        title="确认上架选中商品？"
        width="320.2px"
      >
        <el-button :disabled="checkList.length === 0">上架</el-button>
      </popconfirm>
      <template v-if="tab_key !== 'nosale' && tab_key !== 'drafts'">
        <popconfirm
          :disabled="checkList.length === 0"
          @confirm="putOffShelf(0)"
          title="确认下架选中商品？"
          width="320.2px"
        >
          <el-button :disabled="checkList.length === 0">下架</el-button>
        </popconfirm>
      </template>
      <template v-if="tab_key !== 'recycle'">
        <popconfirm
          :disabled="checkList.length === 0"
          width="424px"
          @confirm="batchDeletion"
          title="商品删除请谨慎操作，确定删除？"
        >
          <el-button :disabled="checkList.length === 0">删除</el-button>
        </popconfirm>
      </template>
      <!-- 执行真实删除 -->
      <template v-if="tab_key == 'recycle'">
        <popconfirm
          :disabled="checkList.length === 0"
          width="424px"
          @confirm="batchRecycleDelete"
          title="商品将被删除且无法撤销，确定删除？"
        >
          <el-button :disabled="checkList.length === 0">删除</el-button>
        </popconfirm>
        <popconfirm :disabled="checkList.length === 0" width="330px" @confirm="batchRestore" title="确认恢复商品？">
          <el-button :disabled="checkList.length === 0">恢复</el-button>
        </popconfirm>
      </template>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort="{ prop: 'created_time', order: 'descending' }"
      @selection-change="handleSelectionChange"
      @select="selectRow"
      @select-all="selectAll"
      ref="goodsTable"
      @sort-change="handleSortMethod"
    >
      <el-table-column type="selection" width="35"> </el-table-column>
      <el-table-column prop="name" label="商品描述" min-width="312">
        <template slot-scope="scope">
          <div class="__goods_cover">
            <img :src="getGoodsCover(scope.row.slideshow)" alt="" />
            <div class="__goods_title">
              <h3>{{ scope.row.name | capitalize }}</h3>
              <p>货号：{{ scope.row.data.goods_sn }}</p>
              <p>ID:{{ scope.row.id }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="task_number" label="积分价格" sortable="custom" min-width="180">
        <template slot-scope="scope">
          <p v-if="scope.row.task">{{ scope.row.task.task_number }}积分 + ¥{{ scope.row.task.task_price }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="task_stock" label="已兑换/剩余" sortable="custom" min-width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.visitors }}/{{ scope.row.task.task_stock }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="created_time" label="创建时间" sortable="custom" min-width="180">
        <template slot-scope="scope">
          <p>{{ scope.row.task.created_time | dateFormat }}</p>
        </template>
      </el-table-column>
      <el-table-column prop="goods_is_sale" label="商品状态" min-width="180" v-if="tab_key !== 'recycle'">
        <template slot-scope="scope">
          <template v-if="scope.row.task.task_stock > 0">
            <el-tag size="medium" type="success" v-if="scope.row.task.goods_is_sale == 1">销售中</el-tag>
            <el-tag size="medium" type="info" v-else-if="scope.row.task.goods_is_sale == 0">下架中</el-tag>
          </template>
          <el-tag size="medium" type="warning" v-else>售罄</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="180">
        <template slot-scope="scope">
          <div class="le-button-editor el-row--flex he-btn flex align-center">
            <template v-if="tab_key != 'recycle'">
              <he-link :query="{ id: scope.row.task.id }" href="plugins/task/edit">
                <el-button type="text" class="le-goods__btn">编辑</el-button>
              </he-link>
              <span class="he-btn__span" v-if="tab_key !== 'soldout'"></span>
              <el-button
                style="position: relative; top: 2px"
                :hide_footer="true"
                :id="scope.row.id + '_promote'"
                module="goods"
                title="推广"
                class="le-goods__btn"
                type="text"
                v-popup.promotetask="{
                  data: scope.row,
                  promoteType: 'goods'
                }"
                width="791"
                v-if="tab_key !== 'soldout'"
                >推广
              </el-button>
              <span class="he-btn__span" v-if="tab_key !== 'drafts'"></span>
              <popconfirm @confirm="deleteGoods(scope.row.id)" width="392px" title="商品删除请谨慎操作，确定删除？">
                <el-button class="le-goods__btn" type="text">删除</el-button>
              </popconfirm>
            </template>
            <template v-if="tab_key == 'recycle'">
              <popconfirm
                @confirm="recycleDelete({ id: scope.row.id, index: scope.$index })"
                title="商品将被删除且无法撤销，确定删除？"
                width="392px"
              >
                <el-button class="le-goods__btn" type="text">删除</el-button>
              </popconfirm>
            </template>
            <template v-if="tab_key == 'recycle'">
              <span class="he-btn__span"></span>
              <popconfirm
                @confirm="restore({ id: scope.row.id, index: scope.$index })"
                title="确认恢复商品？"
                width="320px"
              >
                <el-button class="le-goods__btn" type="text">恢复</el-button>
              </popconfirm>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="he-tabpane-pagination" style="padding: 14px 0 28px 0">
      <div class="__goods_tools" style="float: left">
        <el-checkbox
          :indeterminate="indeterminate"
          @change="handleCheckAllChange"
          class="le_goods__header-checkbox"
          v-model="allCheck"
          >当页全选
        </el-checkbox>
        <popconfirm
          :disabled="checkList.length === 0"
          @confirm="putOffShelf(1)"
          title="确认上架选中商品？"
          width="320.2px"
        >
          <el-button :disabled="checkList.length === 0">上架</el-button>
        </popconfirm>
        <template v-if="tab_key !== 'nosale' && tab_key !== 'drafts'">
          <popconfirm
            :disabled="checkList.length === 0"
            @confirm="putOffShelf(0)"
            title="确认下架选中商品？"
            width="320.2px"
          >
            <el-button :disabled="checkList.length === 0">下架</el-button>
          </popconfirm>
        </template>
        <template v-if="tab_key !== 'recycle'">
          <popconfirm
            :disabled="checkList.length === 0"
            width="424px"
            @confirm="batchDeletion"
            title="商品删除请谨慎操作，确定删除？"
          >
            <el-button :disabled="checkList.length === 0">删除</el-button>
          </popconfirm>
        </template>
        <!-- 执行真实删除 -->
        <template v-if="tab_key == 'recycle'">
          <popconfirm
            :disabled="checkList.length === 0"
            width="424px"
            @confirm="batchRecycleDelete"
            title="商品将被删除且无法撤销，确定删除？"
          >
            <el-button :disabled="checkList.length === 0">删除</el-button>
          </popconfirm>
          <popconfirm :disabled="checkList.length === 0" width="330px" @confirm="batchRestore" title="确认恢复商品？">
            <el-button :disabled="checkList.length === 0">恢复</el-button>
          </popconfirm>
        </template>
      </div>
      <div style="float: right">
        <el-pagination
          :current-page="page.current"
          :page-count="page.count"
          @current-change="currentChange"
          @size-change="sizeChange"
          background=""
          layout="prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import popconfirm from '@/components/popconfirm.vue';
export default {
  components: {
    popconfirm
  },
  /**
   * 对外接口
   * @type {Object}
   */
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: ''
    },
    tab_key: {
      type: [String, Number, Boolean, Object, Array],
      default: 'all'
    },
    status: {
      type: String,
      default: 'all'
    }
  },
  data() {
    return {
      indeterminate: false,
      checkList: [],
      page: {
        size: 20,
        current: 1
      },
      allCheck: false,
      checked: false,
      tableData: []
    };
  },
  filters: {
    /**
     * 格式化时间
     * @param  {[type]} row    [description]
     * @param  {[type]} column [description]
     * @return {[type]}        [description]
     */
    dateFormat(date) {
      if (date === undefined) {
        return '';
      }
      return moment(date * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
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
    this.handleGoodsLoad();
  },
  methods: {
    aaaaaa(e) {},
    /**
     * 执行排序
     * @return {[type]} [description]
     */
    handleSortMethod(e) {
      if (e.order == 'ascending') {
        if (e.prop == 'task_number') {
          this.value['sort'] = {
            't.task_number': 'ASC',
            't.task_price': 'ASC'
          };
        }
        if (e.prop == 'task_stock') {
          this.value['sort'] = {
            't.task_stock': 'ASC'
          };
        }
        if (e.prop == 'created_time') {
          this.value['sort'] = {
            't.created_time': 'ASC'
          };
        }
      }
      if (e.order == 'descending') {
        if (e.prop == 'task_number') {
          this.value['sort'] = {
            't.task_number': 'DESC',
            't.task_price': 'DESC'
          };
        }
        if (e.prop == 'task_stock') {
          this.value['sort'] = {
            't.task_stock': 'DESC'
          };
        }
        if (e.prop == 'created_time') {
          this.value['sort'] = {
            't.created_time': 'DESC'
          };
        }
      }

      if (e.order == null) {
        this.value['sort'] = {};
      }
      this.handleGoodsLoad();
    },
    /**
     * 底部全选按钮
     * @return {[type]} [description]
     */
    handleCheckAllChange() {
      this.$refs.goodsTable.toggleAllSelection();
    },
    /**
     * 选择的参数输数据
     * @return {[type]} [description]
     */
    handleSelectionChange(rows) {
      this.checkList = rows.map(v => {
        return v.id;
      });
      this.allCheck = this.checkList.length === this.tableData.length;
      this.indeterminate = this.checkList.length > 0 && this.checkList.length < this.tableData.length;
    },
    /**
     * 处理全选问题
     * @param  {[type]} rows [description]
     * @return {[type]}      [description]
     */
    selectAll: function (rows) {
      if (rows.length > 0) {
        this.allCheck = true;
        this.indeterminate = false;
      } else {
        this.allCheck = false;
      }
    },
    /**
     * 处理是否选中
     * @return {[type]} [description]
     */
    selectRow: function () {
      if (this.allCheck) this.allCheck = false;
    },

    formatter(row, column) {
      return row.address;
    },
    /**
     * 执行上架下架
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    putOffShelf(e) {
      this.$heshop
        .plugin(
          'put',
          { include: 'task', model: 'goods', type: 1 },
          {
            goods_is_sale: e,
            checkList: this.checkList
          }
        )
        .then(res => {
          this.handleGoodsLoad();
          let str = '';
          if (e === 1) {
            str = '上架成功';
          } else {
            str = '下架成功';
          }
          this.$message.success(str);
        })
        .catch(err => {
          this.$refs.goodsTable.clearSelection();
          this.$message.error(err.data.message);
        });
    },
    /**
     * 获取封面信息
     * @param  {[type]} cover [description]
     * @return {[type]}       [description]
     */
    getGoodsCover(cover) {
      if (cover) {
        if (Object.prototype.toString.call(cover) === '[object Array]') {
          return cover[0];
        }
        if (Object.prototype.toString.call(cover) === '[object String]') {
          try {
            return JSON.parse(cover)[0];
          } catch (e) {
            return this.ipAddress + '/le-default-goods-bg.png';
          }
        }
      }
      return this.ipAddress + '/le-default-goods-bg.png';
    },
    /**
     * 加载商品数据
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    handleGoodsLoad() {
      let keyword = JSON.parse(JSON.stringify(this.value));
      keyword.tab_key = this.tab_key;
      let { page } = this;
      //执行API方法
      this.$heshop
        .plugin('get', { include: 'task', model: 'goods', keyword: JSON.stringify(keyword) })
        .page(page.current, page.size)
        .then(res => {
          //判断文件是否存在
          if (res && res.headers) {
            let { data, headers } = res;
            this.page = {
              current: +headers['x-pagination-current-page'],
              count: +headers['x-pagination-page-count'],
              size: +headers['x-pagination-per-page'],
              total: +headers['x-pagination-total-count']
            };
            if (headers['content-page']) {
              let statistics = JSON.parse(headers['content-page']);
              this.$parent.$parent.$parent.statistics = statistics;
            }
            this.tableData = data;
          }
        })
        .catch(err => {
          this.$message.error('加载配置信息失败，请检查网络');
        });
    },
    sizeChange: function (e) {
      this.page.size = e;
      this.$emit('request', { page: this.page, sort: this.order });
    },
    currentChange: function (e) {
      this.page.current = e;
      this.$emit('request', { page: this.page, sort: this.order });
    },
    /**
     * 执行商品删除
     * @param  {[type]} id [description]
     * @return {[type]}    [description]
     */
    deleteGoods(id) {
      this.$heshop
        .goods('delete', id, { is_task: 1 })
        .then(() => {
          this.$message.success('删除成功');
          this.handleGoodsLoad();
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    /**
     * 批量删除
     * @return {[type]} [description]
     */
    batchDeletion: function () {
      this.$heshop
        .goods('delete', this.checkList, { is_task: 1 })
        .then(() => {
          this.$message.success('删除成功');
          this.handleGoodsLoad();
          this.allCheck = false;
        })
        .catch(err => {
          this.$refs.goodsTable.clearSelection();
          this.$message.error(err.data.message);
        });
    },
    /**
     * 执行恢复
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    restore: function (e) {
      this.$heshop
        .recycle('put', { id: e.id, include: 'goods', is_task: 1 }, null)
        .then(() => {
          this.$message.success('恢复成功');
          this.handleGoodsLoad();
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    /**
     * 批量恢复
     * @return {[type]} [description]
     */
    batchRestore: function () {
      this.$heshop
        .recycle('put', { id: this.checkList, include: 'goods', is_task: 1 }, null)
        .then(() => {
          this.$message.success('恢复成功');
          this.handleGoodsLoad();
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    /**
     * 执行真实删除
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    recycleDelete: function (e) {
      this.$heshop
        .recycle('delete', e.id, { include: 'goods', is_task: 1 })
        .then(() => {
          this.$message.success('删除成功');
          this.handleGoodsLoad();
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    /**
     * 批量真实删除
     * @return {[type]} [description]
     */
    batchRecycleDelete: function () {
      this.$heshop
        .recycle('delete', this.checkList, { include: 'goods', is_task: 1 })
        .then(() => {
          this.$message.success('删除成功');
          this.handleGoodsLoad();
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    }
  }
};
</script>
<style lang="less" scoped="true">
@import '../../task.less';

.el-tag {
  background-color: #ffffff !important;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  padding: 0 16px;
  border-radius: 4px;
  height: 28px;
}

.le_goods__header-checkbox {
  margin-left: 13px;
  margin-right: 16px;
  font-size: 12px;
}

/deep/.el-table-column--selection.is-leaf .el-checkbox {
  margin-left: 4px;
  display: none;
}

/deep/ .el-table .cell {
  text-overflow: clip;
}
</style>
