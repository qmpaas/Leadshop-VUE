<script>
export default {
  name: 'failed-price',
  props: {
    value: {
      type: Boolean,
      default: false
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
        title="确认解除关系"
        width="496px"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}></el-dialog>
    );
  }
};
</script>

<style scoped></style>
