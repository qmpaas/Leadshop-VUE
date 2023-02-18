<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-06-11 17:49:08
 * @LastEditTime: 2021-06-11 17:49:19
 * @LastEditors: fjt
-->
<script>
import { createNamespacedHelpers } from 'vuex';
const { mapMutations } = createNamespacedHelpers('setting');
export default {
  data() {
    const checkPic = (rule, value, callback) => {
      if (!this.form.is_pic_limit) {
        if (!value) {
          callback('请输入图片大小限制');
        }
      }
      callback();
    };
    const checkVideo = (rule, value, callback) => {
      if (!this.form.is_video_limit) {
        if (!value) {
          callback('请输入视频大小限制');
        }
      }
      callback();
    };
    return {
      loading: true,
      submitLoading: false,
      form: {
        is_pic_limit: false,
        pic_limit: 2,
        is_video_limit: false,
        video_limit: 5
      },
      rules: {
        pic_limit: [
          {
            required: true,
            validator: checkPic
          }
        ],
        video_limit: [
          {
            required: true,
            validator: checkVideo
          }
        ]
      }
    };
  },
  render() {
    let self = this;
    return (
      <div class="le-main">
        <el-form
          class="le-card"
          ref="ruleForm"
          props={{
            model: this.form,
            rules: this.rules,
            labelWidth: '190px'
          }}
          v-loading={this.loading || this.submitLoading}>
          <div class="le-prompt">
            温馨提示：为了保障服务器性能及用户体验，请谨慎填写限制！此处的限制需要与服务器的限制相匹配，否则将无法生效。
          </div>
          <el-form-item label="图片大小限制" prop="pic_limit">
            <el-radio-group
              v-model={this.form.is_pic_limit}
              on={{
                change: function (bool) {
                  if (bool) self.form.pic_limit = null;
                }
              }}>
              <el-radio label={false}>限制</el-radio>
              <el-radio label={true}>无限制</el-radio>
            </el-radio-group>
            <div class="le-form-input">
              <el-input
                maxlength={10}
                on={{
                  input: function (val) {
                    val = val.replace(/\D|^0/g, '');
                    self.form.pic_limit = val;
                  }
                }}
                value={this.form.pic_limit}
                disabled={this.form.is_pic_limit}>
                <template slot="append">MB</template>
              </el-input>
            </div>
          </el-form-item>
          <el-form-item label="视频大小限制" prop="video_limit">
            <el-radio-group
              v-model={this.form.is_video_limit}
              on={{
                change: function (bool) {
                  if (bool) self.form.video_limit = null;
                }
              }}>
              <el-radio label={false}>限制</el-radio>
              <el-radio label={true}>无限制</el-radio>
            </el-radio-group>
            <div class="le-form-input">
              <el-input
                maxlength={10}
                on={{
                  input: function (val) {
                    val = val.replace(/\D|^0/g, '');
                    self.form.video_limit = val;
                  }
                }}
                value={this.form.video_limit}
                disabled={this.form.is_video_limit}>
                <template slot="append">MB</template>
              </el-input>
            </div>
          </el-form-item>
        </el-form>
        <div class="le-cardpin">
          <el-button type="primary" disabled={this.loading} loading={this.submitLoading} onClick={this.submit}>
            保存
          </el-button>
        </div>
      </div>
    );
  },
  mounted() {
    this.getSetting();
  },
  methods: {
    ...mapMutations(['setStorage']),
    submit: function () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let data = JSON.parse(JSON.stringify(this.form));
          if (data.is_pic_limit) {
            data.pic_limit = -1;
          }
          if (data.is_video_limit) {
            data.video_limit = -1;
          }
          data.pic_limit = Number(data.pic_limit);
          data.video_limit = Number(data.video_limit);
          delete data.is_pic_limit;
          delete data.is_video_limit;
          this.submitLoading = true;
          this.$heshop
            .setting('post', {
              keyword: 'storage_limit',
              content: data
            })
            .then(() => {
              this.submitLoading = false;
              this.setStorage(data);
              this.$message.success('保存成功');
            })
            .catch(err => {
              this.submitLoading = false;
              this.$message.error(err.data.message);
            });
        } else {
          return false;
        }
      });
    },
    getSetting: function () {
      this.$heshop
        .search(
          'post',
          {
            include: 'setting'
          },
          {
            keyword: 'storage_limit'
          }
        )
        .then(response => {
          let { pic_limit, video_limit } = response.content;
          if (pic_limit === -1) {
            this.form.is_pic_limit = true;
          } else {
            this.form.pic_limit = pic_limit;
          }
          if (video_limit === -1) {
            this.form.is_video_limit = true;
          } else {
            this.form.video_limit = video_limit;
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.data.message);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.le-card {
  min-height: 293px;
  background: #ffffff;
  border-radius: 16px;
  padding: 24px;
}

.le-prompt {
  background: #fff5d1;
  border-radius: 8px;
  padding: 15px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  margin-bottom: 40px;
}

.le-form-input {
  margin-top: 15px;

  .el-input {
    width: 220px;
  }
}
</style>
