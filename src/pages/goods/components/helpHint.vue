<template>
  <span>
    <span style="margin-right: 8px;line-height: 23px;"><slot></slot></span>
    <el-popover trigger="hover" :content="content" :placement="placement">
      <span slot="reference" class="le-icon le-icon-zhushi1"></span>
    </el-popover>
  </span>
</template>
<script>
export default {
  name: 'HelpHint',
  props: {
    placement: {
      default: 'top'
    },
    content: String
  }
};
</script>

<style lang="scss" scoped>
.le-icon-zhushi1 {
  color: #cbced5;
  font-size: 16px;
}
/deep/.el-popover__reference-wrapper {
  height: 13px;
  line-height: 19px;
}
</style>
