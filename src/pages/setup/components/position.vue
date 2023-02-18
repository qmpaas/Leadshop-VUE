<template>
  <el-form label-width="200px" :model="form" ref="ruleForm" class="le-main">
    <div class="le-card">
      <div class="le-card--header flex align-center">
        <span class="le-sign"></span>
        <span>定位服务</span>
      </div>
      <el-form-item label="开发者秘钥(key)">
        <el-input v-model="form.tencent_key"></el-input>
        <div class="he-tips">
          使用腾讯定位服务，商品详情页预估运费根据定位地址计算。
          <span class="le-copy">
              <a
                href="https://lbs.qq.com/miniProgram/jsSdk/jsSdkGuide/jsSdkOverview"
                style="color: inherit"
                target="_blank"
              >申请秘钥</a
              ></span
          >
        </div>
      </el-form-item>
    </div>
    <div class="le-cardpin">
      <el-button type="primary" @click="save()">保存</el-button>
    </div>
  </el-form>
</template>

<script>
export default {
  name: "position",
  data() {
    return {
      form: {
        tencent_key: ''
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
            keyword: 'setting_collection',
            content_key: "location_setting"
          }
        )
        .then(function (response) {
          _this.form = response;
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
              keyword: 'setting_collection',
              content: {
                location_setting: {
                  tencent_key: _this.form.tencent_key
                }
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

.le-copy {
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #623ceb;
  padding: 0 9px !important;
  cursor: pointer;
}
</style>
