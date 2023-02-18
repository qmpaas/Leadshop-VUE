<template>
  <el-form label-width="200px" :model="form" ref="ruleForm" :rules="rules" class="le-main">
    <div class="le-card">
      <div class="le-card--header flex align-center">
        <span class="le-sign"></span>
        <span>采集接口</span>
      </div>
      <el-form-item label="接口来源"> 99api</el-form-item>
      <el-form-item label="接口购买地址">
        <a target="_blank" style="color:  #623ceb" href="https://www.99api.com/Login?log=5&referee=2262"
        >https://www.99api.com/Login?log=5&referee=2262</a
        >
        <div class="he-tips">使用此链接注册99api账号，接口将自动开通</div>
      </el-form-item>
      <el-form-item label="99api apikey" prop="apikey_99">
        <el-input placeholder="请输入99api  apikey" v-model="form.apikey_99"></el-input>
        <div class="he-tips">用于商品采集和评价助手</div>
      </el-form-item>
    </div>
    <div class="le-cardpin">
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "interface",
  data() {
    return {
      form: {
        apikey_99: ''
      },
      rules: {
        apikey_99: [{required: true, message: '请填写apikey', trigger: 'blur'}]
      },
      loading: true
    }
  },
  mounted() {
    this.getDetail();
  },
  methods: {
    getDetail: function () {
      let _this = this;
      this.$heshop
        .search(
          'post',
          {include: 'setting'},
          {
            keyword: 'apikey_99'
          }
        )
        .then(function (response) {
          _this.form = response.content;
        });
      _this.loading = false;
    },
    save: function () {
      this.loading = true;
      let _this = this;
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          _this.$heshop
            .setting('post', {
              keyword: 'apikey_99',
              content: {
                apikey_99: _this.form.apikey_99
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
