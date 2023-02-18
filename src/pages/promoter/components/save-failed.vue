<script>
export default {
  name: 'save-failed',
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
        width="437px"
        top="30vh"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <div class="flex flex-direction align-center">
          <div class="flex align-center">
            <span class="le-icon le-icon-zhushi1"></span>
            <span class="title">操作失败</span>
          </div>
          <span class="prompt-text">存在分销商品未设置成本价，无法根据利润计算佣金</span>
        </div>
        <div slot="footer">
          <el-button onClick={() => (self.showDialog = false)}>取消</el-button>
          <el-button type="primary" onClick={self.modifyProduct}>
            修改商品
          </el-button>
        </div>
      </el-dialog>
    );
  },
  methods: {
    modifyProduct() {
      const { href } = this.$router.resolve({
        path: '/promoter/goods'
      });
      window.open(href, '_blank');
    }
  }
};
</script>

<style scoped>
/deep/ .el-dialog__header {
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
