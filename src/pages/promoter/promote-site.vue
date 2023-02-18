<script>
import mobileUserCenter from './images/mobile-user-center.png';
import goodsSelect from '../../components/goodsSelet/select.vue';
import { getPromoterSetting, savePromoterSetting } from './api';
import index from './index.js';

export default {
  mixins: [index],
  components: {
    goodsSelect
  },
  data() {
    const priceRex = /(^[\d]|^[1-9][\d]*)($|[\\.][\d]{0,2}$)/;
    const integerRex = /^[1-9]\d*$/;

    return {
      loading: true,
      disabled: true,
      form: {
        status: 0,
        level_number: 3,
        self_buy: 1,
        center_show: 1,
        need_check: 1,
        need_apply: 1,
        apply_content: [
          {
            name: '姓名'
          }
        ],
        conditions: {
          type: 1, // 1无条件  2累计消费金额  3累计消费次数  4购买任意商品   5购买指定商品
          buy_amount: '',
          buy_number: '',
          goods_list: []
        },
        bind_way: 1, //成为下线条件  1首次点击链接  2首次付款,
        bind_type: 1, // 绑定关系  1永久  2保护期
        bind_days: '',
        use_agreement: 0, //启用用户协议  0禁用  1启用
        agreement_title: '',
        agreement_content: ''
      },
      rules: {
        become: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const type = this.form.conditions.type;
              if (type === 2) {
                let price = this.form.conditions.buy_amount;
                const errStr = '请输入0~9999999的整数或小数';

                if (!priceRex.test(price)) {
                  callback(errStr);
                  return;
                }
                if (this.$_.toSafeInteger(price) > 9999999) {
                  callback(errStr);
                }
                callback();
              } else if (type === 3) {
                let num = this.form.conditions.buy_number;
                const errStr = '请输入1~9999999的整数';

                if (!integerRex.test(num)) {
                  callback(errStr);
                  return;
                }

                if (this.$_.toSafeInteger(num) > 9999999) {
                  callback(errStr);
                }
              }
              callback();
            }
          }
        ],
        bind_days: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (!integerRex.test(value)) {
                callback('请输入0~30000的整数');
                return;
              }
              if (this.$_.toSafeInteger(value) > 30000) {
                callback('请输入0~30000的整数');
              }
              callback();
            }
          }
        ]
      }
    };
  },
  mounted() {
    // 获取配置
    getPromoterSetting()
      .then(response => {
        this.form = response.content;
        this.loading = false;
        this.disabled = false;
      })
      .catch(() => {
        this.disabled = false;
        this.loading = false;
      });
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          savePromoterSetting(this.form)
            .then(() => {
              this.loading = false;
              this.$message({
                type: 'success',
                message: '保存成功'
              });
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    routerManual() {
      this.$router.push({
        path: '/promoter/manual'
      });
    },
    routerLevel() {
      this.$router.push({
        path: '/promoter/level'
      });
    }
  },
  render() {
    const self = this;
    const conditionsTypes = [
      {
        label: 1,
        name: '无条件'
      },
      {
        label: 2,
        name: '累计消费金额'
      },
      {
        label: 3,
        name: '累计消费次数'
      },
      {
        label: 4,
        name: '购买任意商品'
      },
      {
        label: 5,
        name: '购买指定商品'
      }
    ];
    return (
      <div class="le-main">
        <el-form
          label-width="193px"
          ref="form"
          v-loading={self.loading}
          props={{ model: self.form, rules: self.rules }}>
          <div class="le-card">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>基础信息</span>
              <el-button type="text" class="le-manual" onClick={self.routerManual}>
                《分销商使用手册》
              </el-button>
            </div>
            <div class="le-card-body">
              <el-form-item label="是否启用分销商">
                <el-radio-group v-model={self.form.status}>
                  <el-radio label={1}>启用</el-radio>
                  <el-radio label={0}>禁用</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="分销商层级">
                <el-radio-group v-model={self.form.level_number}>
                  <el-radio label={1}>一级分销</el-radio>
                  <el-radio label={2}>二级分销</el-radio>
                  <el-radio label={3}>三级分销</el-radio>
                </el-radio-group>
                <div class="le-prompt-text">
                  前往
                  <el-button type="text" class="le-prompt--button" onClick={self.routerLevel}>
                    分销商等级
                  </el-button>
                  设置佣金比例
                </div>
              </el-form-item>
              <el-form-item label="分销自购">
                <el-radio-group v-model={self.form.self_buy}>
                  <el-radio label={1}>不允许</el-radio>
                  <el-radio label={2}>自购返佣</el-radio>
                  <el-radio label={3}>自购优惠</el-radio>
                </el-radio-group>
                <div class="le-prompt-text">选择自购优惠，则原本的佣金作为优惠金额减免，只需对剩下的金额付款</div>
              </el-form-item>
              <el-form-item label="分销中心开放人群">
                <el-radio-group v-model={self.form.center_show}>
                  <el-radio label={1}>仅开放给分销商</el-radio>
                  <el-radio label={2}>向所有用户开放</el-radio>
                </el-radio-group>
                <div class="le-prompt-text">
                  选择仅开放给分销商，则仅分销商的个人中心显示出分销中心入口
                  <el-popover
                    placement="right"
                    trigger="hover"
                    scopedSlots={{
                      default: () => {
                        return <img src={mobileUserCenter} width="225" height="400" alt="" />;
                      },
                      reference: () => {
                        return (
                          <el-button type="text" class="le-prompt--button">
                            查看示例
                          </el-button>
                        );
                      }
                    }}
                  />
                </div>
              </el-form-item>
            </div>
          </div>
          <div class="le-card le-card-margin ">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>分销商资格</span>
            </div>
            <div class="le-card-body">
              <el-form-item label="成为分销商" prop="become">
                <div class="le-title">是否需要审核</div>
                <el-radio-group v-model={self.form.need_check}>
                  <el-radio label={0}>无需审核</el-radio>
                  <el-radio label={1}>需审核</el-radio>
                </el-radio-group>
                <div class="le-title">是否需要填写申请信息</div>
                <el-radio-group v-model={self.form.need_apply}>
                  <el-radio label={0}>无需填写</el-radio>
                  <el-radio label={1}>需填写</el-radio>
                </el-radio-group>
                {(() => {
                  if (self.form.need_apply === 1) {
                    return [
                      [
                        <el-table
                          data={self.form.apply_content}
                          class="le-info--table"
                          header-row-class-name="le-table-header"
                          row-class-name="le-table-row">
                          <el-table-column
                            label="信息名称"
                            width="288"
                            scopedSlots={{
                              default: scope => {
                                let disabled = false;
                                if (scope.$index === 0) {
                                  disabled = true;
                                }
                                return (
                                  <el-input
                                    placeholder="请输入信息名称"
                                    disabled={disabled}
                                    maxlength={8}
                                    show-word-limit={true}
                                    v-model={scope.row.name}
                                  />
                                );
                              }
                            }}
                          />
                          <el-table-column
                            label="操作"
                            scopedSlots={{
                              default: scope => {
                                if (scope.$index !== 0) {
                                  return (
                                    <el-button
                                      type="text"
                                      onClick={() => self.form.apply_content.splice(scope.$index, 1)}>
                                      移除
                                    </el-button>
                                  );
                                }
                              }
                            }}
                          />
                        </el-table>
                      ],
                      [
                        <div class="le-info--table_footer">
                          {(() => {
                            let disabled = false;
                            if (self.form.apply_content.length >= 5) {
                              disabled = true;
                            }
                            return (
                              <el-button
                                disabled={disabled}
                                plain={true}
                                onClick={() => self.form.apply_content.push({ name: '' })}>
                                添加申请信息
                              </el-button>
                            );
                          })()}
                          <span class="le-prompt-text">最多添加5条申请信息</span>
                        </div>
                      ]
                    ];
                  }
                })()}
                <div class="le-title">满足的条件</div>
                <el-radio-group v-model={self.form.conditions.type}>
                  {conditionsTypes.map((item, index) => {
                    return (
                      <el-radio key={index} label={item.label}>
                        {item.name}
                      </el-radio>
                    );
                  })}
                </el-radio-group>
                {(() => {
                  switch (self.form.conditions.type) {
                    case 2:
                      return (
                        <div class="le-condition">
                          <span class="le-title">累计消费金额</span>
                          <el-input class="le-small--input" v-model={self.form.conditions.buy_amount}>
                            <template slot="append">元</template>
                          </el-input>
                        </div>
                      );
                    case 3:
                      return (
                        <div class="le-condition">
                          <span class="le-title">累计消费次数</span>
                          <el-input class="le-small--input" v-model={self.form.conditions.buy_number}>
                            <template slot="append">次</template>
                          </el-input>
                        </div>
                      );
                    case 5:
                      return (
                        <div class="le-condition">
                          <el-button
                            plain={true}
                            onClick={() => {
                              self.$refs.goodsSelect.open();
                            }}>
                            选择商品
                          </el-button>
                          <goods-select
                            ref="goodsSelect"
                            type="checkbox"
                            limit={1000}
                            is-tips={false}
                            select-style={{ backgroundColor: '#ffffff' }}
                            v-model={self.form.conditions.goods_list}
                          />
                          <el-table
                            max-height={368}
                            data={self.form.conditions.goods_list}
                            class="le-goods--table"
                            header-row-class-name="le-table-header"
                            row-class-name="le-table-row">
                            <el-table-column
                              label="商品"
                              scopedSlots={{
                                default: scope => {
                                  return (
                                    <div class="flex">
                                      <el-image class="le-goods--image" src={scope.row.slideshow[0]}>
                                        <div slot="error" class="image-slot">
                                          <i class="el-icon-picture-outline" />
                                        </div>
                                      </el-image>
                                      <div class="he-line-2 flex-sub le-goods--name">{scope.row.name}</div>
                                    </div>
                                  );
                                }
                              }}
                            />
                            <el-table-column
                              label="商品价格"
                              width="150px"
                              scopedSlots={{
                                default: scope => {
                                  return `￥${scope.row.price}`;
                                }
                              }}
                            />
                            <el-table-column
                              label="操作"
                              width="90px"
                              scopedSlots={{
                                default: scope => {
                                  return (
                                    <el-button
                                      type="text"
                                      onClick={() => self.form.conditions.goods_list.splice(scope.$index, 1)}>
                                      删除
                                    </el-button>
                                  );
                                }
                              }}
                            />
                          </el-table>
                        </div>
                      );
                  }
                })()}
              </el-form-item>
            </div>
          </div>
          <div class="le-card le-card-margin ">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>分销下线</span>
            </div>
            <div class="le-card-body">
              <el-form-item label="成为下线条件">
                <el-radio-group v-model={self.form.bind_way}>
                  <el-radio label={1}>首次点击分享链接</el-radio>
                  <el-radio label={2}>首次付款</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="绑定关系模式">
                <el-radio-group v-model={self.form.bind_type}>
                  <el-radio label={1}>永久绑定模式</el-radio>
                  <el-radio label={2}>保护期模式</el-radio>
                </el-radio-group>
              </el-form-item>
              {(() => {
                if (self.form.bind_type === 2) {
                  return (
                    <el-form-item label="保护期" label-width="250px" prop="bind_days" class="le-noleabel">
                      <el-input class="le-small--input" v-model={self.form.bind_days}>
                        <template slot="append">天</template>
                      </el-input>
                      <span class="le-title">之后解除关系</span>
                      <div style="margin-top: 10px">
                        去
                        <el-button
                          onClick={() => {
                            const newPage = self.$router.resolve({ path: '/setup/index' });
                            window.open(newPage.href, '_blank');
                          }}
                          style="padding:0;font-size: 14px"
                          type="text">
                          设置>基础设置
                        </el-button>
                        ，配置定时任务
                      </div>
                    </el-form-item>
                  );
                }
              })()}
            </div>
          </div>
          <div class="le-card le-card-margin ">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>分销协议</span>
            </div>
            <div class="le-card-body">
              <el-form-item label="是否启用协议">
                <el-radio-group v-model={self.form.use_agreement}>
                  <el-radio label={1}>启用</el-radio>
                  <el-radio label={0}>禁用</el-radio>
                </el-radio-group>
                <div class="le-prompt-text">启用后将显示在分销商招募令页面</div>
              </el-form-item>
              {(() => {
                if (self.form.use_agreement === 1) {
                  return [
                    [
                      <el-form-item label="协议标题">
                        <el-input
                          v-model={self.form.agreement_title}
                          maxlength={10}
                          show-word-limit={true}
                          placeholder="请输入协议标题"
                        />
                      </el-form-item>
                    ],
                    [
                      <el-form-item label="协议内容">
                        <el-input
                          v-model={self.form.agreement_content}
                          type="textarea"
                          placeholder="请输入协议内容"
                          rows="15"
                        />
                      </el-form-item>
                    ]
                  ];
                }
              })()}
            </div>
          </div>
        </el-form>
        <div class="le-cardpin">
          <el-button
            type="primary"
            disabled={self.disabled}
            loading={self.loading && !self.disabled}
            onClick={self.submit}>
            保存
          </el-button>
        </div>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
@import './index.less';

.le-title:extend(.font-family-yahei) {
  font-size: 14px;
  font-weight: 400;
  color: #262626;
}

.le-manual {
  padding: 9px 4px;
}

.le-info--table ::v-deep {
  width: 387px;
  margin-top: 10px;

  .le-table-row:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    height: 56px;

    .el-input {
      width: 240px;
    }

    .el-button--text {
      padding: 0;
    }
  }
}

.le-info--table_footer {
  margin-top: 15px;

  .le-prompt-text {
    margin-left: 15px;
  }

  .el-button[disabled] {
    color: #bfbfbf;
    border: 1px solid #dcdfe6;
  }
}

.le-goods--table ::v-deep {
  width: 600px;
  margin-top: 15px;

  .le-table-row:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    height: 72px;

    .el-button--text {
      padding: 0;
    }

    .le-goods--image {
      width: 48px;
      height: 48px;
    }

    .le-goods--name {
      font-size: 14px;
      font-weight: 400;
      color: #262626;
      margin-left: 20px;
    }
  }
}

.le-condition {
  margin-top: 10px;

  .goods-selet {
    display: none;
  }
}

.le-small--input {
  width: 125px;
  margin-left: 5px;

  ::v-deep .el-input-group__append {
    padding: 0 16px;
  }
}

.le-noleabel {
  ::v-deep.el-form-item__label {
    padding: 0;
  }

  .le-title {
    margin-left: 5px;
  }
}
</style>
