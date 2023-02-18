<template>
  <el-dialog :visible.sync="showDialog" title="新建评价库" width="440px" top="35vh">
    <el-input placeholder="请输入评价库名称" v-model="name" maxlength="20" show-word-limit></el-input>
    <div slot="footer" class="le-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="create"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'add-evaluation-library',
  props: {
    value: {
      type: Boolean
    }
  },
  data() {
    return {
      name: ''
    };
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
  methods: {
    create() {
      if (this.name) {
        this.$heshop
          .plugin(
            'post',
            {
              include: 'evaluate',
              model: 'repository',
              behavior: 'repository'
            },
            {
              name: this.name
            }
          )
          .then(() => {
            this.$message({
              type: 'success',
              message: '新建评价库成功'
            });
            this.$emit('confirm');
            this.showDialog = false;
          }).catch((error) => {
            this.$message({
              type: 'error',
              message: error.data.message
            });
        });
      }
    }
  }
};
</script>

<style scoped lang="less">
.el-input {
  width: 100%;
}

.le-footer {
  margin-bottom: 24px;
}
</style>
