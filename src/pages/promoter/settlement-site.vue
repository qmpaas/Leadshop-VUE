<script>
import saveFailed from './components/save-failed.vue';
import { getCommissionSetting, saveCommissionSetting } from './api';

export default {
  name: 'settlement-site',
  components: {
    saveFailed
  },
  data() {
    const rex = /(^[\d]|^[1-9][\d]*)($|[\\.][\d]{0,2}$)/;
    const checkPrice = (rule, value, callback) => {
      if (!rex.test(value)) {
        callback('请输入小数点后最多两位');
        return;
      }
      if (this.$_.toSafeInteger(value) > 9999999) {
        callback('请输入0~9999999的整数或小数');
      }
      callback();
    };
    return {
      form: {
        count_rules: 1,
        withdrawal_way: ['wechat', 'alipay', 'bankCard'],
        min_money: '',
        max_money: '',
        poundage: ''
      },
      rules: {
        withdrawal_way: [
          {
            required: true,
            message: '请选择提现方式'
          }
        ],
        min_money: [
          {
            required: true,
            validator: checkPrice
          }
        ],
        max_money: [
          {
            required: true,
            validator: checkPrice
          }
        ],
        poundage: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!rex.test(value)) {
                callback('请输入小数点后最多两位');
                return;
              }
              if (this.$_.toSafeInteger(value) > 100) {
                callback('请输入0~100的整数或小数');
              }
              callback();
            }
          }
        ]
      },
      loading: true,
      showSaveFailed: false
    };
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          const form = this.$_.cloneDeep(this.form);
          let array = new Array(4);
          array[0] = form.withdrawal_way.find(item => {
            return item === 'wechatDib';
          });
          array[1] = form.withdrawal_way.find(item => {
            return item === 'wechat';
          });
          array[2] = form.withdrawal_way.find(item => {
            return item === 'alipay';
          });
          array[3] = form.withdrawal_way.find(item => {
            return item === 'bankCard';
          });
          array = array.filter(function (item) {
            return item;
          });
          form.withdrawal_way = array;
          saveCommissionSetting(form)
            .then(response => {
              if (response.status === 1) {
                this.showSaveFailed = true;
              } else {
                this.$message({
                  type: 'success',
                  message: '保存成功'
                });
              }
            })
            .finally(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    getCommissionSetting()
      .then(response => {
        this.form = response.content;
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
      });
  },
  render() {
    const self = this;
    const list = [
      {
        name: '自动到账微信零钱',
        label: 'wechatDib'
      },
      {
        name: '提现到微信',
        label: 'wechat'
      },
      {
        name: '提现到支付宝',
        label: 'alipay'
      },
      {
        name: '提现到银行卡',
        label: 'bankCard'
      }
    ];
    return (
      <div class="le-main">
        <el-form
          label-width="190px"
          ref="form"
          props={{ model: self.form, rules: self.rules }}
          v-loading={self.loading}>
          <div class="le-card">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>佣金计算</span>
            </div>
            <div class="le-card-body">
              <el-form-item label="佣金计算规则">
                <el-radio-group v-model={self.form.count_rules}>
                  <div class="le-radio-item">
                    <el-radio label={1}>以商品实付金额计算佣金</el-radio>
                    <div class="le-prompt-text">选择后，佣金=商品实付金额*佣金比例</div>
                  </div>
                  <div class="le-radio-item">
                    <el-radio label={2}>以商品利润计算佣金</el-radio>
                    <div class="le-prompt-text">选择后，佣金=商品利润*佣金比例，此种方式能保障商家不亏本</div>
                  </div>
                </el-radio-group>
              </el-form-item>
            </div>
          </div>
          <div class="le-card le-card-margin">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>佣金提现</span>
            </div>
            <div class="le-card-body">
              <el-form-item label="提现方式" prop="withdrawal_way">
                <el-checkbox-group v-model={self.form.withdrawal_way}>
                  {list.map((item, index) => {
                    return (
                      <el-checkbox label={item.label} key={index}>
                        {item.name}
                        {(() => {
                          if (item.label === 'wechatDib') {
                            return (
                              <el-popover content="过售后订单收入" placement="top" trigger="hover">
                                <div>
                                  <span>登录【商户平台】，根据</span>
                                  <a
                                    class="le-popover--btn"
                                    target="_blank"
                                    href="https://developers.weixin.qq.com/community/develop/article/doc/000ee8684ecb9873061cd257651813">
                                    指引
                                  </a>
                                  <span>开通【企业付款到零钱】</span>
                                </div>
                                <span slot="reference" class="le-icon le-icon-zhushi" />
                              </el-popover>
                            );
                          }
                        })()}
                      </el-checkbox>
                    );
                  })}
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="最低提现金额" prop="min_money">
                <el-input class="le-small--input" v-model={self.form.min_money}>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="每日最高提现金额" prop="max_money">
                <el-input class="le-small--input" v-model={self.form.max_money}>
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="提现手续费" prop="poundage">
                <el-input class="le-small--input" v-model={self.form.poundage}>
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="le-cardpin">
          <el-button type="primary" loading={self.loading} onClick={self.submit}>
            保存
          </el-button>
        </div>
        {(() => {
          if (self.showSaveFailed) {
            return <saveFailed v-model={self.showSaveFailed} />;
          }
        })()}
      </div>
    );
  }
};
</script>

<style scoped lang="less">
@import './index.less';

.le-radio-item {
  margin-top: 8px;
}

.le-icon-zhushi {
  color: #bbbfc8;
}

.le-popover--btn {
  color: #1890ff;
}

.le-small--input {
  width: 170px;

  ::v-deep .el-input-group__append {
    padding: 0 15px;
  }
}
</style>
