<!--
 * @Description: 分销商品
 * @Author: fjt
 * @Date: 2021-06-08 17:48:42
 * @LastEditTime: 2021-06-08 17:49:09
 * @LastEditors: fjt
-->
<script>
import GoodsTable from './components/goods-table.vue';
import GoodsParticipationFailed from './components/goods-participation-failed.vue';
import index from './index.js';
import { goodsList, groupList } from './api';

const form = {
  grade: 1,
  tab_key: 'all',
  search: '',
  // 最低价格
  price_start: null,
  // 最高价格
  price_end: null,
  // 成本价状态
  cost_status: null,
  // 分销状态
  is_promoter: null,
  time: [],
  sort: {
    created_time: 'descending'
  },
  group: [],
  pagination: {
    current: 1,
    pageCount: 1
  }
};

export default {
  components: {
    GoodsTable,
    GoodsParticipationFailed
  },
  mixins: [index],
  data() {
    return {
      form: this.$_.cloneDeep(form),
      list: [],
      catObject: {
        returnType: 'children',
        cat: [],
        result: []
      },
      showGoodsParticipationFailed: false,
      goodsParticipationFailedType: ''
    };
  },
  methods: {
    tabSwitch(tab) {
      this.$nextTick(() => {
        const component = this.$refs[tab.name];
        component.emptyCheck();
      });
      this.form.pagination.current = 1;
      this.getList();
    },
    // 筛选
    filter() {
      this.form.pagination.current = 1;
      this.getList();
    },
    async getList() {
      const form = this.$_.cloneDeep(this.form);
      form.tabKey = form.tab_key;
      delete form.tab_key;
      form.page = form.pagination.current;
      delete form.pagination;
      if (form.time) {
        form.time_start = form.time[0] / 1000;
        form.time_end = form.time[1] / 1000;
      } else {
        form.time_start = 0;
        form.time_end = 0;
      }
      form.group = form.group.map(item => {
        return item.id;
      });
      delete form.time;
      const response = await goodsList(form);
      const { pagination, data } = response;
      this.list = data;
      this.form.pagination = pagination;
    },
    // 清空
    empty() {
      this.form = this.$_.cloneDeep(form);
      this.form.pagination.current = 1;
      this.catObject.result = [];
      this.getList();
    },
    // 分类列表
    getGroup() {
      groupList().then(response => {
        this.$set(this.catObject, 'cat', response);
      });
    },
    // 选择完分类
    openGroup(event) {
      this.form.group = event.result;
      this.catObject.result = event.result;
      // this.getList();
    },
    // 删除分类
    delGroup: function (item, index) {
      event.stopPropagation();
      let path = item.path.split('-').map(Number);
      let level = path.length;
      if (level === 3) {
        let p_deleted = false; //父级是否被删除,保证每次只删除一个
        let p2_deleted = false; //父父级是否被删除,保证每次只删除一个
        let result = this.catObject.result;
        for (let i = 0; i < result.length; i++) {
          if (result[i].id === path[1]) {
            if (!p2_deleted) {
              p2_deleted = true;
              this.catObject.result.splice(i, 1);
            }
            for (let j = 0; j < result.length; j++) {
              if (result[j].id === path[2]) {
                if (!p_deleted) {
                  p_deleted = true;
                  this.catObject.result.splice(j, 1);
                }
              }
            }
          }
        }
      } else if (level === 2) {
        let p_deleted = false;
        this.catObject.result.forEach((v, k) => {
          if (v.id === path[1]) {
            if (!p_deleted) {
              p_deleted = true;
              this.catObject.result.splice(k, 1);
            }
          }
        });
      }
      this.$delete(this.form.group, index);
      this.getList();
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-form class="le-card" inline={true} label-width="112px">
          <el-form-item label="商品搜索">
            <el-input
              placeholder="输入商品名称/货号/ID搜索"
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
              clearable={true}
              v-model={self.form.search}
            />
          </el-form-item>
          <el-form-item label="商品分类">
            <div class="group flex justify-between align-center">
              <div
                class="flex-sub"
                width="810"
                title="商品分类"
                module="goods"
                action="openGroup"
                {...{
                  directives: [
                    {
                      name: 'popup',
                      modifiers: {
                        chooseCategory: true
                      },
                      value: self.catObject
                    }
                  ]
                }}>
                {(() => {
                  if (self.catObject.result.length) {
                    return (
                      <div class="flex align-center le-select__content">
                        {self.form.group.map((item, index) => {
                          return (
                            <div class="flex align-center le-select__tag">
                              <span>{item.value}</span>
                              <i onClick={self.delGroup.bind(self, item, index)} class="el-tag__close el-icon-close" />
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else {
                    return <span className="text">全部</span>;
                  }
                })()}
              </div>
              <span class="le-icon le-icon-arrow-right"></span>
            </div>
          </el-form-item>
          <el-form-item label="分销状态">
            <el-select placeholder="请选择" v-model={self.form.is_promoter}>
              <el-option label="全部" value={null} />
              <el-option label="参与" value={1} />
              <el-option label="不参与" value={0} />
            </el-select>
          </el-form-item>
          <el-form-item label="成本价状态">
            <el-select placeholder="请选择" v-model={self.form.cost_status}>
              <el-option label="全部" value={null} />
              <el-option label="已设置" value={1} />
              <el-option label="未设置" value={0} />
            </el-select>
          </el-form-item>
          <el-form-item label="商品价格" class="le-price-range">
            <el-input placeholder="最低价格" v-model={self.form.price_start}>
              <template slot="append">元</template>
            </el-input>
            <span class="le-range">至</span>
            <el-input placeholder="最高价格" v-model={self.form.price_end}>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              size="small"
              type="datetimerange"
              value-format="timestamp"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model={self.form.time}
            />
          </el-form-item>
          <div class="le-button">
            <el-button type="primary" onClick={self.filter}>
              筛选
            </el-button>
            <el-button onClick={self.empty}>清空</el-button>
          </div>
        </el-form>
        <el-tabs
          class="le-tabs"
          type="card"
          v-model={this.form.tab_key}
          before-leave={() => {}}
          on={{
            'tab-click': this.tabSwitch
          }}>
          {[
            { name: '全部', key: 'all', lazy: false },
            { name: '销售中', key: 'onsale', lazy: true },
            { name: '下架中', key: 'nosale', lazy: true },
            { name: '售罄', key: 'soldout', lazy: true }
          ].map(item => {
            return (
              <el-tab-pane key={item.key} lazy={item.lazy} label={item.name} name={item.key}>
                <goods-table
                  v-model={self.list}
                  ref={item.key}
                  pagination={self.form.pagination}
                  on-current-change={() => {
                    // 切换页面搜索
                    self.getList();
                  }}
                  on={{
                    ['update:pagination']: e => {
                      self.form.pagination = e;
                    },
                    ['update:sort']: e => {
                      self.form.sort = e;
                      self.getList();
                    },
                    ['update:showGoodsParticipationFailed']: e => {
                      self.showGoodsParticipationFailed = true;
                      self.goodsParticipationFailedType = e;
                    }
                  }}
                  sort={self.form.sort}
                />
              </el-tab-pane>
            );
          })}
        </el-tabs>
        {(() => {
          if (self.showGoodsParticipationFailed) {
            return (
              <goods-participation-failed
                v-model={self.showGoodsParticipationFailed}
                type={self.goodsParticipationFailedType}
              />
            );
          }
        })()}
      </div>
    );
  },
  mounted() {
    this.getList();
    this.getGroup();
  }
};
</script>

<style lang="less" scoped>
@import './index.less';

.le-card {
  margin-bottom: 24px;
  display: block;
}

.group {
  width: 240px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 6px;
  cursor: pointer;

  .text:extend(.font-family-yahei) {
    font-size: 13px;
    font-weight: 400;
    color: #262626;
  }

  .le-icon-arrow-right {
    height: auto;
    width: auto;
    color: #c0c4cc;
    font-size: 14px;
  }

  .le-select__content {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 210px;
  }

  .le-select__tag {
    height: 20px;
    background: #f4f4f5;
    border: 1px solid #e9e9eb;
    border-radius: 4px;
    margin-right: 5px;

    > span {
      width: 85px;
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

.le-price-range {
  .le-range:extend(.font-family-yahei) {
    width: 48px;
    display: inline-block;
    text-align: center;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }

  .el-input-group--append {
    width: 200px;
  }
}

.le-button {
  margin-left: 115px;
}
</style>
