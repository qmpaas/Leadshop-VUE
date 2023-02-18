<template>
  <el-form
    class="le-matter"
    label-width="160px"
    :model="form"
    label-suffix="10"
    v-loading.lock="loading"
    @submit.native.prevent
  >
    <div class="le-card le-switch">
      <el-form-item label-width="80px">
        <span slot="label" class="le-form-item__label">短信通知</span>
        <el-switch v-model="form.status" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
    </div>
    <div class="le-card">
      <div class="le-card-header flex align-center">
        <span></span>
        <span>基本设置</span>
      </div>
      <div class="le-card-body">
        <el-form-item>
          <span slot="label" class="le-form-item__label">短信平台</span>
          阿里云
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">access_key_id</span>
          <el-input placeholder="请输入access_key_id" v-model="form.access_key_id"></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">access_key_secret</span>
          <el-input placeholder="请输入access_key_secret" v-model="form.access_key_secret"></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板签名</span>
          <el-input placeholder="请输入模板签名" v-model="form.template_name" maxlength="10" show-word-limit></el-input>
        </el-form-item>
      </div>
    </div>
    <div class="le-card">
      <div class="le-card-header flex align-center">
        <span></span>
        <span>提醒商家</span>
      </div>
      <div class="le-card-body">
        <el-form-item>
          <span slot="label" class="le-form-item__label">接收手机号</span>
          <el-input placeholder="请输入手机号" v-model="mobile"></el-input>
          <div class="le-form-item__tips">多个手机号请用英文逗号隔开</div>
        </el-form-item>
        <div class="le-card-title">买家申请售后提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.order_refund.template_id"></el-input>
          <el-button class="le-test-btn" :loading="order_refund" @click="testSend('order_refund')">测试发送</el-button>
          <div class="le-form-item__tips">示例：有买家申请售后，请登录商城后台查看。</div>
        </el-form-item>
        <div class="le-card-title">买家支付订单提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.order_pay_business.template_id"></el-input>
          <el-button class="le-test-btn" :loading="order_pay_business" @click="testSend('order_pay_business')"
            >测试发送</el-button
          >
          <div class="le-form-item__tips">示例：商城来新订单了，订单号尾号${code}，请登录商城后台查看。</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量" v-model="form.order_pay_business.code"></el-input>
        </el-form-item>
      </div>
    </div>
    <div class="le-card le-card__last">
      <div class="le-card-header flex align-center">
        <span></span>
        <span>提醒买家</span>
      </div>
      <div class="le-card-body">
        <div class="le-card-title">绑定手机号</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.captcha.template_id"></el-input>
          <el-button class="le-test-btn" :loading="captcha" @click="testSend('captcha')">测试发送</el-button>
          <div class="le-form-item__tips">示例：您的验证码${code}，该验证码5分钟内有效，请勿泄漏于他人！</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${code}" v-model="form.captcha.code"></el-input>
        </el-form-item>
        <div class="le-card-title">付款成功提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.order_pay.template_id"></el-input>
          <el-button class="le-test-btn" :loading="order_pay" @click="testSend('order_pay')">测试发送</el-button>
          <div class="le-form-item__tips">
            示例：亲爱的会员，您在${name}的订单提交成功。我们会尽快发货，记得关注我们的商城喔～感谢您的支持！
          </div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${name}" v-model="form.order_pay.name"></el-input>
        </el-form-item>
        <div class="le-card-title">订单发货提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.order_send.template_id"></el-input>
          <el-button class="le-test-btn" :loading="order_send" @click="testSend('order_send')">测试发送</el-button>
          <div class="le-form-item__tips">示例：亲爱的用户，您的尾号为${name}的订单已经发出，请注意查收。</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${name}" v-model="form.order_send.code"></el-input>
        </el-form-item>
        <div class="le-card-title">商家审核售后提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.order_verify.template_id"></el-input>
          <el-button class="le-test-btn" :loading="order_verify" @click="testSend('order_verify')">测试发送</el-button>
          <div class="le-form-item__tips">示例：您申请的售后请求已被${name}，请前往查看。</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${name}" v-model="form.order_verify.status"></el-input>
        </el-form-item>
        <div class="le-card-title">退款成功提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.order_refund_success.template_id"></el-input>
          <el-button class="le-test-btn" :loading="order_refund_success" @click="testSend('order_refund_success')"
            >测试发送</el-button
          >
          <div class="le-form-item__tips">示例：您的尾号为${name}的订单，商家已退款</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${name}" v-model="form.order_refund_success.code"></el-input>
        </el-form-item>
        <template>
          <div class="le-card-title">积分变动提醒</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.score_changes.template_id"></el-input>
            <el-button class="le-test-btn" :loading="score_changes" @click="testSend('score_changes')"
              >测试发送</el-button
            >
            <div class="le-form-item__tips">示例：您的积分${name1}了${name2}，剩余${name3}</div>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板变量</span>
            <el-input placeholder="请输入模板变量${name1}" v-model="form.score_changes.name1"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板变量</span>
            <el-input placeholder="请输入模板变量${name2}" v-model="form.score_changes.name2"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板变量</span>
            <el-input placeholder="请输入模板变量${name3}" v-model="form.score_changes.name3"></el-input>
          </el-form-item>
        </template>
        <template>
          <div class="le-card-title">积分到期提醒</div>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板ID</span>
            <el-input placeholder="请输入模板ID" v-model="form.score_due.template_id"></el-input>
            <el-button class="le-test-btn" :loading="score_due" @click="testSend('score_due')">测试发送</el-button>
            <div class="le-form-item__tips">示例：您在X年X月X日前获得的${code}积分即将到期，请及时使用</div>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板变量</span>
            <el-input placeholder="请输入模板变量${date}" v-model="form.score_due.date"></el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">模板变量</span>
            <el-input placeholder="请输入模板变量${code}" v-model="form.score_due.code"></el-input>
          </el-form-item>
        </template>
        <div class="le-card-title">分销商审核结果提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.promoter_verify.template_id"></el-input>
          <el-button class="le-test-btn" :loading="promoter_verify" @click="testSend('promoter_verify')"
            >测试发送</el-button
          >
          <div class="le-form-item__tips">示例：您好，您申请的分销商身份审核${results}</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${results}" v-model="form.promoter_verify.result"></el-input>
        </el-form-item>
        <div class="le-card-title">提现申请审核结果提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.promoter_withdrawal.template_id"></el-input>
          <el-button class="le-test-btn" :loading="promoter_withdrawal" @click="testSend('promoter_withdrawal')"
            >测试发送</el-button
          >
          <div class="le-form-item__tips">示例：您好，您申请的提现审核结果为${results}</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${results}" v-model="form.promoter_withdrawal.result"></el-input>
        </el-form-item>
        <div class="le-card-title">等级变化提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.level_change.template_id"></el-input>
          <el-button class="le-test-btn" :loading="level_change" @click="testSend('level_change')">测试发送</el-button>
          <div class="le-form-item__tips">示例：您好，您的分销等级${results}为${name}</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${status}" v-model="form.level_change.status"></el-input>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${name}" v-model="form.level_change.name"></el-input>
        </el-form-item>
        <div class="le-card-title">分销商身份被清退提醒</div>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板ID</span>
          <el-input placeholder="请输入模板ID" v-model="form.clear_identity.template_id"></el-input>
          <el-button class="le-test-btn" :loading="clear_identity" @click="testSend('clear_identity')"
            >测试发送</el-button
          >
          <div class="le-form-item__tips">示例：您好，您的${name}身份已被清退</div>
        </el-form-item>
        <el-form-item>
          <span slot="label" class="le-form-item__label">模板变量</span>
          <el-input placeholder="请输入模板变量${name}" v-model="form.clear_identity.name"></el-input>
        </el-form-item>
      </div>
    </div>
    <div class="le-cardpin">
      <el-button type="primary" :disabled="loading" @click="submit">保存</el-button>
    </div>
  </el-form>
