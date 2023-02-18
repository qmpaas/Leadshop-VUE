<script>
import { deleteWaybill, waybillList } from './api.js';

export default {
  name: 'waybill',
  data() {
    return {
      list: [],
      pagination: {
        current: 1,
        pageCount: 1
      }
    };
  },
  methods: {
    getWaybillList() {
      waybillList(this.pagination.current).then(response => {
        this.list = response.data;
        this.pagination = response.pagination;
      });
    },
    deleteBill(item, index) {
      this.$confirm('发货信息删除请谨慎操作，确定删除？', '提示')
        .then(() => {
          deleteWaybill(item.id).then(() => {
            this.$delete(this.list, index);
            if (this.list.length === 0) {
              if (this.pagination.current > 1) {
                this.pagination.current -= 1;
                this.getWaybillList();
              }
            }
          });
        })
        .catch(() => {
          // Don't do
        });
    },
    editBill(item) {
      this.$router.push({
        path: '/order/waybill-edit',
        query: {
          id: item.id
        }
      });
    },
    routerWaybillEdit() {
      this.$router.push({
        path: '/order/waybill-edit'
      });
    },
    switchPage(number) {
      this.pagination.current = number;
      this.getWaybillList();
    },
    openTutorials() {
      this.$confirm('电子面单使用教程', {
        message: '<div>123</div>'
      });
    }
  },
  mounted() {
    this.getWaybillList();
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <div class="le-prompt">
          温馨提示：如需打印电子面单，请安装云打印。
          <el-button
            onClick={() => {
              window.open('https://kbydy.cn/CloudPrint/intro');
            }}
            type="text">
            安装教程
          </el-button>
          <br />
          温馨提示：必看
          <el-button
            type="text"
            {...{
              directives: [
                {
                  name: 'popup',
                  modifiers: {
                    waybillTutorials: true
                  }
                }
              ]
            }}
            width="680"
            hide_cancel={true}
            title="电子面单使用教程"
            module="order">
            《电子面单使用教程》
          </el-button>
          <br />
          当前支持电子面单的快递公司：申通快递、中通快递、圆通快递、韵达快递、百世快递、德邦、EMS、邮政快递包裹、优速快递、速尔快递、丰网速运、众邮快递、品骏、京广快递、极兔速递、顺丰速运
        </div>
        <el-button type="primary" onClick={self.routerWaybillEdit}>
          新增发货信息
        </el-button>
        <div class="le-card le-table">
          <el-table data={self.list} cell-class-name="le-table-row" header-row-class-name="le-table-header">
            <el-table-column label="快递公司" prop="company_name" />
            <el-table-column
              label="发货人信息"
              scopedSlots={{
                default: scope => {
                  const { name, mobile, province, city, district, address } = scope.row;
                  return [
                    [<div>姓名： {name}</div>],
                    [<div>联系方式：{mobile}</div>],
                    [
                      <div>
                        地址：{province}
                        {city}
                        {district}
                        {address}
                      </div>
                    ]
                  ];
                }
              }}
            />
            <el-table-column
              label="操作"
              scopedSlots={{
                default: scope => {
                  return (
                    <div class="le-table--operating flex align-center">
                      <el-button type="text" onClick={self.editBill.bind(self, scope.row)}>
                        编辑
                      </el-button>
                      <span class="le-operating--line" />
                      <el-button type="text" onClick={self.deleteBill.bind(self, scope.row, scope.$index)}>
                        删除
                      </el-button>
                    </div>
                  );
                }
              }}
            />
          </el-table>
          <div class="le-pagination flex justify-end">
            <el-pagination
              background={true}
              current-page={self.pagination.current}
              page-count={self.pagination.pageCount}
              on-current-change={self.switchPage}
              layout="prev, pager, next, jumper"
            />
          </div>
        </div>
      </div>
    );
  }
};
</script>

<style scoped lang="less">
.le-prompt {
  padding: 15px 24px 15px 24px;
  background: #fff5d1;
  border-radius: 8px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #595959;
  line-height: 18px;
  margin-bottom: 24px;
  .el-button {
    padding: 0;
  }
}
.le-card {
  margin-top: 24px;
}
.le-table::v-deep {
  .le-table-row {
    height: 92px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 20px;
    .cell {
      padding-left: 10px;
    }
  }
}
.le-table--operating {
  .el-button--text:first-child {
    padding-left: 0;
  }
}
</style>
