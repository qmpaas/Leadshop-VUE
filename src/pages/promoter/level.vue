<!--
 * @Description: 分销等级
 * @Author: fjt
 * @Date: 2021-06-08 17:46:15
 * @LastEditTime: 2021-06-08 17:46:39
 * @LastEditors: fjt
-->
<script>
import { promoterLevelDel, promoterLevelList, getPromoterSetting } from './api.js';

export default {
  data() {
    return {
      list: [],
      level_number: 3
    };
  },
  methods: {
    routerLevelEditor(row) {
      let query = {};
      if (row) {
        query.id = row.id;
      }
      this.$router.push({
        path: '/promoter/level-editor',
        query
      });
    },
    levelList() {
      promoterLevelList().then(response => {
        this.list = response;
      });
    },
    // 删除等级
    delItem(item, index) {
      this.$confirm('是否确认删除此分销等级？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      })
        .then(() => {
          promoterLevelDel(item.id).then(() => {
            this.$delete(this.list, index);
          });
        })
        .catch(() => {
          // Don't do
        });
    },
    routerPromoterIndex(row) {
      this.$router.push({
        path: '/promoter/index',
        query: {
          level: row.level
        }
      });
    }
  },
  async mounted() {
    this.levelList();
     const site = await getPromoterSetting();
    this.level_number = site.content.level_number;
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-button type="primary" onClick={self.routerLevelEditor}>
          添加分销商等级
        </el-button>
        <el-table data={self.list} class="le-card" row-class-name="le-table-row">
          <el-table-column label="等级权重" prop="level" />
          <el-table-column label="等级名称" prop="name" />
          <el-table-column
            label="升级方式"
            min-width="156px"
            scopedSlots={{
              default: scope => {
                const update_type = scope.row.update_type;
                const is_auto = scope.row.is_auto;
                if (is_auto === 0) {
                  return '不允许自动升级';
                }
                if (update_type === 1) {
                  return '满足任意条件';
                } else if (update_type === 2) {
                  return '满足全部条件';
                }
              }
            }}
          />
          <el-table-column
            label="分销商数"
            min-width="156px"
            scopedSlots={{
              default: scope => {
                return (
                  <span class="le-theme--color" onClick={self.routerPromoterIndex.bind(self, scope.row)}>
                    {scope.row.promoter_count}
                  </span>
                );
              }
            }}
          />
          <el-table-column
            label="一级佣金比例"
            min-width="156px"
            scopedSlots={{
              default: scope => {
                return `${Number(scope.row.first)}%`;
              }
            }}
          />
          {
            (() => {
              if (self.level_number >= 2) {
                return  <el-table-column
                  label="二级佣金比例"
                  min-width="156px"
                  scopedSlots={{
                    default: scope => {
                      return `${Number(scope.row.second)}%`;
                    }
                  }}
                />
              }
            })()
          }
          {
            (() => {
              if (self.level_number === 3) {
                return   <el-table-column
                  label="三级佣金比例"
                  min-width="156px"
                  scopedSlots={{
                    default: scope => {
                      return `${Number(scope.row.third)}%`;
                    }
                  }}
                />
              }
            })()
          }

          <el-table-column
            label="操作"
            min-width="156px"
            scopedSlots={{
              default: scope => {
                return (
                  <div class="le-table-operate flex align-center">
                    <el-button type="text" onClick={self.routerLevelEditor.bind(self, scope.row)}>
                      编辑
                    </el-button>
                    {(() => {
                      if (scope.row.promoter_count === 0) {
                        return [
                          [<span class="le-line" />],
                          [
                            <el-button type="text" onClick={self.delItem.bind(self, scope.row, scope.$index)}>
                              删除
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
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
@import './index.less';

.le-card ::v-deep {
  margin-top: 24px;

  .le-table-row:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    height: 52px;
  }
}

.le-theme--color {
  cursor: pointer;
}
</style>
