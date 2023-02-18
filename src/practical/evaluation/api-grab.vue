<template>
  <el-form label-width="190px" @submit.native.prevent class="le-main" ref="form" :model="form" :rules="rules">
    <div class="le-card">支持商品评价采集的平台：淘宝、天猫、京东</div>
    <div class="le-card flex">
      <img class="le-img" :src="good.image"/>
      <div>
        <div class="le-name">
          {{ good.name }}
        </div>
        <div class="flex align-center"  style="margin-left: 20px">
          <div class="le-group" v-if="good.group">{{good.group}}</div>
          <el-button plain class="le-select-group" @click="showChooseSpecifications = true">选择规格</el-button>
        </div>
      </div>
    </div>
    <div class="le-card">
      <div class="le-card--header flex align-center">
        <span class="le-sign"></span>
        <span>基础信息</span>
      </div>
      <el-form-item label="评价数" prop="num">
        <el-input class="le-input--180"  v-model.number="form.num">
          <template slot="append">条</template>
        </el-input>
        <div class="le-prompt-text">建议单次采集不超过50条，否则可能导致采集失败</div>
      </el-form-item>
      <el-form-item label="评价时间范围" prop="time">
        <el-date-picker
          v-model="form.time"
          type="datetimerange"
          value-format="timestamp"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="评价状态">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">显示</el-radio>
          <el-radio :label="0">隐藏</el-radio>
          <el-radio :label="2">置顶</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <div class="le-card">
      <div class="le-card--header flex align-center">
        <span class="le-sign"></span>
        <span>用户信息</span>
      </div>
      <el-form-item label="头像来源" prop="gallery_group_id">
        <el-tag
          type="info"
          size="medium"
          effect="plain"
          v-if="material"
          @close="() => {
            this.material = null;
            this.form.gallery_group_id = null
          }"
          closable>{{ material.name }}
        </el-tag>
        <el-button plain @click="showChooseMaterial = true">选择素材组</el-button>
      </el-form-item>
    </div>
    <div class="le-card">
      <div class="le-card--header flex align-center">
        <span class="le-sign"></span>
        <span>评价信息</span>
      </div>

      <el-form-item label="平台来源">
        <div class="flex">
          <div class="le-platform-item flex align-center">
            <img src="./images/taobao.png" width="28" height="28" alt=""/>
            <div>淘宝</div>
          </div>
          <div class="le-platform-item flex align-center">
            <img src="./images/tianmao.png" width="28" height="28" alt=""/>
            <div>天猫</div>
          </div>
          <div class="le-platform-item flex align-center">
            <img src="./images/jd.png" width="28" height="28" alt=""/>
            <div>京东</div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="商品链接" prop="link">
        <el-input
          placeholder="请输入商品链接"
          resize="none"
          :rows="10"
          v-model="form.link"
          style="width: 600px"
          type="textarea"
        ></el-input>
        <div class="le-prompt-text">
          仅支持采集一条链接，天猫渠道API仅支持按默认顺序逐条抓取评价，不支持自定义条件抓取
        </div>
      </el-form-item>
      <el-form-item label="抓取内容">
        <el-radio-group v-model="form.type">
          <el-radio style="display: block;margin-top: 10px" :label="1">逐条抓取评价</el-radio>
          <div style="margin-bottom: 20px" class="le-prompt-text">
            系统将以展示的默认评价顺序逐条抓取评价文字和对应的图片内容；评价内的视频将自动过滤不抓取
          </div>
          <el-radio style="display: block" :label="2">仅抓取好评</el-radio>
          <div style="margin-bottom: 20px" class="le-prompt-text">
            系统将以展示的默认评价顺序逐条抓取好评；评价内的视频内容将自动过滤不获取
          </div>
          <el-radio style="display: block" :label="3">仅抓取带图评价</el-radio>
          <div class="le-prompt-text">
            如果可抓取的带图评价数量低于设置的抓取数量，将自动抓取无图评价内容；评价内的视频内容将自动过滤不获取
          </div>
        </el-radio-group>
      </el-form-item>
    </div>
    <div class="le-cardpin">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
    <he-loading :show="load" title="正在抓取中，请稍后..."></he-loading>
    <choose-specifications
      v-if="showChooseSpecifications"
      v-model="showChooseSpecifications"
      :info="good"
      @confirm="specifi "
    ></choose-specifications>
    <choose-material v-if="showChooseMaterial" @confirm="(mater) => {
      this.material = mater;
      this.form.gallery_group_id = mater.id;
      this.$refs.form.validateField('gallery_group_id')
    }" v-model="showChooseMaterial"></choose-material>
    <fetched-success @confirm="empty" v-model="showFetchedSuccess" :info="fetchedSuccessInfo"></fetched-success>
  </el-form>
