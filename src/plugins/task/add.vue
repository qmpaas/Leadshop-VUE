<template>
  <div class="task-card">
    <div class="task-content__body">
      <el-form ref="form" :model="form" label-width="140px">
        <div class="__body">
          <el-form-item label="上架状态">
            <el-radio-group v-model="form.goods_is_sale">
              <el-radio :label="1">立即上架</el-radio>
              <el-radio :label="0">暂不上架</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择商品">
            <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>选择商品</span>
            <TaskGoods v-model="form.goods_list" ref="taskgoods"></TaskGoods>
            <el-button plain @click="handleDialog" :disabled="form.goods_list.length >= 10">选择商品</el-button
            ><span style="padding-left: 8px; color: #bfbfbf">单次最多添加10件商品</span>
            <TaskTables v-model="form.goods_list" ref="taskTable"></TaskTables>
          </el-form-item>
        </div>
        <div class="task-card-footer">
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script type="text/javascript">
import TaskTables from './components/tables';
import TaskGoods from './components/dialog/goods.vue';
import verify from './verify.js';

export default {
  components: {
    TaskTables,
    TaskGoods
  },
  data() {
    return {
      dialogVisible: false,
      form: {
        goods_is_sale: 1,
        goods_list: []
      }
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {},
  /**
   * 页面渲染前
   * @return {[type]} [description]
   */
  created() {},
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {},
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  mounted() {},
  methods: {
    handleDialog() {
      this.$refs.taskgoods.dialogVisible = true;
    },
    isPriceNumber(_keyword) {
      if (_keyword == '0' || _keyword == '0.' || _keyword == '0.0' || _keyword == '0.00') {
        _keyword = '0';
        return true;
      } else {
        var index = _keyword.indexOf('0');
        var length = _keyword.length;
        if (index == 0 && length > 1) {
          /*0开头的数字串*/
          var reg = /^[0]{1}[.]{1}[0-9]{1,2}$/;
          if (!reg.test(_keyword)) {
            return false;
          } else {
            return true;
          }
        } else {
          /*非0开头的数字*/
          var reg = /^[1-9]{1}[0-9]{0,10}[.]{0,1}[0-9]{0,2}$/;
          if (!reg.test(_keyword)) {
            return false;
          } else {
            return true;
          }
        }
        return false;
      }
    },
    /**
     * 判断是否为整数
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    isInteger(obj) {
      return obj % 1 === 0;
    },
    handleSubmit() {
      if (this.form.goods_list.length === 0) {
        this.$message.error('请选择商品');
        return;
      }
      let is_submit = true;
      for (let index in this.form.goods_list) {
        let item = this.form.goods_list[index];
        if (item.param_type == 1) {
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
        if (item.param_type == 2) {
          if (!item.param) {
            this.$message.error('请设置多规格参数');
            is_submit = false;
            return false;
          }
        }
      }

      if (is_submit) {
        /**
         * 执行数据提交
         * @param  {[type]} res [description]
         * @return {[type]}     [description]
         */
        this.$heshop
          .plugin('post', { include: 'task', model: 'goods' }, this.form)
          .then(res => {
            this.$message({
              message: '添加成功',
              type: 'success'
            });
            this.form = {
              goods_is_sale: 1,
              goods_list: []
            };
            //跳转界面
            this.$router.push({
              path: '/plugins/task/index'
            });
          })
          .catch(() => {
            this.$message.error('添加失败，请检查网络');
          });
      }
    }
  }
};
</script>
<style lang="less" scoped="true">
@import './task.less';
</style>
