<template>
  <div class="guide" v-if="!is_close" @click="toStep">
    <template v-for="(item, index) in masks">
      <div v-if="step === index" :key="index">
        <div
          class="guide-mask"
          :style="{ top: position.top, left: position.left, width: item.width, height: item.height }"
        ></div>
        <div class="guide-animation" :style="{ top: position.top, left: position.left }">
          <img :src="item.src" />
        </div>
      </div>
    </template>
    <div class="guide-step">
      <img :src="guideNext" @click.stop="toStep" />
      <p @click.stop="toStop">跳过引导</p>
    </div>
  </div>
</template>

<script type="text/javascript">
import guideData from './guide.json';

export default {
  data() {
    return {
      is_close: true,
      pagesData: [],
      step: 0,
      ctx: '',
      position: {
        top: '223px',
        left: '205px',
        width: '87px',
        height: '92px',
        src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide001.png'
      },
      masks: [
        {
          id: 'guide001',
          index: -9,
          top: '223px',
          left: '205px',
          width: '87px',
          height: '92px',
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide001.png'
        },
        {
          id: 'guide002',
          index: -9,
          top: '223px',
          left: '205px',
          width: '0',
          height: '0',
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide002.png',
          offsetX: -87,
          offsetY: 0
        },
        {
          id: 'guide003',
          index: 1,
          top: '223px',
          left: '205px',
          width: '60px',
          height: '52px',
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide003.png',
          offsetX: -13,
          offsetY: -10
        },
        {
          id: 'guide004',
          index: -2,
          top: '223px',
          left: '205px',
          width: '370px',
          height: '210px',
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide004.png',
          offsetX: 13,
          offsetY: 13
        },
        {
          id: 'guide003',
          index: 1,
          top: '223px',
          left: '205px',
          width: '48px',
          height: '35px',
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide005.png',
          offsetX: -5,
          offsetY: 35
        },
        {
          id: 'guide003',
          index: 1,
          top: '223px',
          left: '205px',
          width: '48px',
          height: '80px',
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide006.png',
          offsetX: -5,
          offsetY: 72
        },
        {
          id: 'guide004',
          index: -2,
          top: '223px',
          left: '205px',
          width: '370px',
          height: '210px',
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide007.png',
          offsetX: 13,
          offsetY: 13
        }
      ]
    };
  },
  inject: ['self'],
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    width() {
      return document.body.offsetWidth;
    },
    height() {
      return document.body.offsetHeight;
    },
    guideNext() {
      if (this.step < 6) {
        return 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide-next.png';
      } else {
        return 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/guide/guide-end.png';
      }
    }
  },
  /**
   * 页面加载执行
   * offsetLeft
   * offsetTop
   * offsetWidth
   * offsetHeight
   * @return {[type]} [description]
   */
  mounted() {
    let is_guide = window.localStorage.getItem('is_guide');
    if (!is_guide) {
      this.onSetPage();
    }
  },
  methods: {
    onSetPage() {
      this.is_close = false;
      let el = document.getElementById('guide002');
      el.children[0].style.display = 'none';
      setTimeout(() => {
        this.pagesData = JSON.parse(JSON.stringify(this.$store.state.finish.pages));
        this.$nextTick(() => {
          this.$store.commit('finish/setPagesData', guideData);
        });
      }, 1000);
      this.setPosition();
    },
    toStep() {
      if (this.step == 1) {
        let el = document.getElementById('guide002');
        el.children[0].style.display = 'block';
      }
      if (this.step < 6) {
        this.step++;
        this.setPosition();
      } else {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$store.commit('finish/setPagesData', this.pagesData);
          });
        }, 300);
        this.is_close = true;
        window.localStorage.setItem('is_guide', 1000);
      }
    },
    toStop() {
      setTimeout(() => {
        this.$nextTick(() => {
          this.$store.commit('finish/setPagesData', this.pagesData);
          document.getElementById('min-page').style.display = 'block';
        });
      }, 300);
      this.is_close = true;
      window.localStorage.setItem('is_guide', 1000);
    },
    setPosition(argument) {
      let mask = this.masks[this.step];
      let id = mask.id;
      let index = mask.index;
      if (index !== -9) {
        this.$store.commit('finish/setIndex', index);
      }
      this.$nextTick(() => {
        let el = document.getElementById(id);
        let position = el.getBoundingClientRect();
        this.position.top = position.y + mask.offsetY + 'px';
        this.position.left = position.x + mask.offsetX + 'px';
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import './guide.less';
</style>
