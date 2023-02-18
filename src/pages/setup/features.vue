<template>
  <div class="le-marin">
    <div class="le-card">
      <el-tabs v-model="activeName">
        <el-tab-pane label="接口设置" name="interface">
          <Interface></Interface>
        </el-tab-pane>
        <el-tab-pane label="定时任务" name="timing">
          <Timing></Timing>
        </el-tab-pane>
        <el-tab-pane label="定位服务" name="position">
          <Position></Position>
        </el-tab-pane>
        <el-tab-pane label="服务器设置" name="server">
          <Server></Server>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import Interface from "./components/interface.vue";
import Timing from "./components/timing.vue";
import Position from "./components/position.vue";
import Server from "./components/server.vue";

export default {
  name: "features",
  components: {
    Interface,
    Timing,
    Position,
    Server
  },
  data() {
    return {
      activeName: "interface", //默认
    };
  },
  mounted() {
    this.tabsCode(); //tab
  },
  methods: {
    //获取当前点击下标
    tabsCode() {
      // 比较结果activeName的值
      if (this.$route.query.activeName != null) {
        this.activeName = this.$route.query.activeName;
      }
    },
  }
}
</script>

<style scoped lang="less">
.le-marin >.le-card {
  &:first-child {
    background: transparent;
    border-radius: 0;
    padding:0;
    margin-bottom: 24px;
    /deep/.el-tabs__header {
      border-radius: 16px;
      padding: 0 20px;
      overflow: hidden;
      background: #ffffff;
      margin-bottom: 24px;
      .el-tabs__nav-wrap:after {
        display: none;
      }
      .el-tabs__item {
        height: 64px;
        line-height: 64px;
      }
      .el-tabs__active-bar {
        height: 3px;
      }
    }
    /deep/.el-tabs__content {
      background: #F3F5F7;
    }
  }
}

</style>
