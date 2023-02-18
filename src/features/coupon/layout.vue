<script>
export default {
  render(h) {
    return h(
      'div',
      {
        class: 'leadshop'
      },
      [
        (() => {
          if (this.$route.meta.keepAlive) {
            return h('keep-alive', null, [h('router-view')]);
          } else {
            return h('router-view');
          }
        })()
      ]
    );
  }
};
</script>

<style lang="less">
.leadshop {
  height: 100%;
  width: 100%;
}
</style>
