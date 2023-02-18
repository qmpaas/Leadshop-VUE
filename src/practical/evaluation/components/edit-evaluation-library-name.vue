<template>
  <el-dialog :visible.sync="showDialog" title="修改评价库名称" width="440px" top="35vh">
    <el-input placeholder="请输入评价库名称" v-model="name" :maxlength="20" show-word-limit></el-input>
    <div slot="footer" class="le-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="create"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'edit-evaluation-library-name',
  props: {
    value: {
      type: Boolean
    },
    info: {
      type: Object
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
            'put',
            {
              include: 'evaluate',
              model: 'repository',
              behavior: 'repository'
            },
            {
              id: this.info.id,
              name: this.name
            }
          )
          .then(() => {
            this.showDialog = false;
            this.info.name = this.name;
            this.$message({
              type: 'success',
              message: '修改评价库名称成功'
            });
          });
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.name = this.info.name;
        }
      }
    }
  }
};
</script>

<style scoped>
.el-input {
  width: 100%;
}

.le-footer {
  margin-bottom: 24px;
}
</style>
