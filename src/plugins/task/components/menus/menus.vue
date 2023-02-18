<template>
  <el-menu
    :default-active="activeMenu"
    :unique-opened="false"
    :collapse-transition="false"
    mode="vertical"
    class="task-menus"
  >
    <menus-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
  </el-menu>
</template>
<script>
import menusItem from './menusItem';
import router from '../../config.js';
export default {
  components: { menusItem },
  computed: {
    routes() {
      return router.children;
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.extendMenu) {
        return meta.extendMenu;
      }
      return path;
    }
  }
};
</script>
<style type="text/css" lang="less">
.task-menus {
  width: 100%;
  height: 64px;
  background: #ffffff;
  border-radius: 16px;
  padding: 0 24px;
  padding-left: 24px !important;

  .le-sidebar-item {
    height: 64px;
  }

  .el-menu-item {
    height: 64px;
    line-height: 64px;

    > span {
      height: 62px;
      font-size: 14px;
      font-weight: 400;
      display: inline-block;
    }
  }

  .el-menu-item.is-active {
    color: #623ceb;

    > span {
      height: 62px;
      width: 100%;
      border-bottom: 2px solid #623ceb;
    }
  }

  .el-menu-item:focus,
  .el-menu-item:hover {
    outline: 0;
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
