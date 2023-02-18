<template>
  <el-form class="" label-width="160px" :model="form" :rules="rules" @submit.native.prevent>
    <div class="le-arrow" v-if="step === 0 || step === 1">
      <ul>
        <li class="active" style="z-index: 3; cursor: pointer" @click="editSwitch(1)">
          <div class="center">1.编辑商品信息</div>
        </li>
        <li
          :class="step > 0 ? 'active' : ''"
          :style="form.status === 0 ? 'z-index: 2;cursor:pointer;' : 'z-index: 2;cursor:pointer;'"
          @click="editSwitch(2)"
        >
          <div class="center">2.编辑商品详情</div>
        </li>
      </ul>
    </div>
    <el-tabs v-model="activeName" class="le-tabs" type="card" v-show="step === 0">
      <el-tab-pane label="基本信息" name="first">
        <addBasic v-model="form" />
      </el-tab-pane>
      <el-tab-pane label="价格库存" name="second">
        <addPrice v-model="form" ref="addPrice" />
      </el-tab-pane>
      <el-tab-pane label="物流设置" name="third">
        <addLogistic v-model="form" />
      </el-tab-pane>
      <el-tab-pane label="营销设置" name="fourth">
        <addMarketing v-model="form" />
      </el-tab-pane>
      <el-tab-pane label="其他设置" name="fifth">
        <addOther v-model="form" />
      </el-tab-pane>
    </el-tabs>
    <template v-if="step === 1">
      <goodsEditor v-model="form.body.content" />
    </template>
    <template v-if="step === 2">
      <goodsPreview :form="form" />
    </template>
    <div class="le-cardpin">
      <template v-if="step === 0">
        <el-button @click="save">保存</el-button>
        <el-button type="primary" @click="nextStep">下一步</el-button>
      </template>
      <template v-else-if="step === 1">
        <el-button @click="step = 2">预览</el-button>
        <el-button @click="step = 0">上一步</el-button>
        <el-button type="primary" @click="save">保存商品</el-button>
      </template>
      <template v-else-if="step === 2">
        <el-button @click="step = 1">继续编辑</el-button>
      </template>
    </div>
  </el-form>
</template>

<script>
import addBasic from './components/addBasic.vue';
import addPrice from './components/addPrice.vue';
import addLogistic from './components/addLogistic.vue';
import addMarketing from './components/addMarketing.vue';
import addOther from './components/addOther.vue';
import goodsEditor from './components/goodsEditor.vue';
import goodsPreview from './components/goodsPreview.vue';

