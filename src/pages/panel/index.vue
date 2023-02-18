<template>
  <el-scrollbar class="le-matter le-panel">
    <div class="le-index--content">
      <div class="flex le-content__top">
        <div class="le-top__store le-panel__card flex flex-direction align-center">
          <div class="le-store__sign">
            <el-image style="width: 80px; height: 80px; border-radius: 50%" :src="getStore.logo" alt="logo">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i></div
            ></el-image>
            <div class="le-store__status">
              {{ getBasic.run_status ? '营业中' : '打烊中' }}
            </div>
          </div>
          <span class="le-store__name"> {{ getStore.name }}</span>
          <div class="flex align-center">
            <span class="le-router--text" @click="router(3)">设置</span>
            <span class="le-pivot"></span>
            <span
              class="le-router--text"
              module="goods"
              title="推广"
              :hide_footer="true"
              type="text"
              v-popup.promote="{ data: '', promoteType: 'index' }"
              width="791"
              >推广</span
            >
          </div>
        </div>
        <div class="le-top__router flex-sub">
          <div class="le-router__top flex">
            <div class="le-panel__card flex le-router__top-left">
              <div class="flex-sub flex flex-direction align-center justify-center">
                <span class="le-number" @click="router(0)">
                  <countTo :startVal="0" :duration="1000" :endVal="Number(store_count.unpaid)"></countTo>
                </span>
                <span class="le-prompt">待付款订单</span>
              </div>
              <div class="flex-sub flex flex-direction align-center justify-center">
                <span class="le-number" @click="router(1)">
                  <countTo :startVal="0" :duration="1000" :endVal="Number(store_count.unsent)"></countTo>
                </span>
                <span class="le-prompt">待发货订单</span>
              </div>
              <div class="flex-sub flex flex-direction align-center justify-center">
                <span class="le-number" @click="router(2)">
                  <countTo :startVal="0" :duration="1000" :endVal="Number(store_count.order_after)"></countTo>
                </span>
                <span class="le-prompt">售后订单</span>
              </div>
            </div>
            <div class="le-panel__card le-router__top-right flex">
              <div class="flex-sub flex flex-direction align-center justify-center">
                <span class="le-number" @click="router(6)">
                  <countTo :startVal="0" :duration="1000" :endVal="Number(store_count.user_number)"></countTo>
                </span>
                <span class="le-prompt">总用户数</span>
              </div>
              <div class="flex-sub flex flex-direction align-center justify-center">
                <span class="le-number">
                  <countTo
                    prefix="￥"
                    :startVal="0"
                    :duration="1000"
                    :endVal="Number(store_count.income_amount)"
                    :decimals="2"
                  ></countTo>
                </span>
                <div class="le-prompt flex align-center">
                  <span>订单总收入</span>
                  <el-popover content="过售后订单收入" placement="top" trigger="hover">
                    <span slot="reference" class="le-icon le-icon-zhushi"></span>
                  </el-popover>
                </div>
              </div>
            </div>
          </div>
          <div class="le-router__bottom le-panel__card">
            <div class="le-panel__card--header flex align-center">
              <span class="le-header__sign"></span>
              <span class="le-header__text">快捷入口</span>
            </div>
            <div class="le-router__bottom--body flex">
              <div class="le-entrance flex-sub flex">
                <div class="le-entrance__router flex align-center" @click="router(4)">
                  <img src="./image/release-goods.png" alt="" class="le-entrance__img" />
                  <span class="le-entrance__text">发布商品</span>
                </div>
              </div>
              <div class="le-entrance flex-sub flex">
                <div class="le-entrance__router flex align-center" @click="router(5)">
                  <img src="./image/store-construction.png" alt="" class="le-entrance__img" />
                  <span class="le-entrance__text">店铺装修</span>
                </div>
              </div>
              <div class="le-entrance flex-sub flex">
                <div class="le-entrance__router flex align-center" @click="router(6)">
                  <img src="./image/user-management.png" alt="" class="le-entrance__img" />
                  <span class="le-entrance__text">用户管理</span>
                </div>
              </div>
              <div class="le-entrance flex-sub flex">
                <div class="le-entrance__router flex align-center" @click="router(7)">
                  <img src="./image/order-management.png" alt="" class="le-entrance__img" />
                  <span class="le-entrance__text">订单管理</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="le-content__body le-panel__card">
        <div class="le-panel__card--header flex align-center">
          <span class="le-header__sign"></span>
          <span class="le-header__text">经营数据</span>
        </div>
        <div class="le-content__boyd-body flex">
          <div class="le-echarts flex-sub flex flex-direction align-center">
            <span class="le-number">
              <countTo :startVal="0" :duration="1000" :endVal="Number(today_count.today_visit)"></countTo>
            </span>
            <span class="le-prompt">访客数</span>
            <div class="le-echarts__canvas" id="visitors"></div>
          </div>
          <div class="le-echarts flex-sub flex flex-direction align-center">
            <span class="le-number">
              <countTo
                prefix="￥"
                :startVal="0"
                :duration="1000"
                :endVal="Number(today_count.today_pay_amount)"
                :decimals="2"
              ></countTo>
            </span>
            <span class="le-prompt">支付金额</span>
            <div class="le-echarts__canvas" id="amount"></div>
          </div>
          <div class="le-echarts flex-sub flex flex-direction align-center">
            <span class="le-number">
              <countTo :startVal="0" :duration="1000" :endVal="Number(today_count.today_num_order)"></countTo>
            </span>
            <span class="le-prompt">支付订单数</span>
            <div class="le-echarts__canvas" id="orders"></div>
          </div>
          <div class="le-echarts flex-sub flex flex-direction align-center">
            <span class="le-number">
              <countTo :startVal="0" :duration="1000" :endVal="Number(today_count.today_num_buyer)"></countTo>
            </span>
            <span class="le-prompt">支付买家数</span>
            <div class="le-echarts__canvas" id="buyers"></div>
          </div>
        </div>
      </div>
      <div class="le-content__footer flex">
        <div class="le-table__content le-panel__card flex-sub">
          <div class="le-panel__card--header flex align-center">
            <span class="le-header__sign"></span>
            <span class="le-header__text">商品销量排行</span>
            <button class="le-button" @click="exportData('sale')">导出</button>
          </div>
          <el-table
            class="le-table"
            :data="sale"
            :height="600"
            empty-text="暂无排行"
            row-class-name="le-table__row"
            cell-class-name="le-table__cell"
            header-row-class-name="le-table__header"
            @sort-change="sortGoods"
            :default-sort="{ prop: 'sales_amount', order: 'descending' }"
          >
            <el-table-column label="排名" width="55">
              <template slot-scope="scope">
                <div class="flex justify-start align-center">
                  <span v-if="(sale_page.current - 1) * sale_page.size + scope.$index + 1 > 3">
                    {{ ((sale_page.current - 1) * sale_page.size + scope.$index + 1) | getIndex }}
                  </span>
                  <img
                    v-else-if="(sale_page.current - 1) * sale_page.size + scope.$index + 1 === 1"
                    src="./image/he-rank-1.png"
                    alt=""
                  />
                  <img
                    v-else-if="(sale_page.current - 1) * sale_page.size + scope.$index + 1 === 2"
                    src="./image/he-rank-2.png"
                    alt=""
                  />
                  <img
                    v-else-if="(sale_page.current - 1) * sale_page.size + scope.$index + 1 === 3"
                    src="./image/he-rank-3.png"
                    alt=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品" class-name="le-line-name">
              <template slot-scope="scope">
                {{ scope.row.name }}
              </template>
            </el-table-column>
            <el-table-column label="销售额" :width="200" prop="sales_amount" sortable="custom">
              <template slot-scope="scope"> ￥{{ scope.row.sales_amount }} </template>
            </el-table-column>
            <el-table-column label="销量" :width="200" prop="sales" sortable="custom">
              <template slot-scope="scope">
                {{ scope.row.sales }}
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end le-table__page">
            <el-pagination
              background
              :current-page="sale_page.current"
              :page-count="sale_page.count"
              @current-change="changeCurrent($event, 'sale')"
              layout="prev, pager, next, jumper"
            >
            </el-pagination>
          </div>
        </div>
        <div class="le-table__content le-panel__card flex-sub">
          <div class="le-panel__card--header flex align-center">
            <span class="le-header__sign"></span>
            <span class="le-header__text">用户购买力排行</span>
            <button class="le-button" @click="exportData('buyer')">导出</button>
          </div>
          <el-table
            class="le-table"
            :data="buyer"
            :height="600"
            empty-text="暂无排行"
            row-class-name="le-table__row"
            cell-class-name="le-table__cell"
            header-row-class-name="le-table__header"
            @sort-change="sortBuyer"
            :default-sort="{ prop: 'buy_amount', order: 'descending' }"
          >
            <el-table-column label="排名" width="55">
              <template slot-scope="scope">
                <div class="flex justify-start align-center">
                  <span v-if="(buyer_page.current - 1) * buyer_page.size + scope.$index + 1 > 3">
                    {{ ((buyer_page.current - 1) * buyer_page.size + scope.$index + 1) | getIndex }}
                  </span>
                  <img
                    v-else-if="(buyer_page.current - 1) * buyer_page.size + scope.$index + 1 === 1"
                    src="./image/he-rank-1.png"
                    alt=""
                  />
                  <img
                    v-else-if="(buyer_page.current - 1) * buyer_page.size + scope.$index + 1 === 2"
                    src="./image/he-rank-2.png"
                    alt=""
                  />
                  <img
                    v-else-if="(buyer_page.current - 1) * buyer_page.size + scope.$index + 1 === 3"
                    src="./image/he-rank-3.png"
                    alt=""
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column label="用户">
              <template slot-scope="scope">
                <div class="flex align-center">
                  <img class="le-avatar" :src="scope.row.avatar" alt="" />
                  <el-popover
                    placement="top"
                    max-width="400"
                    trigger="hover"
                    :content="scope.row.oauth && scope.row.oauth.type === 'weapp' ? '小程序' : '公众号'"
                  >
                    <he-icon
                      class="le-icon"
                      slot="reference"
                      size="18px"
                      v-if="scope.row.oauth && scope.row.oauth.type === 'weapp'"
                      type="le-icon-xiaochengxu"
                    ></he-icon>
                    <he-icon
                      class="le-icon"
                      slot="reference"
                      size="18px"
                      v-if="scope.row.oauth && scope.row.oauth.type === 'wechat'"
                      type="le-icon-wehcat"
                    ></he-icon>
                  </el-popover>
                  <span>{{ scope.row.nickname }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="支付金额" :width="200" prop="buy_amount" sortable="custom">
              <template slot-scope="scope"> ￥{{ scope.row.statistical.buy_amount }} </template>
            </el-table-column>
            <el-table-column label="支付件数" :width="200" prop="buy_number" sortable="custom">
              <template slot-scope="scope">
                {{ scope.row.statistical.buy_number }}
              </template>
            </el-table-column>
          </el-table>
          <div class="flex justify-end le-table__page">
            <el-pagination
              background
              :current-page="buyer_page.current"
              :page-count="buyer_page.count"
              @current-change="changeCurrent($event, 'buyer')"
              layout="prev, pager, next, jumper"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div class="le-panel__footer">
        <template v-if="(!auth || $_.isEmpty(copyright_information)) && isAuth">
          <div class="le-link">
            <span> <a href="https://www.leadshop.vip/" target="_blank">官网</a> </span>丨
            <span> <a href="https://www.leadshop.vip/forum" target="_blank">论坛</a> </span>丨
            <span>
              <a href="https://help.leadshop.vip/" target="_blank">文档</a>
            </span>
          </div>
          <div class="le-copy" v-html="copyright"></div>
        </template>
        <template v-else-if="auth && copyright_information && isAuth">
          <div class="flex flex-direction align-center">
            <img
              v-if="copyright_information.admin_copyright_icon"
              :src="copyright_information.admin_copyright_icon"
              width="240"
              height="48"
              alt=""
            />
            <a class="le-copy" :href="copyright_information.admin_copyright_link">{{
              copyright_information.admin_copyright_content
            }}</a>
          </div>
        </template>
      </div>
    </div>
  </el-scrollbar>
</template>
<script type="text/javascript">
import * as echarts from 'echarts';
import countTo from 'vue-count-to';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers('setting');

export default {
  components: { countTo },
  data() {
    return {
      // 商品销量排行榜
      sale: [],
      // 用户购买力排行榜
      buyer: [],
      sale_keyword: {
        sort: {
          sales_amount: 'DESC'
        }
      },
      buyer_keyword: {
        sort: {
          buy_amount: 'DESC'
        }
      },
      store_count: {
        unpaid: 0,
        unsent: 0,
        order_after: 0,
        user_number: 0,
        income_amount: 0
      },
      today_count: {
        today_visit: 0,
        today_pay_amount: 0,
        today_num_order: 0,
        today_num_buyer: 0
      },
      sale_page: {
        size: 10,
        current: 1
      },
      buyer_page: {
        size: 10,
        current: 1
      },
      visitors: null,
      amount: null,
      orders: null,
      buyers: null
    };
  },
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      getBasic: 'getBasic',
      auth: 'getAuth',
      copyright_information: 'getCopyright'
    }),
    copyright() {
      return this.HTMLDecode($_W.Copyright);
    },
    isAuth({ $store }) {
      return $store.state.setting.isAuth;
    }
  },
  mounted() {
    this.visitors = this.setEcharts('visitors');
    this.amount = this.setEcharts('amount');
    this.orders = this.setEcharts('orders');
    this.buyers = this.setEcharts('buyers');
    this.getStoreCount();
    this.getNearTwoDay();
    this.getSaleList();
    this.getBuyerList();
    window.onresize = () => {
      this.visitors.resize();
      this.amount.resize();
      this.orders.resize();
      this.buyers.resize();
    };
  },
  methods: {
    HTMLDecode(text) {
      var temp = document.createElement('div');
      temp.innerHTML = text;
      var output = temp.innerText || temp.textContent;
      temp = null;
      return output;
    },
    getStoreCount() {
      this.$heshop
        .statistical('get', {
          behavior: 'storeCount'
        })
        .then(res => {
          this.store_count = res;
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    getNearTwoDay() {
      this.$heshop
        .statistical('get', {
          behavior: 'nearTwoDay'
        })
        .then(res => {
          this.today_count = res;
          this.setEchartsData('visitors', [res.today_list.visit_list, res.yesterday_list.visit_list]);
          this.setEchartsData('amount', [res.today_list.pay_amount_list, res.yesterday_list.pay_amount_list]);
          this.setEchartsData('orders', [res.today_list.num_order_list, res.yesterday_list.num_order_list]);
          this.setEchartsData('buyers', [res.today_list.num_buyer_list, res.yesterday_list.num_buyer_list]);
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    // 获取列表
    getList: function (include, keyword, page, list, callback) {
      let _this = this;
      this.$heshop
        .search('post', { include: include }, { keyword: keyword })
        .page(this[page].current, this[page].size)
        .then(function (res) {
          let { data, headers } = res;
          _this[list] = callback(data);
          _this[page] = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count'] > 10 ? 10 : +headers['x-pagination-page-count'],
            size: +headers['x-pagination-per-page'],
            total: +headers['x-pagination-page-count'] > 10 ? 10 : +headers['x-pagination-page-count']
          };
        })
        .catch(function (err) {
          _this.$message.error(err.data.message);
        });
    },
    // 获取销量列表
    getSaleList() {
      this.getList('goods', this.sale_keyword, 'sale_page', 'sale', function (res) {
        return res;
      });
    },
    // 获取用户列表
    getBuyerList() {
      this.getList('users', this.buyer_keyword, 'buyer_page', 'buyer', function (res) {
        res = res.map(function (v) {
          if (!v.statistical) {
            v.statistical = {
              buy_number: 0,
              buy_amount: '0.00'
            };
          }
          return v;
        });
        return res;
      });
    },
    // 排序用户列表
    sortBuyer: function (e) {
      this.buyer_keyword.sort = {};
      this.buyer_keyword.sort[e.prop] = e.order === 'ascending' ? 'ASC' : 'DESC';
      this.getBuyerList();
    },
    // 排序商品列表
    sortGoods: function (e) {
      this.sale_keyword.sort = {};
      this.sale_keyword.sort[e.prop] = e.order === 'ascending' ? 'ASC' : 'DESC';
      this.getSaleList();
    },
    // 切换分页
    changeCurrent($event, key) {
      if (key === 'sale') {
        this.sale_page.current = $event;
        this.getSaleList();
      } else {
        this.buyer_page.current = $event;
        this.getBuyerList();
      }
    },
    // 导出数据
    exportData: function (key) {
      let _this = this;
      let behavior = '';
      let sort = '';
      let name = '';
      if (key === 'sale') {
        behavior = 'exportGoods';
        sort = this.sale_keyword.sort;
        name = '商品销量';
      } else {
        behavior = 'exportUsers';
        sort = this.buyer_keyword.sort;
        name = '用户购买力';
      }
      this.$heshop
        .statistical('get', {
          behavior: behavior,
          sort: JSON.stringify(sort)
        })
        .then(function (res) {
          require.ensure([], function () {
            _this.$h.Export2Excel.export_json_to_excel({
              header: res.tHeader,
              data: res.list,
              filename: name + '报表(' + _this.$moment(new Date()).format('YYYYMMDDHHmmss') + ')'
            });
          });
        })
        .catch(function (err) {
          _this.$message.error(err.data.message);
        });
    },
    setEcharts: function (id) {
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line'
          },
          formatter: function (params) {
            let htmlStr = '';
            for (let i = 0; i < params.length; i++) {
              let param = params[i];
              let xName = param.name;

              let seriesName = param.seriesName;
              let value = param.value;
              let color = param.color;
              if (i === 0) {
                htmlStr += xName + ':00~' + xName + ':59<br/>';
              }
              htmlStr += '<div>';
              htmlStr +=
                '<span style="margin-right:5px;display:inline-block;width:10px;height:10px;border-radius:5px;background-color:' +
                color +
                ';"></span>';
              htmlStr += seriesName + '：' + value;
              htmlStr += '</div>';
            }
            return htmlStr;
          }
        },
        color: ['#623CEB', '#BBBFC8'],
        grid: {
          left: '3%',
          right: '4%',
          bottom: '1%',
          top: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          axisLine: {
            lineStyle: {
              color: 'rgba(0, 0, 0, 0.6)',
              width: 0.5
            }
          },
          axisTick: {
            interval: 7
          },
          axisLabel: {
            interval: 7
          },
          data: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
        },
        yAxis: [
          {
            type: 'value',
            axisLabel: {
              show: false
            },
            splitLine: {
              show: true,
              lineStyle: {
                type: 'dashed',
                width: 0.5
              }
            }
          }
        ]
      };
      let chart = echarts.init(document.getElementById(id));
      // 使用刚指定的配置项和数据显示图表。
      chart.setOption(option);
      return chart;
    },
    setEchartsData: function (chart, data) {
      this[chart].setOption({
        series: [
          {
            name: '今日',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              // 折线颜色
              normal: {
                color: '#623CEB',
                width: 1
              }
            },
            data: data[0]
          },
          {
            name: '昨日',
            type: 'line',
            smooth: true,
            symbol: 'none',
            lineStyle: {
              //折线颜色
              normal: {
                color: '#BBBFC8',
                width: 1
              }
            },
            data: data[1]
          }
        ]
      });
    },
    router: function (index) {
      let path = '';
      let query = {};
      if (index === 0 || index === 1) {
        path = '/order/index';
        if (index === 0) {
          query = {
            tab: 'unpaid'
          };
        } else if (index === 1) {
          query = {
            tab: 'unsent'
          };
        }
      } else if (index === 2) {
        path = '/order/after';
      } else if (index === 3) {
        path = '/setup/index';
      } else if (index === 4) {
        path = '/goods/create-goods';
      } else if (index === 5) {
        path = '/store/index';
      } else if (index === 6) {
        path = '/users/index';
      } else if (index === 7) {
        path = '/order/index';
      }
      this.$router.push({
        path: path,
        query: query
      });
    }
  },
  filters: {
    getIndex(index) {
      if (index < 10) {
        return '0' + index;
      } else {
        return index;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import './index.less';
</style>
