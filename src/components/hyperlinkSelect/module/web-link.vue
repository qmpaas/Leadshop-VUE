<script>
export default {
  name: 'web-link',
  data() {
    return {
      dialogVisible: false,
      form: {
        url: ''
      },
      rules: {
        url: [
          {
            required: true,
            message: '跳转链接不能为空'
          }
        ]
      }
    };
  },
  props: {
    value: {
      type: Object
    }
  },
  mounted() {
    this.form.url = this.value.url;
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },
    handleConfirm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.$emit('input', this.form);
          this.dialogVisible = false;
        }
      });
    },
    handleClick() {
      this.dialogVisible = true;
    }
  },
  render() {
    const { dialogVisible, handleClose, handleConfirm, handleClick } = this;

    const dialogData = {
      props: {
        visible: dialogVisible,
        title: '自定义链接',
        'before-close': handleClose,
        width: '530px',
        'destroy-on-close': true,
        'append-to-body': true
      }
    };
    const self = this;
    return (
      <div class="le-main">
        <div onClick={handleClick}>{this.$slots.default}</div>
        <el-dialog {...dialogData}>
          <el-form
            label-width="110px"
            ref="form"
            nativeOn={{
              submit(event) {
                // 阻止表单提交
                event.preventDefault();
              }
            }}
            props={{
              rules: self.rules,
              model: self.form
            }}>
            <el-form-item label="跳转链接" prop="url">
              <el-input placeholder="请输入跳转链接" v-model={self.form.url} />
              <div class="le-prompt-text">
                请填写完整的带有“https://”或“http://”的链接地址
                <br />
                链接的域名必须在微信公众平台设置业务域名
              </div>
            </el-form-item>
          </el-form>
          <template slot="footer">
            <el-button on-click={handleClose}>取 消</el-button>
            <el-button type="primary" on-click={handleConfirm}>
              确 定
            </el-button>
          </template>
        </el-dialog>
      </div>
    );
  }
};
</script>

<style scoped lang="scss">
.el-form {
  padding-right: 40px;
}
</style>
