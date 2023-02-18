<template>
  <div class="task-edit">
    <div class="task-edit__phone">
      <div class="task-edit__phone_window">
        <div class="header">
          <img class="header-bg" src="@/assets/images/icon-phone-header.png" />
          <h3>商品详情</h3>
        </div>
        <div class="body">
          <el-image style="width: 340px; height: 340px" :src="covers[0]" fit="fit"></el-image>
          <div class="goods-info">
            <div class="goods-price">
              <span style="font-size: 22px; font-family: DINPro; font-weight: bold; color: #e60b30">{{
                goodsData.task.task_number
              }}</span>
              <span style="font-size: 11px; font-family: DINPro; font-weight: 800; color: #e60b30"> 积分</span>
              <span style="font-size: 12px; font-family: DINPro; font-weight: bold; color: #e60b30"> + </span>
              <span style="font-size: 14px; font-weight: bold; font-weight: bold; color: #e60b30"> ¥</span>
              <span style="font-size: 22px; font-family: DINPro; font-weight: bold; color: #e60b30">{{
                goodsData.task.task_price
              }}</span>
              <span
                style="
                  font-size: 11px;
                  font-weight: 500;
                  color: #999999;
                  text-decoration: line-through;
                  padding-left: 5px;
                "
                >{{ goodsData.line_price }}</span
              >
            </div>
            <div class="goods-sales">已销0件</div>
            <div class="goods-share">
              <i class="le-icon le-icon-fenxiang"></i>
              <p>分享</p>
            </div>
            <div class="goods-title">
              {{ goodsData.name }}
            </div>
          </div>
          <div class="goods-pay">
            <img class="header-bg" src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task-foot-bg.png" />
          </div>
        </div>
      </div>
    </div>
    <div class="task-edit__lists task-setting">
      <el-form ref="form" :model="form" label-width="100px" style="width: 100%">
        <el-card class="__card">
          <div slot="header" class="__card_clearfix">
            <h3>基础信息</h3>
          </div>
          <div class="__card_body" style="width: 100%; padding-left: 90px">
            <el-form-item label="上架状态">
              <el-radio-group v-model="goodsData.task.goods_is_sale">
                <el-radio :label="1">立即上架</el-radio>
                <el-radio :label="0">暂不上架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="商品名称">
              <el-input v-model="goodsData.name" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="商品轮播图">
              <div v-for="(item, index) in covers" :key="index" class="__card_body_img">
                <img :src="item" alt="" />
              </div>
            </el-form-item>
          </div>
        </el-card>
        <el-card class="__card">
          <div slot="header" class="__card_clearfix">
            <h3>积分设置</h3>
          </div>
          <div
            class="__card_body"
            v-if="goodsData && goodsData.param_type == 1 && goodsData.task"
            style="width: 100%; padding-left: 90px"
          >
            <el-form-item label="可兑换数量" label-width="120px">
              <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>可兑换数量</span>
              <el-input
                v-model="goodsData.task.task_stock"
                blur="(e)=>{
                        if(e.target.value =='') $message.error('可兑换数量不能为空')
                        if(e.target.value>9999999) $message.error(' 可兑换数量不能大于9999999')
                    }"
              >
                <template slot="append">件</template>
              </el-input>
            </el-form-item>
            <el-form-item label="积分价格" label-width="120px">
              <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>积分价格</span>
              <el-input v-model="goodsData.task.task_number" style="width: 140px">
                <template slot="append">积分</template>
              </el-input>
              +
              <el-input
                v-model="goodsData.task.task_price"
                style="width: 140px"
                blur="(e)=>{
                        if(e.target.value =='') $message.error('积分价格不能为空')
                        if(!isPriceNumber(e.target.value)) $message.error('积分价格格式不对')
                        if(e.target.value>9999999) $message.error(' 积分价格不能大于9999999')
                    }"
              >
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="兑换限制" label-width="120px">
              <el-input v-model="goodsData.task.task_limit">
                <template slot="append">件/人</template>
              </el-input>
            </el-form-item>
          </div>
          <div
            class="__card_body"
            style="width: 971px; padding-top: 0"
            v-if="goodsData && goodsData.param_type == 2 && goodsData.task"
          >
            <TaskSpecstable ref="specstable" :goods="goodsData"></TaskSpecstable>
          </div>
        </el-card>
      </el-form>
      <div class="task-card-footer">
        <el-button @click="$router.go(-1)">取消</el-button>
        <el-button type="primary" @click="handleSubmit">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import TaskSpecstable from './components/tables/specs.vue';
