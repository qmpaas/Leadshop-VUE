<template>
  <el-form class="le-matter le-form" label-width="130px" :model="form" v-loading="loading" @submit.native.prevent>
    <div class="le-header le-card">
      温馨提示：请确保您有公众号订阅通知的使用权限，且订阅通知中无任何已存数据。订阅通知添加完成后，请不要删除订阅通知，否则将影响消息的正常发送。<br />
      使用说明：<br />
      1.请前往微信公众平台，将【商家自营>服装/鞋/箱包】类目添加至您的服务类目，否则将影响订阅通知的正常发送。<span
        v-popup.messageGuide="'wechat'"
        module="setup"
        sure_btn="我知道了"
        width="680"
        :hide_cancel="true"
        title="订阅通知模板ID获取指引"
        class="le-header-button"
        >查看指引</span
      ><br />
      2.查找订阅通知并选用，调整关键词的顺序后，复制模板ID，粘贴在此页面对应的模板ID输入框中<br />
      3.您可使用一键添加订阅通知功能，快速获取模板ID&nbsp;
      <button class="le-header-btn" @click="onceAdd">一键添加订阅通知</button>
    </div>
    <div class="le-body flex">
      <div class="flex-sub">
        <div class="le-card">
          <div class="le-card-title">付款成功通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.order_pay"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【付款成功通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">付款金额、付款时间、商家名称、订单编号</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="le-card">
          <div class="le-card-title">售后状态通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.order_sale_verify"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【售后状态通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">审核结果、订单编号、订单金额</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="le-card">
          <div class="le-card-title">优惠券到期通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.coupon_expire"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【优惠券到期通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">优惠券名称、过期时间、商家名称、温馨提示</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="le-card">
          <div class="le-card-title">分销商申请结果通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.promoter_verify"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【分销商申请结果通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">申请结果、申请人、申请时间</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="le-card">
          <div class="le-card-title">提现成功通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.promoter_withdrawal_success"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【提现成功通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">提现金额、手续费、打款方式</span>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
      <div class="flex-sub">
        <div class="le-card">
          <div class="le-card-title">订单发货通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.order_send"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【订单发货通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">快递公司、快递单号、收货地址、订单号</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="le-card">
          <div class="le-card-title">退款成功通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.order_refund_tpl"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【退款成功通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">退款金额、订单编号、商品名称、申请时间</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="le-card">
          <div class="le-card-title">积分变更提醒</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.task_refund_tpl"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【积分变更提醒】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">变更数量、积分余额、变动时间、变更原因</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="le-card">
          <div class="le-card-title">分销商升级通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.level_change"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【分销商升级通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">当前等级、原始等级、变动时间</span>
              </div>
            </div>
          </el-form-item>
        </div>
        <div class="le-card">
          <div class="le-card-title">提现失败通知</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.promoter_withdrawal_error"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板提示</span>
            <div class="le-form-item__content">
              <div class="le-tip-item">
                <span class="le-label">模板标题</span>
                <span class="le-value">【提现失败通知】</span>
              </div>
              <div class="le-tip-item">
                <span class="le-label">关键词及顺序</span>
                <span class="le-value">提现金额、备注、申请时间</span>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
    </div>
    <div class="le-cardpin">
      <el-button type="primary" @click="submit" :disabled="loading">保存</el-button>
    </div>
  </el-form>
</template>
<script>
export default {
  name: 'wechatRemind',
  data() {
    return {
      loading: false,
      form: {
        order_sale_verify: '',
        order_refund_tpl: '',
        coupon_expire: '',
        order_pay: '',
        order_send: '',
        promoter_verify: '',
        level_change: '',
        promoter_withdrawal_success: '',
        promoter_withdrawal_error: ''
      }
    };
  },
  methods: {
    submit: function () {
      this.loading = true;
      let _this = this;
      this.$heshop
        .subscribe(
          'post',
          {
            platform: 'wechat',
            behavior: 'save'
          },
          this.form
        )
        .then(function () {
          _this.loading = false;
          _this.$message.success('保存成功');
        })
        .catch(error => {
          _this.loading = false;
          _this.$message.error(error.data.message);
        });
    },
    obtain: function () {
      this.loading = true;
      let _this = this;
      this.$heshop
        .subscribe('get', {
          platform: 'wechat'
        })
        .then(function (response) {
          _this.form = response.form;
          _this.loading = false;
        })
        .catch(error => {
          _this.loading = false;
          _this.$message.error(error.data.message);
        });
    },
    onceAdd: function () {
      let _this = this;
      this.loading = true;
      this.$heshop
        .subscribe(
          'post',
          {
            platform: 'wechat'
          },
          {}
        )
        .then(function (response) {
          for (let i = 0; i < response.length; i++) {
            _this.form[response[i].tpl_name] = response[i].tpl_id;
          }
          _this.$message.success('一键添加成功');
          _this.loading = false;
        })
        .catch(error => {
          _this.loading = false;
          _this.$message.error(error.data.message);
        });
    }
  },
  mounted() {
    this.obtain();
  }
};
</script>
<style scoped lang="scss">
@import './css/appletsRemind.less';
</style>
