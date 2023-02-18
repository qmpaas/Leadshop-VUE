<template>
  <popup
    ref="popup"
    :disabled="disabled"
    @confirm="handleConfirm"
    @close="handleClose"
    :limit="limit"
    :max="max"
    v-model="url"
  >
    <slot name="preview" v-if="url" :url="url" :index="index"></slot>
    <slot name="upload" v-else></slot>
  </popup>
</template>
<script type="text/javascript">
import popup from './popup.vue';

export default {
  components: {
    popup
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: ''
    },
    /**
     * 上传限制
     * @type {Number}
     */
    limit: {
      type: Number,
      default: 1
    },
    max: {
      type: Number,
      default: 1
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      ddd: [1, 23, 4, 2]
    };
  },
  computed: {
    url: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    index: {
      get() {
        return Number(this.$vnode.index || 0);
      },
      set(value) {}
    }
  },
  methods: {
    handleConfirm(value) {
      this.url = value;
      this.$emit('blur', value);
      this.$emit('confirm', value);
    },
    handleClose(value) {
      this.$emit('blur', value);
    },
    handleClick() {
      this.$refs['popup'].dialogVisible = true;
    }
  }
};
</script>
<style lang="less" scoped>
@import './style.less';
</style>
