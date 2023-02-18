<!--
 * @Description: 下线列表
 * @Author: fjt
 * @Date: 2021-06-19 22:08:35
 * @LastEditors: fjt
 * @LastEditTime: 2021-06-20 11:16:27
-->
<script>
import index from './index.js';
import recruitmentPromotion from './components/recruitment-promotion.vue';
import dissolveRelationship from './components/dissolve-relationship.vue';

export default {
  mixins: [index],
  components: {
    recruitmentPromotion,
    dissolveRelationship
  },
  data() {
    return {
      list: [],
      type: '一级下线',
      children: {},
      children_num: 0,
      user: {},
      form: {
        page: 1,
        search: '',
        type: 0
      },
      page: {
        size: 20,
        total: 0
      },
      // 解除关系
      showDissolveRelationship: false,
      dissolveRelationshipInfo: null
    };
  },
  render() {
    const self = this;
    const type = [
      {
        label: '全部',
        value: 0
      },
      {
        label: '分销商',
        value: 1
      },
      {
        label: '普通下线',
        value: 2
      }
    ];
    return (
      <div>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <a onClick={this.routerBack.bind(this, -2)}>分销列表</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a onClick={this.routerBack.bind(this, -1)}>分销商详情</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>下线列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="le-card le-card-margin le-userinfo-box flex align-center">
          <div class="le-userinfo flex align-center">
            <el-avatar size={48} error={() => true}>
              <img src={this.user.avatar} />
            </el-avatar>
            <span class="le-username">{this.user.nickname}</span>
          </div>
          <span class="le-title">{this.type}</span>
          <span class="le-number">{self.children_num}</span>
        </div>
        <el-form class="le-card le-card-margin" props={{ model: self.form }} inline={true} label-width="112px">
          <el-form-item label="下线搜索">
            <el-input placeholder="输入昵称搜索" v-model={self.form.search} />
          </el-form-item>
          <el-form-item label="下线类型">
            <el-select placeholder="请选择" v-model={self.form.type}>
              {type.map((item, index) => {
                return <el-option key={index} label={item.label} value={item.value} />;
              })}
            </el-select>
          </el-form-item>
          <div class="le-button">
            <el-button type="primary" onClick={this.filter}>
              筛选
            </el-button>
            <el-button onClick={this.empty}>清空</el-button>
          </div>
        </el-form>
        <div class="le-card le-card-margin le-table">
          <el-table props={{ data: this.list }} row-class-name="le-table-row">
            <el-table-column
              label="用户"
              min-width="200px"
              scopedSlots={{
                default: scope => {
                  return (
                    <div class="flex align-center">
                      <el-avatar size={40} error={() => true}>
                        <img src={scope.row.avatar} />
                      </el-avatar>
                      <i
                        class={`le-icon le-userplatform-icon le-icon-${
                          scope.row.type === 'weapp' ? 'xiaochengxu' : 'wehcat'
                        }`}
                      />
                      <span>{scope.row.nickname}</span>
                    </div>
                  );
                }
              }}
            />
            <el-table-column
              label="下级类型"
              min-width="100px"
              scopedSlots={{
                default: scope => {
                  return scope.row.status && scope.row.status == 2 ? '分销商' : '普通下线';
                }
              }}
            />
            <el-table-column
              label="分销商等级"
              min-width="100px"
              scopedSlots={{
                default: scope => {
                  return scope.row.status && scope.row.status == 2 && scope.row.level_name
                    ? scope.row.level_name
                    : '--';
                }
              }}
            />
            <el-table-column
              label="分销商品金额(元)"
              min-width="130px"
              scopedSlots={{
                default: scope => {
                  return scope.row.sales_amount;
                }
              }}
            />
            <el-table-column
              label="贡献佣金金额(元)"
              min-width="130px"
              scopedSlots={{
                default: scope => {
                  return scope.row.commission;
                }
              }}
            />
            <el-table-column
              label="成为下线时间"
              min-width="150px"
              scopedSlots={{
                default: scope => {
                  return scope.row.bind_time
                    ? this.$moment(new Date(scope.row.bind_time * 1000)).format('Y-MM-DD HH:mm:ss')
                    : '--';
                }
              }}
            />
            <el-table-column
              label="操作"
              scopedSlots={{
                default: scope => {
                  if (scope.row.id !== this.user.UID) {
                    return (
                      <el-button
                        class="le-table-button"
                        type="text"
                        onClick={self.dissolveRelationship.bind(self, scope.row)}>
                        解除关系
                      </el-button>
                    );
                  }
                }
              }}
            />
          </el-table>
          <div class="flex le-pagination justify-end">
            <el-pagination
              background
              current-page={this.form.page}
              layout="prev, pager, next, jumper"
              on-current-change={this.switchPage}
              page-count={this.page.count}
            />
          </div>
        </div>
        {
          // 解除关系
          (() => {
            if (self.showDissolveRelationship) {
              return (
                <dissolveRelationship
                  onConfirm={self.dissolveRelationshipConfirm}
                  v-model={self.showDissolveRelationship}
                  info={self.dissolveRelationshipInfo}
                />
              );
            }
          })()
        }
      </div>
    );
  },
  mounted() {
    let params = this.$route.params;
    if (JSON.stringify(params) === '{}') {
      params = JSON.parse(localStorage.getItem('promoter_children'));
    } else {
      localStorage.setItem('promoter_children', JSON.stringify(params));
    }

    this.type = params.type == 1 ? '一级下线数' : params.type == 2 ? '二级下线数' : '三级下线数';
    this.children =
      params.type == 1
        ? params.detail.children.first
        : params.type == 2
        ? params.detail.children.second
        : params.detail.children.third;
    params.detail.user['UID'] = params.detail.UID;
    this.user = params.detail.user;
    this.children_num = this.children.ordinary + this.children.promoter;
    this.getList();
  },
  methods: {
    // 回去下线列表
    getList: function () {
      this.$heshop
        .promoter(
          'post',
          {
            behavior: 'children_list'
          },
          {
            parent: this.children.parent,
            UID: this.user.UID,
            nickname: this.form.search.trim(),
            type: this.form.type
          }
        )
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
    // 路由回退 回到到详情 列表
    routerBack: function (stepCount) {
      this.$router.go(stepCount);
    },
    // 刷选
    filter: function () {
      this.replaceQuery();
      this.getList();
    },
    empty: function () {
      this.form = {
        search: '',
        type: 0,
        page: 1
      };
      this.filter();
    },
    // 页面切换
    switchPage: function (number) {
      this.form.page = number;
      this.replaceQuery();
      this.getList();
    },
    // 解除关系
    dissolveRelationship(item) {
      this.showDissolveRelationship = true;
      this.dissolveRelationshipInfo = item;
      this.dissolveRelationshipInfo.UID = item.id;
    },
    // 确认解除关系回调
    dissolveRelationshipConfirm() {
      const index = this.list.findIndex(item => {
        return item.id === this.dissolveRelationshipInfo.id;
      });
      this.$delete(this.list, index);
      this.children_num--;
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';

.le-card-margin {
  margin-top: 24px;
}

.le-userinfo-box {
  padding: 32px 48px;

  .le-title:extend(.font-family-yahei) {
    font-size: 16px;
    font-weight: 400;
    color: #8c8c8c;
    margin: 0 24px 0 32px;
  }

  .le-number {
    font-size: 20px;
    font-family: DINPro;
    font-weight: bold;
    color: #262626;
  }
}

.le-userinfo {
  border-right: 1px solid #dcdfe6;
  padding-right: 32px;
}

.le-username:extend(.font-family-yahei) {
  width: 96px;
  height: 17px;
  font-size: 16px;
  font-weight: 400;
  color: #262626;
  margin-left: 25px;
}

.le-button {
  margin-left: 115px;
}

.le-table::v-deep {
  .le-userplatform-icon {
    line-height: 16px;
    margin-left: 16px;
    margin-right: 8px;
  }

  .le-table-row:extend(.font-family-yahei) {
    height: 72px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }

  .le-table-button {
    padding: 9px 0;
  }
}
</style>
