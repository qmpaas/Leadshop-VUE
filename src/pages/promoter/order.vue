<!--
 * @Description: 分销订单
 * @Author: fjt
 * @Date: 2021-06-08 17:50:13
 * @LastEditTime: 2021-06-08 17:50:45
 * @LastEditors: fjt
-->
<script>
import index from './index.js';
import { promoterOrderList } from './api.js';

const searchForm = {
  search_key: 'order_sn',
  search: '',
  source: '',
  status: null,
  orderTime: [],
  page: 1
};
export default {
  mixins: [index],
  data() {
    return {
      form: this.$_.cloneDeep(searchForm),
      list: [],
      pagination: {
        pageCount: 1
      }
    };
  },
  methods: {
    filter() {
      this.replaceQuery();
      this.promoterOrderList();
    },
    empty() {
      this.emptyStatus();
      this.form = this.$_.cloneDeep(searchForm);
      this.promoterOrderList();
    },
    switchPage(page) {
      this.form.page = page;
      this.replaceQuery();
      this.promoterOrderList();
    },
    promoterOrderList() {
      const form = JSON.parse(JSON.stringify(this.form));
      if (form.orderTime?.length > 0) {
        form.time_start = form.orderTime[0] + '';
        form.time_start = form.time_start.slice(0, form.time_start.length - 3);
        form.time_end = form.orderTime[1] + '';
        form.time_end = form.time_end.slice(0, form.time_end.length - 3);
      } else {
        form.time_start = null;
        form.time_end = null;
      }
      delete form.orderTime;
      promoterOrderList(this.form.page, {
        keyword: form
      }).then(response => {
        const { data, pagination } = response;
        this.list = data;
        this.pagination = pagination;
      });
    }
  },
  mounted() {
    this.form = this.getQuery();
    this.promoterOrderList();
  },
  render() {
    const self = this;
    const search_key = [
      {
        label: '订单号',
        value: 'order_sn'
      },
      {
        label: '商品名称',
        value: 'goods_name'
      },
      {
        label: '买家昵称',
        value: 'buyer_nickname'
      },
      {
        label: '买家手机号',
        value: 'buyer_mobile'
      },
      {
        label: '收货人姓名',
        value: 'consignee_name'
      },
      {
        label: '收货人手机号',
        value: 'consignee_mobile'
      },
      {
        label: '商品货号',
        value: 'goods_sn'
      }
    ];
    const orderSource = [
      {
        label: '全部',
        value: ''
      },
      {
        label: '微信小程序',
        value: 'weapp'
      },
      {
        label: '公众号',
        value: 'wechat'
      }
    ];
    const commissionStatus = [
      {
        label: '全部',
        value: null
      },
      {
        label: '待结算',
        value: '0'
      },
      {
        label: '已结算',
        value: '1'
      }
    ];
    return (
      <div class="le-main">
        <el-form class="le-card" label-width="112px" inline={true}>
          <el-form-item label="订单搜索" class="le-order--search">
            <el-input
              v-model={self.form.search}
              placeholder="请输入内容"
              nativeOn={{
                keyup: event => {
                  if (event.key === 'Enter') {
                    self.promoterOrderList();
                  }
                }
              }}
              clearable={true}
              onClear={() => {
                self.promoterOrderList();
              }}>
              <el-select v-model={self.form.search_key} slot="prepend" placeholder="请选择">
                {search_key.map((item, index) => {
                  return <el-option key={index} label={item.label} value={item.value} />;
                })}
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="订单来源">
            <el-select v-model={self.form.source} placeholder="请选择">
              {orderSource.map((item, index) => {
                return <el-option key={index} label={item.label} value={item.value} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="佣金状态">
            <el-select v-model={self.form.status} placeholder="请选择">
              {commissionStatus.map((item, index) => {
                return <el-option key={index} label={item.label} value={item.value} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间">
            <el-date-picker
              size="small"
              v-model={self.form.orderTime}
              type="datetimerange"
              value-format="timestamp"
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
        <div class="le-card">
          <div class="le-table--wrapper">
            <table class="le-table">
              <thead class="le-table--head">
                <tr>
                  <td>商品描述</td>
                  <td>单价/数量</td>
                  <td>买家/收货人</td>
                  <td>商品实付金额</td>
                  <td>商品利润</td>
                  <td>佣金状态</td>
                  <td>佣金金额</td>
                </tr>
              </thead>
              <tbody class="le-table--body">
                {(() => {
                  if (self.list.length > 0) {
                    return self.list.map(item => {
                      return [
                        [
                          <tr class="le-body--empty">
                            <td colSpan="7" />
                          </tr>
                        ],
                        [
                          <tr class="le-order--head">
                            <td colSpan="7">
                              <span class="le-order--time">
                                {this.$moment(new Date(item.created_time * 1000)).format('Y-MM-DD HH:mm:ss')}
                              </span>
                              <span class="le-order--text">订单号：</span>
                              <span class="le-order--number">{item.order_sn}</span>
                              {(() => {
                                if (item.order.source === 'weapp') {
                                  let str = '小程序';
                                  let icon = 'le-icon-xiaochengxu';
                                  return [
                                    [<span class={'le-icon le-platform--icon ' + icon} />],
                                    [<span class="le-order--text">{str}</span>]
                                  ];
                                } else if (item.order.source === 'wechat') {
                                  let str = '公众号';
                                  let icon = 'le-icon-wehcat';
                                  return [
                                    [<span class={'le-icon le-platform--icon ' + icon} />],
                                    [<span class="le-order--text">{str}</span>]
                                  ];
                                }
                              })()}
                            </td>
                          </tr>
                        ],
                        [
                          <tr class="le-order--info">
                            <td class="flex">
                              <el-image class="le-order--image" src={item.orderGoods.goods_image} />
                              <div class="le-order--content flex-sub">
                                <div class="flex ">
                                  <div class="le-goods--name">{item.orderGoods.goods_name}</div>
                                </div>
                                <div class="le-goods--attr">{item.orderGoods.goods_param}</div>
                              </div>
                            </td>
                            <td>
                              <div class="le-goods--number">
                                ¥{item.orderGoods.goods_price}
                                <br />X{item.orderGoods.goods_number}
                              </div>
                            </td>
                            <td class="le-contact-person">
                              <div class="le-buyer">{item.user.nickname}</div>
                              <div class="le-receiver">
                                {item.buyer.name}
                                <br />
                                {item.buyer.mobile}
                              </div>
                            </td>
                            <td class="le-amount-paid">¥{item.total_amount}</td>
                            <td class="le-amount-paid">¥{item.profits_amount}</td>
                            <td class="le-order--status">
                              {(() => {
                                let type = '';
                                let str = '';
                                if (item.status === 1) {
                                  type = 'success';
                                  str = '已结算';
                                } else if (item.status === 0) {
                                  type = 'warning';
                                  str = '待结算';
                                } else if (item.status === -1) {
                                  str = '已失效';
                                }
                                return (
                                  <el-tag effect="plain" size="medium" type={type}>
                                    {str}
                                  </el-tag>
                                );
                              })()}
                            </td>
                            <td class="le-level">
                              <div>
                                一级佣金：￥{item.commission.first.commission}&nbsp;&nbsp;&nbsp;&nbsp;分销员：
                                {item.commission.first.user}
                              </div>
                              {(() => {
                                if (item.commission.second) {
                                  return (
                                    <div>
                                      二级佣金：￥{item.commission.second.commission}&nbsp;&nbsp;&nbsp;&nbsp;分销员：
                                      {item.commission.second.user}
                                    </div>
                                  );
                                }
                              })()}
                              {(() => {
                                if (item.commission.third) {
                                  return (
                                    <div>
                                      三级佣金：￥{item.commission.third.commission}&nbsp;&nbsp;&nbsp;&nbsp;分销员：
                                      {item.commission.third.user}
                                    </div>
                                  );
                                }
                              })()}
                            </td>
                          </tr>
                        ]
                      ];
                    });
                  } else {
                    return (
                      <tr class="le-empty">
                        <td colSpan="7">暂无数据</td>
                      </tr>
                    );
                  }
                })()}
              </tbody>
            </table>
          </div>
          <div class="flex le-pagination justify-end">
            <el-pagination
              background={true}
              current-page={self.form.page}
              layout="prev, pager, next, jumper"
              on-current-change={self.switchPage}
              page-count={self.pagination.pageCount}
            />
          </div>
        </div>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
@import './index.less';

.le-card:first-child {
  margin-bottom: 24px;

  .le-order--search ::v-deep {
    .el-input.el-input-group {
      width: 400px;

      .el-input-group__prepend {
        background: #ffffff;

        .el-input,
        .el-select {
          width: 150px;
        }
      }
    }
  }

  .le-button {
    margin-left: 110px;
  }
}

.le-table--wrapper {
  overflow-x: auto;
  width: 100%;
}

.le-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-bottom: 1px solid #ebeef5;

  .le-table--head:extend(.font-family-yahei) {
    height: 40px;
    background: #f5f7fa;
    font-size: 14px;
    font-weight: 400;
    color: #595959;

    td {
      text-align: center;
    }
  }

  .le-body--empty {
    height: 17px;
  }

  .le-table--body {
    .le-order--head:extend(.font-family-yahei) {
      background: #f5f7fa;
      height: 48px;
      font-size: 14px;

      .le-order--time {
        margin: 0 30px 0 20px;
        color: #262626;
      }

      .le-order--number {
        color: #262626;
        margin-right: 30px;
      }

      .le-order--text {
        color: #8c8c8c;
      }

      .le-platform--icon {
        margin-right: 8px;
      }
    }

    .le-order--head td {
      border-top: 1px solid #dcdfe6;
      border-top-left-radius: 4px;
    }

    .le-order--head td:first-child {
      border-left: 1px solid #dcdfe6;
    }

    .le-order--head td:last-child {
      border-right: 1px solid #dcdfe6;
      border-top-right-radius: 4px;
    }

    .le-order--info td {
      height: 120px;
      border-bottom: 1px solid #dcdfe6;
      border-right: 1px solid #dcdfe6;
    }

    .le-order--info td:first-child {
      border-left: 1px solid #dcdfe6;
      border-right: none;
      border-bottom-left-radius: 4px;
      padding: 20px;
    }

    .le-order--info td:nth-child(2) {
      border-left: none !important;
    }

    .le-order--info td:last-child {
      border-bottom-right-radius: 4px;
    }

    .le-order--image {
      width: 80px;
      height: 80px;
    }

    .le-order--content {
      margin-left: 12px;

      .le-goods--name:extend(.font-family-yahei) {
        font-size: 14px;
        font-weight: 400;
        color: #262626;
        min-width: 240px;
      }

      .le-goods--attr:extend(.font-family-yahei) {
        font-size: 12px;
        font-weight: 400;
        color: #8c8c8c;
      }
    }

    .le-goods--number:extend(.font-family-yahei) {
      font-size: 14px;
      font-weight: 400;
      color: #262626;
      line-height: 22px;
      text-align: center;
      padding: 0 40px;
    }

    .le-empty {
      text-align: center;
      line-height: 60px;
      color: #909399;
      font-size: 14px;
    }
  }

  .le-receiver:extend(.font-family-yahei) {
    width: 144px;
    height: 60px;
    background: #f5f7fa;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
    padding: 10px 25px;
    margin: 6px auto 0 auto;
  }

  .le-buyer:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
    margin-bottom: 6px;
  }

  .le-contact-person {
    text-align: center;
    padding: 0 20px;
  }

  .le-amount-paid:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    text-align: center;
    padding: 0 20px;
    min-width: 100px;
  }

  .le-level:extend(.font-family-yahei) {
    padding: 0 20px 0 28px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    line-height: 20px;
    min-width: 325px;
  }

  .le-order--status {
    padding: 0 20px;
    text-align: center;
  }
}
</style>
