<script>
import { promoterGoodsSetting } from '../api.js';

export default {
  name: 'goods-table',
  props: {
    // 商品列表
    value: {
      type: Array
    },
    // 分页数据
    pagination: {
      type: Object
    },
    // 排序
    sort: {
      type: Object
    }
  },
  computed: {
    list: {
      get({ value }) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    page: {
      get({ pagination }) {
        return pagination;
      },
      set(value) {
        this.$emit('update:pagination', value);
      }
    },
    sequence: {
      get({ sort }) {
        return sort;
      },
      set(value) {
        this.$emit('update:sort', value);
      }
    }
  },
  data() {
    return {
      checkedList: [],
      type: '',
      // 全选当前页面
      isChooseIndeterminate: false,
      chooseCheck: false,
      // 全选所有页
      isAllIndeterminate: false,
      allCheck: false
    };
  },
  methods: {
    // 分页切换
    switchPage(number) {
      this.page.current = number;
      this.$emit('current-change');
      this.allCheck = false;
    },
    // 批量设置参与与否
    batchSetting(boolean) {
      let message = `是否批量设置商品${boolean ? '' : '不'}参与分销？`;

      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      })
        .then(() => {
          let success = `批量设置商品为${boolean ? '' : '不'}参与分销成功`;
          let type = '';
          let list = [];
          // 判断是否为全选所有页
          if (this.allCheck) {
            type = 'all';
          } else {
            type = 'choose';
            list = this.checkedList.map(item => {
              return item.id;
            });
          }
          // 接口
          promoterGoodsSetting(type, list, this.$parent.paneName, boolean ? 1 : 0)
            .then(() => {
              this.checkedList.forEach(item => {
                item.is_promoter = boolean ? 1 : 0;
              });
              this.emptyCheck();
              this.$message({
                type: 'success',
                message: success
              });
            })
            .catch(error => {
              if (error.data.message === '存在未设置成本价的商品') {
                this.$emit('update:showGoodsParticipationFailed', 'all');
              } else {
                this.$message({
                  type: 'error',
                  message: error.data.message
                });
              }
            });
        })
        .catch(() => {
          // Don't do
        });
    },
    // 单个设置参与与否
    itemSetting(item, boolean) {
      let message = `是否设置商品${boolean ? '' : '不'}参与分销？`;
      this.$confirm(message, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      })
        .then(() => {
          let success = `设置商品为${boolean ? '' : '不'}参与分销成功`;
          const is_promoter = boolean ? 1 : 0;
          promoterGoodsSetting('choose', [item.id], this.$parent.paneName, is_promoter)
            .then(() => {
              item.is_promoter = is_promoter;
              this.$message({
                type: 'success',
                message: success
              });
            })
            .catch(error => {
              if (error.data.message === '存在未设置成本价的商品') {
                this.$emit('update:showGoodsParticipationFailed', 'choose');
              } else {
                this.$message({
                  type: 'error',
                  message: error.data.message
                });
              }
            });
        })
        .catch(() => {
          // Don't do
        });
    },
    // 全选当前页面change事件
    chooseChange(value) {
      if (value) {
        this.list.forEach(row => {
          this.$refs.table.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.table.clearSelection();
        this.isAllIndeterminate = true;
        this.allCheck = false;
      }
    },
    // 选中所有页
    allChange(value) {
      this.isAllIndeterminate = false;
      if (value) {
        this.list.forEach(row => {
          this.$refs.table.toggleRowSelection(row, true);
        });
      } else {
        this.$refs.table.clearSelection();
      }
    },
    // 表格checkbox选中回调事件
    selectionChange(row) {
      if (row.length === this.list.length || row.length === 0) {
        this.isChooseIndeterminate = false;
        this.chooseCheck = row.length === this.list.length;
      } else if (0 < row.length < this.list.length) {
        this.isChooseIndeterminate = true;
        if (!this.allCheck) {
          this.isAllIndeterminate = true;
        }
      }
      if (row.length === 0) {
        this.isAllIndeterminate = false;
      }
      this.checkedList = row;
    },
    // 清空选中
    emptyCheck() {
      this.checkedList = [];
      this.isAllIndeterminate = false;
      this.allCheck = false;
      this.isChooseIndeterminate = false;
      this.chooseCheck = false;
      this.$refs.table.clearSelection();
    },
    // 表格排序
    sortChange(event) {
      const { prop, order } = event;
      let sequence = {};
      sequence[prop] = order === 'descending' ? 'DESC' : 'ASC';
      this.sequence = sequence;
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <div class="le-table--batch">
          <el-checkbox
            indeterminate={self.isChooseIndeterminate}
            v-model={self.chooseCheck}
            onChange={self.chooseChange}>
            当页全选
          </el-checkbox>
          <el-checkbox indeterminate={self.isAllIndeterminate} v-model={self.allCheck} onChange={self.allChange}>
            全选所有页
          </el-checkbox>
          <el-button
            disabled={!(!self.$_.isEmpty(self.checkedList) || self.isAllIndeterminate || self.allCheck)}
            onClick={self.batchSetting.bind(self, true)}>
            参与
          </el-button>
          <el-button
            disabled={!(!self.$_.isEmpty(self.checkedList) || self.isAllIndeterminate || self.allCheck)}
            onClick={self.batchSetting.bind(self, false)}>
            不参与
          </el-button>
        </div>
        <el-table
          data={self.list}
          on-selection-change={self.selectionChange}
          class="le-table"
          ref="table"
          on-sort-change={self.sortChange}
          header-row-class-name="le-table-header-row"
          default-sort={{ prop: 'created_time', order: 'descending' }}
          row-class-name="le-table-row">
          <el-table-column type="selection" width="55" />
          <el-table-column
            label="商品描述"
            min-width="274px"
            scopedSlots={{
              default(scope) {
                return (
                  <div class="flex">
                    <el-image class="le-goods-image" lazy={true} src={scope.row.slideshow[0]} />
                    <div class="flex-sub le-goods-info">
                      <div class="le-goods-name">{scope.row.name}</div>
                      <div class="le-goods-parameter">
                        {(() => {
                          if (scope.row.goods_sn) {
                            return [[`货号:${scope.row.goods_sn}`], [<br />]];
                          }
                        })()}
                        ID:{scope.row.id}
                      </div>
                    </div>
                  </div>
                );
              }
            }}
          />
          <el-table-column
            label="商品价格"
            prop="price"
            sortable="custom"
            scopedSlots={{
              default(scope) {
                return `￥${scope.row.price}`;
              }
            }}
          />
          <el-table-column label="库存" sortable="custom" prop="stocks" />
          <el-table-column
            label="销量"
            sortable="custom"
            render-header={() => {
              return [
                ['销量'],
                [
                  <el-popover
                    trigger="hover"
                    content="仅统计分销商品的销量，与普通销售方式的销量分开统计"
                    placement="top">
                    <span slot="reference">
                      <span class="le-icon le-icon-zhushi" />
                    </span>
                  </el-popover>
                ]
              ];
            }}
            prop="promoter_sales"
            scopedSlots={{
              default(scope) {
                return scope.row.promoter ? scope.row.promoter.sales : 0;
              }
            }}
          />
          <el-table-column
            label="创建时间"
            sortable="custom"
            prop="created_time"
            scopedSlots={{
              default(scope) {
                return self.$options.filters.timeFormat(scope.row.created_time, 'yyyy-mm-dd hh:MM:ss');
              }
            }}
          />
          <el-table-column
            label="商品状态"
            prop="status"
            width="105px"
            scopedSlots={{
              default(scope) {
                const is_sale = scope.row.is_sale;
                const stocks = scope.row.stocks;
                if (stocks === 0) {
                  return (
                    <el-tag effect="plain" size="medium" type="warning">
                      售罄
                    </el-tag>
                  );
                } else {
                  return (
                    <el-tag effect="plain" size="medium" type={is_sale === 1 ? 'success' : is_sale === 0 ? 'info' : ''}>
                      {is_sale === 1 ? '销售中' : is_sale === 0 ? '下架中' : ''}
                    </el-tag>
                  );
                }
              }
            }}
          />
          <el-table-column
            label="分销状态"
            min-width="104px"
            scopedSlots={{
              default(scope) {
                if (!scope.row.is_promoter) {
                  return (
                    <div class="no--span">
                      <span class="le-icon le-icon-fork " />
                      <span>不参与</span>
                    </div>
                  );
                } else {
                  return (
                    <div class="right--span">
                      <span class="le-icon le-icon-tick " />
                      <span>参与</span>
                    </div>
                  );
                }
              }
            }}
          />
          <el-table-column
            label="成本价状态"
            min-width="104px"
            scopedSlots={{
              default(scope) {
                if (!scope.row.max_profits) {
                  return (
                    <div class="no--span">
                      <span class="le-icon le-icon-fork " />
                      <span>未设置</span>
                    </div>
                  );
                } else {
                  return (
                    <div class="right--span">
                      <span class="le-icon le-icon-tick " />
                      <span>已设置</span>
                    </div>
                  );
                }
              }
            }}
          />
          <el-table-column
            label="操作"
            width="160px"
            scopedSlots={{
              default: scope => {
                return (
                  <div class="le-table-operate flex align-center">
                    <el-button
                      type="text"
                      onClick={() => {
                        // 跳转到商城商品
                        this.$router.push({
                          path: '/goods/create-goods',
                          query: {
                            id: scope.row.id
                          }
                        });
                      }}>
                      编辑
                    </el-button>
                    <span class="le-line" />
                    {
                      // 参与分销状态
                      (() => {
                        if (!scope.row.is_promoter) {
                          return (
                            <el-button type="text" onClick={self.itemSetting.bind(self, scope.row, true)}>
                              参与
                            </el-button>
                          );
                        } else {
                          return (
                            <el-button type="text" onClick={self.itemSetting.bind(self, scope.row, false)}>
                              不参与
                            </el-button>
                          );
                        }
                      })()
                    }
                  </div>
                );
              }
            }}
          />
        </el-table>
        <div class="flex le-pagination justify-between">
          <div class="le-table--batch">
            <el-checkbox
              indeterminate={self.isChooseIndeterminate}
              v-model={self.chooseCheck}
              onChange={self.chooseChange}>
              当页全选
            </el-checkbox>
            <el-checkbox indeterminate={self.isAllIndeterminate} v-model={self.allCheck} onChange={self.allChange}>
              全选所有页
            </el-checkbox>
            <el-button
              disabled={!(!self.$_.isEmpty(self.checkedList) || self.isAllIndeterminate || self.allCheck)}
              onClick={self.batchSetting.bind(self, true)}>
              参与
            </el-button>
            <el-button
              disabled={!(!self.$_.isEmpty(self.checkedList) || self.isAllIndeterminate || self.allCheck)}
              onClick={self.batchSetting.bind(self, false)}>
              不参与
            </el-button>
          </div>
          <el-pagination
            background={true}
            current-page={self.page.current}
            layout="prev, pager, next, jumper"
            on-current-change={self.switchPage}
            pager-count={5}
            page-count={self.page.pageCount}
          />
        </div>
      </div>
    );
  },
  watch: {
    isChooseIndeterminate: {
      handler(value) {
        if (value) {
          this.allCheck = false;
          this.isAllIndeterminate = true;
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
@import '../index.less';

.le-table--batch {
  padding-left: 10px;
  margin-bottom: 15px;

  .el-checkbox {
    margin-right: 15px;
  }
}

.le-pagination {
  .le-table--batch {
    margin-bottom: 0;
  }
}

.le-table ::v-deep {
  .le-table-header-row {
    .el-table-column--selection {
      opacity: 0;

      .el-checkbox {
        display: none;
      }
    }
  }

  .le-icon-zhushi {
    //font-size: 12px;
    color: #bbbfc8;
    margin-left: 5px;
  }

  .le-table-row:extend(.font-family-yahei) {
    height: 88px;
    width: 76px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }

  .le-goods-image {
    width: 64px;
    height: 64px;
  }

  .le-goods-name:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .le-goods-info {
    margin-left: 12px;
  }

  .le-goods-parameter:extend(.font-family-yahei) {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 18px;
  }

  .no--span:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #8c8c8c;
  }

  .right--span:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #623ceb;
  }

  .le-icon-tick,
  .le-icon-fork {
    margin-right: 4px;
  }
}
</style>
