<template>
  <div class="layoutA">
    <div class="layoutA-header">
      <!-- 面包屑管理 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <he-link href="plugins/practical">实用工具</he-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>小程序直播</el-breadcrumb-item>
        <el-breadcrumb-item v-if="activeMenu">{{ activeMenu }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <layout-menus></layout-menus>
    </div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <!-- 不需要缓存的视图组件 -->
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script type="text/javascript">
import menus from './components/menus';

export default {
  components: {
    'layout-menus': menus
  },
  data() {
    return {
      activeIndex: ''
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    activeMenu() {
      const route = this.$route;
      const { meta, query } = route;
      if (query.roomid) {
        return '编辑直播间';
      }
      if (query.goodsId) {
        return '编辑直播商品';
      }
      if (meta.title) {
        return meta.title;
      }
      return '';
    }
  },
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
  mounted() {},
  methods: {}
};
</script>
<style lang="less" scoped="true">
.layoutA {
  /deep/ .el-input--prefix .el-input__inner {
    padding-left: 30px;
  }

  &-header {
    margin-bottom: 20px;

    /deep/ .el-breadcrumb {
      .el-breadcrumb__inner {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}
</style>
