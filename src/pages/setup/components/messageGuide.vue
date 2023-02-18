<template>
  <el-scrollbar class="le-messageGuide">
    <img :src="value === 'applets' ? applets : wechat" alt="" />
  </el-scrollbar>
</template>

<script>
const wechat = require('../image/wechatMessage.png');
const applets = require('../image/appletsMessage.png');
export default {
  name: 'messageGuide',
  props: {
    value: {
      type: String
    }
  },
  data() {
    return {
      wechat: wechat,
      applets: applets
    };
  },
  mounted() {},
  methods: {
    affirm(e) {
      let { handleClose } = e;
      handleClose();
    }
  }
};
</script>

<style scoped lang="scss">
.le-messageGuide {
  width: 600px;
  height: 480px;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  img {
    width: 100%;
  }
}
</style>
