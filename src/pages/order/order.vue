<template>
  <div class="le-matter">
    <div class="le-form-card">
      <el-form :model="keyword" status-icon ref="keyword" label-width="80px" class="le-search--form">
        <div style="display: flex; flex-wrap: wrap">
          <el-form-item label="订单搜索" prop="pass">
            <el-input
              clearable
              v-model="keyword.search"
              @keyup.enter.native="brush"
              @clear="brush"
              autocomplete="off"
              :placeholder="`输入${placeHolder}搜索`"
              class="he-searchInput"
            >
              <el-select v-model="keyword.search_key" slot="prepend" placeholder="请选择">
                <el-option
                  v-for="(item, index) in selectList"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-input>
          </el-form-item>
          <el-form-item label="支付方式" prop="checkPass">
            <el-select v-model="keyword.pay_type" placeholder="请选择" class="he-select__width">
              <el-option label="全部" value=""></el-option>
              <el-option label="微信" value="wechat"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单类型" prop="checkPass">
            <el-select v-model="keyword.type" placeholder="请选择" class="he-select__width">
              <el-option label="全部" value=""></el-option>
              <el-option label="普通订单" value="base"></el-option>
              <el-option label="积分订单" value="task" v-if="$manifest('task', 'status')"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="下单时间" prop="checkPass">
            <div class="el-row--flex">
              <div class="data-picker">
                <el-date-picker
                  style="width: 200px"
                  v-model="keyword.time_start_show"
                  type="datetime"
                  placeholder="选择时间"
                >
                </el-date-picker>
              </div>
              <div class="to">至</div>
              <div class="data-picker">
                <el-date-picker
                  style="width: 200px"
                  v-model="keyword.time_end_show"
                  type="datetime"
                  placeholder="选择时间"
                >
                </el-date-picker>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="订单来源" prop="age">
            <el-select v-model="keyword.source" placeholder="请选择" class="he-select__width">
              <el-option label="全部" value=""></el-option>
              <el-option label="微信小程序" value="weapp"></el-option>
              <el-option label="公众号" value="wechat"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="le-button">
          <el-button type="primary" @click="brush">筛选</el-button>
          <el-button @click="empty">清空</el-button>
          <el-button
            sureBtn="导出"
            title="导出"
            module="order"
            width="880"
            v-popup.orderExport="keyword"
            :hide_cancel="true"
            sure_btn="确认导出"
            action="toHistory"
            >导出
          </el-button>
          <he-link href="order/orderExportHistory">
            <el-button type="text" class="he-click">导出历史</el-button>
          </he-link>
        </div>
      </el-form>
    </div>
    <el-tabs v-model="activeName" type="card" class="le-tabs" @tab-click="tableClick">
      <el-tab-pane lazy :label="`全部订单(${tabCount.all})`" name="all">
        <orderAll
          v-model="orderList"
          :page="page"
          @count="onReload"
          @request="getList"
          :loading="tableLoading"
        ></orderAll>
      </el-tab-pane>
      <el-tab-pane lazy :label="`待付款(${tabCount.unpaid})`" name="unpaid">
        <orderAll
          v-model="orderList"
          :page="page"
          @count="onReload"
          @request="getList"
          :loading="tableLoading"
        ></orderAll>
      </el-tab-pane>
      <el-tab-pane lazy :label="`待发货(${tabCount.unsent})`" name="unsent">
        <orderAll
          v-model="orderList"
          :page="page"
          @count="onReload"
          @request="getList"
          :loading="tableLoading"
        ></orderAll>
      </el-tab-pane>
      <el-tab-pane lazy :label="`待收货(${tabCount.unreceived})`" name="unreceived">
        <orderAll
          v-model="orderList"
          :page="page"
          @count="onReload"
          @request="getList"
          :loading="tableLoading"
        ></orderAll>
      </el-tab-pane>
      <el-tab-pane lazy :label="`已收货(${tabCount.received})`" name="received">
        <orderAll
          v-model="orderList"
          :page="page"
          @count="onReload"
          @request="getList"
          :loading="tableLoading"
        ></orderAll>
      </el-tab-pane>
      <el-tab-pane lazy :label="`已完成(${tabCount.finished})`" name="finished">
        <orderAll
          v-model="orderList"
          :page="page"
          @count="onReload"
          @request="getList"
          :loading="tableLoading"
        ></orderAll>
      </el-tab-pane>
      <el-tab-pane lazy :label="`已关闭(${tabCount.closed})`" name="closed">
        <orderAll
          v-model="orderList"
          :page="page"
          @count="onReload"
          @request="getList"
          :loading="tableLoading"
        ></orderAll>
      </el-tab-pane>
      <el-tab-pane lazy :label="`回收站(${tabCount.recycle})`" name="recycle">
        <orderAll
          v-model="orderList"
          :page="page"
          @count="onReload"
          @request="getList"
          :loading="tableLoading"
        ></orderAll>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script type="text/javascript">
import orderAll from './components/orderAll.vue';