</template>

<script>
import heLoading from '../../components/heloading2.vue';
import ChooseSpecifications from "./components/choose-specifications.vue";
import fetchedSuccess from "./components/fetched-success.vue";
import ChooseMaterial from "./../../components/choose-material/index.vue";

export default {
  name: 'api-grab',
  components: {heLoading, ChooseSpecifications, fetchedSuccess, ChooseMaterial},
  data() {
    const checkNum = (rule, value, callback) => {
      if (isNaN(Number(value))) {
        callback("请输入整数")
      }
      if (Number(value) < 0) {
        callback('请输入0以上的整数')
      }
      callback();
    }
    return {
      good: {},
      form: {
        num: 0,
        time: null,
        status: 1,
        link: '',
        type: 1,
        gallery_group_id: null,
      },
      rules: {
        num: [
          {
            required: true,
            message: '评价数不能为空'
          },
          { validator: checkNum, trigger: ['blur', 'change'] }
        ],
        time: [
          {
            required: true,
            message: "时间不能为空"
          }
        ],
        link: [
          {
            required: true,
            message: '请输入商品链接'
          }
        ],
        gallery_group_id: [
          {
            required: true,
            message: '请选择头像来源'
          }
        ],
      },
      load: false,
      showChooseSpecifications: false,
      showFetchedSuccess: false,
      fetchedSuccessInfo: {},
      showChooseMaterial: false,
      material: null,
    };
  },
  mounted() {
    try {
      this.good = JSON.parse(decodeURIComponent(this.$route.query.good));
    } catch (err) {
      this.$router.back();
    }
  },
  methods: {
    submit() {
      if (!this.good.group) {
        this.$message({
          type: "error",
          message: "商品规格不能为空"
        });
        return;
      }
      this.$refs.form.validate(value => {
        if (value) {
          this.load = true;
          let form = this.$_.cloneDeep(this.form);
          if (form.time && form.time.length > 0) {
            form.begin = form.time[0] / 1000;
            form.end = form.time[1] / 1000;
          }
          this.$heshop
            .plugin(
              'post',
              {
                include: 'evaluate',
                model: 'evaluate',
                behavior: 'api'
              },
              {
                id: this.good.id,
                show_goods_param: this.good.group,
                ...form
              }
            )
            .then((response) => {
              this.fetchedSuccessInfo = {
                slideshow: this.good.image,
                goods_id: this.good.goods_id,
                name: this.good.name,
                type: "api",
                number: response
              }
              this.showFetchedSuccess = true;
            }).catch((err) => {
              this.$message({
                type: "error",
                message: err.data.message
              })
          }).finally(() => {
              this.load = false;
            });
        }
      });
    },
    empty() {
      this.form = {
        num: 0,
        time: null,
        status: 1,
        link: '',
        type: 1
      }
      this.repository = null;
      this.good.group = null;
    },
    specifi(group) {
      this.good.group = group;
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.le-card {
  &:first-child {
    background: #fff5d1;
    border-radius: 8px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    height: 40px;
    padding-top: 0;
    padding-bottom: 0;
    padding-left: 15px;
    line-height: 40px;
  }

  .le-img {
    width: 48px;
    height: 48px;
  }

  .le-name {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
    margin-left: 20px;
  }

  .le-select-group {
    height: 28px;
    width: 70px;
    padding: 6px 0 !important;
    margin-top: 4px;

    font-size: 12px;
    //line-height: 26px;
  }

  .le-group {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #8C8C8C;
    line-height: 18px;
    margin-right: 10px;
  }
  &:not(:last-child) {
    margin-bottom: 24px;
  }

  .le-platform-item {
    width: 92px;
    height: 44px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-right: 8px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #595959;
    line-height: 22px;

    > img {
      margin: 0 8px 0 12px;
    }
  }
}
.el-tag--medium {
  height: 33px;
  line-height: 31px;
  margin-right: 15px;
}
</style>
