<template>
  <el-dialog
    class="he-dialog"
    :title="title"
    :visible="visible"
    :top="top"
    :width="`${width}px`"
    :before-close="handleClose"
  >
    <component ref="mdeol" v-bind:is="content" v-model="value"></component>
    <span slot="footer" class="dialog-footer" v-if="!hide_footer">
      <el-button @click="handleClose" v-if="!hide_cancel">取 消</el-button>
      <el-button type="primary" @click="handleOk">{{ sure_btn }}</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/javascript">
export default {
  props: {
    title: {
      type: String,
      default: '操作窗口'
    },
    top: {
      type: String,
      default: '15vh'
    },
    hide_footer: {
      type: [Number, String, Boolean],
      default: true
    },
    hide_cancel: {
      type: [Number, String, Boolean],
      default: true
    },
    width: {
      type: [Number, String],
      default: 800
    },
    content: [Object, Function],
    value: [Array, Object, Number, String],
    sure_btn: {
      type: String,
      default: '确定'
    },
    vm: [Object, Function],
    hide_close: {
      type: [Number, String, Boolean],
      default: false
    }
  },
  data() {
    return {
      ModalText: 'Content of the modal',
      visible: true,
      affirm: false,
      confirmLoading: false
    };
  },
  watch: {
    value: {
      // 监听的对象
      deep: true, // 深度监听设置为 true
      handler: function (newV, oldV) {
        this.$emit('input', newV);
      }
    }
  },
  async mounted() {},
  methods: {
    showModal() {
      this.visible = true;
    },
    async handleOk(e) {
      this.affirm = true;
      try {
        let returned = await this.$refs.mdeol.affirm(this);
        if (returned) {
          this.handleClose();
        }
      } catch (error) {
        console.error('事件不存在', error);
      }
    },
    handleClose(e) {
      this.visible = false;
    }
  }
};
</script>
<style type="text/css" lang="less">
div.v-modal {
  opacity: 0.7;
}

/deep/.he-dialog {
  .el-dialog__headerbtn {
    right: -22px;
    top: -4px;

    .el-dialog__close {
      color: #fff;
      font-size: 18px;
      font-weight: 800;
    }
  }

  .el-dialog__header {
    text-align: center;
    padding: 40px 0 32px 0;

    .el-dialog__title {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #000000;
      line-height: 20px;
      opacity: 0.85;
    }
  }

  .el-dialog__footer {
    text-align: center;
  }

  .el-dialog {
    position: relative;
    background-color: #fff;
    border: 1px solid #999;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 16px;
    background-clip: padding-box;
    outline: 0;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  }

  .el-dialog__body {
    padding: 0;
    color: #606266;
    font-size: 14px;
    word-break: break-all;
  }
}
</style>