export default {
  name: 'create-goods',
  components: {
    addBasic,
    addPrice,
    addLogistic,
    addMarketing,
    addOther,
    goodsEditor,
    goodsPreview
  },
  data() {
    return {
      // 商品信息表单
      form: {
        name: '',
        body: {
          goods_introduce: '',
          goods_args: []
        },
        group: [],
        param: {
          goods_data: [
            {
              param_value: '',
              price: '',
              stocks: 0,
              cost_price: '',
              weight: '',
              goods_sn: ''
            }
          ],
          param_data: [
            {
              name: '',
              image_status: false,
              value: [
                {
                  value: '',
                  image: ''
                }
              ]
            }
          ]
        },
        stocks: 0,
        slideshow: [],
        param_type: 1,
        ft_type: 1,
        pfr_status: 0,
        unit: '件',
        is_video: 0,
        videoType: 1,
        video: {},
        video_cover: '',
        is_sale: 0,
        min_number: '',
        coupon: [],
        price: ''
      },
      // 验证规则
      rules: {},
      // 进度
      step: 0,
      activeName: 'first'
    };
  },
  methods: {
    // 下一步
    nextStep() {
      if (this.activeName === 'first') {
        this.activeName = 'second';
      } else if (this.activeName === 'second') {
        this.activeName = 'third';
      } else if (this.activeName === 'third') {
        this.activeName = 'fourth';
      } else if (this.activeName === 'fourth') {
        this.activeName = 'fifth';
      } else {
        this.step = 1;
      }
    },
    editSwitch(name) {
      if (name === 1) {
        this.activeName = 'first';
        this.step = 0;
      } else {
        this.step = 1;
      }
    },
    // 保存
    save() {
      const first = this.firstVerify();
      if (!first) {
        this.step = 0;
        this.activeName = 'first';
        return false;
      }
      const second = this.secondVerify();
      if (!second) {
        this.step = 0;
        this.activeName = 'second';
        return false;
      }
      const third = this.thirdVerify();
      if (!third) {
        this.step = 0;
        this.activeName = 'third';
        return false;
      }
      const fourth = this.fourthVerify();
      if (!fourth) {
        this.step = 0;
        this.activeName = 'fourth';
        return false;
      }
      const form = this.$_.cloneDeep(this.form);
      form.param_data = form.param.param_data;
      form.goods_data = JSON.stringify(form.param.goods_data);
      delete form.param;
      if (form.is_video) {
        form.video.type = form.videoType;
        delete form.videoType;
      }
      form.coupon = form.coupon.map(item => {
        return {
          coupon_id: item.info.id,
          number: item.number
        };
      });
      this.$heshop
        .goods('post', form)
        .then(() => {
          this.$router.replace({
            path: '/goods/index'
          });
        })
        .catch(error => {
          if (this.$_.isArray(error.data)) {
            this.$message({
              type: 'error',
              message: error.data[0].message
            });
          } else {
            this.$message({
              type: 'error',
              message: error.data.message
            });
          }
        });
    },
    // 获取详情
    getDetail() {
      this.$heshop
        .goods('get', parseInt(this.$route.query.id))
        .then(response => {
          response.video = response.video
            ? response.video
            : {
                type: 1
              };
          response.videoType = response.video.type;
          response.body.goods_args = response.body.goods_args ? response.body.goods_args : [];
          this.form = response;
        })
        .catch(error => {
          this.$message.error(error.data.message);
        });
    },
    firstVerify() {
      const { name, group, body, slideshow, is_video, video, videoType } = this.form;
      if (!name) {
        this.$message({
          type: 'error',
          message: '请输入商品名称'
        });
        return false;
      }
      if (this.$_.isEmpty(group)) {
        this.$message({
          type: 'error',
          message: '请选择商品分类'
        });
        return false;
      }
      let goods_args = body.goods_args;
      for (let i = 0; i < goods_args.length; i++) {
        if (!goods_args[i].name || !goods_args[i].value) {
          this.$message({
            type: 'error',
            message: '商品参数不能为空'
          });
          return false;
        }
      }
      if (this.$_.isEmpty(slideshow)) {
        this.$message({
          type: 'error',
          message: '请选择商品轮播图'
        });
        return false;
      }
      // 开启视频
      if (is_video === 1) {
        if (videoType === 1) {
          if (!video.url) {
            this.$message({
              type: 'error',
              message: '请选择主视频'
            });
            return false;
          }
        } else if (videoType === 2) {
          if (!video.url) {
            this.$message({
              type: 'error',
              message: '请输入主视频地址'
            });
            return false;
          } else {
            if (video.url.length > 100) {
              this.$message({
                type: 'error',
                message: '网络图片地址最多允许100字符'
              });
              return false;
            }
          }
        }
      }
      return true;
    },
    secondVerify() {
      const { param_type, param, stocks, unit, price } = this.form;
      if (param_type === 1) {
        if (!param.goods_data[0].param_value) {
          this.$message({
            type: 'error',
            message: '请输入商品规格值'
          });
          return false;
        }
        if (!param.goods_data[0].price || param.goods_data[0].price == 0) {
          this.$message({
            type: 'error',
            message: '请输入商品价格'
          });
          return false;
        }
      } else if (param_type === 2) {
        let error = [];
        error = this.$refs.addPrice.handleDataCheck();
        if (error.length > 0) {
          this.$message({
            type: 'error',
            message: error[0]
          });
          return false;
        }
      }
      if (!price || price == 0) {
        this.$message({
          type: 'error',
          message: '请输入商品价格'
        });
        return false;
      }
      if (!stocks && stocks != 0) {
        this.$message({
          type: 'error',
          message: '请输入商品库存'
        });
        return false;
      }
      if (!unit) {
        this.$message({
          type: 'error',
          message: '请输入商品单位'
        });
        return false;
      }
      return true;
    },
    thirdVerify() {
      const { ft_type, ft_price, ft_id, pfr_status, pfr_id } = this.form;
      if (ft_type === 1) {
        if (!ft_price) {
          this.$message({
            type: 'error',
            message: '请输入统一运费'
          });
          return false;
        }
      } else {
        if (!ft_id) {
          this.$message({
            type: 'error',
            message: '请选择运费模板'
          });
          return false;
        }
      }
      if (pfr_status) {
        if (!pfr_id) {
          this.$message({
            type: 'error',
            message: '请选择包邮规则'
          });
          return false;
        }
      }
      return true;
    },
    fourthVerify() {
      const { coupon } = this.form;
      console.log(coupon);
      for (let k in coupon) {
        if (coupon[k].number > coupon[k].info.over_num) {
          this.$message({
            type: 'error',
            message: '发放优惠券超出限制'
          });
          return false;
        }
      }
      return true;
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetail();
    }
  }
};
</script>

<style scoped lang="scss">
.le-tabs {
  margin-top: 24px;
}
</style>
