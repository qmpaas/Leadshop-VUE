<template>
  <el-dialog
    title="多规格设置"
    :visible.sync="dialogVisible"
    width="1038px"
    :before-close="
      done => {
        done();
      }
    "
  >
    <div class="task-dialog">
      <div class="__tools">
        <div class="__goods_cover">
          <img :src="getGoodsCover(goods.slideshow)" />
          <div class="__goods_title">
            <p>{{ goods.name | capitalize }}</p>
          </div>
        </div>
      </div>
      <div class="__lists">
        <TaskSpecstable ref="specstable" v-model="value" :goods="goods"></TaskSpecstable>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleAffirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script type="text/javascript">
import TaskSpecstable from '../tables/specs.vue';
import verify from '../../verify.js';
export default {
  components: {
    TaskSpecstable
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
    goods: {
      type: [String, Number, Boolean, Object, Array]
    }
  },
  data() {
    return {
      dialogVisible: false
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
  mounted() {},
  methods: {
    /**
     * 判断是否为整数
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    isInteger(obj) {
      return obj % 1 === 0;
    },
    handleAffirm() {
      //拉取多规格数据
      let tableData = this.$refs['specstable'].tableData;
      let is_submit = true;
      if (tableData) {
        for (let index in tableData) {
          let item = tableData[index];
          let verifyData = JSON.parse(JSON.stringify(item));
          //判断是否为空
          if (verify.isEmpty(verifyData.task_stock)) {
            this.$message.error('可兑换数量不能为空');
            is_submit = false;
            return false;
          }
          if (verify.isEmpty(verifyData.task_number)) {
            this.$message.error('积分值不能为空');
            is_submit = false;
            return false;
          }
          if (verify.isEmpty(verifyData.task_price)) {
            this.$message.error('积分价格不能为空');
            is_submit = false;
            return false;
          }
          //判断是否存在小数
          if (verify.isFloat(verifyData.task_stock)) {
            this.$message.error('可兑换数量填写错误');
            is_submit = false;
            return false;
          }
          if (verify.isFloat(verifyData.task_number)) {
            this.$message.error('积分值填写错误');
            is_submit = false;
            return false;
          }
          if (verify.isFloat(verifyData.task_limit)) {
            this.$message.error('兑换限制填写错误');
            is_submit = false;
            return false;
          }

          //判断是否为数组
          if (!verify.isNumber(verifyData.task_stock)) {
            this.$message.error('可兑换数量必须是数字');
            is_submit = false;
            return false;
          }
          if (!verify.isNumber(verifyData.task_number)) {
            this.$message.error('积分值必须是数字');
            is_submit = false;
            return false;
          }
          if (!verify.isNumber(verifyData.task_price)) {
            this.$message.error('积分价格必须是数字');
            is_submit = false;
            return false;
          }
          if (!verify.isNumber(verifyData.task_limit) && !verify.isEmpty(verifyData.task_limit)) {
            this.$message.error('兑换限制必须是数字');
            is_submit = false;
            return false;
          }

          //判断非负数
          if (!verify.isIntNum(verifyData.task_stock)) {
            this.$message.error('可兑换数量不能为负数');
            is_submit = false;
            return false;
          }
          if (!verify.isIntNum(verifyData.task_number)) {
            this.$message.error('积分值不能为负数');
            is_submit = false;
            return false;
          }
          if (!verify.isIntNum(verifyData.task_price)) {
            this.$message.error('积分价格不能为负数');
            is_submit = false;
            return false;
          }
          if (!verify.isIntNum(verifyData.task_limit) && !verify.isEmpty(verifyData.task_limit)) {
            this.$message.error('兑换限制不能为负数');
            is_submit = false;
            return false;
          }

          //判断大小限制
          if (verify.isLimit(verifyData.task_stock, 9999999)) {
            this.$message.error('可兑换数量不能大于9999999');
            is_submit = false;
            return false;
          }
          if (verify.isLimit(verifyData.task_number, 9999999)) {
            this.$message.error('积分值不能大于9999999');
            is_submit = false;
            return false;
          }
          if (verify.isLimit(verifyData.task_price, 9999999)) {
            this.$message.error('积分价格不能大于9999999');
            is_submit = false;
            return false;
          }
          if (verify.isLimit(verifyData.task_limit, 9999999) && !verify.isEmpty(verifyData.task_limit)) {
            this.$message.error('兑换限制不能大于9999999');
            is_submit = false;
            return false;
          }

          //判断价格格式
          if (!verify.isPrice(verifyData.task_price)) {
            this.$message.error('积分价格格式不正确');
            is_submit = false;
            return false;
          }

          //判断限制数量
          if (
            parseInt(verifyData.task_limit) > parseInt(verifyData.task_stock) &&
            parseInt(verifyData.task_limit) > 0
          ) {
            this.$message.error('兑换限制不能大于可兑换数量');
            is_submit = false;
            return false;
          }
        }

        if (is_submit) {
          this.$emit('input', tableData);
          this.dialogVisible = false;
        }
      } else {
        this.$message.error('请先设置规格数据');
      }
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
    }
  }
};
</script>
<style type="text/css" lang="less" scoped>
.task-dialog {
  .__tools {
    width: 384px;
    height: 72px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    padding: 12px;

    .__goods_cover {
      display: flex;
      position: relative;
      width: 384px;

      img {
        width: 48px;
        height: 48px;
        background: #f2f2f2;
        margin-right: 12px;
      }

      .__goods_title {
        display: table;
        height: 48px;
        width: 300px;
        text-align: left;

        p {
          display: table-cell;
          vertical-align: middle;
          line-height: 16px;
        }
      }
    }
  }

  .__lists {
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
      width: 956px;
      height: 48px;
      background: #f3f5f7;
      line-height: 48px;
      padding-left: 14px;
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
}
</style>
