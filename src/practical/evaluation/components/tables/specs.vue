<template>
  <div class="task__specs">
    <u-table
      ref="plTable"
      :show-body-overflow="false"
      :data="tableData"
      :height="height"
      fixed-columns-roll
      use-virtual
      showHeaderOverflow="title"
      :row-height="rowHeight"
      @cell-click="dataCleansing"
      class="task-specs"
      :border="false"
      @selection-change="handleSelectionChange"
      @select="selectRow"
      @select-all="selectAll"
      row-key="id"
      v-if="tableData.length"
      v-loading="loading"
    >
      <u-table-column type="selection" width="34"> </u-table-column>
      <u-table-column width="282" keys="index" :label="labelName">
        <template slot-scope="scope">
          <div class="__specs_title">
            <p>{{ scope.row.param_value.replace(/_/, '/') }}</p>
          </div>
        </template>
      </u-table-column>
      <u-table-column width="170" column-key="id">
        <template slot="header" slot-scope="scope">
          <strong style="color: red; padding-right: 3px">*</strong>可兑换数量
          <el-tooltip
            class="item"
            content="可兑换数量与商城商品库存互相独立，互不影响"
            placement="top"
            popper-class="task-tooltip"
          >
            <i
              class="le-icon le-icon-zhushi1"
              style="position: relative; top: -1px; font-size: 13px; color: #bbbfc8; vertical-align: middle"
            ></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.task_stock"
            blur="(e)=>{
                     if(e.target.value=='') $message.error('可兑换数量不能为空')
                     if(!isInteger(e.target.value)) $message.error('可兑换数量必须为整数')
                     if(e.target.value>9999999) $message.error('兑换数量不能大于9999999') }"
          >
            <template slot="append">件</template>
          </el-input>
        </template>
      </u-table-column>
      <u-table-column width="310">
        <template slot="header" slot-scope="scope">
          <strong style="color: red; padding-right: 3px">*</strong>积分价格
        </template>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.task_number"
            blur="(e)=>{
                        if(e.target.value=='') $message.error('积分价格不能为空')
                        if(!isInteger(e.target.value)) $message.error('积分价格必须为整数')
                        if(e.target.value>9999999) $message.error('积分价格不能大于9999999')
                    }"
          >
            <template slot="append">积分</template>
          </el-input>
          <span style="display: inline-block; width: 24px; height: 32px; line-height: 32px; text-align: center">+</span>
          <el-input
            v-model="scope.row.task_price"
            blur="(e)=>{
                        if(e.target.value=='') $message.error('积分价格不能为空')
                        if(e.target.value>9999999) $message.error('积分价格不能大于9999999')
                    }"
          >
            <template slot="append">元</template>
          </el-input>
        </template>
      </u-table-column>
      <u-table-column width="160">
        <template slot="header" slot-scope="scope"> 兑换限制 </template>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.task_limit"
            blur="(e)=>{
                        if(e.target.value>9999999) $message.error('兑换限制不能大于9999999')
                        if(!isInteger(e.target.value)) $message.error('兑换限制必须为整数')
                        if(e.target.value>scope.row.task_stock) $message.error('兑换限制不能大于可兑换数量')
                    }"
          >
            <template slot="append">件/人</template>
          </el-input>
        </template>
      </u-table-column>
    </u-table>
    <div class="task__specs_tools">
      <el-checkbox
        v-model="allCheck"
        :indeterminate="indeterminate"
        @change="handleCheckAllChange"
        @select-all="selectAll"
        >批量设置</el-checkbox
      >
      <div style="display: inline-block" v-if="selectData.length">
        <el-popover placement="bottom-start" width="125" trigger="click" v-model="tools[0].visible">
          <div class="task__specs_input">
            <el-input v-model="tools[0].value"></el-input>
            <div style="padding-top: 10px">
              <el-button type="text" size="mini" @click="tools[0].visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleAffirm(0)">确定</el-button>
            </div>
          </div>
          <el-button slot="reference" type="text">可兑换数量</el-button>
        </el-popover>
        <el-popover placement="bottom-start" width="125" trigger="click" v-model="tools[1].visible">
          <div class="task__specs_input">
            <el-input v-model="tools[1].value"></el-input>
            <div style="padding-top: 10px">
              <el-button type="text" size="mini" @click="tools[1].visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleAffirm(1)">确定</el-button>
            </div>
          </div>
          <el-button slot="reference" type="text">积分数</el-button>
        </el-popover>
        <el-popover placement="bottom-start" width="125" trigger="click" v-model="tools[2].visible">
          <div class="task__specs_input">
            <el-input v-model="tools[2].value"></el-input>
            <div style="padding-top: 10px">
              <el-button type="text" size="mini" @click="tools[2].visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleAffirm(2)">确定</el-button>
            </div>
          </div>
          <el-button slot="reference" type="text">现金价格</el-button>
        </el-popover>
        <el-popover placement="bottom-start" width="125" trigger="click" v-model="tools[3].visible">
          <div class="task__specs_input">
            <el-input v-model="tools[3].value"></el-input>
            <div style="padding-top: 10px">
              <el-button type="text" size="mini" @click="tools[3].visible = false">取消</el-button>
              <el-button type="primary" size="mini" @click="handleAffirm(3)">确定</el-button>
            </div>
          </div>
          <el-button slot="reference" type="text">兑换限制</el-button>
        </el-popover>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  components: {},
  /**
   * 对外接口
   * @type {Object}
   */
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: ''
    },
    goods: {
      type: [String, Number, Boolean, Object, Array]
    }
  },
  data() {
    return {
      labelName: '规格',
      loading: false,
      indeterminate: false,
      selectData: [],
      dialogVisible: true,
      allCheck: false,
      searchValue: '',
      tools: [
        {
          value: '',
          visible: false
        },
        {
          value: '',
          visible: false
        },
        {
          value: '',
          visible: false
        },
        {
          value: '',
          visible: false
        }
      ],
      tableData: [],
      height: 0,
      rowHeight: 55 // 如果你这里给行高为50，那么你表格行会出现错乱，不要问为啥，因为你可以看看控制台看节点的高是多少，是55，而你这里给50就有问题！
    };
  },
  filters: {
    capitalize: function (value) {
      if (value.length >= 42) {
        return value.slice(0, 39) + '...';
      } else {
        return value;
      }
    }
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {},
  mounted() {
    this.height = 400; // 动态设置高度
    this.tableData = [];
    this.loading = true;
    this.loadGoodsData(this.goods.id);
  },
  methods: {
    /**
     * 底部全选按钮
     * @return {[type]} [description]
     */
    handleCheckAllChange() {
      this.$refs.plTable.toggleAllSelection();
    },
    /**
     * 选择的参数输数据
     * @return {[type]} [description]
     */
    handleSelectionChange(value) {
      this.selectData = value;
      this.allCheck = this.selectData.length === this.tableData.length;
      this.indeterminate = this.selectData.length > 0 && this.selectData.length < this.tableData.length;
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
    /**
     * 确认设置数据
     * @param  {[type]} index [description]
     * @return {[type]}       [description]
     */
    handleAffirm(index) {
      this.tools[index].visible = false;
      let value = this.tools[index].value;
      if (value >= 0) {
        for (let i in this.tableData) {
          switch (index) {
            case 0:
              if (!this.isInteger(value)) {
                this.$message.error('可兑换数量必须为整数');
                return;
              }
              this.tableData[i]['task_stock'] = value;
              break;
            case 1:
              if (!this.isInteger(value)) {
                this.$message.error('兑换积分必须为整数');
                return;
              }
              this.tableData[i]['task_number'] = value;
              break;
            case 2:
              this.tableData[i]['task_price'] = value;
              break;
            case 3:
              if (!this.isInteger(value)) {
                this.$message.error('兑换限制必须为整数');
                return;
              }
              this.tableData[i]['task_limit'] = value;
              break;
          }
        }
      } else {
        this.$message.error('批量修改的值不能为空或格式错误');
      }
      this.tools[index].value = '';
    },

    /**
     * 判断是否为整数
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    isInteger(obj) {
      return obj % 1 === 0;
    },
    setHei(val) {
      this.height = val;
    },
    scrollBottom() {
      this.$refs.plTable.scrollBottom();
    },
    pagingScrollTopLeft(val) {
      this.$refs.plTable.pagingScrollTopLeft(val, 0);
    },
    /**
     * 加载商品数据
     * @return {[type]} [description]
     */
    loadGoodsData(goods_id) {
      this.$heshop
        .goods('get', goods_id)
        .then(res => {
          this.labelName = '规格名称';
          if (res.param.param_data) {
            this.labelName = '';
            for (let index in res.param.param_data) {
              let item = res.param.param_data[index];
              if (item.name) {
                if (this.labelName == '') {
                  this.labelName = item.name;
                } else {
                  this.labelName += '/' + item.name;
                }
              }
            }
          }

          this.$nextTick(() => {
            this.tableData = res.param.goods_data;
            this.loading = false;

            setTimeout(function () {
              var lis1 = document.getElementsByClassName('umy-table-beyond');
              for (let index in lis1) {
                let item = lis1[index];
                if (item.removeAttribute) {
                  item.removeAttribute('title');
                }
              }
            }, 1000);
          });
        })
        .catch(err => {
          this.loading = false;
        });
    },
    /**
     * 清理DOM结构
     * @return {[type]} [description]
     */
    dataCleansing() {
      setTimeout(() => {
        var lis1 = document.getElementsByClassName('umy-table-beyond');
        for (let index in lis1) {
          let item = lis1[index];
          if (item.removeAttribute) {
            item.removeAttribute('title');
          }
        }
      }, 1000);
    }
  }
};
</script>
<style type="text/css" lang="less" scoped>
.task__specs {
  margin-top: 16px;

  /deep/ .plTableBox {
    .el-table {
      .el-table__header th.is-leaf {
        padding-left: 3px;
      }

      .cell.umy-table-beyond {
        text-overflow: clip;
      }

      .el-input.el-input--mini.el-input-group {
        width: 124px;

        .el-input-group__append {
          padding: 0 15px;
        }
      }

      .__specs_title {
        display: table;
        height: 55px;
        width: 262px;

        p {
          padding: 0;
          margin: 0;
          display: table-cell;
          vertical-align: middle;
          line-height: 16px;
          word-wrap: break-word !important;
          word-break: normal !important;
          white-space: pre-wrap !important;
        }
      }
    }
  }

  &_tools {
    width: 100%;
    height: 48px;
    background: #f3f5f7;
    line-height: 48px;
    padding-left: 14px;
    text-align: left;

    /deep/ .el-checkbox__label {
      font-size: 12px;
      font-weight: 400;
      color: #262626;
      padding-right: 35px;
    }

    /deep/ .el-button--mini.el-button--text {
      padding: 9px 12px;
    }
  }
}
</style>
