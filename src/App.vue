<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script type="text/javascript">
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('setting');

export default {
  name: 'App',
  methods: {
    ...mapActions(['getSettingInfo', 'getVersion'])
  },
  mounted() {
    if (localStorage.getItem('Authorization')) {
      this.getSettingInfo();
    }
    this.getVersion();
    //获取插件设置
    this.$store.dispatch('plugins/getPlugins');
    //用于延时测试数据
    setTimeout(() => {
      this.$manifest('task', 'status');
    }, 2000);
  }
};
</script>
<style type="text/css" lang="less">
@import './assets/less/main.less';

body {
  text-size-adjust: none;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  min-width: 1024px;
}

.task-action.el-message-box {
  width: 360px;
  height: 226px;
  background: #ffffff;
  border-radius: 16px;

  .el-message-box__header {
    padding-top: 32px;

    .el-message-box__title {
      display: block !important;
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      line-height: 20px;
      text-align: center;
    }
  }

  .el-message-box__content {
    padding: 0 40px;
  }

  .el-button {
    width: 72px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
  }

  .el-button.el-button--primary {
    width: 72px;
    height: 32px;
    background: #623ceb;
    border-radius: 4px;
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #ffffff;
  }

  .el-input.el-input--miniz {
    width: 280px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}

.el-message-box__message {
  color: #262626;
  font-weight: 400;
  font-size: 16px;
  font-family: Microsoft YaHei;
}

.select-cover__120 {
  position: relative;
  width: 120px;
  height: 120px;
  flex: 1;

  &-add {
    width: 120px;
    height: 120px;
    background: rgba(0, 0, 0, 0.02);
    border: 1px dashed #dcdfe6;
    border-radius: 4px;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
    cursor: pointer;
  }

  &-icon {
    display: block;
    font-size: 26px;
    width: 26px;
    height: 26px;
    line-height: 26px;
    color: #bfbfbf;
    margin: 8px auto;
  }

  &-text {
    display: block;
    font-size: 14px;
    font-weight: 400;
    line-height: 30px;
    color: #8c8c8c;
  }

  &-edit {
    position: absolute;
    width: 120px;
    height: 120px;
    cursor: pointer;

    .el-image {
      width: 120px;
      height: 120px;
    }
  }

  &-tips {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 120px;
    height: 28px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 4px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    text-align: center;
    line-height: 28px;
    display: none;
  }

  &-edit:hover {
    .select-cover__120-tips {
      display: block;
    }
  }
}

.task-date {
  .el-date-picker__header {
    button:first-child {
      width: 100px;
      background-color: #000 !important;
      display: none !important;
    }

    span:nth-child(3) {
      width: 100px;
      background-color: #000 !important;
      display: none !important;
    }

    button:nth-last-child(2) {
      width: 100px;
      background-color: #000 !important;
      display: none !important;
    }
  }
}

.el-tooltip__popper.is-dark {
  background-color: #ffffff !important;
  color: #000 !important;
}

.task-tooltip {
  background-color: #ffffff;
}
</style>
