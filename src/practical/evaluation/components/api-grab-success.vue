<template>
  <el-dialog :visible.sync="showDialog" title="" width="440px" top="35vh">
    <div slot="footer" class="le-footer"></div>
  </el-dialog>
</template>

<script>
export default {
  name: 'api-grab-success',
  props: {
    value: {
      type: Boolean
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
  }
};
</script>

<style scoped></style>
