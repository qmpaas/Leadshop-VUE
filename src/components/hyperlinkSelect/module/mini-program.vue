<script>
export default {
  name: 'mini-program',
  data() {
    return {
      dialogVisible: false,
      form: {
        applet: {
          appId: '',
          path: '',
          label: 1
        },
        wechat: {
          appId: '',
          path: '',
          label: 1
        }
      },
      rules: {
        'applet.appId': [
          {
            required: true,
            message: '小程序AppId不能为空'
          }
        ],
        'wechat.appId': [
          {
            required: true,
            message: '小程序原始ID不能为空'
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
    this.form.wechat = this.value.wechat;
    this.form.applet = this.value.applet;
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
    },
    changeApplet(e) {
      if (e === 0) {
        this.form.applet.appId = '';
        this.form.applet.path = '';
      }
    },
    changeWechat(e) {
      if (e === 0) {
        this.form.wechat.appId = '';
        this.form.wechat.path = '';
      }
    }
  },
  render() {
    const { dialogVisible, handleClose, handleConfirm, handleClick } = this;

    const dialogData = {
      props: {
        visible: dialogVisible,
        title: '其他小程序',
        'before-close': handleClose,
        width: '456px',
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
            label-width="136px"
            ref="form"
            props={{
              rules: self.rules,
              model: self.form
            }}>
            <el-form-item label="小程序跳转小程序">
              <el-radio-group v-model={self.form.applet.label} onChange={self.changeApplet}>
                <el-radio label={1}>开启</el-radio>
                <el-radio label={0}>关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            {(() => {
              if (self.form.applet.label) {
                return [
                  [
                    <el-form-item label="小程序AppID" prop="applet.appId">
                      <el-input placeholder="请输入小程序AppID" v-model={self.form.applet.appId} />
                    </el-form-item>
                  ],
                  [
                    <el-form-item label="小程序路径">
                      <el-input placeholder="请输入小程序路径" v-model={self.form.applet.path} />
                    </el-form-item>
                  ]
                ];
              }
            })()}
            <el-form-item label="公众号跳转小程序">
              <el-radio-group v-model={self.form.wechat.label} onChange={self.changeWechat}>
                <el-radio label={1}>开启</el-radio>
                <el-radio label={0}>关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            {(() => {
              if (self.form.wechat.label === 1) {
                return [
                  [
                    <el-form-item label="小程序原始ID" prop="wechat.appId">
                      <el-input placeholder="请输入小程序原始ID" v-model={self.form.wechat.appId} />
                    </el-form-item>
                  ],
                  [
                    <el-form-item label="小程序路径">
                      <el-input placeholder="请输入小程序路径" v-model={self.form.wechat.path} />
                    </el-form-item>
                  ]
                ];
              }
            })()}
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
