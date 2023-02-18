<template>
  <el-dialog :visible.sync="showDialog" title=" " width="390px" top="35vh">
    <div class="flex flex-direction  align-center">
      <div class="le-title">
        <span class="le-icon le-icon-chenggong"></span>
        <span>提交成功</span>
      </div>
      <div class="le-prompt-text">
        {{info.number}}条评价已抓取成功
      </div>
      <div class="flex align-center justify-center">
        <el-button type="text" @click="routerView">查看评价</el-button>
        <span class="line"></span>
        <el-button type="text" @click="again">继续抓取</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "fetched-success",
  props: {
    value: {
      type: Boolean
    },
    info: {
      type: Object
    }
  },
  computed: {
    showDialog: {
      get({value}) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    routerView() {
      this.$router.push({
        path: '/practical/evaluation/view-reviews',
        query: {
          good: encodeURIComponent(
            JSON.stringify({
              image: this.info.slideshow,
              id: this.info.goods_id,
              name: this.info.name
            })
          ),
          type: this.info.type
        }
      });
    },
    again() {
      this.$emit("confirm");
      this.showDialog = false;
    }
  }
}
</script>

<style scoped lang="less">
/deep/ .el-dialog__header {
  padding: 50px 0 0 0;
}

.line {
  margin: 0 10px;
  height: 15px;
  width: 1px;
  background: #623ceb;
}

.el-button--text {
  padding: 0 0;
}

.le-icon-chenggong {
  font-size: 22px;
  color: #53C41A;
  margin-right: 15px;
}

/deep/ .el-dialog__body {
  padding-bottom: 30px;
}

.le-prompt-text {
  margin: 15px 0 30px 0;
}

.le-title {
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  line-height: 22px;
}
</style>
