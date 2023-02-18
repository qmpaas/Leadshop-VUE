<script>
import { promotermaterialList, promotermaterialDel } from './api';
import index from './index';

export default {
  name: 'material',
  data() {
    return {
      form: {
        type: '',
        name: '',
        created_time: [],
        page: 1
      },
      list: [],
      page: {
        count: 1
      }
    };
  },
  mixins: [index],
  mounted() {
    this.materialList();
  },
  methods: {
    // 筛选
    filter() {
      this.materialList();
    },
    // 清空筛选
    empty() {
      this.form = {
        type: '',
        name: '',
        created_time: [],
        page: 1
      };
      this.filter();
    },
    // 素材列表
    materialList() {
      const form = this.$_.cloneDeep(this.form);
      if (form.created_time.length) {
        form.begin_time = form.created_time[0] / 1000;
        form.end_time = form.created_time[1] / 1000;
      } else {
        form.begin_time = 0;
        form.end_time = 0;
      }
      delete form.created_time;
      promotermaterialList(form.page, form).then(response => {
        const { data, pagination } = response;
        this.page.count = pagination.pageCount;
        this.form.page = pagination.current;
        this.list = data;
      });
    },
    // 分页
    switchPage(event) {
      this.form.page = event;
      this.materialList();
    },
    // 删除素材
    deleteDynamic(item, index) {
      this.$confirm('是否确认删除此素材？')
        .then(() => {
          promotermaterialDel(item.id).then(() => {
            this.$delete(this.list, index);
            this.$message.success('删除成功');
          });
        })
        .catch(() => {
          //  Do nothing
        });
    },
    // 新增素材
    createDynamic() {
      this.$router.push({
        path: '/promoter/material-edit'
      });
    },
    // 编辑素材
    editDynamic(row) {
      this.$router.push({
        path: '/promoter/material-edit',
        query: {
          id: row.id
        }
      });
    }
  },
  render() {
    const types = [
      {
        label: '全部',
        value: ''
      },
      {
        label: '图片',
        value: '1'
      },
      {
        label: '视频',
        value: '2'
      }
    ];
    const self = this;
    return (
      <div class="le-main">
        <el-button type="primary" onClick={self.createDynamic}>
          添加素材
        </el-button>
        <el-form props={{ model: self.form }} class="le-card" inline={true} label-width="110px">
          <el-form-item label="素材名称搜索">
            <el-input
              v-model={self.form.name}
              value={self.form.name}
              onInput={e => {
                self.form.name = e;
              }}
              nativeOn={{
                keyup: event => {
                  if (event.key === 'Enter') {
                    self.materialList();
                  }
                }
              }}
              clearable={true}
              onClear={() => {
                self.materialList();
              }}
              placeholder="输入素材名称搜索"
            />
          </el-form-item>
          <el-form-item label="素材类型">
            <el-select placeholder="请选择" v-model={self.form.type}>
              {types.map((v, k) => {
                return <el-option key={k} label={v.label} value={v.value} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              size="small"
              v-model={self.form.created_time}
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
          <el-table row-class-name="le-table-row" props={{ data: self.list }}>
            <el-table-column label="素材名称" prop="name" />
            <el-table-column
              label="素材文案"
              min-width="260"
              prop="content"
              scopedSlots={{
                default: scope => {
                  return (
                    <el-popover placement="top-start" width="400" trigger="hover" content={scope.row.content}>
                      <div class="he-line-2" slot="reference">
                        {scope.row.content}
                      </div>
                    </el-popover>
                  );
                }
              }}
            />
            <el-table-column
              label="素材类型"
              prop="type"
              min-width="104"
              scopedSlots={{
                default: scope => {
                  if (scope.row.type === 1) {
                    return '图片';
                  } else if (scope.row.type === 2) {
                    return '视频';
                  }
                }
              }}
            />
            <el-table-column
              label="关联商品"
              width="260"
              scopedSlots={{
                default: scope => {
                  if (!self.$_.isEmpty(scope.row.goods)) {
                    return (
                      <div class="flex">
                        <el-image class="le-goods-image" lazy={true} src={scope.row.goods.slideshow[0]} />
                        <div class="flex-sub le-goods-info">
                          <div class="le-goods-name he-line-2">{scope.row.goods.name}</div>
                          <div class="le-goods-parameter">
                            {(() => {
                              if (scope.row.goods_sn) {
                                return [[`货号:${scope.row.goods_sn}`], [<br />]];
                              }
                            })()}
                            ID:{scope.row.goods.id}
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return '— —';
                  }
                }
              }}
            />
            <el-table-column label="分享次数" prop="share_count" />
            <el-table-column
              label="创建时间"
              width="200"
              scopedSlots={{
                default: scope => {
                  return self.$moment(new Date(scope.row.created_time * 1000)).format('Y-MM-DD HH:mm:ss');
                }
              }}
            />
            <el-table-column
              label="操作"
              width="160"
              scopedSlots={{
                default: scope => {
                  return (
                    <div class="le-table-operate flex align-center">
                      <el-button type="text" onClick={self.editDynamic.bind(self, scope.row)}>
                        编辑
                      </el-button>
                      <span class="le-line" />
                      <el-button type="text" onClick={self.deleteDynamic.bind(self, scope.row, scope.$index)}>
                        删除
                      </el-button>
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
      </div>
    );
  }
};
</script>

<style scoped lang="less">
@import './index.less';

.le-card {
  margin-top: 24px;
}
.le-button {
  margin-left: 125px;
}
.le-table ::v-deep {
  .le-table-row:extend(.font-family-yahei) {
    height: 88px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }
  .le-goods-image {
    width: 64px;
    height: 64px;
  }
  .le-goods-info {
    margin-left: 12px;
  }
  .le-goods-name:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
  }
  .le-goods-parameter:extend(.font-family-yahei) {
    font-size: 12px;
    font-weight: 400;
    color: #8c8c8c;
    line-height: 18px;
  }
}
</style>
