<template>
  <div class="le-matters">
    <div class="le-upload-loading flex align-center justify-center" @touchmove.prevent v-if="uploadLoading">
      <div class="le-upload-content">
        <img class="le-upload-img" src="../../assets/images/le-upload-applets.gif" />
        <div>下载中...</div>
      </div>
    </div>
    <div class="tabbar">
      <div class="tabbar-phone">
        <div class="tabbar-phone-header">
          <div class="tabbar-phone-title">微页面</div>
        </div>
        <div class="tabbar-phone-body">
          <div class="tabbar-phone-tabbar">
            <div class="tabbar-phone-opacity"></div>
            <iframe
              frameborder="0"
              scrolling="no"
              class="tabbar-phone-iframe"
              :src="origin"
              width="375px"
              height="700px"
            ></iframe>
            <Tabbar
              :tabbarDes="tabbarDes.data"
              :type="tabbarDes.tabbarStyle"
              :color="tabbarDes.inactive_color"
              :background="tabbarDes.background_color"
            ></Tabbar>
          </div>
        </div>
      </div>
      <div class="tabbar-attribute">
        <Attribute v-model="tabbarDes"></Attribute>
      </div>
      <div class="tabbar-footer">
        <el-button type="primary" @click="handleTabbarSave">保存</el-button>
      </div>
    </div>
    <download v-model="isDownload"></download>
  </div>
</template>
<script type="text/javascript">
import Attribute from './attribute';
import Tabbar from './tabbar';
import download from './components/download';
export default {
  components: {
    Attribute,
    Tabbar,
    download
  },
  data() {
    return {
      tabbarDes: {
        tabbarStyle: 1,
        background_color: '#FFFFFF',
        inactive_color: '#666666',
        active_color: '#f5212d',
        data: []
      },
      fullHeight: document.documentElement.clientHeight,
      origin: $_W.AppWEB,
      uploadLoading: false,
      isDownload: false
    };
  },
  computed: {
    scrollHeight() {
      return {
        height: parseInt(this.fullHeight) - 65 + 'px'
      };
    }
  },
  mounted() {
    let that = this;
    //监听页面大小
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight;
        that.fullHeight = window.fullHeight;
      })();
    };
    this.handleLoadTabbar();
  },
  methods: {
    /**
     * 执行页面保存操作
     * @return {[type]} [description]
     */
    handleTabbarSave() {
      for (let index in this.tabbarDes.data) {
        let item = this.tabbarDes.data[index];
        if (item.text == '') {
          this.$message({
            message: '名称不能为空',
            type: 'warning'
          });
          return;
        }

        if (item.link && Object.keys(item.link).length === 0) {
          this.$message({
            message: '链接不能为空',
            type: 'warning'
          });
          return;
        }

        if (this.tabbarDes.tabbarStyle == 2) {
          if (item.iconPath == '') {
            this.$message({
              message: '【未选中】图标不能为空',
              type: 'warning'
            });
            return;
          }
          if (item.selectedIconPath == '') {
            this.$message({
              message: '【选中】图标不能为空',
              type: 'warning'
            });
            return;
          }
        }
      }
      const loading = this.$loading({
        lock: true,
        text: '保存中……',
        spinner: 'el-icon-loading'
      });
      this.$heshop
        .fitment('POST', {
          keyword: 'tabbar',
          content: JSON.stringify(this.tabbarDes)
        })
        .then(() => {
          loading.close();
          this.isDownload = true;
        })
        .catch(error => {
          console.error('错误信息', error);
        });
    },
    /**
     * 执行页面保存操作
     * @return {[type]} [description]
     */
    handleLoadTabbar() {
      this.$heshop
        .search('POST', { include: 'fitment' }, { keyword: 'tabbar' })
        .then(data => {
          if (data && data.content) {
            this.tabbarDes = JSON.parse(data.content);
          }
        })
        .catch(error => {
          console.error('错误信息', error);
        });
    },
    changeRadio(e) {
      this.enable_live = e;
    }
  }
};
</script>
<style lang="less" scoped>
@import './style.less';
</style>