export default {
  components: {
    orderAll
  },
  data() {
    return {
      orderList: [],
      ruleForm: {
        pass: '',
        checkPass: '',
        age: '',
        search: '订单号'
      },
      placeHolder: '订单号',
      selectList: [
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
      ],
      activeName: 'all',
      keyword: {
        tab_key: 'all', // all全部  unpaid未付款  unsent待发货  unreceived待收货  received已收货  finished已完成  closed已关闭  recycle回收站
        pay_type: '',
        source: '',
        time_start: '',
        time_end: '',
        time_start_show: '',
        time_end_show: '',
        search_key: 'order_sn',
        search: '',
        search_key_label: '订单号'
      },
      page: {
        current: 1,
        size: 20
      },
      tabCount: {
        all: 0,
        closed: 0,
        finished: 0,
        received: 0,
        recycle: 0,
        unpaid: 0,
        unreceived: 0,
        unsent: 0
      },
      tableLoading: false
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {},
  /**
   * 页面渲染前
   * @return {[type]} [description]
   */
  created() {},
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {
    'keyword.search_key': {
      handler(newVal) {
        for (let i = 0; i < this.selectList.length; i++) {
          if (newVal === this.selectList[i].value) {
            this.placeHolder = this.selectList[i].label;
            this.keyword.search_key_label = this.placeHolder;
          }
        }
      }
    },
    'keyword.time_start_show': {
      handler(newVal) {
        if (newVal) {
          let str = newVal.valueOf().toString();
          this.keyword.time_start = str.slice(0, str.length - 3);
        } else {
          this.keyword.time_start = '';
        }
      }
    },
    'keyword.time_end_show': {
      handler(newVal) {
        if (newVal) {
          let str = newVal.valueOf().toString();
          this.keyword.time_end = str.slice(0, str.length - 3);
        } else {
          this.keyword.time_end = '';
        }
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    let tab = this.$getQueryVariable('tab');
    this.keyword.tab_key = tab ? tab : 'all';
    this.activeName = tab ? tab : 'all';
    this.getTabCount();
    this.getList(this.page);
  },
  methods: {
    empty: function () {
      this.keyword = {
        tab_key: 'all',
        pay_type: '',
        source: '',
        time_start: '',
        time_end: '',
        time_start_show: '',
        time_end_show: '',
        search_key: 'order_sn',
        search: '',
        search_key_label: '订单号'
      };
      this.brush();
    },
    getList: function (page) {
      this.tableLoading = true;
      let keyword = this.$heshop.utils.deepClone(this.keyword);
      delete keyword.time_start_show;
      delete keyword.time_end_show;
      this.$heshop
        .search('post', { include: 'order' }, { keyword: keyword })
        .page(page.current, page.size)
        .then(res => {
          let { data, headers } = res;
          this.page = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count'],
            size: +headers['x-pagination-per-page'],
            total: +headers['x-pagination-total-count']
          };
          this.tabCount[this.activeName] = this.page.total;
          this.orderList = data;
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
          this.$message.error(err.data.message);
        });
    },
    getTabCount: function () {
      let keyword = this.$heshop.utils.deepClone(this.keyword);
      delete keyword.time_start_show;
      delete keyword.time_end_show;
      this.$heshop
        .tabcount('post', { include: 'order' }, { keyword: keyword })
        .then(res => {
          this.tabCount = res;
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    tableClick: function (res) {
      this.keyword.tab_key = res.name;
      this.page.current = 1;
      this.getList(this.page);
    },
    brush: function () {
      this.page.current = 1;
      this.getList(this.page);
      this.getTabCount();
    },
    onReload() {
      this.getTabCount();
      this.getList(this.page);
    },
    toHistory() {
      this.$router.push('orderExportHistory');
    }
  }
};
</script>
<style lang="scss" scoped>
.le-matter {
  /deep/ .el-tabs__content {
    min-width: 1600px;
    overflow-x: auto;
  }
}

.le-tabs {
  margin-top: 24px;
}

.le-form-card /deep/ .el-col.el-col-6 {
  width: 22.5%;
}

.le-form-card {
  background-color: #ffffff;
  border-radius: 16px;
  padding: 24px 24px 0 24px;
  overflow: hidden;

  /deep/ .el-input-group__prepend {
    background: #ffffff !important;
  }
}

.le-form-card .to {
  width: 35px;
  text-align: center;
}

.data-picker /deep/ .el-input.el-input--mini .el-input__inner {
  padding-left: 30px;
}

.le-matter .he-searchInput /deep/ .el-select--mini {
  width: 140px;

  .el-input__inner {
    width: 140px;
  }

  .el-input--suffix {
    width: 140px;
  }
}

.le-matter /deep/ .he-searchInput {
  width: 447px;
}

.he-select__width /deep/ .el-input--suffix {
  width: 160px;
}

.le-matter .el-form-item__content /deep/ .el-button--text {
  margin-left: 0;
  padding: 10px 8px;
  color: #623ceb;
}

.he-click {
  font-size: 12px;
  font-weight: 400;
  color: #623ceb;
  padding: 0;
  margin-left: 5px;
}

.el-form-item {
  margin-right: 40px;
}

/deep/ .is-always-shadow {
  box-shadow: none;
}

.le-matter /deep/ .el-tabs--card > .el-tabs__content {
  box-shadow: none;
}

.le-main .le-tabs /deep/ .el-tabs__content {
  padding: 20px !important;
}

.le-button {
  margin: 0 0 24px 80px;
}

.le-search--form ::v-deep {
  .el-form-item {
    margin-bottom: 16px !important;
  }
}
</style>
