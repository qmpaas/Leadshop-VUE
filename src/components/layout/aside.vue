<template>
  <el-container>
    <el-aside width="96px" class="apply-main__menus">
      <Sidebar></Sidebar>
    </el-aside>
    <el-main class="apply-main__content le-main">
      <el-scrollbar style="height: 100%">
        <div style="padding: 24px">
          <transition name="fade" mode="out-in">
            <router-view />
          </transition>
        </div>
        <div class="le-panel__footer">
          <template v-if="(!auth || $_.isEmpty(copyright_information)) && isAuth">
            <div class="le-link">
              <span>
                <a href="https://www.leadshop.vip/" target="_blank">官网</a>
              </span>
              丨
              <span>
                <a href="https://www.leadshop.vip/forum" target="_blank">论坛</a>
              </span>
              丨
              <span>
                <a href="https://help.leadshop.vip/" target="_blank">文档</a>
              </span>
            </div>
            <div class="le-copy" v-html="copyright"></div>
          </template>
          <template v-else-if="auth && copyright_information && isAuth">
            <div class="flex flex-direction align-center">
              <img
                v-if="copyright_information.admin_copyright_icon"
                :src="copyright_information.admin_copyright_icon"
                width="240"
                height="48"
                alt=""
              />
              <a class="le-copy" :href="copyright_information.admin_copyright_link">{{
                copyright_information.admin_copyright_content
              }}</a>
            </div>
          </template>
        </div>
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script type="text/javascript">
import '@/pages.js';
import Sidebar from '../mainbar/Side';
import { createNamespacedHelpers } from 'vuex';

const { mapGetters } = createNamespacedHelpers('setting');

export default {
  components: {
    Sidebar
  },
  data() {
    return {};
  },
  computed: {
    copyright() {
      return this.HTMLDecode($_W.Copyright);
    },
    ...mapGetters({
      auth: 'getAuth',
      copyright_information: 'getCopyright'
    }),
    isAuth({ $store }) {
      return $store.state.setting.isAuth;
    }
  },
  methods: {
    HTMLDecode(text) {
      var temp = document.createElement('div');
      temp.innerHTML = text;
      var output = temp.innerText || temp.textContent;
      temp = null;
      return output;
    }
  },
  mounted() {}
};
</script>
<style lang="less" scoped>
@import './style.less';

.le-main {
  padding: 0;
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}

/deep/ .el-scrollbar .el-scrollbar__bar,
.is-horizontal {
  height: 10px;
}

.le-panel__footer {
  height: 120px;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.45);
  line-height: 22px;
  opacity: 0.45;
  padding-top: 10px;
  margin-top: 50px;

  .le-link span {
    cursor: pointer;
    display: inline-block;
    margin: 0 10px;

    a {
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .le-copy {
    margin-bottom: 50px;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    line-height: 48px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}
</style>
