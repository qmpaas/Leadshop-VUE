<!--
 * @Description:
 * @Author: fjt
 * @Date: 2021-05-25 09:50:26
 * @LastEditTime: 2021-05-25 11:16:57
 * @LastEditors: fjt
-->

<template>
  <div class="le-matter">
    <el-form :model="form" label-width="193px" ref="ruleForm" :rules="rules" status-icon v-loading="loading">
      <div class="le-card">
        <div class="flex align-center">
          <span class="he-title-line"></span>
          <span class="he-title">商品采集</span>
        </div>
        <div class="le-line"></div>
        <div class="le-line"></div>
        <el-form-item label="接口来源">
          <span class="le-source">99api</span>
        </el-form-item>
        <el-form-item label="接口购买地址">
          <a target="_blank" class="le-a" href="https://www.99api.com/Login?log=5&referee=14278"
            >https://www.99api.com/Login?log=5&referee=14278</a
          >
          <div class="le-prompt-text">使用此链接注册99api账号，接口将自动开通</div>
        </el-form-item>
        <el-form-item label="99api  apikey" prop="apikey_99">
          <el-input placeholder="请输入99api  apikey" v-model="form.apikey_99"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="le-cardpin">
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        apikey_99: ''
      },
      rules: {
        apikey_99: [{ required: true, message: '请填写apikey', trigger: 'blur' }]
      },
      loading: true
    };
  },
  methods: {
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
    getDetail: function () {
      let _this = this;
      this.$heshop
        .search(
          'post',
          { include: 'setting' },
          {
            keyword: 'apikey_99'
          }
        )
        .then(function (response) {
          _this.form = response.content;
        });
      _this.loading = false;
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.le-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}
.he-title-line {
  width: 4px;
  height: 16px;
  background: #623ceb;
  display: inline-block;
}
.he-title {
  font-size: 16px;
  font-weight: 400;
  color: #262626;
  margin-left: 12px;
}
.le-source {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  line-height: 19px;
}
.le-a {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #623ceb;
}
</style>
