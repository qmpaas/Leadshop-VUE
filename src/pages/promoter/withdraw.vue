<!--
 * @Description: 提现管理
 * @Author: fjt
 * @Date: 2021-06-08 17:52:08
 * @LastEditTime: 2021-06-08 17:52:38
 * @LastEditors: fjt
-->

<script>
import withdrawTable from './components/withdraw-table.vue';
import index from './index';
import { financeList, promoterLevelList } from './api.js';

// 提现方式
const type = [
  {
    label: '全部',
    value: null
  },
  {
    label: '自动转账',
    value: 'wechatDib'
  },
  {
    label: '提现到微信',
    value: 'wechat'
  },
  {
    label: '提现到支付宝',
    value: 'alipay'
  },
  {
    label: '提现到银行卡',
    value: 'bankCard'
  }
];
const searchForm = {
  keyword: '', // 搜索关键词
  status: '-1', // -1--全部    0--申请中(待审核) 1--同意(待打款) 2--已打款 3--驳回
  level: 0, // 当前等级（不是等级id）
  type: null, // 提现方式 1--自动打款 2--微信打款 3--支付宝打款 4--银行转账
  time: []
};
export default {
  data() {
    return {
      form: this.$_.cloneDeep(searchForm),
      list: [],
      pagination: {
        current: 1,
        pageCount: 1
      },
      level: []
    };
  },
  components: {
    withdrawTable
  },
  mixins: [index],
  mounted() {
    // 获取提现列表
    this.getList();
    // 获取分销商等级列表
    this.getLevelList();
  },
  methods: {
    empty() {
      this.form = this.$_.cloneDeep(searchForm);
      this.tabSwitch();
    },
    // tab切换
    tabSwitch() {
      this.pagination.current = 1;
      this.getList();
    },
    // 筛选
    filter() {
      this.getList();
    },
    // 获取提现列表
    getList() {
      let form = this.$_.cloneDeep(this.form);
      if (form.time?.length > 0) {
        form.begin_time = form.time[0] + '';
        form.begin_time = form.begin_time.slice(0, form.begin_time.length - 3);
        form.end_time = form.time[1] + '';
        form.end_time = form.end_time.slice(0, form.end_time.length - 3);
      }
      delete form.time;
      Object.keys(form).forEach(key => {
        if (!form[key]) {
          delete form[key];
        }
      });
      financeList(this.pagination.current, form).then(response => {
        const { data, pagination } = response;
        this.list = data;
        this.pagination = pagination;
      });
    },
    // 获取分销商等级列表
    getLevelList() {
      promoterLevelList().then(response => {
        this.level = response;
      });
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-form class="le-card" inline={true} label-width="126px">
          <el-form-item label="分销商搜索">
            <el-input
              class="le-input--240"
              v-model={self.form.keyword}
              nativeOn={{
                keyup: event => {
                  if (event.key === 'Enter') {
                    self.getList();
                  }
                }
              }}
              clearable={true}
              onClear={() => {
                self.getList();
              }}
              placeholder="输入ID/昵称/姓名/手机号搜索"
            />
          </el-form-item>
          <el-form-item label="分销商等级">
            <el-select placeholder="请选择" v-model={self.form.level}>
              <el-option label="全部" value={0} />
              {self.level.map((item, index) => {
                return <el-option key={index} label={item.name} value={item.level} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="提现方式">
            <el-select placeholder="请选择" v-model={self.form.type}>
              {type.map((item, index) => {
                return <el-option key={index} label={item.label} value={item.value} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="申请时间">
            <el-date-picker
              v-model={self.form.time}
              size="small"
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
        <el-tabs
          class="le-tabs"
          type="card"
          v-model={self.form.status}
          on={{
            'tab-click': this.tabSwitch
          }}>
          {[
            { name: '全部', key: '-1', lazy: false },
            { name: '待审核', key: '0', lazy: true },
            { name: '待打款', key: '1', lazy: true },
            { name: '已打款', key: '2', lazy: true },
            { name: '已拒绝', key: '3', lazy: true }
          ].map(item => {
            return (
              <el-tab-pane lazy={item.lazy} label={item.name} name={item.key} key={item.key}>
                <withdrawTable
                  v-model={self.list}
                  pagination={self.pagination}
                  on-current-change={event => {
                    self.pagination.current = event;
                    // 切换页面搜索
                    self.getList();
                  }}
                  on={{
                    ['update:pagination']: e => {
                      self.pagination = e;
                    }
                  }}
                  on-confirm={self.getList}
                />
              </el-tab-pane>
            );
          })}
        </el-tabs>
      </div>
    );
  }
};
</script>

<style lang="scss" scoped>
@import './index.less';

.le-card {
  margin-bottom: 24px;

  .le-button {
    margin-left: 120px;
  }
}
</style>
