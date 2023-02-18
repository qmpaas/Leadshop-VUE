<template>
  <div class="plugins-details">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item class="el-icon-arrow_start">
        <a href="javascript:void(history.back())">
          {{ plugins[keyword].menu }}
        </a>
      </el-breadcrumb-item>
      <el-breadcrumb-item>{{ plugins[keyword].title }}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="plugins-details__header">
      <img :src="plugins[keyword].cover" alt="" class="__header_cover" />
      <h3 class="__header_title">{{ plugins[keyword].title }}</h3>
      <p class="__header_declare">{{ plugins[keyword].details }}</p>
    </div>
    <div class="plugins-details__body">
      <h3 class="__header_title">应用详情</h3>
      <div class="flex justify-center">
        <img :src="plugins[keyword].body" />
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  data() {
    return {
      keyword: 'task',
      plugins: {
        task: {
          link: '/plugins/tools',
          menu: '用户维护',
          name: 'task',
          title: '任务中心',
          details:
            '任务中心”通过激励用户在商城完成任务，获得积分，使用积分兑换商品，达到增强用户粘性的目的。任务的设置有获取用户信息、促进每日活跃、提高订单转化三个方向，为商家维护用户提供强大的工具。',
          path: '/plugins/task/index',
          cover: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/plugins/plugins-task-icon.png',
          body: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/plugins/plugins-task-body.png'
        },
        coupon: {
          link: '/plugins/features',
          menu: '营销玩法',
          name: 'coupon',
          title: '优惠券',
          details: '买家持优惠券享受减免优惠',
          path: '/plugins/coupon/index',
          cover: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/plugins/plugins-coupon-icon.png',
          body: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/plugins/plugins-coupon-body.png'
        },
        live: {
          link: '/plugins/practical',
          menu: '实用工具',
          name: 'coupon',
          title: '小程序直播',
          details: '跟上直播热潮，与观众实时互动',
          path: '/plugins/coupon/index',
          cover: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/plugins/plugins-live-icon.png',
          body: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/plugins/plugins-live-body.png'
        },
        evaluation: {
          link: '/plugins/practical',
          menu: '实用工具',
          name: 'coupon',
          title: '评价助手',
          details: '用好口碑提高订单转化率',
          path: '/plugins/coupon/index',
          cover: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/plugins/plugins-evaluation-icon.png',
          body: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/plugins/plugins-evaluation-body.png'
        }
      }
    };
  },

  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  mounted() {
    this.keyword = this.$route.query.keyword;
    let activeMenu;
    if (this.keyword === 'coupon') {
      activeMenu = '/plugins/features';
    } else if (this.keyword === 'task') {
      activeMenu = '/plugins/tools';
    } else if (this.keyword === 'live') {
      activeMenu = '/plugins/practical';
    } else if (this.keyword === "evaluation") {
      activeMenu = '/plugins/practical';
    }
    this.$route.meta.activeMenu = activeMenu;
    this.$router.replace({
      meta: {
        activeMenu: activeMenu
      }
    });
    this.$router.replace({
      query: {
        keyword: this.keyword
      }
    });
  },
  methods: {
    toUrl() {}
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
}

/deep/ .plugins-details {
  .el-breadcrumb__item {
    .el-breadcrumb__inner {
      color: #8c8c8c;
      font-weight: 400;
    }
  }

  .el-icon-arrow_start {
    .el-breadcrumb__inner {
      color: #262626;
      font-weight: 400;
    }
  }
}

.plugins-details {
  .plugins-details__header {
    margin-top: 25px;
    position: relative;
    width: 1296px;
    height: 168px;
    background: #ffffff;
    border-radius: 16px;

    .__header_cover {
      position: absolute;
      top: 24px;
      left: 24px;
      width: 120px;
      height: 120px;
    }

    .__header_title {
      position: absolute;
      left: 168px;
      top: 34px;
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      line-height: 12px;
      padding: 0;
      margin: 0;
    }

    .__header_declare {
      position: absolute;
      left: 168px;
      top: 70px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 18px;
      padding: 0;
      margin: 0;
      padding-right: 24px;
    }
  }

  .plugins-details__body {
    width: 1296px;
    min-height: 683px;
    background: #ffffff;
    border-radius: 16px;
    padding: 24px;
    margin-top: 24px;

    .__header_title {
      position: relative;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      padding: 0;
      margin: 0;
      padding-left: 15px;
    }

    .__header_title:before {
      position: absolute;
      content: '';
      width: 4px;
      height: 16px;
      background: #623ceb;
      left: 0;
      top: 4px;
    }
  }
}
</style>
