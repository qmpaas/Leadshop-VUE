<template>
  <div class="task" v-if="status">
    <div class="task-header">
      <!-- 面包屑管理 -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>
          <he-link href="plugins/practical">实用工具</he-link>
        </el-breadcrumb-item>
        <el-breadcrumb-item>评价助手</el-breadcrumb-item>
        <el-breadcrumb-item v-if="activeMenu">{{ activeMenu }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <menus></menus>
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
    menus: menus
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
    status() {
      return this.$manifest('task', 'status');
    },
    activeMenu() {
      const route = this.$route;
      const { meta } = route;
      if (meta.title) {
        return meta.title;
      }
      return '';
    }
  }
};
</script>

<style lang="less" scoped>
@import './task.less';

/deep/ .task-header {
  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: #8c8c8c;
      font-weight: 400;
    }
  }

  .el-icon-arrow_start {
    .el-breadcrumb__inner {
      color: #262626;
      font-weight: 400;
    }
  }
}
</style>
