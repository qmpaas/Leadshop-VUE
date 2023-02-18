<template>
  <div class="hyperlink-select">
    <popup @confirm="handleConfirm" :forbidden="forbidden" :original="selectData">
      <div class="classify-select-tag" v-if="selectData.name" @click="stop">
        <Tag @close="handleClose" :closable="!isHome">
          {{ getTipsInfo(selectData) }}
        </Tag>
        <el-button type="text" :disabled="isHome">修改</el-button>
      </div>
      <slot v-else></slot>
    </popup>
  </div>
</template>

<script type="text/javascript">
import popup from './index.vue';
import Tag from '@/components/tag.vue';

export default {
  components: {
    popup,
    Tag
  },
  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: ''
    },
    index: {
      type: Number
    },
    /**
     * 禁用选项
     * @type {Object}
     */
    forbidden: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {};
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    selectData: {
      get() {
        return this.value;
      },
      set(value) {
        let data = JSON.parse(JSON.stringify(value));
        this.$emit('input', data);
      }
    },
    isHome: function () {
      return this.index === 0;
    }
  },
  methods: {
    getTipsInfo(item) {
      if (item.extend) {
        if (item.index == 2) {
          if (item.param.name) {
            if (item.param.name.length > 4) {
              return item.param.name.slice(0, 4) + '...';
            } else {
              return item.param.name;
            }
          }
        }
        if (item.index == 3) {
          if (item.param.address) {
            if (item.param.address.length > 4) {
              return item.param.address.slice(0, 4) + '...';
            } else {
              return item.param.address;
            }
          }
        }
        if (item.index == 7) {
          if (item.param.title) {
            if (item.param.title.length > 4) {
              return item.param.title.slice(0, 4) + '...';
            } else {
              return item.param.title;
            }
          }
        }
        if (item.index === 10) {
          if (item.param.name) {
            if (item.param.name.length > 4) {
              return item.param.name.slice(0, 4) + '...';
            } else {
              return item.param.name;
            }
          }
        }
        if (item.index === 11) {
          if (item.param.appId) {
            if (item.param.appId.length > 4) {
              return item.param.appId.slice(0, 4) + '...';
            } else {
              return item.param.appId;
            }
          }
        }
        if (item.index === 12) {
          if (item.param.url) {
            if (item.param.url.length > 4) {
              return item.param.url.slice(0, 4) + '...';
            } else {
              return item.param.url;
            }
          }
        }
      }
      return item.name;
    },
    handleClose() {
      this.selectData = {};
    },
    /**
     * 处理确认事件
     * @return {[type]} [description]
     */
    handleConfirm(value) {
      this.$nextTick(() => {
        this.selectData = value;
      });
    },
    stop: function (event) {
      if (this.isHome) event.stopPropagation();
    }
  }
};
</script>

<style lang="less" scoped>
@import './style.less';
</style>
