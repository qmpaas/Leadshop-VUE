<template>
  <control title="公告" :is_tab="false">
    <el-form ref="form" :model="content" @submit.native.prevent label-width="90px" size="mini" label-position="left">
      <div class="control-item-title">文字设置</div>
      <el-form-item label="文字内容">
        <el-input type="text" @keyup.native.enter placeholder="请输入文字内容" v-model="content.title"> </el-input>
      </el-form-item>
      <el-divider></el-divider>
      <div class="control-item-title">颜色设置</div>
      <el-form-item label="文字颜色">
        <colour v-model="facade.title_color" colour="#f58e20"></colour>
      </el-form-item>
      <el-form-item label="背景颜色">
        <colour v-model="facade.background_color" colour="#fff5e1"></colour>
      </el-form-item>
      <el-divider></el-divider>
      <div class="control-item-title">速度设置</div>
      <el-form-item label="轮播速度">
        <el-radio-group class="le-radio-group" v-model="facade.speed">
          <el-radio :label="80">标准速</el-radio>
          <el-radio :label="40">中速</el-radio>
          <el-radio :label="20">低速</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-divider></el-divider>
      <div class="control-item-title">图标设置</div>
      <el-form-item label="公告图标">
        <div class="select-cover__60">
          <pictureDialog v-model="content.icon">
            <div slot="upload" class="select-cover__60-add">
              <i class="le-icon le-icon-add select-cover__60-icon"></i>
            </div>
            <div
              slot="preview"
              slot-scope="scope"
              class="select-cover__60-edit"
              style="border: 1px solid #dcdfe6; border-radius: 4px"
            >
              <el-image :src="content.icon" fit="cover"></el-image>
              <div class="select-cover__60-tips">替换</div>
            </div>
          </pictureDialog>
        </div>
        <p class="tips">建议尺寸：80px*80px <span @click="resetIcon" class="resetBtn">恢复默认</span></p>
      </el-form-item>
    </el-form>
  </control>
</template>
<script type="text/javascript">
import control from '@/components/control.vue';
import colour from '@/components/colour.vue';
export default {
  components: {
    control,
    colour
  },
  data() {
    return {};
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    content: {
      get() {
        return this.$store.getters.content;
      },
      set(value) {
        let data = {
          key: 'content',
          value: value
        };
        this.$store.commit('finish/setAttribute', data);
      }
    },
    facade: {
      get() {
        return this.$store.getters.facade;
      },
      set(value) {
        let data = {
          key: 'facade',
          value: value
        };
        this.$store.commit('finish/setAttribute', data);
      }
    }
  },
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
    resetIcon() {
      this.content.icon = 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/pageicon/notice-img.png';
    }
  }
};
</script>
<style lang="less" scoped>
@import '../attribute.less';

.resetBtn {
  padding-left: 7px;
  font-size: 12px;
  font-weight: 400;
  color: #623ceb;
  cursor: pointer;
}
</style>
