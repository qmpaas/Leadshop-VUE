<template>
  <el-scrollbar class="logistics-step flex flex-direction">
    <div class="le-step" v-for="(item, index) in list" :key="index">
      <div class="le-step__head">
        <div class="le-step__line" v-if="index !== list.length - 1"></div>
        <div class="le-step__dot" :class="{ 'le-select': index === 0 }"></div>
      </div>
      <div class="le-step__main">
        <div class="le-step__description">
          <div class="le-step__content">
            {{ item.desc }}
          </div>
          <div class="le-step__datetime">{{ item.datetime }}</div>
        </div>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
export default {
  name: 'logisticsStep',
  props: {
    list: {
      type: Array,
      default: function () {
        return [];
      }
    }
  },
  mounted() {}
};
</script>

<style scoped lang="scss">
.logistics-step {
  height: 100%;
  padding-left: 15px;
  /deep/.el-scrollbar__wrap {
    padding-top: 20px;
  }
}

.le-step {
  display: flex;
  position: relative;
  flex-basis: 50%;

  .le-step__head {
    width: 8px;
    flex-grow: 0;
    border-color: #ff0000;

    .le-step__line {
      margin-right: 0;
      width: 1px;
      top: 0;
      bottom: 0;
      left: 4px;
      position: absolute;
      background: #dcdfe6;
    }

    .le-step__dot {
      position: relative;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      z-index: 1;
      background: #dcdfe6;
    }

    .le-step__dot.le-select {
      background: #623ceb;
    }
  }

  .le-step__main {
    padding-left: 10px;
    flex-grow: 1;
    font-size: 12px;
  }

  .le-step__description {
    padding-right: 10%;
    margin-top: -5px;
    margin-bottom: 20px;
    .le-step__datetime {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 18px;
    }
    .le-step__content {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      line-height: 18px;
    }
  }
}
</style>
