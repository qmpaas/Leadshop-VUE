<script>
export default {
  name: 'parameterTemplateEdit',
  data() {
    return {
      form: {
        title: '',
        content: [
          {
            name: '',
            value: ''
          }
        ]
      },
      rules: {
        title: [
          {
            required: true,
            message: '参数模板名称不能为空'
          }
        ],
        content: [
          {
            required: true,
            validator: (rule, value, callback) => {
              for (let i = 0; i < value.length; i++) {
                if (!value[i].value || !value[i].name) {
                  callback('参数内容不能为空');
                }
              }
              callback();
            }
          }
        ]
      },
      loading: false,
      disabled: false
    };
  },
  methods: {
    pushParameter() {
      this.form.content.push({
        name: '',
        value: ''
      });
    },
    deletionParameter(index) {
      if (this.form.content.length <= 1) return;
      this.$delete(this.form.content, index);
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          let method = undefined;
          if (this.form.id) {
            method = 'put';
          } else {
            method = 'post';
          }
          let data = this.$heshop.utils.deepClone(this.form);
          this.$heshop
            .goodsargs(method, data)
            .then(res => {
              this.$message.success('保存成功');
              this.loading = false;
              this.$router.push({
                path: '/goods/parameterTemplate'
              });
            })
            .catch(err => {
              if (err.data[0]) {
                this.$message.error(err.data[0].message);
              } else {
                this.$message.error(err.data.message);
              }
            });
        } else {
          return false;
        }
      });
    },
    // 获取详情
    getDetail(id) {
      this.$heshop
        .goodsargs('get', parseInt(id))
        .then(res => {
          this.form = res;
          this.disabled = false;
        })
        .catch(error => {
          this.$message.error(error.data.message);
        });
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.disabled = true;
      this.getDetail(this.$route.query.id);
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <a href="javascript:history.back()">参数模板</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>新增参数模板</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
          props={{
            model: self.form,
            rules: self.rules
          }}
          class="le-card"
          ref="form"
          label-width="164px"
          v-loading={self.loading}>
          <el-form-item label="参数模板名称" prop="title">
            <el-input
              maxlength="10"
              show-word-limit
              v-model={self.form.title}
              class="le-input--240"
              placeholder="请输入参数模板名称"
            />
          </el-form-item>
          <el-form-item label="参数内容" prop="content" class="le-content">
            {self.form.content.map((item, index, array) => {
              return (
                <div class="le-parameter">
                  <el-form-item label="参数名" label-width="82px" key={index + '_name'}>
                    <el-input
                      maxlength="8"
                      show-word-limit
                      v-model={item.name}
                      class="le-input--240"
                      placeholder="请输入参数名"
                    />
                    <div class="le-prompt-text">示例：语言种类</div>
                  </el-form-item>
                  <el-form-item label="参数值" label-width="82px" key={index + '_value'}>
                    <el-input
                      v-model={item.value}
                      resize="none"
                      rows="5"
                      type="textarea"
                      class="le-input--600"
                      placeholder="请输入参数值"
                    />
                    <div class="le-prompt-text">建议参数值之间用“；”隔开，示例：汉语；英语；法语；德语</div>
                  </el-form-item>
                  {(() => {
                    if (array.length !== 1) {
                      return (
                        <div
                          class="le-deletion le-icon le-icon-cha2"
                          onClick={self.deletionParameter.bind(self, index)}
                        />
                      );
                    }
                  })()}
                </div>
              );
            })}
          </el-form-item>
          <el-form-item>
            <el-button onClick={self.pushParameter} plain={true}>
              添加参数
            </el-button>
          </el-form-item>
        </el-form>
        <div class="le-cardpin">
          <el-button
            type="primary"
            disabled={self.disabled}
            loading={self.loading && !self.disabled}
            onClick={self.submit}>
            保存
          </el-button>
        </div>
      </div>
    );
  }
};
</script>

<style scoped lang="scss">
.le-card {
  margin-top: 24px;
  padding-top: 40px;
}

.le-input--240 {
  width: 240px;
}

.le-input--600 {
  width: 600px;
}

.le-prompt-text {
  margin-top: 5px;
}

.le-parameter {
  width: 706px;
  height: 244px;
  background: #f3f5f7;
  border-radius: 4px;
  padding: 24px 0 0 0;
  position: relative;
  margin-bottom: 16px;

  .le-deletion {
    height: auto;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    width: 16px;
    transform: translate(50%, -50%);
    opacity: 0;
  }

  &:hover {
    .le-deletion {
      opacity: 1;
    }
  }
}

/deep/ .le-content.el-form-item.is-error.is-required {
  .el-input__inner,
  .el-textarea__inner {
    border-color: #dcdfe6 !important;
  }
}
</style>
