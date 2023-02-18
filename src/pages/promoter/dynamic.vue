<!--
 * @Description: 动态列表
 * @Author: fjt
 * @Date: 2021-07-06 17:32:10
 * @LastEditTime: 2021-07-06 11:09:20
 * @LastEditors: fjt
-->
<script>
import index from './index';
import { delPromoterZone, promoterzoneList } from './api';

export default {
  name: 'dynamic',
  mixins: [index],
  data() {
    return {
      form: {
        type: '',
        name: '',
        created_time: []
      },
      page: {
        count: 1
      },
      list: []
    };
  },
  methods: {
    createDynamic() {
      this.$router.push({
        path: '/promoter/dynamic-edit'
      });
    },
    filter() {
      this.getPromoterzoneList();
    },
    empty() {
      this.form = {
        type: '',
        name: '',
        created_time: []
      };
      this.filter();
    },
    switchPage(number) {
      this.page.page = number;
      this.replaceQuery();
    },
    // 删除动态
    deleteDynamic(item, index) {
      this.$confirm('是否确认删除此动态？')
        .then(() => {
          delPromoterZone(item.id).then(() => {
            this.$delete(this.list, index);
            this.$message.success('删除成功');
          });
        })
        .catch(() => {
          //  Do nothing
        });
    },
    getPromoterzoneList() {
      const form = this.$_.cloneDeep(this.form);
      if (form.created_time?.length) {
        form.begin_time = form.created_time[0] / 1000;
        form.end_time = form.created_time[1] / 1000;
      } else {
        form.begin_time = 0;
        form.end_time = 0;
      }
      delete form.created_time;
      promoterzoneList(this.page.page, form).then(response => {
        const { data, pagination } = response;
        this.list = data;
        this.page = {
          page: pagination.current,
          count: pagination.pageCount
        };
      });
    },
    // 动态编辑跳转
    editDynamic(item) {
      this.$router.push({
        path: '/promoter/dynamic-edit',
        query: {
          id: item.id
        }
      });
    }
  },
  mounted() {
    this.getPromoterzoneList();
  },
  render() {
    const self = this;
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
    return (
      <div class="le-main">
        <el-button type="primary" onClick={self.createDynamic}>
          添加动态
        </el-button>
        <el-form class="le-card" label-width="112px" inline={true}>
          <el-form-item label="动态名称搜索">
            <el-input
              placeholder="输入动态名称搜索"
              v-model={self.form.name}
              nativeOn={{
                keyup: event => {
                  if (event.key === 'Enter') {
                    self.getPromoterzoneList();
                  }
                }
              }}
              clearable={true}
              onClear={() => {
                self.getPromoterzoneList();
              }}
            />
          </el-form-item>
          <el-form-item label="动态类型">
            <el-select placeholder="请选择" v-model={self.form.type}>
              {types.map((v, k) => {
                return <el-option key={k} label={v.label} value={v.value} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="发布时间">
            <el-date-picker
              size="small"
              v-model={self.form.created_time}
              value-format="timestamp"
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
          <el-table row-class-name="le-table-row" header-row-class-name="le-table-header" props={{ data: self.list }}>
            <el-table-column label="动态名称" prop="name" />
            <el-table-column
              label="动态文案"
              scopedSlots={{
                default: scope => {
                  return (
                    <el-popover placement="top-start" width="400" trigger="click">
                      <div class="he-content-popover">{scope.row.content}</div>
                      <div class="he-line-2" slot="reference">
                        {scope.row.content}
                      </div>
                    </el-popover>
                  );
                }
              }}
            />
            <el-table-column
              label="动态类型"
              scopedSlots={{
                default: scope => {
                  return scope.row.type === 1 ? '图片' : scope.row.type === 2 ? '视频' : '';
                }
              }}
            />
            <el-table-column label="跳转链接" prop="link.name" />
            <el-table-column
              label="创建时间"
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
              current-page={self.page.page}
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

.he-content-popover:extend(.font-family-yahei) {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  line-height: 16px;
}

.le-card {
  margin-top: 24px;

  .le-button {
    margin-left: 112px;
  }
}

.le-table ::v-deep {
  margin-top: 14px;

  .le-table-row:extend(.font-family-yahei) {
    height: 88px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }
}
</style>
