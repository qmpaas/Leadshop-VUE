<template>
  <control title="微信公众号" :is_tab="false">
    <div class="control-item-title">该模块由系统根据设置自动展示，无需编辑</div>
  </control>
</template>
<script type="text/javascript">
import control from '@/components/control.vue';

export default {
  components: {
    control
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    content: {
      get() {
        return this.$store.getters.content;
      },
      set(value) {
        let data = {
          key: 'content',
          value: value
        };
        this.$store.commit('finish/setAttribute', data);
      }
    },
    facade: {
      get() {
        return this.$store.getters.facade;
      },
      set(value) {
        let data = {
          key: 'facade',
          value: value
        };
        this.$store.commit('finish/setAttribute', data);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import '../attribute.less';
</style>
