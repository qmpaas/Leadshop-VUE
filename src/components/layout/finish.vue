<template>
  <el-container class="main">
    <el-header height="64px">
      <div class="layout-logo">
        <img :src="getStore.logo" />
      </div>
      <div class="layout-back">
        <ul>
          <router-link tag="li" :to="{ name: 'store' }">
            <li>
              <span><i class="le-icon le-icon-arrow-left"></i>返回</span>
            </li>
          </router-link>
        </ul>
      </div>
    </el-header>
    <el-container class="main-body">
      <el-main class="main-main">
        <keep-alive>
          <router-view />
        </keep-alive>
      </el-main>
    </el-container>
  </el-container>
</template>

<script type="text/javascript">
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('setting');
export default {
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    ...mapGetters({
      getStore: 'getStore',
      version: 'getVersion'
    })
  }
};
</script>

<style lang="less">
@import './finish.less';
</style>
