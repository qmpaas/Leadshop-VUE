<template>
  <popup v-model="selectData" :limit="limit">
    <slot></slot>
  </popup>
</template>

<script>
import popup from './index.vue';

export default {
  data() {
    return {
      drag: false
    };
  },
  props: {
    value: {
      type: Array,
      default: []
    },
    limit: {
      type: Number,
      default: 50
    }
  },
  computed: {
    selectData: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  components: {
    popup
  }
};
</script>

<style scoped></style>
