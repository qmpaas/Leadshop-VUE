<template>
  <div class="wechat">
    <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/wechat_bg.png" width="100%" height="100%" />
  </div>
</template>
<script type="text/javascript">
export default {
  props: {
    facade: {
      type: [Object, Array]
    },
    content: {
      type: [Object, Array]
    }
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    margin() {
      if (this.facade.chamfer_style == 1) {
        return 0;
      } else {
        return 10;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import './element.less';
</style>
