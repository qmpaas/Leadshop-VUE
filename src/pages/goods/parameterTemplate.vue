<script>
export default {
  name: 'parameterTemplate',
  data() {
    return {
      list: [],
      page: {
        current: 1,
        count: 1,
        size: 10,
        total: 1
      },
      search: '',
      sort: 'DESC',
      checkList: [],
      checkAll: false,
      isIndeterminate: false
    };
  },
  methods: {
    // 创建跳转
    createParameterTemplate() {
      this.$router.push({
        path: '/goods/parameterTemplateEdit'
      });
    },
    // 编辑跳转
    editParameterTemplate(item) {
      this.$router.push({
        path: '/goods/parameterTemplateEdit?id=' + item.id
      });
    },
    selectionChange(list) {
      this.checkList = list;
      this.isIndeterminate = this.checkList.length > 0 && this.checkList.length < this.list.length;
      if (this.checkList.length === this.list.length) {
        this.checkAll = true;
      }
      if (this.checkList.length === 0) {
        this.checkAll = false;
      }
    },
    handleCheckAllChange() {
      this.isIndeterminate = false;
      this.checkList = this.list;
      this.list.forEach(item => {
        this.$refs.templateTable.toggleRowSelection(item, this.checkAll);
      });
    },
    // 批量删除
    batchDelete() {
      this.$confirm('是否确定批量删除参数模板？').then(() => {
        let ids = this.checkList.map(item => {
          return item.id;
        });
        this.onDel(ids, '批量删除参数模板成功');
      });
    },
    // 删除单个
    oneDelete(item) {
      this.$confirm('是否确定删除此参数模板？').then(() => {
        this.onDel([item.id], '删除成功');
      });
    },
    onDel(ids, msg) {
      this.$heshop
        .goodsargs('delete', ids)
        .then(res => {
          let page = this.page;
          if (page.count == page.current && page.current > 1) {
            if (page.total - page.size * (page.current - 1) == ids.length) {
              this.page.current -= 1;
            }
          }
          this.getList();
          this.$message.success(msg);
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    //   清空搜索
    clearSearch() {
      this.search = '';
      this.getList();
    },
    sortList(e) {
      this.sort = e.order == 'descending' ? 'DESC' : 'ASC';
      this.getList();
    },
    switchPage(e) {
      this.page.current = e;
      this.getList();
    },
    getList() {
      this.$heshop
        .goodsargs('get', {
          search: this.search,
          sort: this.sort
        })
        .page(this.page.current, this.page.size)
        .then(res => {
          let { data, headers } = res;
          this.list = data;
          this.page = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count'],
            size: +headers['x-pagination-per-page'],
            total: +headers['x-pagination-total-count']
          };
        })
        .catch(() => {
          this.$message.error('获取失败');
        });
    }
  },
  mounted() {
    this.getList();
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-button type="primary" onClick={self.createParameterTemplate}>
          新增参数模板
        </el-button>
        <el-form
          class="le-card le-search"
          label-width="120px"
          nativeOn={{
            submit(event) {
              // 阻止表单提交
              event.preventDefault();
              self.getList();
            }
          }}>
          <el-form-item label="参数模板搜索">
            <el-input placeholder="输入参数模板搜索" v-model={self.search} />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" onClick={self.getList}>
              筛选
            </el-button>
            <el-button onClick={self.clearSearch}>清空</el-button>
          </el-form-item>
        </el-form>
        <div class="le-card le-table">
          <div class="le-table--setting">
            <el-checkbox
              v-model={self.checkAll}
              indeterminate={self.isIndeterminate}
              on-change={self.handleCheckAllChange}>
              当页全选
            </el-checkbox>
            <el-button onClick={self.batchDelete} disabled={!self.checkList.length}>
              删除
            </el-button>
          </div>
          <el-table
            {...{
              on: {
                'sort-change': self.sortList,
                'selection-change': self.selectionChange
              }
            }}
            default-sort={{ prop: 'created_time', order: 'descending' }}
            data={self.list}
            row-class-name="le-table-row"
            header-row-class-name="le-table-header"
            ref="templateTable">
            <el-table-column type="selection" width="55" />
            <el-table-column label="参数模板名称" prop="title" />
            <el-table-column
              label="创建时间"
              sortable="custom"
              prop="created_time"
              scopedSlots={{
                default: scope => {
                  return self.$moment(new Date(scope.row.created_time * 1000)).format('Y-MM-DD HH:mm:ss');
                }
              }}
            />
            <el-table-column
              label="操作"
              scopedSlots={{
                default: scope => {
                  return (
                    <div class="le-table--operating flex align-center">
                      <el-button type="text" onClick={self.editParameterTemplate.bind(self, scope.row, scope.$index)}>
                        编辑
                      </el-button>
                      <span class="le-operating--line" />
                      <el-button type="text" onClick={self.oneDelete.bind(self, scope.row)}>
                        删除
                      </el-button>
                    </div>
                  );
                }
              }}
            />
          </el-table>
          <div class="le-table--setting flex align-center justify-between">
            <div>
              <el-checkbox v-model={self.checkAll} indeterminate={self.isIndeterminate}>
                当页全选
              </el-checkbox>
              <el-button onClick={self.batchDelete} disabled={!self.checkList.length}>
                删除
              </el-button>
            </div>
            <el-pagination
              background
              current-page={self.page.current}
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

<style scoped lang="scss">
.le-card {
  margin-top: 24px;
}

.le-search {
  .el-form-item:last-child {
    margin-bottom: 0;
  }
}

.le-table /deep/ {
  .le-table--setting {
    padding-left: 14px;

    &:first-child {
      margin-bottom: 16px;
    }

    &:last-child {
      margin-top: 16px;
    }

    .el-button {
      margin-left: 15px;
    }
  }

  .le-table-header {
    .el-table-column--selection {
      opacity: 0;
    }
  }

  .le-table-row {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    height: 52px;

    .cell {
      padding-left: 10px;
    }
  }
}
</style>
