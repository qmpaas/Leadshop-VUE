<!--
 * @Description: 分销列表
 * @Author: fjt
 * @Date: 2021-06-08 17:32:10
 * @LastEditTime: 2021-06-20 11:09:20
 * @LastEditors: fjt
-->
<script>
import index from './index.js';
import asyncComponent from './advanced-component.js';
import agreeRefuseApply from './components/agree-refuse-apply.vue';
import clearOut from './components/clear-out.vue';
import distributor from './components/add-distributor.vue';

export default {
  mixins: [index],
  components: {
    agreeRefuseApply,
    clearOut,
    addDistributor: asyncComponent(distributor)
  },
  data() {
    return {
      form: {
        source: '',
        level: 0,
        status: '',
        apply_time: [],
        join_time: [],
        search: '',
        page: 1,
        invite: '',
        sort: {
          apply_time: 'DESC'
        }
      },
      page: {
        size: 10
      },
      levelList: [],
      list: [],
      // 拒绝、同意申请
      showAgreeRefuse: false,
      agreeRefuseInfo: {},
      agreeRefuseType: '',
      // 清退分销商
      showClearOut: false,
      clearOutInfo: {},
      // 添加分销商
      showAddDistributor: false
    };
  },
  render() {
    let self = this;
    return (
      <div class="le-main">
        <el-button type="primary" onClick={() => (self.showAddDistributor = true)}>
          添加分销商
        </el-button>
        <el-form props={{ model: self.form }} class="le-card" inline={true} label-width="125px">
          <el-form-item label="分销商搜索">
            <el-input
              v-model={self.form.search}
              value={self.form.search}
              onInput={e => {
                self.form.search = e;
              }}
              placeholder="输入ID/昵称/姓名/手机号搜索"
              clearable={true}
              onClear={() => {
                self.getList();
              }}
              nativeOn={{
                keyup: event => {
                  if (event.key === 'Enter') {
                    self.getList();
                  }
                }
              }}
            />
          </el-form-item>
          <el-form-item label="邀请方搜索">
            <el-input
              value={self.form.invite}
              onInput={e => {
                self.form.invite = e;
              }}
              clearable={true}
              nativeOn={{
                keyup: event => {
                  if (event.key === 'Enter') {
                    self.getList();
                  }
                }
              }}
              onClear={() => {
                self.getList();
              }}
              placeholder="输入昵称搜索"
            />
          </el-form-item>
          <el-form-item label="分销商等级">
            <el-select placeholder="请选择" v-model={self.form.level}>
              <el-option label="全部" value={0} />
              {self.levelList.map((v, k) => {
                return <el-option key={k} label={v.name} value={v.level} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="用户来源">
            <el-select placeholder="请选择" v-model={self.form.source}>
              <el-option label="全部" value={''} />
              <el-option label="微信小程序" value={'weapp'} />
              <el-option label="公众号" value={'wechat'} />
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select placeholder="请选择" v-model={self.form.status}>
              <el-option label="全部" value="" />
              <el-option label="待审核" value={1} />
              <el-option label="已通过" value={2} />
              <el-option label="已拒绝" value={3} />
              <el-option label="已清退" value={4} />
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              size="small"
              v-model={self.form.apply_time}
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <el-form-item label="加入时间">
            <el-date-picker
              size="small"
              v-model={self.form.join_time}
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            />
          </el-form-item>
          <div class="le-button">
            <el-button type="primary" onClick={self.filter}>
              筛选
            </el-button>
            <el-button onClick={self.empty}>清空</el-button>
          </div>
        </el-form>
        <div class="le-card le-table">
          <el-table
            {...{
              on: {
                'sort-change': self.sortList
              }
            }}
            props={{ data: this.list }}
            default-sort={{ prop: 'apply_time', order: 'descending' }}
            header-row-class-name="le-table-header"
            row-class-name="le-table-row">
            <el-table-column
              label="基本信息"
              width="288px"
              fixed="left"
              scopedSlots={{
                default: scope => {
                  return (
                    <div slot-scope="scope" class="flex">
                      <div>
                        <el-avatar size={48} error={() => true}>
                          <img src={scope.row.avatar} />
                        </el-avatar>
                      </div>
                      <div class="le-usercontent">
                        <div class="le-user">
                          <i class={`le-icon le-icon-${scope.row.type === 'weapp' ? 'xiaochengxu' : 'wehcat'}`} />
                          <span class="le-username">{scope.row.nickname}</span>
                        </div>
                        <div class="le-userinfor">
                          ID:{scope.row.UID}
                          <br />
                          {scope.row.realname}
                          <br />
                          {scope.row.mobile}
                        </div>
                      </div>
                    </div>
                  );
                }
              }}
            />
            <el-table-column
              label="分销商等级"
              scopedSlots={{
                default: scope => {
                  return scope.row.status === 2 ? scope.row.level_name : '--';
                }
              }}
            />
            <el-table-column
              label="邀请方"
              scopedSlots={{
                default: scope => {
                  if (scope.row.status !== 2) {
                    return '--';
                  } else {
                    return !scope.row.invite_nickname ? '官方招募' : scope.row.invite_nickname;
                  }
                }
              }}
            />
            <el-table-column
              label="累计销售金额(元)"
              sortable="custom"
              min-width="140px"
              prop="sales_amount"
              scopedSlots={{
                default: scope => {
                  return scope.row.status === 2 || scope.row.repel_time ? scope.row.sales_amount : '--';
                }
              }}
            />
            <el-table-column
              label="累计佣金(元)"
              sortable="custom"
              prop="all_commission_amount"
              min-width="120px"
              scopedSlots={{
                default: scope => {
                  return scope.row.status === 2 || scope.row.repel_time ? scope.row.all_commission_amount : '--';
                }
              }}
            />
            <el-table-column
              label="当前下线数"
              prop="all_children"
              sortable="custom"
              min-width="120px"
              scopedSlots={{
                default: scope => {
                  return scope.row.status === 2 ? scope.row.all_children : '--';
                }
              }}
            />

            <el-table-column
              label="累计邀请分销商"
              sortable="custom"
              prop="invite_number"
              min-width="130px"
              scopedSlots={{
                default: scope => {
                  return scope.row.status === 2 ? scope.row.invite_number : '--';
                }
              }}
            />

            <el-table-column
              label="状态"
              min-width="100px"
              scopedSlots={{
                default: scope => {
                  const status = scope.row.status;
                  return (
                    <el-tag
                      effect="plain"
                      size="medium"
                      type={
                        status === 2
                          ? 'success'
                          : status === 1
                          ? 'warning'
                          : status === 3
                          ? 'danger'
                          : status === 4 || status === -2
                          ? 'info'
                          : ''
                      }>
                      {status === 2
                        ? '已通过'
                        : status === 1
                        ? '待审核'
                        : status === 3
                        ? '已拒绝'
                        : status === 4 || status === -2
                        ? '已清退'
                        : ''}
                    </el-tag>
                  );
                }
              }}
            />
            <el-table-column
              label="时间"
              sortable="custom"
              prop="apply_time"
              min-width="180px"
              scopedSlots={{
                default: scope => {
                  let apply_time = scope.row.apply_time
                    ? self.$moment(new Date(scope.row.apply_time * 1000)).format('Y-MM-DD HH:mm:ss')
                    : '--';
                  let join_time = scope.row.join_time
                    ? self.$moment(new Date(scope.row.join_time * 1000)).format('Y-MM-DD HH:mm:ss')
                    : '--';
                  return (
                    <span>
                      申请：{apply_time}
                      {(() => {
                        if (scope.row.status === 2) {
                          return [[<br />], [`加入：${join_time}`]];
                        }
                      })()}
                    </span>
                  );
                }
              }}
            />
            <el-table-column
              label="操作"
              min-width="220px"
              scopedSlots={{
                default: scope => {
                  return (
                    <div class="le-table-operate flex align-center">
                      {(() => {
                        // 是分销商 或者 以前是分销商
                        if (scope.row.repel_time || scope.row.status === 2) {
                          return [
                            [
                              <el-button type="text" onClick={self.routerDetail.bind(self, scope.row.UID)}>
                                详情
                              </el-button>
                            ],
                            [
                              (() => {
                                if (scope.row.repel_time && scope.row.status === 1) {
                                  return <span class="le-line" />;
                                }
                              })()
                            ]
                          ];
                        }
                      })()}
                      {(() => {
                        if (scope.row.status === 2) {
                          return [
                            [<span class="le-line" />],
                            [
                              <el-button onClick={self.clearOut.bind(self, scope.row)} type="text">
                                清退
                              </el-button>
                            ]
                          ];
                        } else if (scope.row.status === 1) {
                          return [
                            [
                              <el-button type="text" onClick={self.agreeRefuse.bind(self, scope.row, 'pass')}>
                                通过
                              </el-button>
                            ],
                            [<span class="le-line" />],
                            [
                              <el-button type="text" onClick={self.agreeRefuse.bind(self, scope.row, 'refuse')}>
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
              current-page={self.form.page}
              layout="prev, pager, next, jumper"
              on-current-change={self.switchPage}
              page-count={self.page.count}
            />
          </div>
        </div>
        {
          // 同意拒绝成为分销商
          (() => {
            if (self.showAgreeRefuse) {
              return (
                <agreeRefuseApply
                  type={self.agreeRefuseType}
                  info={self.agreeRefuseInfo}
                  v-model={self.showAgreeRefuse}
                />
              );
            }
          })()
        }
        {
          // 清退分销商
          (() => {
            if (self.showClearOut) {
              return <clearOut v-model={self.showClearOut} info={self.clearOutInfo} />;
            }
          })()
        }
        {
          // 添加分销商
          (() => {
            if (self.showAddDistributor) {
              return (
                <addDistributor
                  v-model={self.showAddDistributor}
                  onConfirm={() => {
                    self.getList();
                  }}
                />
              );
            }
          })()
        }
      </div>
    );
  },
  async mounted() {
    await this.getLevel();
    if (this.$route.query.level) {
      this.form.level = parseInt(this.$route.query.level);
    }
    await this.getList();
  },
  methods: {
    routerDetail: function (UID) {
      this.$router.push({
        path: '/promoter/index-detail/' + UID
      });
    },
    // 列表分页切换
    switchPage: function (number) {
      this.form.page = number;
      this.getList();
    },
    // 筛选
    filter: function () {
      this.getList();
    },
    empty: function () {
      this.form = {
        source: '',
        level: 0,
        status: '',
        apply_time: [],
        join_time: [],
        search: '',
        page: 1,
        invite: '',
        sort: this.form.sort
      };
      this.filter();
    },
    //   字符串转数字
    getParseInt: function (data) {
      if (!isNaN(data)) {
        return parseInt(data);
      }
      return 0;
    },
    // 列表排序
    sortList: function (e) {
      this.form.sort = {
        [e.prop]: e.order === 'descending' ? 'DESC' : 'ASC'
      };
      this.getList();
    },
    //  获取列表
    getList: function () {
      let form = this.$_.cloneDeep(this.form);
      if (form.apply_time?.length) {
        form.apply_time_start = form.apply_time[0] / 1000;
        form.apply_time_end = form.apply_time[1] / 1000;
      } else {
        form.apply_time_start = 0;
        form.apply_time_end = 0;
      }
      if (form.join_time?.length) {
        form.join_time_start = form.join_time[0] / 1000;
        form.join_time_end = form.join_time[1] / 1000;
      } else {
        form.join_time_start = 0;
        form.join_time_end = 0;
      }
      delete form.apply_time;
      delete form.join_time;
      this.$heshop
        .search('post', { include: 'promoter' }, { keyword: form })
        .page(this.form.page, this.page.size)
        .then(res => {
          let { data, headers } = res;
          this.list = data;
          this.form.page = +headers['x-pagination-current-page'];
          this.page = {
            count: +headers['x-pagination-page-count'],
            size: +headers['x-pagination-per-page'],
            total: +headers['x-pagination-total-count']
          };
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    // 获取当前全部等级
    async getLevel() {
      this.levelList = await this.$heshop.promoterlevel('get');
      return true;
    },
    // 拒绝 or 同意
    agreeRefuse(item, type) {
      this.showAgreeRefuse = true;
      this.agreeRefuseInfo = item;
      this.agreeRefuseType = type;
    },
    // 清退
    clearOut(item) {
      this.showClearOut = true;
      this.clearOutInfo = item;
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';

.le-card {
  margin-top: 24px;
}

.le-button {
  margin-left: 125px;
}

.le-table ::v-deep {
  .le-table-row:extend(.font-family-yahei) {
    height: 120px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }

  .le-avatar {
    display: block;
  }

  .le-usercontent {
    padding-left: 12px;

    .le-user {
      margin-bottom: 8px;
    }
  }

  .le-username:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    margin-left: 8px;
  }

  .le-userinfor:extend(.font-family-yahei) {
    width: 156px;
    background: #f3f5f7;
    border-radius: 4px;
    padding: 8px;
    font-size: 12px;
    font-weight: 400;
    color: #595959;
    line-height: 16px;
  }
}
</style>
