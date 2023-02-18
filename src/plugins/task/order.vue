<template>
  <div class="task-content">
    <div class="__search">
      <el-form
        :inline="true"
        :model="formValue"
        ref="ruleForm"
        :rules="rules"
        class="demo-form-inline"
        label-width="100px"
        :default-sort="{ prop: 'created_time', order: 'descending' }"
      >
        <div>
          <el-form-item label="关键词搜索">
            <el-input
              v-model="formValue.search"
              placeholder="请输入商品名称/输入用户昵称/用户ID搜索"
              @keyup.enter.native="onSubmit"
              @clear="onSubmit"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="积分价格" prop="score_start">
            <el-input v-model="formValue.score_start" placeholder="积分的最低值"></el-input>
            <span style="display: inline-block; width: 47px; height: 32px; line-height: 32px; text-align: center"
              >至</span
            >
            <el-form-item prop="score_end" style="display: inline-block; margin-bottom: 0">
              <el-input v-model="formValue.score_end" placeholder="积分的最高值" @change="handleChange"></el-input>
            </el-form-item>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="兑换时间">
            <el-date-picker
              v-model="formValue.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始时间"
              end-placeholder="结束时间"
            >
            </el-date-picker>
          </el-form-item>
        </div>
        <div style="padding-left: 100px">
          <el-form-item style="margin-bottom: 0">
            <el-button type="primary" @click="onSubmit">筛选</el-button>
            <el-button @click="onEmpty">清空</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="__content" style="padding-top: 24px">
      <el-table
        :data="tableData"
        style="width: 100%"
        :default-sort="{ prop: 'created_time', order: 'descending' }"
        @sort-change="handleSortMethod"
      >
        <el-table-column prop="name" label="商品描述" min-width="312">
          <template slot-scope="scope">
            <div class="__goods_cover">
              <img :src="scope.row.goods[0].goods_image" alt="" />
              <div class="__goods_title">
                <h3>{{ scope.row.goods[0].goods_name | capitalize }}</h3>
                <p>{{ scope.row.goods[0].show_goods_param }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="user" label="用户" min-width="220">
          <template slot-scope="scope">
            <div class="__content_cover">
              <i class="le-icon le-icon-xiaochengxu" style="color: #623ceb" v-if="scope.row.oauth.type == 'weapp'"></i>
              <i class="le-icon le-icon-weixin2" style="color: #3bb430" v-else></i>
              <div class="__content_title">
                <h3 class="task_tab_tl">{{ scope.row.user.nickname }}</h3>
                <p>ID:{{ scope.row.UID }}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" label="订单号" min-width="180">
          <template slot-scope="scope">
            <he-link href="order/orderDetail" :query="{ order_sn: scope.row.order_sn }" v-if="scope.row.order_sn">
              <p class="task_tab_tl" style="color: #623ceb; font-weight: 400">{{ scope.row.order_sn || '-' }}</p>
            </he-link>
            <p v-else class="task_tab_tl" style="color: #623ceb; font-weight: 400">-</p>
          </template>
        </el-table-column>
        <el-table-column prop="total_score" label="积分价格" min-width="180">
          <template slot-scope="scope">
            <p class="task_tab_tl">{{ scope.row.total_score }}积分 + ¥{{ scope.row.total_amount }}</p>
          </template>
        </el-table-column>
        <el-table-column prop="order_sn" label="兑换数量" min-width="100">
          <template slot-scope="scope">
            <p class="task_tab_tl">
              {{ scope.row.goods[0].goods_number }}
            </p>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="兑换时间" sortable="custom" min-width="200">
          <template slot-scope="scope">
            <p class="task_tab_tl">{{ scope.row.created_time | dateFormat }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div class="__paging">
        <el-pagination
          :current-page="page.current"
          :page-count="page.count"
          @current-change="currentChange"
          @size-change="sizeChange"
          background=""
          layout="prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import moment from 'moment';
export default {
  data() {
    var validateStart = (rule, value, callback) => {
      let score_start = Number(this.formValue.score_start);
      let score_end = this.formValue.score_end ? Number(this.formValue.score_end) : '';
      if (score_start) {
        if (!(score_start % 1 === 0)) {
          callback(new Error('积分必须是整数'));
          return;
        }
        if (score_end || score_end === 0) {
          if (score_start > score_end) {
            callback(new Error('最低值需小于或等于最高值'));
            return;
          }
        }
      }
      callback();
    };
    var validateEnd = (rule, value, callback) => {
      let score_start = Number(this.formValue.score_start);
      let score_end = Number(this.formValue.score_end);
      if (score_start) {
        if (!(score_end % 1 === 0)) {
          callback(new Error('积分必须是整数'));
        }
        if (score_start > score_end) {
          callback(new Error('最高值需大于或等于最高低'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      /**
       * 分页数据
       * @type {Object}
       */
      page: {
        size: 20,
        current: 1
      },
      /**
       * 表格数据
       * @type {Array}
       */
      tableData: [],
      /**
       * 表单数据
       * @type {Object}
       */
      formValue: {
        search: '',
        score_start: '',
        score_end: '',
        date: []
      },
      /**
       * 验证规则
       * @type {Object}
       */
      rules: {
        score_start: [{ validator: validateStart, trigger: 'blur' }]
        // score_end: [

        //   { validator: validateEnd, trigger: 'blur' }
        // ]
      }
    };
  },
  filters: {
    /**
     * 格式化时间
     * @param  {[type]} row    [description]
     * @param  {[type]} column [description]
     * @return {[type]}        [description]
     */
    dateFormat(date) {
      if (date === undefined) {
        return '';
      }
      return moment(date * 1000).format('YYYY-MM-DD HH:mm:ss');
    },
    capitalize: function (value) {
      if (value.length >= 32) {
        return value.slice(0, 29) + '...';
      } else {
        return value;
      }
    }
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
  watch: {},
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.handleLogLoad();
  },
  methods: {
    handleChange() {
      this.$refs.ruleForm.validate(() => {});
    },
    handleSortMethod(e) {
      if (e.order == 'ascending') {
        this.formValue['sort'] = {
          'o.created_time': 'ASC'
        };
      }
      if (e.order == 'descending') {
        this.formValue['sort'] = {
          'o.created_time': 'DESC'
        };
      }
      if (e.order == null) {
        this.formValue['sort'] = {};
      }
      this.handleLogLoad();
    },
    onEmpty() {
      this.formValue = {
        search: '',
        score_start: '',
        score_end: '',
        date: []
      };
      this.$refs.ruleForm.resetFields();
      this.handleLogLoad();
    },
    /**
     * 加载商品数据
     * @param  {Function} done [description]
     * @return {[type]}        [description]
     */
    handleLogLoad() {
      let keyword = JSON.parse(JSON.stringify(this.formValue));
      let { page } = this;
      //执行API方法
      this.$heshop
        .plugin('get', { include: 'task', model: 'order', keyword: JSON.stringify(keyword) })
        .page(page.current, page.size)
        .then(res => {
          //判断文件是否存在
          if (res && res.headers) {
            let { data, headers } = res;
            this.page = {
              current: +headers['x-pagination-current-page'],
              count: +headers['x-pagination-page-count'],
              size: +headers['x-pagination-per-page'],
              total: +headers['x-pagination-total-count']
            };
            this.tableData = data;
          }
        })
        .catch(err => {
          this.$message.error('加载配置信息失败，请检查网络');
        });
    },
    /**
     * 提交数据
     * @return {[type]} [description]
     */
    onSubmit() {
      this.handleLogLoad();
    },
    /**
     * 跳页
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    sizeChange: function (e) {
      this.page.size = e;
      this.handleLogLoad();
      this.$emit('request', { page: this.page, sort: this.order });
    },
    /**
     * 跳页
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    currentChange: function (e) {
      this.page.current = e;
      this.handleLogLoad();
      this.$emit('request', { page: this.page, sort: this.order });
    }
  }
};
</script>
<style lang="less" scoped="true">
@import './task.less';

.task-content {
  .__content_cover {
    position: relative;
    padding-left: 25px;
    margin-bottom: 10px;
    margin-top: 10px;

    h3,
    p {
      padding: 0;
      margin: 0;
    }

    .le-icon {
      position: absolute;
      left: 0;
      top: 5px;
      font-size: 16px;
      height: 16px;
      line-height: 16px;
      width: 16px;
    }
  }

  .__goods_cover {
    display: flex;
    position: relative;

    img {
      width: 64px;
      height: 64px;
      background: #f2f2f2;
      margin-right: 12px;
    }

    .__goods_title {
      display: table;
      height: 48px;
      width: 230px;

      h3 {
        padding: 0;
        margin: 0;
        font-size: 14px;
        font-weight: 400;
        color: #262626;
        line-height: 18px;
        margin-bottom: 4px;
        padding-right: 4px;
      }

      p {
        padding: 0;
        margin: 0;
        line-height: 16px;
        font-size: 12px;
        font-weight: 400;
        color: #8c8c8c;
      }
    }
  }
}
</style>
