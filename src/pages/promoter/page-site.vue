<script>
import mobileHead from './images/mobile-head.png';
import { pageSetting, savePageSetting } from './api';

const form = {
  apply: {
    bg_url: 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/promoter/join-us.png',
    title: '申请分销商'
  },
  distributor_center: {
    // 页面标题
    title: '分销商中心',
    // 待提现佣金
    commission: '待提现佣金',
    // 累计佣金
    all_commission_amount: '累计佣金',
    // 待结算佣金
    wait_account: '待结算佣金',
    // 已提现佣金
    is_withdrawal: '已提现佣金',
    // 累计分销订单
    promoter_order_number: '累计分销订单',
    // 累计下线人数
    all_children: '累计下线人数',
    // 分销商品
    goods: '分销商品',
    // 推广赚钱
    promotion_make_money: '推广赚钱'
  },
  grade_center: {
    // 一级分销佣金
    first: '一级分销佣金',
    // 二级分销佣金
    second: '二级分销佣金',
    // 三级分销佣金
    third: '三级分销佣金',
    // 当前下线数
    all_children: '当前下线数',
    // 累计销售金额
    sales_amount: '累计销售金额',
    // 累计佣金
    all_commission_amount: '累计佣金'
  },
  // 分销下线
  children: {
    // 一级
    first: '一级',
    // 二级
    second: '二级',
    // 三级
    third: '三级'
  },
  // 空间动态
  dynamic: {
    bg_url: 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/promoter/dynamic-bg.png'
  }
};

