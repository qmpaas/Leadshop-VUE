<template>
  <div class="plugins">
    <div class="plugins-toolslist">
      <template v-for="(item, index) in plugins">
        <router-link :to="{ path: item.path }" :key="index" tag="div" class="plugins-toolslist__item">
          <img :src="item.cover" class="__icon" />
          <div class="__info">
            <h3>{{ item.title }}</h3>
            <p>{{ item.details }}</p>
          </div>
          <div class="__btn" @click.stop="toUrl(1)">详情</div>
        </router-link>
      </template>
    </div>
    <div class="clear"></div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      plugins: [
        {
          name: 'task',
          title: '任务中心',
          details: '完成任务攒积分，用积分换商品',
          path: '/plugins/task/index',
          cover: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/icon-cover.png'
        }
      ]
    };
  },
  methods: {
    toUrl() {
      this.$router.push({ path: '/plugins/details', query: { keyword: 'task' } });
    }
  }
};
</script>
<style lang="less" scoped="true">
.plugins {
  width: 100%;
  background: #ffffff;
  border-radius: 16px;
  padding: 12px;
  box-sizing: border-box;
  min-height: 700px;

  .clear {
    clear: both;
  }

  .plugins-toolslist {
    padding: 0;
    margin: 0;

    .plugins-toolslist__item {
      position: relative;
      cursor: pointer;
      width: 302px;
      height: 72px;
      background: #f3f5f7;
      border-radius: 8px;
      float: left;
      margin: 12px;

      /**
     *  #F3F5F7
     */
      .__btn {
        position: absolute;
        width: 40px;
        height: 28px;
        background: #ffffff;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        text-align: center;
        line-height: 26px;
        right: 12px;
        top: 32px;
        display: block;
      }

      &:hover {
        .__btn {
          display: block;
        }
      }

      .__icon {
        position: absolute;
        width: 40px;
        height: 40px;
        left: 16px;
        top: 16px;
      }

      .__info {
        position: absolute;
        left: 68px;
        top: 16px;
        height: 60px;

        h3 {
          height: 20px;
          line-height: 20px;
          font-size: 14px;
          font-weight: 400;
          color: #262626;
          margin: 0;
        }

        p {
          height: 20px;
          line-height: 20px;
          font-size: 12px;
          font-weight: 400;
          color: #8c8c8c;
          margin: 0;
        }
      }
    }
  }
}
</style>
