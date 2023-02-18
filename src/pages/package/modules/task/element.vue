<template>
  <div
    class="goodstask"
    :style="{
      backgroundColor: facade.background_color
    }"
  >
    <div class="control-task" v-if="is_emtpy">
      <div class="control-task_header" :style="{ backgroundColor: facade.title_background, color: facade.title_color }">
        签到送积分
      </div>
      <div class="control-task_body" :style="{ backgroundColor: facade.content_background }">
        <img class="control-task_icon" :src="getIconUrl" />
        <div class="control-task_title" :style="{ color: facade.content_color }">
          每日签到获得10积分<br />连续签到5天，获得额外50积分
        </div>
        <div
          class="control-task_button"
          :style="{ backgroundColor: facade.button_background, color: facade.button_color }"
        >
          去攒积分
        </div>
      </div>
    </div>
    <div class="control-task" v-else>
      <div class="control-task_header" :style="{ backgroundColor: facade.title_background, color: facade.title_color }">
        {{ content.task.name }}送积分
      </div>
      <div class="control-task_body" :style="{ backgroundColor: facade.content_background }">
        <img class="control-task_icon" :src="getIconUrl" />
        <div class="control-task_title" :style="{ color: facade.content_color }">{{ getRemark(content.task) }}</div>
        <div
          class="control-task_button"
          :style="{ backgroundColor: facade.button_background, color: facade.button_color }"
        >
          {{ content.title || '去攒积分' }}
        </div>
      </div>
    </div>
    <div
      class="goods-layout"
      :style="{
        paddingLeft: facade.padding + 'px',
        paddingRight: facade.padding + 'px',
        marginLeft: -facade.margin / 2 + 'px',
        marginRight: -facade.margin / 2 + 'px'
      }"
      :class="{
        larger: facade.list_style == 1,
        small: facade.list_style == 2,
        list: facade.list_style == 3,
        swipe: facade.list_style == 4
      }"
    >
      <div
        class="goods-wrapper"
        :class="{
          white: facade.card_style == 1,
          card: facade.card_style == 2,
          stroke: facade.card_style == 3,
          lucency: facade.card_style == 4,
          chamfer: facade.chamfer_style
        }"
        v-for="(item, index) in goodsData"
        :key="index"
      >
        <div
          class="goods-item"
          :style="{
            margin: facade.margin / 2 + 'px'
          }"
        >
          <div class="goods-item-photo">
            <div class="goods-item-image">
              <div class="goods-item-cover">
                <el-image style="width: 100%; height: 100%" :src="getGoodsCover(item.slideshow)" fit="cover"></el-image>
              </div>
            </div>
          </div>
          <div class="goods-item-detail" v-if="is_hide">
            <div class="goods-item-title" v-if="content.is_title">
              {{ item.name }}
            </div>
            <div class="goods-item-info">
              <div class="goods-item-price">
                <div v-if="content.is_price" class="goods-item-price__box">
                  <i class="goods-item-price__icon le-icon le-icon-jifen"></i>
                  <span class="goods-item-price__num">{{ item.task.task_number }}+</span>
                  <span class="goods-item-price__tag">¥</span
                  ><span class="goods-item-price__val">{{ item.task.task_price }}</span>
                </div>
              </div>
              <div
                class="goods-item-button"
                v-if="content.is_button"
                :class="{
                  minibnt: facade.list_style == 1,
                  bigbnt: facade.list_style == 2,
                  minibnt: facade.list_style == 3,
                  bigbnt: facade.list_style == 4
                }"
              >
                兑换
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="clear"></div>
    </div>
  </div>
</template>

<script type="text/javascript">
export default {
  props: {
    facade: {
      type: [Object, Array]
    },
    content: {
      type: [Object, Array]
    }
  },
  data() {
    return {
      goods: [
        {
          id: 1,
          name: '商品名称',
          cover: 'cover',
          task: {
            task_number: 66,
            task_price: 66
          }
        },
        {
          id: 1,
          name: '商品名称',
          cover: 'cover',
          task: {
            task_number: 66,
            task_price: 66
          }
        },
        {
          id: 1,
          name: '商品名称',
          cover: 'cover',
          task: {
            task_number: 66,
            task_price: 66
          }
        },
        {
          id: 1,
          name: '商品名称',
          cover: 'cover',
          task: {
            task_number: 66,
            task_price: 66
          }
        },
        {
          id: 1,
          name: '商品名称',
          cover: 'cover',
          task: {
            task_number: 66,
            task_price: 66
          }
        }
      ],
      goodsData: []
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    getIconUrl() {
      if (this.content.icon) {
        return this.content.icon;
      } else {
        if (this.content.task.icon) {
          return this.content.task.icon;
        }
      }
      return 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/task/task-sign-icon.png';
    },
    is_emtpy() {
      if (this.content.task) {
        if (Object.keys(this.content.task).length === 0) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    },
    is_hide() {
      if (this.facade.list_style !== 3) {
        if (!this.content.is_title && !this.content.is_price && !this.content.is_button) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    }
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {
    content: {
      deep: true,
      handler: function () {
        this.handleCheck();
      }
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.handleCheck();
    //this.handleCheckTaak();
  },
  methods: {
    /**
     * 任务功能简称
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    handleCheckTaak() {
      let keyword = this.content.task.keyword;
      this.$heshop
        .plugin('get', { include: 'task', model: 'task', keyword: keyword })
        .then(res => {
          if (res) {
            this.content.task = res;
            if (!res.status) {
              this.content.task = {};
            }
          } else {
            this.content.task = {};
          }
        })
        .catch(err => {});
    },
    getRemark(task) {
      if (task.remark) {
        let data = task.remark.split('，');
        if (task.keyword == 'signin') {
          return data[0] + '，' + data[1];
        }
        return data[0] + '\n' + data[1];
      }
      return '';
    },
    handleCheck() {
      if (this.content.type == 1 && this.content.goods && this.content.goods.length > 0) {
        this.goodsData = this.content.goods;
      } else if (this.content.type == 2) {
        this.handleAutoList();
        this.goodsData = this.goods;
      } else {
        this.goodsData = this.goods;
      }
    },
    /**
     * 获取封面信息
     * @param  {[type]} cover [description]
     * @return {[type]}       [description]
     */
    getGoodsCover(cover) {
      if (cover) {
        if (Object.prototype.toString.call(cover) === '[object Array]') {
          return cover[0];
        }
        if (Object.prototype.toString.call(cover) === '[object String]') {
          try {
            return JSON.parse(cover)[0];
          } catch (e) {
            return this.ipAddress + '/le-default-goods-bg.png';
          }
        }
      }
      return 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/le-default-goods-bg.png';
    },
    /**
     * 加载数据信息
     * @return {[type]} [description]
     */
    handleAutoList() {
      let _this = this;
      this.$heshop
        .goods('GET', { behavior: 'fitment', is_task: 1, auto: this.content.auto })
        .then(function (res) {
          if (res.length > 0) {
            _this.goodsData = res;
          }
        })
        .catch(error => {
          console.error('获取错误信息', error);
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import './element.less';
</style>