export default {
  name: 'page-site',
  data() {
    return {
      activeName: '',
      form: {
        apply: {
          bg_url: '',
          title: ''
        },
        distributor_center: {
          // 页面标题
          title: '',
          // 待提现佣金
          commission: '',
          // 累计佣金
          all_commission_amount: '',
          // 待结算佣金
          wait_account: '',
          // 已提现佣金
          is_withdrawal: '',
          // 累计分销订单
          promoter_order_number: '',
          // 累计下线人数
          all_children: '',
          // 分销商品
          goods: '',
          // 推广赚钱
          promotion_make_money: ''
        },
        grade_center: {
          // 一级分销佣金
          first: '',
          // 二级分销佣金
          second: '',
          // 三级分销佣金
          third: '',
          // 当前下线数
          all_children: '',
          // 累计销售金额
          sales_amount: '',
          // 累计佣金
          all_commission_amount: ''
        },
        children: {
          first: '',
          second: '',
          third: ''
        },
        dynamic: {
          bg_url: ''
        }
      },
      loading: false
    };
  },
  render() {
    const self = this;
    return (
      <el-form class="le-main" label-width="140px">
        <el-tabs class="tabs" v-model={self.activeName} on-tab-click={self.handleClick}>
          <el-tab-pane label="申请分销商" name="first">
            <div class="flex">
              <div class="mobile-prediv">
                <div class="prediv-content">
                  <div class="content--title">{self.form.apply.title}</div>
                  <img height="80" width="336" class="le-mobile-head" src={mobileHead} />
                  <img src={self.form.apply.bg_url} height="162.9" width="336" alt="" />
                  <img src={require('./images/mobile-join-us-bg.png')} height="372" width="336" alt="" />
                </div>
              </div>
              <div class="le-right flex-sub">
                <div class="le-card  ">
                  <div class="le-card-head flex align-center">
                    <span class="le-card-line" />
                    <span>背景图设置</span>
                  </div>
                  <el-form-item label="上传图片">
                    <div class="select-cover__120">
                      <pictureDialog
                        v-model={self.form.apply.bg_url}
                        limit={1}
                        scopedSlots={{
                          upload() {
                            return (
                              <div class="select-cover__120-add">
                                <i class="le-icon le-icon-add select-cover__120-icon" />
                                <span class="select-cover__120-text">添加图片</span>
                              </div>
                            );
                          },
                          preview(scope) {
                            return (
                              <div class="select-cover__120-edit">
                                <el-image src={scope.url} fit="cover" />
                                <div class="select-cover__120-tips">
                                  <span>替换</span>
                                </div>
                              </div>
                            );
                          }
                        }}
                      />
                    </div>
                    <div class="he-tips">
                      <el-button
                        type="text"
                        onClick={() => (self.form.apply.bg_url = form.apply.bg_url)}
                        class="le-reset">
                        重置为默认
                      </el-button>
                      <span class="le-prompt-text">建议尺寸：750像素 * 360像素</span>
                    </div>
                  </el-form-item>
                </div>
                <div class="le-card  ">
                  <div class="le-card-head flex align-center">
                    <span class="le-card-line" />
                    <span>文字设置</span>
                  </div>
                  <el-form-item label="页面标题">
                    <el-input v-model={self.form.apply.title} maxlength="8" show-word-limit={true} />
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="分销商中心" name="second">
            <div class="flex">
              <div class="mobile-prediv">
                <div class="prediv-content">
                  <div class="content--title">{self.form.distributor_center.title}</div>
                  <img height="80px" width="336px" class="le-mobile-head" src={mobileHead} />
                  <el-scrollbar class="he-head">
                    <img src={require('./images/center.png')} height="900" alt="" />
                    <span style="top:243px;left: 50%;transform: translateX(-50%)">
                      {self.form.distributor_center.all_commission_amount}
                    </span>
                    <span style="top: 437px;left: 37px">{self.form.distributor_center.commission}</span>
                    <span style="top: 372px;left:198px ">{self.form.distributor_center.wait_account}</span>
                    <span style="top: 372px;left: 37px">{self.form.distributor_center.is_withdrawal}</span>
                    <span style="top: 513px; left:15px">{self.form.distributor_center.promoter_order_number}</span>
                    <span style="top: 513px; left:179px">{self.form.distributor_center.all_children}</span>
                    <div style="top: 587px; left:22px">{self.form.distributor_center.goods}</div>
                    <div style="top: 760px; left:22px;color: #333333">
                      {self.form.distributor_center.promotion_make_money}
                    </div>
                  </el-scrollbar>
                </div>
              </div>
              <div class="le-right flex-sub">
                <div class="le-card">
                  <div class="le-card-head flex align-center">
                    <span class="le-card-line" />
                    <span>文字设置</span>
                  </div>
                  <el-form-item label="页面标题">
                    <el-input v-model={self.form.distributor_center.title} maxlength="8" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="待提现佣金">
                    <el-input v-model={self.form.distributor_center.commission} maxlength="6" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="累计佣金">
                    <el-input
                      v-model={self.form.distributor_center.all_commission_amount}
                      maxlength="6"
                      show-word-limit={true}
                    />
                  </el-form-item>
                  <el-form-item label="待结算佣金">
                    <el-input
                      v-model={self.form.distributor_center.wait_account}
                      maxlength="6"
                      show-word-limit={true}
                    />
                  </el-form-item>
                  <el-form-item label="已提现佣金">
                    <el-input
                      v-model={self.form.distributor_center.is_withdrawal}
                      maxlength="6"
                      show-word-limit={true}
                    />
                  </el-form-item>
                  <el-form-item label="累计分销订单">
                    <el-input
                      v-model={self.form.distributor_center.promoter_order_number}
                      maxlength="6"
                      show-word-limit={true}
                    />
                  </el-form-item>
                  <el-form-item label="累计下线人数">
                    <el-input
                      v-model={self.form.distributor_center.all_children}
                      maxlength="6"
                      show-word-limit={true}
                    />
                  </el-form-item>
                  <el-form-item label="分销商品">
                    <el-input v-model={self.form.distributor_center.goods} maxlength="6" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="推广赚钱">
                    <el-input
                      v-model={self.form.distributor_center.promotion_make_money}
                      maxlength="6"
                      show-word-limit={true}
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="等级中心" name="third">
            <div class="flex">
              <div class="mobile-prediv">
                <div class="prediv-content">
                  <div class="content--title">等级中心</div>
                  <img height="80px" width="336px" class="le-mobile-head" src={mobileHead} />
                  <el-scrollbar style="position: relative;">
                    <img src={require('./images/level-bg.png')} width="336" height="290" alt="" />
                    <div class="banner flex justify-around">
                      <div class="">
                        <span>{self.form.grade_center.first}</span>
                      </div>
                      <div class="">
                        <span>{self.form.grade_center.second}</span>
                      </div>
                      <div class="">
                        <span>{self.form.grade_center.third}</span>
                      </div>
                    </div>
                    <div class="level">
                      <div>
                        <span class="title">中级分销商</span>
                        <span class="assist">满足全部条件升级</span>
                      </div>
                      <div class="item">
                        <div>{self.form.grade_center.all_children}</div>
                        <div class="progress">
                          <div class="bar" style="width: 150px"></div>
                        </div>
                        <div class="flex justify-between footer">
                          <div>已达521人</div>
                          <div>1000人</div>
                        </div>
                      </div>
                      <div class="item">
                        <div>{self.form.grade_center.sales_amount}</div>
                        <div class="progress">
                          <div class="bar" style="width: 50px"></div>
                        </div>
                        <div class="flex justify-between footer">
                          <div>已达￥148.23</div>
                          <div>￥1000.00</div>
                        </div>
                      </div>
                      <div class="item">
                        <div>{self.form.grade_center.all_commission_amount}</div>
                        <div class="progress">
                          <div class="bar" style="width: 234px"></div>
                        </div>
                        <div class="flex justify-between footer">
                          <div>已达￥765.52</div>
                          <div>￥1000.00</div>
                        </div>
                      </div>
                    </div>
                  </el-scrollbar>
                </div>
              </div>
              <div class="le-right flex-sub">
                <div class="le-card  ">
                  <div class="le-card-head flex align-center">
                    <span class="le-card-line" />
                    <span>文字设置</span>
                  </div>
                  <el-form-item label="一级分销佣金">
                    <el-input v-model={self.form.grade_center.first} maxlength="6" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="二级分销佣金">
                    <el-input v-model={self.form.grade_center.second} maxlength="6" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="三级分销佣金">
                    <el-input v-model={self.form.grade_center.third} maxlength="6" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="当前下线数">
                    <el-input v-model={self.form.grade_center.all_children} maxlength="6" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="累计销售金额">
                    <el-input v-model={self.form.grade_center.sales_amount} maxlength="6" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="累计佣金">
                    <el-input
                      v-model={self.form.grade_center.all_commission_amount}
                      maxlength="6"
                      show-word-limit={true}
                    />
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="分销下线" name="fourth">
            <div class="flex">
              <div class="mobile-prediv">
                <div class="prediv-content">
                  <div class="content--title">分销下线</div>
                  <img height="80px" width="336px" class="le-mobile-head" src={mobileHead} />
                  <div class="flex switch justify-around" style="border-radius: 0 0 10px 10px;">
                    <div class="switch-item ">{self.form.children.first}(96)</div>
                    <div class="switch-item ">{self.form.children.second}(295)</div>
                    <div class="switch-item ">{self.form.children.third}(695)</div>
                  </div>
                  <img src={require('./images/children-bg.png')} width="336" height="468" alt="" />
                </div>
              </div>
              <div class="le-right flex-sub">
                <div class="le-card  ">
                  <div class="le-card-head flex align-center">
                    <span class="le-card-line" />
                    <span>文字设置</span>
                  </div>
                  <el-form-item label="一级">
                    <el-input v-model={self.form.children.first} maxlength="4" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="二级">
                    <el-input v-model={self.form.children.second} maxlength="4" show-word-limit={true} />
                  </el-form-item>
                  <el-form-item label="三级">
                    <el-input v-model={self.form.children.third} maxlength="4" show-word-limit={true} />
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="空间动态" name="fifth">
            <div class="flex">
              <div class="mobile-prediv">
                <div class="prediv-content">
                  <div class="content--title">空间动态</div>
                  <img height="80px" width="336px" class="le-mobile-head" src={mobileHead} />
                  <img src={self.form.dynamic.bg_url} width="336" height="169" alt="" />
                  <img src={require('./images/dynamic-bg.png')} width="336" height="376" alt="" />
                </div>
              </div>
              <div class="le-right flex-sub">
                <div class="le-card  ">
                  <div class="le-card-head flex align-center">
                    <span class="le-card-line" />
                    <span>背景图设置</span>
                  </div>
                  <el-form-item label="上传图片">
                    <div class="select-cover__120">
                      <pictureDialog
                        v-model={self.form.dynamic.bg_url}
                        limit={1}
                        scopedSlots={{
                          upload() {
                            return (
                              <div class="select-cover__120-add">
                                <i class="le-icon le-icon-add select-cover__120-icon" />
                                <span class="select-cover__120-text">添加图片</span>
                              </div>
                            );
                          },
                          preview(scope) {
                            return (
                              <div class="select-cover__120-edit">
                                <el-image src={scope.url} fit="cover" />
                                <div class="select-cover__120-tips">
                                  <span>替换</span>
                                </div>
                              </div>
                            );
                          }
                        }}
                      />
                    </div>
                    <div class="he-tips">
                      <el-button
                        type="text"
                        onClick={() => (self.form.dynamic.bg_url = form.dynamic.bg_url)}
                        class="le-reset">
                        重置为默认
                      </el-button>
                      <span class="le-prompt-text">建议尺寸：750像素 * 360像素</span>
                    </div>
                  </el-form-item>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <div class="le-cardpin">
          <el-button type="primary" loading={self.loading} onClick={self.submit}>
            保存
          </el-button>
        </div>
      </el-form>
    );
  },
  mounted() {
    console.count('mounted');
    if (this.$route.query.name) {
      this.activeName = this.$route.query.name;
    } else {
      this.activeName = 'first';
    }
    this.getDetail();
  },
  methods: {
    handleClick(v) {
      this.$router.replace({
        path: '/promoter/page-site',
        query: {
          name: v.name
        }
      });
    },
    // 提交保存
    async submit() {
      const response = await savePageSetting(this.form);
      this.$message({
        type: 'success',
        message: '保存成功'
      });
    },
    // 获取详情
    async getDetail() {
      const response = await pageSetting();
      if (this.$_.isEmpty(response)) {
        this.form = form;
      } else {
        this.form = response;
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (!vm.$route.query.name) {
        vm.$router.replace({
          path: '/promoter/page-site',
          query: {
            name: 'first'
          }
        });
      }
    });
  }
};
</script>

