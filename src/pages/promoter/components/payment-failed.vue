<script>
export default {
  name: 'payment-failed',
  props: {
    value: {
      type: Boolean,
      default: true
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
        width="299px"
        top="30vh"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <div class="flex flex-direction align-center">
          <div class="flex align-center">
            <span class="le-icon le-icon-zhushi1"></span>
            <span class="title">打款失败</span>
          </div>
          <span class="prompt-text">未开通【企业付款到零钱】</span>
        </div>
        <div slot="footer">
          <el-button type="primary" onClick={() => (self.showDialog = false)}>
            我知道了
          </el-button>
        </div>
      </el-dialog>
    );
  }
};
</script>

<style scoped>
/deep/.el-dialog__header {
  padding: 15px;
}
.title {
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  margin-left: 15px;
}
.le-icon-zhushi1 {
  font-size: 22px;
  color: #ff8226;
  height: auto;
}
.el-button--primary {
  margin-bottom: 20px;
}
.prompt-text {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #8c8c8c;
  margin-top: 10px;
  line-height: 22px;
}
</style>
