<template>
  <div
    class="notice"
    :style="{
      backgroundColor: facade.background_color
    }"
  >
    <div class="notice-icon">
      <img :src="content.icon" />
    </div>
    <div
      class="notice-title"
      :style="{
        color: facade.title_color
      }"
    >
      {{ content.title }}
    </div>
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
  data() {
    return {};
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {},
  /**
   * 页面渲染前
   * @return {[type]} [description]
   */
  created() {},
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {},
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {}
};
</script>
<style lang="less" scoped>
@import './element.less';
</style>
