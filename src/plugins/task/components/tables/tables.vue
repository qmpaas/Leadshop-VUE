<template>
  <div class="task-tables">
    <el-table :data="value" :span-method="arraySpanMethod">
      <el-table-column label="Date" prop="date">
        <template slot="header" slot-scope="scope"> 商品 </template>
        <template slot-scope="scope">
          <div class="__goods_cover">
            <img :src="getGoodsCover(scope.row.slideshow)" alt="" />
            <div class="__goods_title">
              <p>{{ scope.row.name | capitalize }}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name" width="184px">
        <template slot="header" slot-scope="scope">
          <strong style="color: red; padding-right: 3px">*</strong>可兑换数量
          <el-tooltip
            class="item"
            :manual="true"
            content="可兑换数量与商城商品库存互相独立，互不影响"
            placement="top"
            popper-class="task-tooltip"
          >
            <i
              class="le-icon le-icon-zhushi1"
              style="position: relative; top: -1px; font-size: 13px; color: #bbbfc8; vertical-align: middle"
            ></i>
          </el-tooltip>
        </template>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.task_stock"
            v-if="scope.row.param_type == 1"
            blur="(e)=>{
                     if(e.target.value=='') $message.error('可兑换数量不能为空')
                     if(!isInteger(e.target.value)) $message.error('可兑换数量必须为整数')
                     if(e.target.value>9999999) $message.error('兑换数量不能大于9999999') }"
          >
            <template slot="append">件</template>
          </el-input>
          <div class="__specs-setting" v-if="scope.row.param_type == 2">
            <TaskSpecs v-model="scope.row.param" :ref="`taskspecs${scope.$index}`" :goods="scope.row"></TaskSpecs>
            <el-button @click="handleDialog(scope.$index)">多规格设置</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name" width="322px">
        <template slot="header" slot-scope="scope">
          <strong style="color: red; padding-right: 3px">*</strong>积分价格
        </template>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.task_number"
            blur="(e)=>{
                        if(e.target.value=='') $message.error('积分价格不能为空')
                        if(!isInteger(e.target.value)) $message.error('积分价格必须为整数')
                        if(e.target.value>9999999) $message.error('积分价格不能大于9999999')
                    }"
          >
            <template slot="append">积分</template>
          </el-input>
          <span style="display: inline-block; width: 24px; height: 32px; line-height: 32px; text-align: center">+</span>
          <el-input
            v-model="scope.row.task_price"
            blur="(e)=>{
                        if(e.target.value=='') $message.error('积分价格不能为空')
                        if(!isPriceNumber(e.target.value)) $message.error('积分价格格式不对')
                        if(e.target.value>9999999) $message.error('积分价格不能大于9999999')
                    }"
          >
            <template slot="append">元</template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name" width="184px">
        <template slot="header" slot-scope="scope"> 兑换限制 </template>
        <template slot-scope="scope">
          <el-input
            v-model="scope.row.task_limit"
            blur="(e)=>{
                        if(e.target.value>9999999) $message.error('兑换限制不能大于9999999')
                        if(!isInteger(e.target.value)) $message.error('兑换限制必须为整数')
                        if(e.target.value>scope.row.task_stock) $message.error('兑换限制不能大于可兑换数量')
                    }"
          >
            <template slot="append">件/人</template>
          </el-input>
        </template>
      </el-table-column>
      <el-table-column label="Name" prop="name">
        <template slot="header" slot-scope="scope"> 操作 </template>
        <template slot-scope="scope">
          <el-button type="text" style="padding: 9px 0" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import TaskSpecs from '../dialog/specs.vue';
/**
 * 需要测试最多可以加载多少件商品
 */
export default {
  components: {
    TaskSpecs
  },
  /**
   * 对外接口
   * @type {Object}
   */
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default() {
        return [];
      }
    }
  },
  /**
   * 页面数据链
   * @return {[type]} [description]
   */
  data() {
    return {
      search: ''
    };
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {},
  /**
   * 过滤器
   * @type {Object}
   */
  filters: {
    capitalize: function (value) {
      if (value.length >= 38) {
        return value.slice(0, 35) + '...';
      } else {
        return value;
      }
    }
  },
  /**
   * 处理执行
   * @type {Object}
   */
  methods: {
    isPriceNumber(_keyword) {
      if (_keyword == '0' || _keyword == '0.' || _keyword == '0.0' || _keyword == '0.00') {
        _keyword = '0';
        return true;
      } else {
        var index = _keyword.indexOf('0');
        var length = _keyword.length;
        if (index == 0 && length > 1) {
          /*0开头的数字串*/
          var reg = /^[0]{1}[.]{1}[0-9]{1,2}$/;
          if (!reg.test(_keyword)) {
            return false;
          } else {
            return true;
          }
        } else {
          /*非0开头的数字*/
          var reg = /^[1-9]{1}[0-9]{0,10}[.]{0,1}[0-9]{0,2}$/;
          if (!reg.test(_keyword)) {
            return false;
          } else {
            return true;
          }
        }
        return false;
      }
    },
    /**
     * 判断是否为整数
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    isInteger(obj) {
      return obj % 1 === 0;
    },
    /**
     * 获取封面信息
     * @param  {[type]} cover [description]
     * @return {[type]}       [description]
     */
    getGoodsCover(cover) {
      if (cover) {
        if (Object.prototype.toString.call(cover) === '[object Array]') {
          return cover[0];
        }
        if (Object.prototype.toString.call(cover) === '[object String]') {
          try {
            return JSON.parse(cover)[0];
          } catch (e) {
            return this.ipAddress + '/le-default-goods-bg.png';
          }
        }
      }
      return this.ipAddress + '/le-default-goods-bg.png';
    },
    /**
     * 合并对应数据
     * @param  {[type]} options.row         [description]
     * @param  {[type]} options.column      [description]
     * @param  {[type]} options.rowIndex    [description]
     * @param  {[type]} options.columnIndex [description]
     * @return {[type]}                     [description]
     */
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.param_type == 2) {
        if (columnIndex === 1) {
          return [1, 3];
        } else if (columnIndex === 2) {
          return [0, 0];
        } else if (columnIndex === 3) {
          return [0, 0];
        }
      }
    },
    handleDialog(index) {
      let taskspecs = 'taskspecs' + index;
      this.$refs[taskspecs].dialogVisible = true;
    },
    handleEdit(row) {},
    /**
     * @param  {[type]} index [description]
     * @param  {[type]} row   [description]
     * @return {[type]}       [description]
     */
    handleDelete(scope) {
      this.value.splice(scope.$index, 1);
    }
  }
};
</script>
<style lang="less" scoped="true">
@import '../../task.less';

.el-tag {
  background-color: #ffffff !important;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  padding: 0 16px;
  border-radius: 4px;
  height: 28px;
}
</style>
