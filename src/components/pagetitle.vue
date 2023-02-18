<script type="text/javascript">
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    confirmButtonText: {
      type: String,
      default: '确认'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    width: {
      type: String,
      default: '344px'
    }
  },
  data() {
    return {
      visible: false,
      cacheData: '',
      is_error: false,
      msg: '此名称已被占用，请重新输入',
      oldName: ""
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    pageInfo() {
      return this.$store.state.finish.pageInfo;
    },
    name: {
      get() {
        if (this.value && Number(this.value.length) === 13) {
          return '默认微页面' + this.pageInfo.id;
        } else {
          return this.value;
        }
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  watch: {
    visible: {
      handler(value) {
        if (value) {
          this.oldName = this.name;
        }
      }
    }
  },
  methods: {
    handleDialog() {
      this.cacheData = this.value;
      this.visible = true;
    },
    /**
     * 获取商品信息
     * @return {[type]} [description]
     */
    handleConfirm() {
      if (!this.value) {
        this.msg = '微页面名称不能为空';
        this.is_error = true;
        return;
      }
      this.$heshop
        .pages('PUT', { id: this.pageInfo.id }, { title: this.oldName })
        .then(() => {
          this.visible = false;
          this.name = this.oldName;
        })
        .catch(error => {
          this.$message.error(error.data.message);
        });
    },
    /**
     * 获取分组信息
     * @return {[type]} [description]
     */
    handleCancel() {
      this.visible = false;
      this.$emit('cancel');
    }
  },
  render() {
    let { handleConfirm, handleDialog, handleCancel, confirmButtonText, cancelButtonText, is_error } = this;
    let dialogData = {
      props: {
        title: '微页面名称',
        visible: this.visible,
        width: this.width,
        center: true,
        top: '15%',
        'append-to-body': true,
        'modal-append-to-body': false,
        'before-close': handleCancel
      }
    };
    let inputData = {
      props: {
        size: 'small',
        maxlength: 8,
        placeholder: '请输入页面名称'
      }
    };
    //判断插槽是否存在DOM结构，如果存在则获取后放入upload目录
    const trigger = this.$slots.trigger || this.$slots.default;

    return (
      <div class="pagetitle">
        <span on-click={handleDialog}>{trigger}</span>
        <el-dialog {...dialogData}>
          {name}
          <el-input type="text" {...inputData} show-word-limit v-model={this.oldName}></el-input>
          {is_error ? <span class="pagetitle_error">{this.msg}</span> : ''}
          <span slot="footer" class="dialog-footer">
            <el-button on-click={handleCancel}>{cancelButtonText}</el-button>
            <el-button type="primary" on-click={handleConfirm}>
              {confirmButtonText}
            </el-button>
          </span>
        </el-dialog>
      </div>
    );
  }
};
</script>

<style lang="less" scoped>
@import './pagetitle.less';
</style>
