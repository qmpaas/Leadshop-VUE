<!--
 * @Description: 分销商详情
 * @Author: fjt
 * @Date: 2021-06-08 17:58:21
 * @LastEditTime: 2021-06-20 11:18:24
 * @LastEditors: fjt
-->
<script>
import Echart from './echarts.js';
import clearOut from './components/clear-out.vue';
import agreeRefuseApply from './components/agree-refuse-apply.vue';
import modifyLevel from './components/modify-level.vue';
import modifyName from './components/modify-name';
import modifyPhone from './components/modify-phone.vue';

export default {
  components: {
    clearOut,
    agreeRefuseApply,
    modifyLevel,
    modifyName,
    modifyPhone
  },
  render() {
    const self = this;
    return (
      <div class="le-main" v-loading={self.loading}>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <a onClick={this.routerBack}>分销列表</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>分销商详情</el-breadcrumb-item>
        </el-breadcrumb>
       <div class="flex">
         <div class="le-card le-card-margin flex-sub">
           <div class="le-card-head flex align-center">
             <span class="le-card-line"/>
             <span>基本信息</span>
           </div>
           <div class="le-basicinformation flex">
             <div class="le-information-one flex align-center flex-direction justify-center">
               <div>
                 <el-avatar size={80} error={() => true}>
                   <img src={self.detail.user.avatar}/>
                 </el-avatar>
               </div>
               <span class="le-name">{self.detail.user.nickname}</span>
               <span class="le-id">ID:{self.detail.UID}</span>
             </div>
             <div class="le-information-two">
               <p class="le-information-item">
                 <span>姓名: </span>
                 <span>{self.detail.user.realname ? self.detail.user.realname : '--'}</span>
                 <i class="le-icon le-icon-editor" onClick={() => (self.showModifyName = true)}/>
               </p>
               <p class="le-information-item">
                 <span>手机号: </span>
                 <span>{self.detail.user.mobile ? self.detail.user.mobile : '--'}</span>
                 <i class="le-icon le-icon-editor" onClick={() => (self.showModifyPhone = true)}/>
               </p>
               <p class="le-information-item">
                 <span>申请时间: </span>
                 <span>
                  {self.detail.apply_time
                    ? this.$moment(new Date(self.detail.apply_time * 1000)).format('Y-MM-DD HH:mm:ss')
                    : '--'}
                </span>
               </p>
               {(() => {
                 if (self.detail.status === 4) {
                   return (
                     <p class="le-information-item flex">
                       <span>下线关系处理: </span>
                       <div>
                         {(() => {
                           if (!self.detail.transfer_id) {
                             return '自由绑定分销商';
                           } else {
                             return [
                               ['转移给指定分销商'],
                               [
                                 <el-button
                                   onClick={() => {
                                     self.$router.push({
                                       path: '/promoter/index-detail/' + self.detail.transfer_id
                                     });
                                   }}
                                   class="le-transfer"
                                   type="text">
                                   {self.detail.transfer_name}
                                 </el-button>
                               ]
                             ];
                           }
                         })()}
                       </div>
                     </p>
                   );
                 }
               })()}
               {(() => {
                 if (self.detail.status === 2) {
                   return (
                     <p class="le-information-item">
                       <span>加入时间: </span>
                       <span>
                        {self.detail.join_time
                          ? self.$moment(new Date(self.detail.join_time * 1000)).format('Y-MM-DD HH:mm:ss')
                          : '--'}
                      </span>
                     </p>
                   );
                 }
               })()}
             </div>
             <div class="le-information-three">
               <p class="le-information-item">
                 <span>邀请方: </span>
                 <span>
                  {self.detail.status !== 2
                    ? '--'
                    : self.detail.invite_nickname
                      ? self.detail.invite_nickname
                      : '官方邀请'}
                </span>
               </p>
               {(() => {
                 if (self.detail.status === 2) {
                   return (
                     <p class="le-information-item">
                       <span>分销商等级: </span>
                       <span>{self.detail.level_name}</span>
                       <i class="le-icon le-icon-editor" onClick={() => (self.showModifyLevel = true)}/>
                     </p>
                   );
                 }
               })()}
               <p class="le-information-item">
                 <span>状态: </span>
                 <span>
                  {self.detail.status === 2
                    ? '已通过'
                    : self.detail.status === 1
                      ? '待审核'
                      : self.detail.status === 3
                        ? '已拒绝'
                        : self.detail.status === 4 || self.detail.status === -2
                          ? '已清退'
                          : ''}
                </span>
               </p>
             </div>
           </div>
         </div>
         {
           (() => {
             if (self.detail.apply_content) {
               return <div class="le-card le-card-margin  le-apply-content">
                 <div class="le-card-head flex align-center">
                   <span class="le-card-line"/>
                   <span>申请信息</span>
                 </div>
                 <div class="le-basicinformation">
                   <div class="">
                     {
                       self.detail.apply_content.map((item) => {
                         return <p class="le-infomation-item">
                           <span>{item.name}：</span>
                           <span>{item.value}</span>
                         </p>
                       })
                     }
                   </div>
                 </div>
               </div>
             }
           })()
         }
       </div>
        {(() => {
          if (self.detail.status === 2) {
            return (
              <div class="le-card le-card-margin">
                <div class="le-card-head flex align-center">
                  <span class="le-card-line" />
                  <span>下线人数</span>
                </div>
                <div class="flex le-offlinenumber">
                  {(() => {
                    if (self.detail.children.first) {
                      const first = self.detail.children.first;
                      return (
                        <div
                          class="flex-sub"
                          onClick={self.routerOfflineList.bind(self, { type: 1, detail: self.detail })}>
                          <div class="le-total-text">一级下线人数</div>
                          <div class="le-total-number">{first.ordinary + first.promoter}</div>
                          <div class="le-charts" id="le-offline-first" />
                        </div>
                      );
                    }
                  })()}
                  {(() => {
                    if (this.detail.children.second) {
                      const second = self.detail.children.second;
                      return (
                        <div
                          class="flex-sub"
                          onClick={self.routerOfflineList.bind(self, { type: 2, detail: self.detail })}>
                          <div class="le-total-text">二级下线人数</div>
                          <div class="le-total-number">{second.ordinary + second.promoter}</div>
                          <div class="le-charts" id="le-offline-two" />
                        </div>
                      );
                    }
                  })()}
                  {(() => {
                    if (this.detail.children.third) {
                      const third = self.detail.children.third;
                      return (
                        <div
                          class="flex-sub"
                          onClick={self.routerOfflineList.bind(self, { type: 3, detail: self.detail })}>
                          <div class="le-total-text">三级下线人数</div>
                          <div class="le-total-number">{third.ordinary + third.promoter}</div>
                          <div class="le-charts" id="le-offline-three" />
                        </div>
                      );
                    }
                  })()}
                </div>
              </div>
            );
          }
        })()}
        <div class="flex le-card-margin">
          <div class="le-card le-performance">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>业绩统计</span>
            </div>
            <div class="le-total-box flex align-center flex-direction justify-center">
              <div class="le-total-text">累计销售额</div>
              <div class="le-total-number">{self.detail.status !== 3 ? '¥' + self.detail.sales_amount : '--'}</div>
            </div>
            <div class="le-total-box flex align-center flex-direction justify-center">
              <div class="le-total-text">累计邀请分销商</div>
              <div class="le-total-number">{self.detail.status !== 3 ? self.detail.invite_number : '--'}</div>
            </div>
          </div>
          <div class="le-card le-commission">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>佣金统计</span>
            </div>
            <div class="le-content flex">
              <div class="le-data flex align-center flex-direction justify-center">
                <div class="le-total-text">累计佣金</div>
                <div class="le-total-number">
                  {self.detail.status !== 3 ? `¥${self.detail.all_commission_amount}` : '--'}
                </div>
              </div>
              <div class="le-chart" id="le-commission" />
            </div>
          </div>
        </div>
        {(() => {
          // 待审核 可清退
          if (self.detail.status === 2 || self.detail.status === 1) {
            return (
              <div class="le-cardpin">
                {(() => {
                  if (self.detail.status === 2) {
                    return (
                      <el-button
                        onClick={() => {
                          self.showClearOut = true;
                          self.clearOutInfo = {
                            UID: self.detail.UID,
                            mobile: self.detail.user.mobile,
                            status: self.detail.status
                          };
                        }}>
                        清退
                      </el-button>
                    );
                  } else if (self.detail.status === 1) {
                    return [
                      [<el-button onClick={self.agreeRefuse.bind(self, 'refuse')}>拒绝</el-button>],
                      [
                        <el-button type="primary" onClick={self.agreeRefuse.bind(self, 'pass')}>
                          通过
                        </el-button>
                      ]
                    ];
                  }
                })()}
              </div>
            );
          }
        })()}
        {
          // 清退
          (() => {
            if (self.showClearOut) {
              return (
                <clearOut
                  onConfirm={({ transferName }) => {
                    self.detail.status = 4;
                    self.detail.transfer_name = transferName;
                  }}
                  v-model={self.showClearOut}
                  info={self.clearOutInfo}
                />
              );
            }
          })()
        }
        {(() => {
          if (self.showAgreeRefuse) {
            return (
              <agreeRefuseApply
                type={self.agreeRefuseType}
                info={self.agreeRefuseInfo}
                v-model={self.showAgreeRefuse}
              />
            );
          }
        })()}
        {
          // 修改分销商等级
          (() => {
            if (self.detail.status === 2 && self.showModifyLevel) {
              return (
                <modifyLevel
                  v-model={self.showModifyLevel}
                  info={self.detail}
                  on={{
                    ['update:info']: e => {
                      self.detail = e;
                    }
                  }}
                />
              );
            }
          })()
        }
        {(() => {
          if (self.showModifyName) {
            return (
              <modifyName
                v-model={self.showModifyName}
                info={self.detail}
                on={{
                  ['update:info']: e => {
                    self.detail = e;
                  }
                }}
              />
            );
          }
        })()}
        {(() => {
          if (self.showModifyPhone) {
            return (
              <modifyPhone
                v-model={self.showModifyPhone}
                info={self.detail}
                on={{
                  ['update:info']: e => {
                    self.detail = e;
                  }
                }}
              />
            );
          }
        })()}
      </div>
    );
  },
  data() {
    return {
      detail: {
        user: {},
        children: {},
        all_commission_amount: '--',
        invite_number: '--',
        sales_amount: '--',
        status: -1
      },
      loading: true,
      // 清退分销商
      showClearOut: false,
      clearOutInfo: null,
      // 拒绝、同意申请
      showAgreeRefuse: false,
      agreeRefuseInfo: {},
      agreeRefuseType: '',
      // 修改分销商等级
      showModifyLevel: false,
      // 修改分销商姓名
      showModifyName: false,
      // 修改分销商手机
      showModifyPhone: false
    };
  },
  mounted() {
    const id = this.$route.params.id;
    this.getDetail(parseInt(id));
  },
  methods: {
    getDetail: function (id) {
      this.$heshop
        .promoter('get', id)
        .then(res => {
          this.detail = res;
          this.$nextTick(() => {
            this.commissionEchart();
            const status = this.detail.status;
            // 已通过
            if (status === 2) {
              this.offlineFirstEchart();
              if (res.children.second) {
                this.offlineTwoEchart();
              }
              if (res.children.second) {
                this.offlineThreeEchart();
              }
            }
          });
          this.loading = false;
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    routerBack: function () {
      this.$router.back(-1);
    },
    // 设置佣金统计表
    commissionEchart: function () {
      let data = new Echart('le-commission', '佣金统计');
      setTimeout(() => {
        data.setOptions([
          {
            value: this.detail.wait_account,
            name: '待结算佣金'
          },
          {
            value: this.detail.commission,
            name: '待提现佣金'
          },
          {
            value: this.detail.is_withdrawal,
            name: '已提现佣金'
          }
        ]);
      }, 500);
    },
    // 设置下线第一人数统计表
    offlineFirstEchart: function () {
      const echart = new Echart('le-offline-first', '下线人数');
      const first = this.detail.children.first;
      setTimeout(() => {
        echart.setOptions([
          {
            value: first.promoter,
            name: '分销商'
          },
          {
            value: first.ordinary,
            name: '普通下线'
          }
        ]);
      }, 500);
    },
    // 设置下线第二人数统计表
    offlineTwoEchart: function () {
      const echart = new Echart('le-offline-two', '下线人数');
      const second = this.detail.children.second;
      setTimeout(() => {
        echart.setOptions([
          {
            value: second.promoter,
            name: '分销商'
          },
          {
            value: second.ordinary,
            name: '普通下线'
          }
        ]);
      }, 500);
    },
    // 设置下线第三人数统计表
    offlineThreeEchart() {
      const echart = new Echart('le-offline-three', '下线人数');
      const third = this.detail.children.third;
      setTimeout(() => {
        echart.setOptions([
          {
            value: third.promoter,
            name: '分销商'
          },
          {
            value: third.ordinary,
            name: '普通下线'
          }
        ]);
      }, 500);
    },
    routerOfflineList(data) {
      this.$router.push({
        name: 'promoter-index-detail-list',
        path: '/promoter/index-detail-list',
        params: data
      });
    },
    // 通过 / 拒绝
    agreeRefuse(type) {
      this.agreeRefuseType = type;
      this.showAgreeRefuse = true;
      this.agreeRefuseInfo = this.detail;
      this.agreeRefuseInfo.nickname = this.detail.user.nickname;
    }
  }
};
</script>
<style lang="less" scoped>
@import './index.less';

.le-card-margin {
  margin-top: 24px;
}

.le-basicinformation {
  height: 156px;
  margin-top: 24px;

  .le-information-one {
    width: 192px;
    margin-right: 24px;

    .le-name:extend(.font-family-yahei) {
      font-size: 14px;
      font-weight: 400;
      color: #262626;
      margin-top: 10px;
    }

    .le-id:extend(.font-family-yahei) {
      font-size: 12px;
      font-weight: 400;
      color: #8c8c8c;
    }
  }

  .le-information-two,
  .le-information-three {
    padding-top: 15px;

    .le-icon-editor {
      color: #bbbfc8;
      margin-left: 13px;
      font-size: 14px;
      cursor: pointer;
    }
  }

  .le-information-three {
    margin-left: 150px;
  }

  .le-information-item:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    margin: 10px 0 0 0;

    .le-transfer {
      padding: 0;
      margin-left: 8px;
    }
  }
}

.le-commission,
.le-performance {
  height: 424px;
}

.le-offlinenumber {
  height: 384px;
  margin: 24px 0;

  .flex-sub:not(:last-child) {
    border-right: 1px solid #dcdfe6;
  }

  .le-total-text {
    line-height: 23px;
    text-align: center;
    margin-top: 16px;
  }

  .le-total-number {
    color: #623ceb;
    text-align: center;
    cursor: pointer;
  }

  .le-charts {
    height: 304px;
  }
}

.le-total-text:extend(.font-family-yahei) {
  font-size: 16px;
  font-weight: 400;
  color: #8c8c8c;
  line-height: 32px;
}

.le-total-number {
  font-size: 32px;
  font-family: DINPro;
  font-weight: bold;
  color: #262626;
  line-height: 40px;
}

.le-performance {
  width: 36%;
  margin-right: 24px;

  .le-total-box {
    height: 156px;
    background: rgba(98, 60, 235, 0.05);
    border-radius: 8px;
    margin-top: 23px;
  }
}

.le-commission {
  width: 64%;

  .le-content {
    margin-top: 24px;
    height: 328px;
  }

  .le-data {
    width: 35%;
  }

  .le-chart {
    width: 65%;
  }
}

.le-apply-content {
  width: 428px;
  margin-left: 24px;
}
</style>
