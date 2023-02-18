<template>
  <el-form label-width="190px" @submit.native.prevent class="le-main" ref="form" :model="form" :rules="rules">
    <div class="le-card flex">
      <img class="le-img" :src="good.image"/>
      <div>
        <div class="le-name">
          {{ good.name }}
        </div>
        <div class="flex align-center" style="margin-left: 20px">
          <div class="le-group" v-if="good.group">{{ good.group }}</div>
          <el-button plain class="le-select-group" @click="showChooseSpecifications = true">选择规格</el-button>
        </div>
      </div>
    </div>
    <div class="le-card">
      <div class="le-card--header flex align-center">
        <span class="le-sign"></span>
        <span>基础信息</span>
      </div>
      <el-form-item label="选择评价库" prop="repository_id">
        <el-tag
          type="info"
          size="medium"
          effect="plain"
          v-if="repository"
          @close="() => {
            this.repository = null;
            this.form.repository_id = null
          }"
          closable>{{ repository.name }}
        </el-tag>
        <el-button plain @click="showChooseLibrary = true">选择评价库</el-button>
        <div class="le-count le-prompt-text" v-if="repository">共{{repository.count}}条评价</div>
      </el-form-item>
      <el-form-item label="评价数" prop="num">
        <el-input class="le-input--180" v-model.number="form.num">
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
      <el-form-item label="用户昵称">
        自动生成虚拟昵称
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
      @confirm="(group) => good.group = group "
      :group="good.group"
    ></choose-specifications>
    <choose-library @confirm="(group) => {
      this.repository = group;
      this.form.repository_id = group.id
      this.$refs.form.validateField('repository_id')
    }" v-if="showChooseLibrary" v-model="showChooseLibrary"></choose-library>
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
import ChooseLibrary from "./components/choose-library.vue";
import ChooseMaterial from "./../../components/choose-material/index.vue";
import fetchedSuccess from "./components/fetched-success.vue";

export default {
  name: 'library-grab',
  components: {heLoading, ChooseSpecifications, ChooseLibrary, ChooseMaterial, fetchedSuccess},
  data() {
    const checkNum = (rule, value, callback) => {
      if (this.repository) {
        if (Number(value) > this.repository.count) {
          callback("评价不能超过评论库的总数" + this.repository.count);
        }
      }
      if (isNaN(Number(value))) {
        callback("请输入整数")
      }
      if (Number(value) < 0) {
        callback('请输入0以上的整数')
      }
      callback();
    }
    return {
      good: {
        image: ""
      },
      form: {
        num: 0,
        time: null,
        status: 1,
        gallery_group_id: null,
        repository_id: null
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
            message: "时间不能为空",
          }
        ],
        gallery_group_id: [
          {
            required: true,
            message: '请选择头像来源'
          }
        ],
        repository_id: [
          {
            required: true,
            message: '请选择评价库'
          }
        ]
      },
      load: false,
      showChooseSpecifications: false,
      showChooseLibrary: false,
      repository: null,
      showChooseMaterial: false,
      material: null,
      showFetchedSuccess: false,
      fetchedSuccessInfo: {}
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
                behavior: 'repository'
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
                type: "repository",
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
      this.material = null;
      this.good.group = null;
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.le-card {

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

  .el-tag--medium {
    height: 33px;
    line-height: 31px;
    margin-right: 15px;
  }
}

.le-count {

}
</style>