<style scoped lang="less">
@import './index.less';

.tabs ::v-deep {
  .el-tabs__header {
    border-radius: 16px;
    background: #ffffff;
    padding-left: 64px;
    margin-bottom: 24px;
  }

  .el-tabs__nav-wrap::after {
    display: none;
  }

  .el-tabs__item {
    height: 64px;
    line-height: 64px;
    color: #8c8c8c;

    &.is-active {
      color: #623ceb;
    }
  }
}

.le-mobile-head {
  display: block;
}

.mobile-prediv {
  width: 380px;
  height: 690px;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 40px;
  padding: 37px 20px;
  margin-right: 24px;

  .prediv-content {
    border: 1px solid #dcdfe6;
    height: 100%;
    position: relative;
    background: #f5f5f5;
    overflow-y: hidden;
  }

  /deep/.is-horizontal {
    display: none;
  }
  .el-scrollbar {
    height: 525px;

    /deep/ .el-scrollbar__view {
      position: relative;
    }
  }

  .content--title:extend(.font-family-yahei) {
    font-size: 16px;
    font-weight: bold;
    color: #262626;
    position: absolute;
    left: 50%;
    top: 50px;
    transform: translateX(-50%);
  }

  .switch {
    width: 336px;
    height: 65px;
    background: #ffffff;
    padding: 15px;
  }

  .switch-item:extend(.font-family-yahei) {
    width: 99px;
    height: 36px;
    line-height: 36px;
    text-align: center;
    border-radius: 4px;
    background: #f5f5f5;
    font-size: 12px;
    font-weight: 400;
    color: #262626;

    &:first-child {
      background: #fef3f4;
      color: #e60b30;
    }
  }

  .banner:extend(.font-family-yahei) {
    position: absolute;
    top: 243px;
    padding: 0 40px;
    width: 100%;
    text-align: center;
    font-size: 10px;
    font-weight: 400;
    color: #a06640;

    > div {
      width: 90px;

      > span {
        display: block;
        transform: scale(0.9);
      }
    }
  }

  .level {
    width: 322px;
    background: #ffffff;
    border-radius: 8px;
    margin: 16px 8px 0 8px;
    padding: 18px 18px 22px 18px;

    .title:extend(.font-family-yahei) {
      font-size: 14px;
      font-weight: 400;
      color: #222222;
    }

    .assist:extend(.font-family-yahei) {
      font-size: 11px;
      font-weight: 400;
      color: #999999;
      margin-left: 8px;
    }

    .item:extend(.font-family-yahei) {
      margin-top: 15px;
      font-size: 12px;
      font-weight: 400;
      color: #666666;
      line-height: 16px;

      .footer:extend(.font-family-yahei) {
        font-size: 11px;
        font-weight: 400;
        color: #666666;
        line-height: 16px;
      }
    }

    .progress {
      width: 286px;
      height: 8px;
      background: #f3e0d2;
      border-radius: 4px;
      margin: 6px 0;

      .bar {
        height: 8px;
        background: #c9875e;
        border-radius: 4px;
      }
    }
  }
}

.le-right {
  .le-card:not(:last-child) {
    margin-bottom: 24px;
  }

  .le-reset {
    padding: 0 8px 0 0;
  }
}

.he-head {
  width: 336px;
  overflow: hidden;
  span:extend(.font-family-yahei) {
    position: absolute;
    font-size: 10px;
    font-weight: 400;
    color: #666666;
    line-height: 16px;
    transform: scale(0.8);
  }
  div:extend(.font-family-yahei) {
    font-size: 12px;
    font-weight: 400;
    color: #333333;
    position: absolute;
  }
}
</style>