</template>
<script>
export default {
  name: 'smsRemind',
  data() {
    return {
      loading: false,
      form: {
        platform: 'aliyun',
        mobile_list: [],
        access_key_id: '',
        access_key_secret: '',
        template_name: '',
        order_refund: {
          template_id: ''
        },
        order_refund_success: {
          template_id: '',
          name: ''
        },
        order_pay: {
          template_id: '',
          name: ''
        },
        order_send: {
          template_id: '',
          code: ''
        },
        order_verify: {
          template_id: '',
          status: ''
        },
        captcha: {
          template_id: '',
          code: ''
        },
        order_pay_business: {
          template_id: '',
          code: ''
        },
        score_changes: {
          template_id: '',
          name1: '',
          name2: '',
          name3: ''
        },
        score_due: {
          template_id: '',
          code: '',
          date: ''
        },
        promoter_verify: {
          template_id: '',
          result: ''
        },
        promoter_withdrawal: {
          template_id: '',
          result: ''
        },
        level_change: {
          template_id: '',
          status: '',
          name: ''
        },
        clear_identity: {
          template_id: '',
          name: ''
        }
      },
      order_refund: false,
      order_pay_business: false,
      captcha: false,
      order_pay: false,
      order_send: false,
      order_verify: false,
      order_refund_success: false,
      score_changes: false,
      score_due: false,
      promoter_verify: false,
      promoter_withdrawal: false,
      level_change: false,
      clear_identity: false
    };
  },
  computed: {
    mobile: {
      get: function () {
        return this.form.mobile_list.join();
      },
      set: function (val) {
        this.form.mobile_list = val.split(',');
      }
    }
  },
  methods: {
    submit: function () {
      this.loading = true;
      let _this = this;
      this.$heshop
        .sms('post', this.form)
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
        .sms('get')
        .then(function (response) {
          //_this.form =  { ...response.detail };
          _this.form = Object.assign(_this.form, { ...response.detail });
          _this.loading = false;
        })
        .catch(error => {
          _this.loading = false;
          _this.$message.error(error.data.message);
        });
    },
    testSend: function (type) {
      this[type] = true;
      let _this = this;
      this.$heshop
        .sms(
          'post',
          {
            behavior: 'test_sms'
          },
          {
            type: type,
            mobile: this.form.mobile_list
          }
        )
        .then(function (response) {
          if (response) {
            _this.$message.success('发送成功');
          } else {
            _this.$message.error('发送失败, ');
          }
          _this[type] = false;
        })
        .catch(function (error) {
          _this[type] = false;
          if (error.status === 403) {
            _this.$message.error(error.data.message);
          }
        });
    }
  },
  mounted() {
    this.obtain();
  }
};
</script>
<style scoped lang="scss">
@import './css/smsRemind.less';
</style>
