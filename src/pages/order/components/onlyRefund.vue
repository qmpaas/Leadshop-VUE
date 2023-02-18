<template>
  <el-form label-width="164px" :model="ruleForm" class="le-matter" :rules="rules" @submit.native.prevent>
    <div class="he-prompt">买家通过【微信支付】付款，退款金额将原路返回到买家微信付款账户。</div>
    <el-form-item label="售后类型">
      <span class="he-value">{{
        value.item.type === 0 ? '仅退款' : value.item.type === 1 ? '退货退款' : value.item.type === 2 ? '换货' : ''
      }}</span>
    </el-form-item>
    <el-form-item label="退款商品数">
      <span class="he-value">{{ value.item.return_number }}</span>
    </el-form-item>
    <template v-if="value.item.order_type == 'task' && value.item.return_score_type">
      <el-form-item label="退还积分" prop="actual_score">
        <el-input class="he-input" v-model="ruleForm.actual_score" oninput="value=value.replace(/[^\d.]/g,'')">
          <template slot="append">积分</template>
        </el-input>
        <div class="he-tips">退还积分最大限制为{{ value.item.return_score }}</div>
      </el-form-item>
    </template>
    <el-form-item label="退款金额" prop="actual_refund">
      <el-input class="he-input" v-model="ruleForm.actual_refund" oninput="value=value.replace(/[^\d.]/g,'')">
        <template slot="append">元</template>
      </el-input>
      <div class="he-tips">退款金额最大限制为￥{{ value.item.return_amount }}</div>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  name: 'onlyRefund',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      ruleForm: {
        actual_refund: this.value.item.return_amount,
        actual_score: this.value.item.return_score
      },
      rules: {
        actual_refund: [
          {
            required: false,
            message: '请填写正确的金额,保留两位小数',
            pattern: /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/
          }
        ]
      }
    };
  },
  methods: {
    /**
     * 判断是否整数
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    isInteger(obj) {
      return obj % 1 === 0;
    },
    affirm(e) {
      let is_affirm = true;
      if (this.value.item.order_type === 'task') {
        if (this.ruleForm.actual_score > this.value.item.return_score) {
          is_affirm = false;
          this.$message.error('退还积分最大限制为' + this.value.item.return_score);
        }

        if (!this.isInteger(this.ruleForm.actual_score)) {
          is_affirm = false;
          this.$message.error('退还积分必须为整数');
        }

        if (this.$manifest('task', 'config.integral_return')) {
          if (this.ruleForm.actual_score == '') {
            is_affirm = false;
            this.$message.error('退还积分不能为空');
          }
        }

        if (this.ruleForm.actual_score < 0) {
          is_affirm = false;
          this.$message.error('退还积分不能是负数');
        }
      }

      if (is_affirm) {
        let behavior = this.value.item.status === 111 ? 'refund' : 'salesreturn';
        this.$heshop
          .orderafter(
            'put',
            { id: this.value.item.id, behavior },
            { actual_refund: this.ruleForm.actual_refund, actual_score: this.ruleForm.actual_score }
          )
          .then(res => {
            this.value.item.status = res.status;
            this.$message.success('退款成功');
            let { handleClose } = e;
            handleClose();
          })
          .catch(err => {
            this.$message.error(err.data.message);
          });
      }
    }
  }
};
</script>
<style scoped lang="scss">
.he-prompt {
  width: 440px;
  height: 32px;
  font-size: 12px;
  font-weight: 400;
  color: #000000;
  opacity: 0.85;
  margin: auto;
  background: #fff5d1;
  text-align: center;
  line-height: 32px;
  margin-bottom: 25px;
}

.he-tips {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  line-height: 20px;
  opacity: 0.45;
  margin-top: 8px;
}

.he-input {
  width: 200px;

  /deep/ > .el-input__inner {
    font-size: 14px;
    font-weight: 400;
    color: #f5212d;
    opacity: 0.85;
  }
}

.he-value {
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  opacity: 0.85;
}
</style>
