<template>
  <el-form label-width="200px" :model="form" ref="ruleForm" class="le-main">
    <div class="le-card">
      <div class="le-card--header flex align-center">
        <span class="le-sign"></span>
        <span>定时任务</span>
      </div>
      <el-form-item label="定时任务">
        <el-input disabled :value="form.crontab"></el-input>
        <span @click="copy(form.crontab)" class="le-copy">复制链接</span>
        <div class="he-tips">
          请将定时任务链接，配置到服务器。
          <span class="le-copy">
              <a href="https://help.leadshop.vip/3045042" style="color: inherit" target="_blank"
              >查看配置教程</a
              ></span
          >
        </div>
      </el-form-item>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "timing",
  data() {
    return {
      form: {
        crontab: ''
      },
      loading: true
    }
  },
  mounted() {
    this.getCrontab();
  },
  methods: {
    getCrontab: function () {
      let _this = this;
      this.$heshop
        .crontab('post')
        .then(function (response) {
          _this.form.crontab = response;
        })
        .catch(function () {});
    },
    copy: function (content) {
      var copyDom = document.createElement('div');
      copyDom.innerText = content;
      copyDom.style.position = 'absolute';
      copyDom.style.top = '0px';
      copyDom.style.right = '-9999px';
      document.body.appendChild(copyDom);
      //创建选中范围
      let range = document.createRange();
      range.selectNode(copyDom);
      //移除剪切板中内容
      window.getSelection().removeAllRanges();
      //添加新的内容到剪切板
      window.getSelection().addRange(range);
      //复制
      let successful = document.execCommand('copy');
      copyDom.parentNode.removeChild(copyDom);
      this.$message.success('复制成功');
    }
  },
}
</script>

<style scoped lang="less">
.le-card--header {
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  margin-bottom: 24px;

  .le-sign {
    display: inline-block;
    width: 4px;
    height: 16px;
    background: #623ceb;
    margin-right: 12px;
  }
}

.le-copy {
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #623ceb;
  padding: 0 9px !important;
  cursor: pointer;
}
</style>
