<template>
  <router-link :target="target" class="he-link" tag="a" :to="{ path: getMenusLink(), query: getQueryLink() }">
    <slot></slot>
  </router-link>
</template>

<script type="text/javascript">
export default {
  props: {
    name: {
      type: String,
      default: ''
    },
    query: {
      type: Object
    },
    href: {
      type: String,
      default: 'panel/index'
    },
    target: {
      type: String,
      default: '_self'
    }
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    modules() {
      return this.name || this.$heshop.AppAlias || this.$heshop.AppName;
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  mounted() {},
  methods: {
    /**
     * 获取跳转链接，用于新开页跳转
     * @param  {[type]} item [description]
     * @return {[type]}      [description]
     */
    getMenusLink() {
      return '/' + this.href;
      let href = this.ltrim(this.href, '/');
      href = href.split('/');
      return {
        module: href[0],
        page: href[1]
      };
    },
    getQueryLink() {
      return this.query;
    },
    ltrim(str, value = ' ') {
      str = str.toString();
      let leng = value.length;
      if (leng < 1) {
        return str;
      }
      let init = str.slice(0, leng);
      if (init == value) {
        return str.slice(leng);
      } else {
        return str;
      }
    }
  }
};
</script>
<style lang="less" scoped="true">
a {
  white-space: normal;
  word-break: break-all;
}

a:link {
  color: #000;
  text-decoration: none;
}

a:visited {
  color: #000;
  text-decoration: none;
}

a:hover {
  color: #000;
  text-decoration: none;
}

a:active {
  color: #000;
  text-decoration: none;
}
</style>
