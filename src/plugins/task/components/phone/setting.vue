<template>
  <div class="task-uni">
    <div class="task-background">
      <img src="@/assets/images/task-user-bg.png" />
      <!--       <div class="task-background1"></div>
      <div class="task-background2"></div>
      <img class="task-background3" src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/tack-backgroud-top.png" />
      <div class="task-background__span">积分规则</div>
      <div class="task-background__current">当前积分</div>
      <img class="task-background__icon" src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral.png" />
      <div class="task-background__info">
        <span class="_number">
          5892
        </span>
        <span class="_detail">
          明细
        </span>
        <span class="iconfont iconbtn_arrow"></span>
      </div>
      <div class="task-background__btn">兑换商品</div> -->
    </div>
    <div class="task-main">
      <div class="task-panel" v-if="signin && signin.status">
        <div class="task-panel__title">
          {{ sprintf(signin.remark, signin.acquire) }}
          <span v-if="sustain && sustain.status">
            , {{ sprintf(sustain.remark, sustain.total, sustain.maximum) }}
          </span>
        </div>
        <div class="task-panel__title" v-if="sustain && sustain.status">已连续签到1天</div>
        <div class="task-panel__lists">
          <div class="task-panel__item">
            <div class="__bg active">
              <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral_s.png" />
              <span class="__tips">已签</span>
            </div>
            <div class="__date">1.1</div>
          </div>
          <div class="task-panel__item">
            <div class="__bg">
              <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral_w.png" />
              <span class="__tips">漏签</span>
            </div>
            <div class="__date">1.2</div>
          </div>
          <div class="task-panel__item">
            <div class="__bg active">
              <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral_s.png" />
              <span class="__tips">已签</span>
            </div>
            <div class="__date">1.3</div>
          </div>
          <div class="task-panel__item">
            <div class="__bg">
              <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral.png" />
              <span class="__tips"> {{ signin.acquire }}</span>
            </div>
            <div class="__date">1.4</div>
          </div>
          <div class="task-panel__item">
            <div class="__bg">
              <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral.png" />
              <span class="__tips"> {{ signin.acquire }}</span>
            </div>
            <div class="__date">1.5</div>
          </div>
          <div class="task-panel__item">
            <div class="__bg">
              <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral.png" />
              <span class="__tips"> {{ signin.acquire }}</span>
            </div>
            <div class="__date">1.6</div>
          </div>
          <div class="task-panel__item">
            <div class="__bg">
              <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task_integral.png" />
              <span class="__tips"> {{ signin.acquire }}</span>
            </div>
            <div class="__date">1.7</div>
          </div>
        </div>
        <div class="task-panel__button">签到领积分</div>
      </div>
      <div class="task-body" v-if="noTask">
        <div class="task-card" v-for="(item, index) in taskList" :key="index" v-if="item.display">
          <div class="task-card__header">{{ item.title }}</div>
          <div class="task-card__lists">
            <template v-for="(i, k) in item.data">
              <div class="__item" v-if="i.status">
                <img class="__icon" :src="i.icon" />
                <div class="__info">
                  <div class="__title">{{ i.name }}</div>
                  <div class="__tips" v-if="i.type == 2">{{ sprintf(i.remark, i.acquire) }}</div>
                  <div class="__tips" v-else>{{ sprintf(i.remark, i.total, i.acquire) }}</div>
                  <!--<div class="__tips" v-if="i.keyword=='goods' || i.keyword=='order'">
                                        {{sprintf(i.prompt,i.maximum)}}
                                    </div> -->
                  <!--                   <div class="__notice">20积分待领取</div> -->
                  <div class="__btn">去完成</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="he-no-content-yet card" v-if="!noTask">
        <img class="he-empty__image" src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task-score-empty.png" />
        <div>暂无相关积分任务</div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
export default {
  components: {},
  props: {
    task: {
      type: [Array]
    }
  },
  data() {
    return {
      noTask: true,
      signin: {},
      sustain: {},
      taskList: {}
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {},
  /**
   * 页面渲染前
   * @return {[type]} [description]
   */
  created() {},
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {
    task: {
      //监听的对象
      deep: true, //深度监听设置为 true
      handler: function (newV, oldV) {
        let a = newV;
        this.handleUpdate();
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.handleUpdate();
  },
  methods: {
    handleUpdate() {
      let { task } = this;

      let array = {
        buy: {
          title: '购买任务',
          data: []
        },
        active: {
          title: '活跃任务',
          data: []
        },
        base: {
          title: '基础任务',
          data: []
        }
      };
      let res = {};
      for (let index in task) {
        let item = task[index];

        if (item.keyword == 'signin') {
          this.signin = item;
        }

        if (item.keyword == 'sustain') {
          this.sustain = item;
        }

        res[item.keyword] = item;
      }
      array = {
        buy: {
          title: '购买任务',
          display: res['goods'].status || res['order'].status,
          data: [res['goods'], res['order']]
        },
        active: {
          title: '活跃任务',
          display: res['share'].status || res['browse'].status || res['invite'].status,
          data: [res['share'], res['browse'], res['invite']]
        },
        base: {
          title: '基础任务',
          display: res['perfect'].status || res['binding'].status,
          data: [res['perfect'], res['binding']]
        }
      };
      this.noTask = array['buy'].display || array['active'].display || array['base'].display || this.signin.status;
      this.taskList = array;
    },
    /**
     * 查找统换
     * @return {[type]} [description]
     */
    sprintf() {
      var arg = arguments,
        str = arg[0] || '',
        i,
        n;
      for (i = 1, n = arg.length; i < n; i++) {
        str = str.replace(/%s/, arg[i]);
      }
      return str;
    }
  }
};
</script>
<style lang="less" scoped>
@import './style.less';

.he-no-content-yet {
  font-size: 26px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #999999;
  line-height: 1.3;
  text-align: center;
  margin-top: 40px;
  position: relative;
  z-index: 999;
}

.he-no-content-yet.card {
  background: #ffffff;
  border-radius: 16px;
  width: 95%;
  margin: 0 auto;
  padding: 40px;
  margin-bottom: 40px;
}

.he-empty__image {
  width: 320px;
  height: 320px;
}
</style>
