<template></template>
<script type="text/javascript">
import TaskSpecstable from '../tables/specs.vue';
export default {
  components: {
    TaskSpecstable
  },
  data() {
    return {
      goods: {
        name: '可盐可甜连衣裙女装秋装新款温柔风裙子秋季收可盐可甜连衣裙女装秋装新款温柔风裙子秋季收可盐可甜连衣裙女装秋装新款温柔风裙子秋季收'
      },
      dialogVisible: true
    };
  },
  filters: {
    capitalize: function (value) {
      if (value.length >= 42) {
        return value.slice(0, 39) + '...';
      } else {
        return value;
      }
    }
  },
  mounted() {},
  methods: {
    handleClose(done) {}
  }
};
</script>
<style type="text/css" lang="less"></style>
