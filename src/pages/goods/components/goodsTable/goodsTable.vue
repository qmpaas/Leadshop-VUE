<script>
import HelpHint from '../helpHint.vue';

export default {
  name: 'goodsTable',
  components: {
    HelpHint
  },
  data() {
    return {
      sort: '1'
    };
  },
  props: {
    list: {
      type: Array
    },
    loading: {
      type: Boolean
    },
    tab_key: {
      type: String,
      default: function () {
        return 'all';
      }
    },
    status: {
      type: String
    }
  },
  computed: {
    newList: {
      get: function () {
        return this.list;
      },
      set: function (val) {
        this.$emit('update:list', val);
      }
    }
  },
  methods: {
    hintRender: function () {
      return this.$createElement(
        'HelpHint',
        {
          props: {
            content: '序号越大，排序越靠前'
          }
        },
        '排序'
      );
    },
    routerPush: function (index, row) {
      let path = '';
      let query = {};
      if (index === 0) {
        path = '/goods/create-goods';
        query = {
          id: row.id
        };
      }
      this.$router.push({
        path: path,
        query: query
      });
    },
    cancel: function (index) {
      this.newList[index].popover = false;
    },
    setSort: function (index) {
      let { id } = this.newList[index];
      this.$heshop
        .goods(
          'put',
          { id, behavior: 'batchsetting' },
          {
            sort: this.sort
          }
        )
        .then(() => {
          this.newList[index].popover = false;
          this.newList[index].sort = this.sort;
          this.$message.success('修改成功');
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    onlyNum: function (value) {
      let num = Number(value.replace(/\D/g, ''));
      if (num > 999) {
        return 999;
      } else if (num < 0) {
        return 0;
      }
      return num;
    }
  },
  render() {
    return (
      <el-table
        data={this.newList}
        row-class-name="le-goods__row"
        default-sort={{ prop: 'created_time', order: 'descending' }}
        cell-class-name="le-goods__cell">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          label="商品描述"
          width="309"
          {...{
            scopedSlots: {
              default: scope => {
                return (
                  <div class="flex ">
                    <img class="le-goods__img " src={scope.row.slideshow[0]} alt="" />
                    <div class="flex flex-direction flex-sub">
                      <span class="he-line-2 flex-sub le-goods__name">{scope.row.name}</span>
                      <span class="le-goods__description">
                        货号: {scope.row.goods_sn ? scope.row.goods_sn : '--'}
                        <br />
                        ID:{scope.row.id}
                      </span>
                    </div>
                  </div>
                );
              }
            }
          }}></el-table-column>
        <el-table-column
          sort-orders={['ascending', 'descending']}
          label="商品价格"
          prop="price"
          sortable="custom"
          {...{
            scopedSlots: {
              default: scope => {
                return '￥' + scope.row.price;
              }
            }
          }}></el-table-column>
        <el-table-column
          sort-orders={['ascending', 'descending']}
          label="库存"
          prop="stocks"
          sortable="custom"></el-table-column>
        <el-table-column
          sort-orders={['ascending', 'descending']}
          label="销量"
          prop="sales"
          sortable="custom"></el-table-column>
        <el-table-column
          label="创建时间"
          prop="created_time"
          sortable="custom"
          {...{
            scopedSlots: {
              default: scope => {
                return this.$h.timeFormat(scope.row.created_time, 'yyyy-mm-dd hh:MM:ss');
              }
            }
          }}></el-table-column>
        {this.tab_key !== 'drafts' && this.tab_key !== 'recycle' ? (
          <el-table-column
            label="商品状态"
            prop="status"
            {...{
              scopedSlots: {
                default: scope => {
                  return scope.row.stocks > 0 ? (
                    scope.row.is_sale == 1 ? (
                      <span class="le-success__tag">销售中</span>
                    ) : scope.row.is_sale == 0 ? (
                      <span class="le-info__tag">下架中</span>
                    ) : null
                  ) : (
                    <span class="le-warning__tag">售罄</span>
                  );
                }
              }
            }}></el-table-column>
        ) : null}
        <el-table-column
          render-header={this.hintRender}
          prop="sort"
          sortable="custom"
          {...{
            scopedSlots: {
              default: scope => {
                return (
                  <div>
                    {scope.row.sort}
                    <el-popover id={scope.row.id} title=" " vModel={scope.row.popover} trigger="click">
                      <p class="el-popconfirm__main">
                        <el-input
                          vModel={this.sort}
                          onInput={() => {
                            this.sort = this.onlyNum(this.sort);
                          }}></el-input>
                      </p>
                      <div class="el-popconfirm__action">
                        <el-button onClick={this.cancel.bind(this, scope.$index)} size="mini" type="text">
                          取消
                        </el-button>
                        <el-button onClick={this.setSort.bind(this, scope.$index)} size="mini" type="primary">
                          确定
                        </el-button>
                      </div>
                      <span slot="reference">
                        <he-icon type="le-icon-editor"></he-icon>
                      </span>
                    </el-popover>
                  </div>
                );
              }
            }
          }}></el-table-column>
        <el-table-column
          label="访问量"
          prop="visits"
          sortable="custom"
          {...{
            scopedSlots: {
              default: scope => {
                return (
                  <div class="flex flex-direction le-goods__visits">
                    <span>访问量：{scope.row.visits}</span>
                    <span>访客数：{scope.row.visitors}</span>
                  </div>
                );
              }
            }
          }}></el-table-column>
        <el-table-column
          label="操作"
          {...{
            scopedSlots: {
              default: scope => {
                return (
                  <div class="flex">
                    {this.status !== 'recycle' ? (
                      <template>
                        <span class="le-edit__btn" type="text" onClick={this.routerPush.bind(this, 0, scope.row)}>
                          编辑
                        </span>
                        <span class="le-edit__line"></span>
                      </template>
                    ) : null}
                    {this.tab_key !== 'drafts' ? (
                      <template>
                        <span
                          class="le-edit__btn"
                          hide_footer
                          width="791"
                          module="goods"
                          title="推广"
                          id={scope.row.id + '_promote'}>
                          推广
                        </span>
                        <span class="le-edit__line"></span>
                      </template>
                    ) : null}
                    <span class="le-edit__btn">删除</span>
                  </div>
                );
              }
            }
          }}></el-table-column>
      </el-table>
    );
  }
};
</script>

<style scoped>
@import './goodsTable.less';
</style>