import verify from './verify.js';
export default {
  components: {
    TaskSpecstable
  },
  data() {
    return {
      goodsData: {
        name: '',
        slideshow: '',
        param_type: 1,
        line_price: 0,
        task: {
          task_number: 0,
          task_price: 0,
          goods_is_sale: 0
        }
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    };
  },

  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    covers() {
      if (this.goodsData.slideshow) {
        let cover = this.goodsData.slideshow;
        if (Object.prototype.toString.call(cover) === '[object Array]') {
          return cover[0];
        }
        if (Object.prototype.toString.call(cover) === '[object String]') {
          try {
            return JSON.parse(cover);
          } catch (e) {
            return [this.ipAddress + '/le-default-goods-bg.png'];
          }
        }
      }
      return [this.ipAddress + '/le-default-goods-bg.png'];
    }
  },
  filters: {
    capitalize: function (value) {
      if (value.length >= 42) {
        return value.slice(0, 39) + '...';
      } else {
        return value;
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.handleLoadData(this.$route.query.id);
    } else {
      this.$message.error('商品找不到或不存在');
    }
  },
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
    handleSubmit(done) {
      let goodsData = this.goodsData;

      //判断是否可以提交
      let is_submit = true;

      //判断是否为多规格数据
      if (goodsData.param_type == 2) {
        let param = this.handleAffirm();
        if (param) {
          for (let index in param) {
            let verifyData = JSON.parse(JSON.stringify(param[index]));
            //判断是否为空
            if (verify.isEmpty(verifyData.task_stock)) {
              this.$message.error('可兑换数量不能为空');
              is_submit = false;
              return false;
            }
            if (verify.isEmpty(verifyData.task_number)) {
              this.$message.error('积分值不能为空');
              is_submit = false;
              return false;
            }
            if (verify.isEmpty(verifyData.task_price)) {
              this.$message.error('积分价格不能为空');
              is_submit = false;
              return false;
            }

            // //判断不能为0
            // if (verifyData.task_number == 0) {
            //   this.$message.error('积分不能为零')
            //   is_submit = false;
            //   return false;
            // }

            //判断是否存在小数
            if (verify.isFloat(verifyData.task_stock)) {
              this.$message.error('可兑换数量填写错误');
              is_submit = false;
              return false;
            }
            if (verify.isFloat(verifyData.task_number)) {
              this.$message.error('积分值填写错误');
              is_submit = false;
              return false;
            }
            if (verify.isFloat(verifyData.task_limit)) {
              this.$message.error('兑换限制填写错误');
              is_submit = false;
              return false;
            }

            //判断是否为数组
            if (!verify.isNumber(verifyData.task_stock)) {
              this.$message.error('可兑换数量必须是数字');
              is_submit = false;
              return false;
            }
            if (!verify.isNumber(verifyData.task_number)) {
              this.$message.error('积分值必须是数字');
              is_submit = false;
              return false;
            }
            if (!verify.isNumber(verifyData.task_price)) {
              this.$message.error('积分价格必须是数字');
              is_submit = false;
              return false;
            }
            if (!verify.isNumber(verifyData.task_limit) && !verify.isEmpty(verifyData.task_limit)) {
              this.$message.error('兑换限制必须是数字');
              is_submit = false;
              return false;
            }

            //判断非负数
            if (!verify.isIntNum(verifyData.task_stock)) {
              this.$message.error('可兑换数量不能为负数');
              is_submit = false;
              return false;
            }
            if (!verify.isIntNum(verifyData.task_number)) {
              this.$message.error('积分值不能为负数');
              is_submit = false;
              return false;
            }
            if (!verify.isIntNum(verifyData.task_price)) {
              this.$message.error('积分价格不能为负数');
              is_submit = false;
              return false;
            }
            if (!verify.isIntNum(verifyData.task_limit) && !verify.isEmpty(verifyData.task_limit)) {
              this.$message.error('兑换限制不能为负数');
              is_submit = false;
              return false;
            }

            //判断大小限制
            if (verify.isLimit(verifyData.task_stock, 9999999)) {
              this.$message.error('可兑换数量不能大于9999999');
              is_submit = false;
              return false;
            }
            if (verify.isLimit(verifyData.task_number, 9999999)) {
              this.$message.error('积分值不能大于9999999');
              is_submit = false;
              return false;
            }
            if (verify.isLimit(verifyData.task_price, 9999999)) {
              this.$message.error('积分价格不能大于9999999');
              is_submit = false;
              return false;
            }
            if (verify.isLimit(verifyData.task_limit, 9999999) && !verify.isEmpty(verifyData.task_limit)) {
              this.$message.error('兑换限制不能大于9999999');
              is_submit = false;
              return false;
            }

            //判断价格格式
            if (!verify.isPrice(verifyData.task_price)) {
              this.$message.error('积分价格格式不正确');
              is_submit = false;
              return false;
            }
            //判断限制数量
            if (
              parseInt(verifyData.task_limit) > parseInt(verifyData.task_stock) &&
              parseInt(verifyData.task_limit) > 0
            ) {
              this.$message.error('兑换限制不能大于可兑换数量');
              is_submit = false;
              return false;
            }
          }
          goodsData.param = param;
        } else {
          is_submit = false;
        }
      }
      //单规格数据判断
      //task_stock
      //task_number
      //task_price
      //task_limit
      else {
        let verifyData = JSON.parse(JSON.stringify(goodsData.task));
        //判断是否为空
        if (verify.isEmpty(verifyData.task_stock)) {
          this.$message.error('可兑换数量不能为空');
          is_submit = false;
          return false;
        }
        if (verify.isEmpty(verifyData.task_number)) {
          this.$message.error('积分值不能为空');
          is_submit = false;
          return false;
        }
        if (verify.isEmpty(verifyData.task_price)) {
          this.$message.error('积分价格不能为空');
          is_submit = false;
          return false;
        }

        //判断是否存在小数
        if (verify.isFloat(verifyData.task_stock)) {
          this.$message.error('可兑换数量填写错误');
          is_submit = false;
          return false;
        }
        if (verify.isFloat(verifyData.task_number)) {
          this.$message.error('积分值填写错误');
          is_submit = false;
          return false;
        }
        if (verify.isFloat(verifyData.task_limit)) {
          this.$message.error('兑换限制填写错误');
          is_submit = false;
          return false;
        }

        //判断是否为数组
        if (!verify.isNumber(verifyData.task_stock)) {
          this.$message.error('可兑换数量必须是数字');
          is_submit = false;
          return false;
        }
        if (!verify.isNumber(verifyData.task_number)) {
          this.$message.error('积分值必须是数字');
          is_submit = false;
          return false;
        }
        if (!verify.isNumber(verifyData.task_price)) {
          this.$message.error('积分价格必须是数字');
          is_submit = false;
          return false;
        }
        if (!verify.isNumber(verifyData.task_limit) && !verify.isEmpty(verifyData.task_limit)) {
          this.$message.error('兑换限制必须是数字');
          is_submit = false;
          return false;
        }

        //判断非负数
        if (!verify.isIntNum(verifyData.task_stock)) {
          this.$message.error('可兑换数量不能为负数');
          is_submit = false;
          return false;
        }
        if (!verify.isIntNum(verifyData.task_number)) {
          this.$message.error('积分值不能为负数');
          is_submit = false;
          return false;
        }
        if (!verify.isIntNum(verifyData.task_price)) {
          this.$message.error('积分价格不能为负数');
          is_submit = false;
          return false;
        }
        if (!verify.isIntNum(verifyData.task_limit) && !verify.isEmpty(verifyData.task_limit)) {
          this.$message.error('兑换限制不能为负数');
          is_submit = false;
          return false;
        }

        //判断大小限制
        if (verify.isLimit(verifyData.task_stock, 9999999)) {
          this.$message.error('可兑换数量不能大于9999999');
          is_submit = false;
          return false;
        }
        if (verify.isLimit(verifyData.task_number, 9999999)) {
          this.$message.error('积分值不能大于9999999');
          is_submit = false;
          return false;
        }
        if (verify.isLimit(verifyData.task_price, 9999999)) {
          this.$message.error('积分价格不能大于9999999');
          is_submit = false;
          return false;
        }
        if (verify.isLimit(verifyData.task_limit, 9999999) && !verify.isEmpty(verifyData.task_limit)) {
          this.$message.error('兑换限制不能大于9999999');
          is_submit = false;
          return false;
        }

        //判断价格格式
        if (!verify.isPrice(verifyData.task_price)) {
          this.$message.error('积分价格格式不正确');
          is_submit = false;
          return false;
        }

        //判断限制数量
        if (parseInt(verifyData.task_limit) > parseInt(verifyData.task_stock) && parseInt(verifyData.task_limit) > 0) {
          this.$message.error('兑换限制不能大于可兑换数量');
          is_submit = false;
          return false;
        }
      }

      //设置提交的数据
      let postData = {
        goods_is_sale: goodsData.task.goods_is_sale,
        goods_list: [goodsData]
      };

      //处理判断是否提交
      if (is_submit) {
        /**
         * 执行数据提交
         * @param  {[type]} res [description]
         * @return {[type]}     [description]
         */
        this.$heshop
          .plugin('post', { include: 'task', model: 'goods' }, postData)
          .then(res => {
            this.$message({
              message: '保存成功',
              type: 'success'
            });
            //跳转界面
            // this.$router.push({
            //     path: "/plugins/task/index",
            // });
          })
          .catch(err => {
            this.$message.error('保存失败，请检查规格参数是否设置正确');
          });
      } else {
        //this.$message.error('请检查规格参数是否设置正确');
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
     * 主要用于循环判断规格参数是否填写正确
     * @return {[type]} [description]
     */
    handleAffirm() {
      //拉取多规格数据
      let tableData = this.$refs['specstable'].tableData;
      if (tableData) {
        for (let index in tableData) {
          let item = tableData[index];
          if (item.task_number < 0 || item.task_number == null) {
            this.$message.error('兑换积分不能为空，不能为负数');
            return false;
          }

          if (item.task_price < 0 || item.task_price == null) {
            this.$message.error('兑换价格不能为空');
            return false;
          }

          if (item.task_stock < 0 || item.task_stock == null) {
            this.$message.error('可兑换数量不能为空');
            return false;
          }

          if (!this.isInteger(item.task_limit)) {
            this.$message.error('兑换限制必须为整数');
            return false;
          }
          if (!this.isInteger(item.task_number)) {
            this.$message.error('积分值必须为整数');
            return false;
          }

          if (!this.isInteger(item.task_stock)) {
            this.$message.error('可兑换数量必须为整数');
            return false;
          }

          if (item.task_limit > item.task_stock) {
            this.$message.error('兑换限制不能大于可兑换数量');
            return false;
          }
        }
        return tableData;
      } else {
        this.$message.error('请先设置规格数据');
        return false;
      }
    },
    /**
     * 加载产品数据信息
     * @return {[type]} [description]
     */
    handleLoadData(id) {
      /**
       * 执行数据提交
       * @param  {[type]} res [description]
       * @return {[type]}     [description]
       */
      this.$heshop
        .plugin('get', { id: id, include: 'task', model: 'goods' })
        .then(res => {
          this.goodsData = res;
        })
        .catch(err => {
          this.$message.error('获取失败，请检查网络');
        });
    }
  }
};
</script>
<style lang="less" scoped="true">
@import './task.less';

.task-edit {
  margin-top: -20px;
}

/deep/.task-edit__lists {
  .__card .el-card__body {
    padding-top: 0 !important;
  }

  .task__specs {
    margin-top: 0;
  }
}
</style>
