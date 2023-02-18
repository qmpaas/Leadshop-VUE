<template>
  <svg class="le-icon" aria-hidden="true" :style="`font-size:${size}`">
    <use :xlink:href="`#${type}`"></use>
  </svg>
</template>

<script type="text/javascript">
export default {
  props: {
    type: {
      type: String,
      default: 'modules'
    },
    size: {
      type: String,
      default: '14px;'
    }
  }
};
</script>
