<script>
import agreeAfterWithdraw from './agree-refuse-withdraw.vue';
import makeMoney from './make-money.vue';
import paymentFailed from './payment-failed.vue';

export default {
  name: 'withdraw-table',
  components: {
    agreeAfterWithdraw,
    makeMoney,
    paymentFailed
  },
  props: {
    value: {
      type: Array
    },
    pagination: {
      type: Object
    }
  },
  data() {
    return {
      // 打款
      showMakeMoney: false,
      makeMoneyType: 'agree',
      makeMoneyInfo: null,
      //  申请
      showAgreeAfterWithdraw: false,
      agreeAfterWithdrawType: 'agree',
      agreeAfterWithdrawInfo: null,
      // 打款失败
      showPaymentFailed: false
    };
  },
  computed: {
    // 提现列表
    list: {
      get({value}) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    // 分页数据
    page: {
      get({pagination}) {
        return pagination;
      },
      set(value) {
        this.$emit('update:pagination', value);
      }
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-table data={self.list} class="le-table" row-class-name="le-table-row">
          <el-table-column
            label="分销商"
            min-width="288px"
            fixed="left"
            scopedSlots={{
              default: scope => {
                return (
                  <div class="flex">
                    <div>
                      <el-avatar size={48} src={scope.row.user.avatar} error={() => true}>
                        <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"/>
                      </el-avatar>
                    </div>
                    <div class="le-usercontent">
                      <div class="le-user">
                        <i
                          class={[
                            'le-icon',
                            {'le-icon-xiaochengxu': scope.row.oauth.type === 'weapp'},
                            {'le-icon-wehcat': scope.row.oauth.type === 'wechat'}
                          ]}
                        />
                        <span class="le-username">{scope.row.user.nickname}</span>
                      </div>
                      <div class="le-userinfor">
                        ID:{scope.row.user.id}
                        <br/>
                        {scope.row.user.realname}
                        <br/>
                        {scope.row.user.mobile}
                      </div>
                    </div>
                  </div>
                );
              }
            }}
          />
          <el-table-column
            label="分销商等级"
            min-width="216px"
            scopedSlots={{
              default: scope => {
                return scope.row.promoter.levelInfo.name;
              }
            }}
          />
          <el-table-column
            label="提现方式"
            min-width="288px"
            scopedSlots={{
              default: scope => {
                const type = scope.row.type;
                return [
                  [
                    <div>
                      {(() => {
                        if (type === 'wechatDib') {
                          return '自动到账微信零钱';
                        } else if (type === 'wechat') {
                          return '提现到微信';
                        } else if (type === 'alipay') {
                          return '提现到支付宝';
                        } else if (type === 'bankCard') {
                          return '提现到银行卡';
                        }
                      })()}
                    </div>
                  ],
                  (() => {
                    if (type === 'wechat') {
                      return (
                        <div class="le-auxiliaryText">
                          姓名：{scope.row.extra.name}
                          <br/>
                          微信号：{scope.row.extra.wechat}
                          {
                            (() => {
                              if (scope.row.extra.receiveCode) {
                                return [
                                  [<br/>],
                                  [" 收款码："], [
                                    <el-button type="text" style="padding:0;" onClick={() => {
                                      self.$refs.image.previewSrcList = [scope.row.extra.receiveCode.response];
                                      self.$refs.image.clickHandler();
                                    }}>点击查看</el-button>
                                  ]
                                ]
                              }
                            })()
                          }
                        </div>
                      );
                    } else if (type === 'alipay') {
                      return (
                        <div class="le-auxiliaryText">
                          姓名：{scope.row.extra.name}
                          <br/>
                          支付宝账号：{scope.row.extra.alipay}
                          {
                            (() => {
                              if (scope.row.extra.receiveCode) {
                                return [
                                  [<br/>],
                                  [" 收款码："], [
                                    <el-button type="text" style="padding:0;" onClick={() => {
                                      self.$refs.image.previewSrcList = [scope.row.extra.receiveCode.response];
                                      self.$refs.image.clickHandler();
                                    }}>点击查看</el-button>
                                  ]
                                ]
                              }
                            })()
                          }
                        </div>
                      );
                    } else if (type === 'bankCard') {
                      return (
                        <div class="le-auxiliaryText">
                          开户人：{scope.row.extra.bank_user_name}
                          <br/>
                          开户行：{scope.row.extra.bank_name}
                          <br/>
                          银行账号：{scope.row.extra.bank_no}
                        </div>
                      );
                    }
                  })()
                ];
              }
            }}
          />
          <el-table-column
            label="申请提现金额"
            min-width="216px"
            scopedSlots={{
              default: scope => {
                return [
                  [<div>￥{scope.row.price}</div>],
                  [<div class="le-auxiliaryText">(手续费：￥{scope.row.service_charge})</div>]
                ];
              }
            }}
          />
          <el-table-column
            label="实际打款金额"
            min-width="216px"
            scopedSlots={{
              default: scope => {
                return scope.row.actual_price;
              }
            }}
          />
          <el-table-column
            label="状态"
            min-width="124px"
            scopedSlots={{
              default: scope => {
                const status = scope.row.status;
                let type = '';
                let text = '';
                if (status === 0) {
                  type = '';
                  text = '待审核';
                } else if (status === 1) {
                  type = 'warning';
                  text = '待打款';
                } else if (status === 2) {
                  type = 'success';
                  text = '已打款';
                } else if (status === 3) {
                  type = 'danger';
                  text = '已拒绝';
                }
                return (
                  <el-tag effect="plain" type={type} size="medium">
                    {text}
                  </el-tag>
                );
              }
            }}
          />
          <el-table-column
            label="申请时间"
            min-width="216px"
            scopedSlots={{
              default: scope => {
                return self.$moment(new Date(scope.row.created_time * 1000)).format('Y-MM-DD HH:mm:ss');
              }
            }}
          />
          <el-table-column
            label="操作"
            min-width="164px"
            scopedSlots={{
              default: scope => {
                return (
                  <div class="le-table-operate flex align-center">
                    {(() => {
                      if (scope.row.status === 1) {
                        // 待打款
                        return [
                          [
                            <el-button type="text" onClick={self.setMakeMoney.bind(self, scope.row, 'agree')}>
                              打款
                            </el-button>
                          ],
                          [<span class="le-line"/>],
                          [
                            <el-button type="text" onClick={self.setMakeMoney.bind(self, scope.row, 'refuse')}>
                              拒绝
                            </el-button>
                          ]
                        ];
                      } else if (scope.row.status === 0) {
                        // 待审核
                        return [
                          [
                            <el-button type="text" onClick={self.setAgreeRefuseWithdraw.bind(self, scope.row, 'agree')}>
                              通过
                            </el-button>
                          ],
                          [<span class="le-line"/>],
                          [
                            <el-button
                              type="text"
                              onClick={self.setAgreeRefuseWithdraw.bind(self, scope.row, 'refuse')}>
                              拒绝
                            </el-button>
                          ]
                        ];
                      }
                    })()}
                  </div>
                );
              }
            }}
          />
        </el-table>
        <div class="flex le-pagination justify-end">
          <el-pagination
            background={true}
            current-page={self.page.current}
            page-count={self.page.pageCount}
            on-current-change={self.switchPage}
            layout="prev, pager, next, jumper"
          />
        </div>
        {
          // 打款 同意 拒绝
          (() => {
            if (self.showMakeMoney) {
              return (
                <makeMoney
                  v-model={self.showMakeMoney}
                  on={{
                    ['update:showPaymentFailed']: e => {
                      self.showPaymentFailed = e;
                    },
                    confirm() {
                      self.$emit('confirm');
                    }
                  }}
                  type={self.makeMoneyType}
                  info={self.makeMoneyInfo}
                />
              );
            }
          })()
        }
        {
          // 申请 同意 拒绝
          (() => {
            if (self.showAgreeAfterWithdraw) {
              return (
                <agreeAfterWithdraw
                  v-model={self.showAgreeAfterWithdraw}
                  type={self.agreeAfterWithdrawType}
                  info={self.agreeAfterWithdrawInfo}
                  on={{
                    confirm() {
                      self.$emit('confirm');
                    }
                  }}
                />
              );
            }
          })()
        }
        {
          // 打款失败
          (() => {
            if (self.showPaymentFailed) {
              return <paymentFailed v-model={self.showPaymentFailed}/>;
            }
          })()
        }
        <el-image ref="image" style="opacity:0"></el-image>
      </div>
    );
  },
  methods: {
    switchPage(number) {
      this.page.current = number;
      this.$emit('current-change', number);
    },
    setMakeMoney(item, type) {
      this.makeMoneyType = type;
      this.makeMoneyInfo = item;
      this.showMakeMoney = true;
    },
    setAgreeRefuseWithdraw(item, type) {
      this.agreeAfterWithdrawType = type;
      this.agreeAfterWithdrawInfo = item;
      this.showAgreeAfterWithdraw = true;
    }
  }
};
</script>

<style>
.el-tag--plain {
  color: #1890ff;
  border-color: #1890ff;
}
</style>

<style scoped lang="less">
@import './../index.less';

.le-table ::v-deep {
  .le-table-row:extend(.font-family-yahei) {
    height: 120px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }

  .le-usercontent {
    padding-left: 12px;

    .le-user {
      margin-bottom: 8px;
    }
  }

  .le-username {
    margin-left: 8px;
  }

  .le-userinfor:extend(.font-family-yahei) {
    width: 156px;
    background: #f3f5f7;
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    color: #595959;
    line-height: 16px;
  }

  .le-auxiliaryText:extend(.font-family-yahei) {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 16px;
  }
}
</style>
