<script type="text/javascript">
import Table from './table.vue';
export default {
  components: {
    Table
  },
  provide() {
    return {
      self: this
    };
  },
  props: {
    value: {
      type: [Array],
      default: []
    },
    data: {
      type: [String, Number, Boolean, Object, Array],
      default: ''
    },
    /**
     * [visible description]
     * @type {Object}
     */
    select: {
      type: Boolean,
      default: false
    },
    /**
     * 选择类型 radio | checkbox
     * @type {Object}
     */
    type: {
      type: String,
      default: 'radio'
    },
    /**
     * 执行的上传方法
     * @type {Object}
     */
    limit: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      selectData: this.value,
      dialogVisible: false
    };
  },
  watch: {
    value: {
      handler(val) {
        this.selectData = val;
      },
      immediate: true
    }
  },
  methods: {
    /**
     * 处理点击事件
     * @return {[type]} [description]
     */
    handleClick() {
      if (this.value.length >= this.limit) {
        return;
      } else {
        this.dialogVisible = true;
      }
    },
    /**
     * 处理关闭事件
     * @return {[type]} [description]
     */
    handleClose() {
      this.dialogVisible = false;
    },
    /**
     * 处理确认事件
     * @return {[type]} [description]
     */
    handleConfirm() {
      if (this.selectData.length > this.limit) {
        this.$message({
          message: '多选' + (this.selectData.length - this.limit) + '件优惠券',
          type: 'warning'
        });
        return;
      } else {
        this.$emit('input', this.selectData);
        this.dialogVisible = false;
      }
    }
  },
  render(h) {
    let { dialogVisible, handleClick, handleClose, handleConfirm } = this;
    //判断插槽是否存在DOM结构，如果存在则获取后放入upload目录
    const trigger = this.$slots.trigger || this.$slots.default;

    //设置上传样式
    const defaultData = {
      on: {
        click: handleClick
      }
    };

    const dialogData = {
      props: {
        visible: dialogVisible,
        title: '添加优惠券',
        'before-close': handleClose,
        width: '1002px',
        'destroy-on-close': true,
        'append-to-body': true
      }
    };

    return (
      <div class="goods-dialog">
        <div class="goods-dialog-title" {...defaultData}>
          {trigger}
        </div>
        <el-dialog {...dialogData}>
          <Table dialogVisible={dialogVisible}></Table>
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
<style lang="less" scoped></style>
