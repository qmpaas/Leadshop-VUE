<template>
  <el-input type="textarea" class="he-editName" maxlength="40" resize="none" v-model="name" show-word-limit></el-input>
</template>

<script>
export default {
  name: 'editName',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      name: this.value.name
    };
  },
  methods: {
    affirm(e) {
      let { handleClose } = e;
      let _this = this;
      if (this.name) {
        this.$heshop
          .goods(
            'put',
            {
              id: this.value.id,
              behavior: 'simplesetting'
            },
            {
              name: this.name
            }
          )
          .then(function () {
            _this.value.name = _this.name;
            _this.$message.success('商品名称修改成功');
            handleClose();
          })
          .catch(function () {
            _this.$message.error('商品名称修改失败');
            handleClose();
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
.he-editName.el-textarea {
  width: 300px;
  height: 80px;

  /deep/ .el-textarea__inner {
    min-height: 80px !important;
  }
}
</style>
