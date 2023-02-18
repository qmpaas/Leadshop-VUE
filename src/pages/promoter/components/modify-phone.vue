<script>
export default {
  name: 'modify-phone',
  data() {
    return {
      mobile: this.info.user.mobile
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    info: {
      type: [Object]
    }
  },
  computed: {
    showDialog: {
      get({ value }) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  render() {
    const self = this;
    return (
      <el-dialog
        visible={self.showDialog}
        title="改手机号"
        width="360px"
        top="30vh"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <el-form ref="form" label-width="140px">
          <el-input
            maxlength="11"
            show-word-limit
            placeholder="请输入姓名"
            class="he-input"
            v-model={self.mobile}></el-input>
        </el-form>
        <div slot="footer">
          <el-button onClick={() => (self.showDialog = false)}>取消</el-button>
          <el-button type="primary" onClick={self.submit}>
            确定
          </el-button>
        </div>
      </el-dialog>
    );
  },
  methods: {
    // 提交修改等级
    submit() {
      this.$heshop
        .users(
          'put',
          { id: this.info.UID, behavior: 'setting' },
          {
            mobile: this.mobile
          }
        )
        .then(() => {
          this.info.user.mobile = this.mobile;
          this.showDialog = false;
          this.$message.success('修改分销商手机号成功');
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.el-dialog .el-dialog__body {
  padding-bottom: 0;
}

.level-title:extend(.font-family-yahei) {
  font-size: 14px;
  font-weight: 400;
  color: #262626;
}

/deep/ .el-dialog__footer {
  padding-bottom: 40px;
}
</style>
