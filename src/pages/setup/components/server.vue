<template>
  <div>
    <el-form label-width="250px" :model="form" ref="ruleForm" :rules="rules" class="le-main">
      <div class="le-card">
        <div class="le-card--header flex align-center">
          <span class="le-sign"></span>
          <span>服务器设置</span>
        </div>
        <el-form-item label="小程序使用(新版微信支付功能)"> 请将以下信息填入微信小程序-开发管理-开发设置-消息推送。
          <a target="_blank" style="color:  #623ceb" @click="weappVisible = true">
            查看引导
          </a>
        </el-form-item>
        <el-form-item label="服务器地址(URL)">
          <div>{{ form.server }} <span style="color: #623ceb; cursor: pointer" @click="copy(form.server)"> 复制</span></div>
        </el-form-item>
        <el-form-item label="令牌(Token)">
          <div>{{ form.token }} <span style="color: #623ceb; cursor: pointer" @click="copy(form.token)"> 复制</span> <span style="color: #623ceb; cursor: pointer" @click="form.token = randomWord(32)"> 重置</span></div>
        </el-form-item>
        <el-form-item label="消息加解密密钥(EncodingAESKey)" prop="encodingAESKey">
          <div>{{ form.encodingAESKey }} <span style="color: #623ceb; cursor: pointer" @click="copy(form.encodingAESKey)"> 复制</span> <span style="color: #623ceb; cursor: pointer" @click="form.encodingAESKey = randomWord(43)"> 重置</span></div>
        </el-form-item>
      </div>
      <div class="le-cardpin">
        <el-button type="primary" @click="save()">保存</el-button>
      </div>
    </el-form>
    <el-dialog title="查看引导" :visible.sync="weappVisible" width="867px">
      <span style="padding-right: 10px">微信小程序-开发管理-开发设置-消息推送</span><a href="https://mp.weixin.qq.com/" target="_blank" class="text-button dialog-text">去设置</a>
      <img style="width: 800px;height: 350px; padding-top: 20px" src="./../../../assets/images/wxapp-server.png" alt="">
      <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="weappVisible = false" size="small">我知道了</el-button>
            </span>
    </el-dialog>
  </div>
</template>

<script>
import copy from '@/lib/function/copy.js';

export default {
  name: "server",
  data() {
    return {
      form: {},
      rules: {},
      loading: true,
      weappVisible: false
    }
  },
  mounted() {
    this.getSetting();
  },
  methods: {
    getSetting: function () {
      this.loading = true;
      this.$heshop
        .weappserver('get')
        .then(response => {
          this.form = response;
        });
      this.loading = false;
    },
    save: function () {
      this.loading = true;
      let _this = this;
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          _this.$heshop
            .setting('post', {
              keyword: 'weapp_server_setting',
              content: {
                token: _this.form.token,
                encodingAESKey: _this.form.encodingAESKey
              }
            })
            .then(() => {
              _this.loading = false;
              _this.$message.success('保存成功');
            })
            .catch(error => {
              _this.loading = false;
              _this.$message.error(error.data.message);
            });
        } else {
          this.loading = false;
        }
      });
    },
    copy: function (content) {
      let _this = this;
      copy({
        content: content,
        success: function () {
          console.log(_this)
          _this.$message.success('复制成功');
        }
      });
    },
    randomWord(length) {
      console.log(length)
      var str = "",
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      var pos = ''
      for (var i = 0; i < length; i++) {
        pos = Math.round(Math.random() * (arr.length - 1));
        str += arr[pos];
      }
      return str;
    },
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
</style>
