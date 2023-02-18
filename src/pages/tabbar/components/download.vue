<template>
  <el-dialog width="532px" :visible.sync="newVal" custom-class="le-download">
    <div class="">
      <div class="le-name">保存成功！如需生效请下载小程序包并上传审核。</div>
      <div>
        <span class="le-title">是否已开通小程序直播</span>
        <el-radio-group v-model="enable_live">
          <el-radio :label="0">未开通</el-radio>
          <el-radio :label="1">已开通</el-radio>
        </el-radio-group>
      </div>
      <div class="le-prompt-text">
        请谨慎选择是否有开通小程序直播功能，否则将影响小程序的发布审核<br />
        可前往 <span class="le-prompt">微信公众号平台>小程序>功能>直播</span>
        开通直播功能
      </div>
      <el-button class="le-btn" type="primary" @click="download">下载</el-button>
    </div>
  </el-dialog>
</template>
<script>
import fileDownload from 'js-file-download';

export default {
  name: 'download',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    newVal: {
      get: function () {
        return this.value;
      },
      set: function (val) {
        this.$emit('input', val);
      }
    }
  },
  data() {
    return {
      enable_live: 0
    };
  },
  methods: {
    download() {
      this.$heshop
        .download({
          enable_live: this.enable_live
        })
        .then(res => {
          //如何监听下载完成？
          fileDownload(res, 'wxapp.zip');
          this.newVal = false;
        })
        .catch(err => {
          console.error(err);
        });
    }
  }
};
</script>
<style lang="less" scoped>
.le-name {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.85);
  line-height: 20px;
  text-align: center;
  margin-bottom: 28px;
}

.le-title {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  margin: 0 32px 0 30px;
}

.le-prompt {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #595959;
}

.le-btn {
  margin: 0 auto;
  display: block;
  margin-top: 34px;
  margin-bottom: 20px;
}
</style>
<style lang="scss">
.le-download {
  .el-dialog__header {
    padding: 40px 0 0 0;
  }
}
</style>
