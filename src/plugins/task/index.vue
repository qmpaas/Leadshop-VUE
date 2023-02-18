<template>
  <div class="task-content">
    <div class="__tools">
      <router-link :to="{ path: '/plugins/task/add' }">
        <el-button type="primary">添加商品</el-button>
      </router-link>
    </div>
    <div class="__search">
      <el-form
        :inline="true"
        :model="formValue"
        ref="ruleForm"
        :rules="rules"
        class="demo-form-inline"
        label-width="100px"
      >
        <div>
          <el-form-item label="商品搜索" prop="search">
            <el-input
              v-model="formValue.search"
              placeholder="输入商品名称搜索"
              @keyup.enter.native="onSubmit"
              @clear="onSubmit"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="积分价格" prop="score_start">
            <el-input v-model="formValue.score_start" placeholder="积分的最低值" ref="score_start"></el-input>
            <span style="display: inline-block; width: 47px; height: 32px; line-height: 32px; text-align: center"
              >至</span
            >
            <el-form-item prop="score_end" style="display: inline-block; margin-bottom: 0">
              <el-input v-model="formValue.score_end" placeholder="积分的最高值" @change="handleChange"></el-input>
            </el-form-item>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="创建时间" prop="date">
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
    <div class="__tabs">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane :label="`全部(${statistics.all})`" name="first">
          <tableGoods v-model="formValue" ref="first"></tableGoods>
        </el-tab-pane>
        <el-tab-pane :label="`销售中(${statistics.onsale})`" name="second">
          <tableGoods v-model="formValue" ref="second" tab_key="onsale"></tableGoods>
        </el-tab-pane>
        <el-tab-pane :label="`下架中(${statistics.nosale})`" name="third">
          <tableGoods v-model="formValue" ref="third" tab_key="nosale"></tableGoods>
        </el-tab-pane>
        <el-tab-pane :label="`售罄(${statistics.soldout})`" name="fourth">
          <tableGoods v-model="formValue" ref="fourth" tab_key="soldout"></tableGoods>
        </el-tab-pane>
        <el-tab-pane :label="`回收站(${statistics.recycle})`" name="five">
          <tableGoods v-model="formValue" ref="five" tab_key="recycle"></tableGoods>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script type="text/javascript">
import tableGoods from './components/tables/goods.vue';
import tablesOrder from './components/tables/order.vue';

export default {
  components: {
    tableGoods,
    tablesOrder
  },
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
      statistics: { all: 0, onsale: 0, nosale: 0, soldout: 0, drafts: 0, recycle: 0 },
      activeName: 'first',
      formValue: {
        search: '',
        score_start: '',
        score_end: '',
        date: []
      },
      rules: {
        score_start: [{ validator: validateStart, trigger: 'blur' }]
      }
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
  watch: {},
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {},
  methods: {
    handleChange() {
      this.$refs.ruleForm.validate(valid => {});
    },
    onEmpty() {
      this.$refs.ruleForm.resetFields();
      let key = this.activeName;
      //处理不同选项卡下面的数据问题
      if (this.$refs[key] && this.$refs[key].handleGoodsLoad) {
        this.$refs[key].handleGoodsLoad();
      }
    },
    handleClick(tab, event) {
      let key = tab.name;
      //处理不同选项卡下面的数据问题
      if (this.$refs[key] && this.$refs[key].handleGoodsLoad) {
        this.$refs[key].handleGoodsLoad();
      }
    },
    //查询数据提交
    onSubmit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let key = this.activeName;
          //处理不同选项卡下面的数据问题
          if (this.$refs[key] && this.$refs[key].handleGoodsLoad) {
            this.$refs[key].handleGoodsLoad();
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less" scoped="true">
@import './task.less';
</style>
