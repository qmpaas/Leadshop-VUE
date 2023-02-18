<template>
  <el-container class="apply-body">
    <el-header class="apply-header" height="64px" style="background-color: rgb(34, 34, 34)">
      <div class="apply-header__logo">
        <img :src="getStore.logo" />
      </div>
      <div class="apply-header__menu">
        <MianBar></MianBar>
      </div>
      <div class="apply-header__user">
        <ul>
          <el-popover
            placement="top-start"
            popper-class="apply-header__popver"
            width="132"
            trigger="hover"
            :offset="-10"
            :visible-arrow="false"
          >
            <div class="apply-header__logout">
              <div class="footer-item" @click="handleClearCache">
                <i class="le-icon le-icon-qinglihuancun"></i> <span>清理缓存</span>
              </div>
              <div
                class="footer-item"
                module="index"
                title="修改密码"
                action="handleLogout"
                v-popup.changePassword
                width="524"
              >
                <i class="le-icon le-icon-xiugaimima"></i> <span>修改密码</span>
              </div>
              <div class="footer-item" @click="handleLogout">
                <i class="le-icon le-icon-tuichudenglu"></i> <span>退出登录</span>
              </div>
            </div>
            <template slot="reference">
              <li>
                <div class="user-name" @mouseover="visible = true">
                  {{ getStore.name }}
                </div>
              </li>
              <li>
                <div class="user-photo">
                  <img :src="getStore.logo" />
                </div>
              </li>
            </template>
          </el-popover>
          <li>
            <div class="le-update" @click="router">
              <i class="le-icon le-icon-youshengji" v-if="version"></i>
              <i v-else class="le-icon le-icon-wushengji"></i>
            </div>
          </li>
        </ul>
      </div>
    </el-header>
    <el-main class="apply-main">
      <router-view />
    </el-main>
  </el-container>
</template>

<script type="text/javascript">
import '@/pages.js';
import MianBar from '@/components/mainbar/Main';

import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers('setting');

export default {
  components: { MianBar },
  data() {
    return {
      visible: false,
      isHiden: false
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    ...mapGetters({
      getStore: 'getStore',
      version: 'getVersion'
    })
  },
  methods: {
    /**
     * 清除缓存
     * @return {[type]} [description]
     */
    handleClearCache() {
      this.$heshop
        .clean('get')
        .then(res => {
          this.$message({
            message: '清除完成',
            type: 'success'
          });
          //清除对应缓存数据
          localStorage.removeItem('ndfWxbOhLIIHVZeR');
          //获取插件设置
          this.$store.dispatch('plugins/getPlugins');
        })
        .catch(() => {
          this.$message({
            message: '清除失败',
            type: 'warning'
          });
        });
      this.visible = false;
    },
    /**
     * 执行退出
     * @return {[type]} [description]
     */
    handleLogout() {
      this.$heshop.logout().then(() => {
        this.$router.push({ path: '/login/index' }).catch(error => {
          console.error('路由跳转错误', error);
        });
        location.reload();
      });
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(this.basePath)) {
        return this.basePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    router: function () {
      const newRouter = this.$router.resolve({ path: '/changelog' });
      window.open(newRouter.href, '_blank');
    }
  }
};
</script>

<style lang="less" scoped>
@import './style.less';

.apply-body .apply-header__logout {
  width: 132px;
  height: 136px;
  background: #ffffff;
  box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.footer-item {
  height: 40px;
  line-height: 40px;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.65);
}

.apply-header__popver {
  margin-top: -20px;
}

.le-icon {
  color: #a3a3a3;
}

.le-update {
  margin: 17px 16px;
  cursor: pointer;
}

.le-icon-youshengji {
  font-size: 20px;
  color: #623ceb;
}

.le-icon-wushengji {
  font-size: 20px;
}
</style>
