<script>
import { createNamespacedHelpers } from 'vuex';
import customCopyright from './../../image/custom-copyright.png';

const { mapGetters } = createNamespacedHelpers('setting');

export default {
  data() {
    return {
      loading: true,
      submitLoading: false,
      form: {
        login_img: '',
        brand_name: '',
        admin_copyright_content: '',
        admin_copyright_icon: '',
        admin_copyright_link: '',
        mobile_copyright_content: '',
        mobile_copyright_icon: ''
      },
      rules: {
        admin_copyright_content: [
          {
            required: true,
            message: '版权内容不能为空',
            trigger: 'blur'
          }
        ],
        mobile_copyright_content: [
          {
            required: true,
            message: '版权内容不能为空',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters({
      auth: 'getAuth'
    })
  },
  render() {
    return (
      <div>
        {(() => {
          if (!this.auth) {
            return (
              <div style="position: relative;margin-bottom: 24px">
                <img src={customCopyright} width="100%" height="296" alt="" />
                <div class="le-buy-copyright flex flex-direction align-center">
                  <span>Leadshop微商城授权 - 自定义版权</span>
                  <el-button
                    onClick={() => {
                      window.open('https://www.leadshop.vip/goods/author');
                    }}
                    type="primary">
                    购买授权
                  </el-button>
                </div>
              </div>
            );
          }
        })()}
        <el-form
          label-width="200px"
          props={{
            rules: this.rules,
            model: this.form
          }}
          v-loading={this.loading}>
          <div class="le-card">
            <div class="le-head flex align-center">
              <span class="le-title-line" />
              <span class="le-title">背景图</span>
            </div>
            <el-form-item label="登录页背景图">
              <div class="select-cover__120">
                <pictureDialog
                  limit={1}
                  v-model={this.form.login_img}
                  disabled={!this.auth}
                  scopedSlots={{
                    upload: () => {
                      return (
                        <div class="select-cover__120-add">
                          <i class="le-icon le-icon-add select-cover__120-icon" />
                          <span class="select-cover__120-text">添加图片</span>
                        </div>
                      );
                    },
                    preview: scope => {
                      return (
                        <div class="select-cover__120-edit">
                          <el-image src={scope.url} fit="cover" />
                          {(() => {
                            if (this.auth) {
                              return (
                                <div class="select-cover__120-tips">
                                  <span>替换</span> |
                                  <span
                                    onClick={() => {
                                      event.stopPropagation();
                                      this.form.login_img = '';
                                    }}>
                                    删除
                                  </span>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      );
                    }
                  }}
                />
              </div>
              <div class="le-prompt-text">建议尺寸：400像素*512像素</div>
            </el-form-item>
            <el-form-item label="品牌名">
              <div class="select-cover__120">
                <pictureDialog
                  limit={1}
                  v-model={this.form.brand_name}
                  disabled={!this.auth}
                  scopedSlots={{
                    upload: () => {
                      return (
                        <div class="select-cover__120-add">
                          <i class="le-icon le-icon-add select-cover__120-icon" />
                          <span class="select-cover__120-text">添加图片</span>
                        </div>
                      );
                    },
                    preview: scope => {
                      return (
                        <div class="select-cover__120-edit">
                          <el-image src={scope.url} fit="cover" />
                          {(() => {
                            if (this.auth) {
                              return (
                                <div class="select-cover__120-tips">
                                  <span>替换</span> |
                                  <span
                                    onClick={() => {
                                      event.stopPropagation();
                                      this.form.brand_name = '';
                                    }}>
                                    删除
                                  </span>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      );
                    }
                  }}
                />
              </div>
              <div class="le-prompt-text">建议尺寸：260像素*64像素</div>
            </el-form-item>
          </div>
          <div class="le-card">
            <div class="le-head flex align-center">
              <span class="le-title-line" />
              <span class="le-title">后台版权</span>
            </div>
            <el-form-item label="版权内容" key="admin_copyright_content" prop="admin_copyright_content">
              <el-input
                disabled={!this.auth}
                v-model={this.form.admin_copyright_content}
                placeholder="请输入版权内容"
              />
            </el-form-item>
            <el-form-item label="版权图标">
              <div class="select-cover__120">
                <pictureDialog
                  limit={1}
                  v-model={this.form.admin_copyright_icon}
                  disabled={!this.auth}
                  scopedSlots={{
                    upload: () => {
                      return (
                        <div class="select-cover__120-add">
                          <i class="le-icon le-icon-add select-cover__120-icon" />
                          <span class="select-cover__120-text">添加图片</span>
                        </div>
                      );
                    },
                    preview: scope => {
                      return (
                        <div class="select-cover__120-edit">
                          <el-image src={scope.url} fit="cover" />
                          {(() => {
                            if (this.auth) {
                              return (
                                <div class="select-cover__120-tips">
                                  <span>替换</span> |
                                  <span
                                    onClick={() => {
                                      event.stopPropagation();
                                      this.form.admin_copyright_icon = '';
                                    }}>
                                    删除
                                  </span>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      );
                    }
                  }}
                />
              </div>
              <div class="le-prompt-text">建议尺寸：240像素*48像素，不超过2M</div>
            </el-form-item>
            <el-form-item label="版权跳转链接">
              <el-input
                disabled={!this.auth}
                v-model={this.form.admin_copyright_link}
                placeholder="请输入版权跳转链接"
              />
            </el-form-item>
          </div>
          <div class="le-card">
            <div class="le-head flex align-center">
              <span class="le-title-line" />
              <span class="le-title">手机端版权</span>
            </div>
            <el-form-item label="版权内容" key="mobile_copyright_content" prop="mobile_copyright_content">
              <el-input
                disabled={!this.auth}
                v-model={this.form.mobile_copyright_content}
                placeholder="请输入版权内容"
              />
            </el-form-item>
            <el-form-item label="版权图标">
              <div class="select-cover__120">
                <pictureDialog
                  disabled={!this.auth}
                  limit={1}
                  v-model={this.form.mobile_copyright_icon}
                  scopedSlots={{
                    upload: () => {
                      return (
                        <div class="select-cover__120-add">
                          <i class="le-icon le-icon-add select-cover__120-icon" />
                          <span class="select-cover__120-text">添加图片</span>
                        </div>
                      );
                    },
                    preview: scope => {
                      return (
                        <div class="select-cover__120-edit">
                          <el-image src={scope.url} fit="cover" />
                          {(() => {
                            if (this.auth) {
                              return (
                                <div class="select-cover__120-tips">
                                  <span>替换</span> |
                                  <span
                                    onClick={() => {
                                      event.stopPropagation();
                                      this.form.mobile_copyright_icon = '';
                                    }}>
                                    删除
                                  </span>
                                </div>
                              );
                            }
                          })()}
                        </div>
                      );
                    }
                  }}
                />
              </div>
              <div class="le-prompt-text">建议尺寸：240像素*48像素，不超过2M</div>
            </el-form-item>
          </div>
        </el-form>
        {(() => {
          if (this.auth) {
            return (
              <div class="le-cardpin">
                <el-button type="primary" disabled={this.loading} loading={this.submitLoading} onClick={this.submit}>
                  保存
                </el-button>
              </div>
            );
          }
        })()}
      </div>
    );
  },
  methods: {
    submit: function () {
      this.submitLoading = true;
      this.$heshop
        .setting('post', {
          keyword: 'copyright_information',
          content: this.form
        })
        .then(() => {
          this.submitLoading = false;
          this.$message.success('保存成功');
          this.$store.state.setting.copyright_information = this.form;
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    getDetail: function () {
      this.$heshop
        .search(
          'post',
          {
            include: 'setting'
          },
          {
            keyword: 'copyright_information'
          }
        )
        .then(e => {
          if (e) {
            this.form = e.content;
          }
          this.loading = false;
        })
        .catch(e => {
          this.loading = false;
          this.$message.error(e.data.message);
        });
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>

<style lang="scss" scoped>
.le-card {
  background-color: #fff;
  padding: 24px;
  border-radius: 16px;
  margin-bottom: 24px;
}

.le-head {
  margin-bottom: 24px;
}

.le-title-line {
  width: 4px;
  height: 16px;
  background: #623ceb;
  display: inline-block;
}

.le-title {
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  opacity: 0.85;
  margin-left: 12px;
}

.le-tip {
  padding-left: 24px;
  height: 40px;
  line-height: 40px;
  background: #fff5d1;
  border-radius: 8px;
  margin-bottom: 25px;
}

.le-prompt-text {
  margin-top: 8px;
}

.le-file-input {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}

.select-cover__120-edit {
  position: absolute;
  top: 0;
  background: #fff;
}

.le-buy-copyright {
  position: absolute;
  top: 95px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 32px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #ffffff;
  line-height: 52px;

  .el-button {
    margin-top: 30px;
    width: 140px;
    height: 48px;
    background: #623ceb;
    border-radius: 8px;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }
}
</style>
