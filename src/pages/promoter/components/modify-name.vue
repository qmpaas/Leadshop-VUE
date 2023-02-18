<script>
export default {
  name: 'modify-name',
  data() {
    return {
      realname: this.info.user.realname
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
        title="改姓名"
        width="360px"
        top="30vh"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <el-form ref="form" label-width="140px">
          <el-input
            maxlength="20"
            show-word-limit
            placeholder="请输入姓名"
            class="he-input"
            v-model={self.realname}></el-input>
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
            realname: this.realname
          }
        )
        .then(() => {
          this.info.user.realname = this.realname;
          this.showDialog = false;
          this.$message.success('修改分销商姓名成功');
        })
        .catch(err => {
          this.$message.error(err.data[0].message);
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
