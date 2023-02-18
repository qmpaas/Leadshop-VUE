<script>
import waybillTutorials1 from '../image/waybill-tutorials-1.png';
import waybillTutorials2 from '../image/waybill-tutorials-2.png';

export default {
  name: 'waybill-tutorials',
  render() {
    return (
      <el-scrollbar class="le-tutorials">
        <a href="http://ckd.so/ydy" class="le-link--label" />
        <img src={waybillTutorials1} width="584" alt="" />
        <img src={waybillTutorials2} width="584" alt="" />
      </el-scrollbar>
    );
  },
  methods: {
    affirm(e) {
      let { handleClose } = e;
      handleClose();
    }
  }
};
</script>

<style scoped lang="scss">
.le-tutorials {
  width: 600px;
  height: 480px;
  position: relative;
  img {
    display: block;
  }
}
/deep/.el-scrollbar__wrap {
  overflow-x: hidden;
}
.le-link--label {
  position: absolute;
  width: 140px;
  height: 20px;
  top: 0;
  left: 220px;
}
</style>
