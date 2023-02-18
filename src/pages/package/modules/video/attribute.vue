<template>
  <control title="视频" :is_tab="false">
    <el-form ref="form" :model="facade" @submit.native.prevent label-width="90px" size="mini" label-position="left">
      <el-form-item label="视频来源">
        <el-radio-group class="le-radio-group" v-model="content.source" @change="emptyVideo()">
          <el-radio :label="0">素材库</el-radio>
          <el-radio :label="1">网络</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="视频地址" v-if="content.source == 1">
        <el-input placeholder="复制视频地址到这里" v-model="content.video.url"></el-input>
        <p class="tips">支持视频源地址和腾讯视频平台的网络视频</p>
      </el-form-item>
      <el-form-item label="视频上传" v-else>
        <div class="select-cover__120">
          <videoDialog v-model="content.video">
            <div slot="upload" class="select-cover__120-add">
              <i class="le-icon le-icon-add select-cover__120-icon"></i>
              <span class="select-cover__120-text">添加视频</span>
            </div>
            <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
              <el-image :src="scope.url.cover || ''" fit="cover">
                <div slot="error" class="image-slot">
                  <i class="le-icon le-icon-morentupian"></i>
                </div>
              </el-image>
              <div class="select-cover__120-tips">替换视频</div>
            </div>
          </videoDialog>
        </div>
        <p class="tips">视频大小不超过 100 MB，建议时长在5分钟以内，宽高比 16:9</p>
      </el-form-item>
      <el-form-item label="视频封面">
        <div class="select-cover__120">
          <pictureDialog v-model="content.cover">
            <div slot="upload" class="select-cover__120-add">
              <i class="le-icon le-icon-add select-cover__120-icon"></i>
              <span class="select-cover__120-text">添加图片</span>
            </div>
            <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
              <el-image :src="scope.url" fit="cover"></el-image>
              <div class="select-cover__120-tips">替换封面</div>
            </div>
          </pictureDialog>
        </div>
        <p class="tips">大小不超过3M，建议宽高比 16:9</p>
      </el-form-item>
      <el-form-item label="自动播放">
        <el-switch v-model="content.autoplay"></el-switch>
        <span class="tips"> 默认静音播放</span>
      </el-form-item>
      <el-form-item label="循环播放">
        <el-switch v-model="content.loop"></el-switch>
      </el-form-item>
    </el-form>
  </control>
</template>
<script type="text/javascript">
import control from '@/components/control.vue';

export default {
  components: {
    control
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
  methods: {
    emptyVideo: function () {
      this.content.video = {};
    }
  }
};
</script>

<style lang="less" scoped>
@import '../attribute.less';
</style>
