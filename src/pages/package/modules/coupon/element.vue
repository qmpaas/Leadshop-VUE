<template>
  <div class="coupon">
    <div class="le-coupon-box" :class="[couponBox]">
      <div
        class="le-coupon-item"
        :class="[couponItem]"
        :style="[itemStyle]"
        v-for="(item, index) in newData"
        :key="index"
      >
        <div class="le-item-Jagged" v-if="content.style === 2"></div>
        <div class="le-coupon-item-content flex">
          <div class="le-coupon-item-left" :style="[borderStyle, leftStyle]">
            <div class="le-coupon-item-price" :style="[textStyle, priceStyle]">{{ item.sub_price | setNumber }}</div>
            <div class="le-coupon-iem-appoint" v-if="facade.list_style !== 1" :style="[textStyle, appointStyle]">
              {{ item.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}
            </div>
            <div class="le-coupon-item-min" :style="[textStyle, minStyle]">
              <template v-if="item.expire_type === 1"> 满{{ item.min_price | setNumber }}可用 </template>
              <template v-else> 无门槛 </template>
            </div>
          </div>
          <div class="le-coupon-item-center">
            <template v-if="content.style === 1">
              <div class="le-item-doc le-item-doc-a"></div>
              <div class="le-item-doc le-item-doc-b"></div>
              <div class="le-item-center">
                <div class="sawtooth"></div>
                <div class="le-item-center-doc le-item-center-doc-a" :style="[borderStyle]"></div>
                <div class="le-item-center-doc le-item-center-doc-b" :style="[borderStyle]"></div>
              </div>
            </template>
            <div v-else-if="content.style === 2" :style="[lineColor]" class="le-coupon-item-center-line"></div>
          </div>
          <div class="le-coupon-item-right" :class="[rightClass]" :style="[borderStyle, rightStyle]">
            <div
              v-if="facade.list_style === 1"
              class="flex flex-sub flex-direction justify-between le-coupon-item-text"
            >
              <div :style="[textStyle]" class="le-coupon-item-name">{{ item.name }}</div>
              <div class="le-coupon-iem-appoint" :style="[textStyle, appointStyle]">
                {{ item.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}
              </div>
            </div>
            <div class="le-coupon-btn" :style="[textStyle, couponBtn]">领取</div>
          </div>
        </div>
        <div class="le-item-Jagged" v-if="content.style === 2"></div>
      </div>
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
      list: []
    };
  },
  computed: {
    newData: function () {
      if (this.content.data.length === 0) {
        let item = {
          expire_type: 2,
          appoint_type: 1,
          name: '优惠券名称',
          sub_price: 88
        };
        let _array = [item, item, item];
        if (this.facade.list_style === 2) {
          _array.push(item);
        }
        return _array;
      } else {
        return this.content.data;
      }
    },
    couponBox: function () {
      if (this.facade.list_style === 1) {
        return '';
      } else if (this.facade.list_style === 2) {
        return 'flex flex-wrap';
      } else if (this.facade.list_style === 3) {
        return 'flex';
      }
    },
    couponItem: function () {
      let str = '';
      if (this.content.style === 3) {
        str += 'fillet ';
      }
      if (this.facade.list_style === 1) {
        str += '';
      } else if (this.facade.list_style === 2) {
        str += 'le-item-marginRight-odd ';
      } else if (this.facade.list_style === 3) {
        str += 'le-item-marginRight ';
      }
      return str;
    },
    rightClass: function () {
      if (this.facade.list_style === 1) {
        return 'flex ';
      } else if (this.facade.list_style === 2) {
        return '';
      } else if (this.facade.list_style === 3) {
        return '';
      }
    },
    itemStyle: function () {
      let style = {
        backgroundColor: this.facade.background_color
      };
      if (this.facade.list_style === 1) {
        style.width = 355 + 'px';
        style.marginBottom = 5 + 'px';
      } else if (this.facade.list_style === 2) {
        style.width = 174.5 + 'px';
        style.marginBottom = 5 + 'px';
      } else if (this.facade.list_style === 3) {
        style.width = 140 + 'px';
      }
      return style;
    },
    textStyle: function () {
      return {
        color: this.facade.title_color
      };
    },
    borderStyle: function () {
      return {
        borderColor: this.facade.title_color
      };
    },
    leftStyle: function () {
      let border = '1px solid ' + this.facade.title_color;
      let style = {};
      if (this.content.style === 1) {
        style = {
          borderTop: border,
          borderBottom: border,
          borderLeft: border
        };
      }
      if (this.facade.list_style === 1) {
        style.width = 100 + 'px';
      } else if (this.facade.list_style === 2) {
        style.width = 119 + 'px';
      } else if (this.facade.list_style === 3) {
        style.width = 84 + 'px';
      }
      return style;
    },
    rightStyle: function () {
      let border = '1px solid ' + this.facade.title_color;
      let style = {};
      if (this.content.style === 1) {
        style = {
          borderTop: border,
          borderBottom: border,
          borderRight: border
        };
      }
      if (this.facade.list_style === 1) {
        style.width = 230 + 'px';
      } else if (this.facade.list_style === 2) {
        style.width = 32 + 'px';
      } else if (this.facade.list_style === 3) {
        style.width = 32 + 'px';
      }
      return style;
    },
    priceStyle: function () {
      let style = {};
      if (this.facade.list_style === 1) {
        style.lineHeight = 26 + 'px';
        style.marginTop = 12.5 + 'px';
        style.fontSize = 22 + 'px';
      } else if (this.facade.list_style === 2) {
        style.lineHeight = 22 + 'px';
        style.marginTop = 8 + 'px';
        style.fontSize = 22 + 'px';
      } else if (this.facade.list_style === 3) {
        style.lineHeight = 22 + 'px';
        style.marginTop = 8 + 'px';
        style.fontSize = 22 + 'px';
      }
      return style;
    },
    minStyle: function () {
      let style = {};
      if (this.facade.list_style === 1) {
        style.lineHeight = 18 + 'px';
        style.fontSize = 12 + 'px';
      } else if (this.facade.list_style === 2) {
        style.lineHeight = 14 + 'px';
        style.fontSize = 10 + 'px';
      } else if (this.facade.list_style === 3) {
        style.lineHeight = 14 + 'px';
        style.fontSize = 10 + 'px';
      }
      return style;
    },
    couponBtn: function () {
      let style = {};
      if (this.facade.list_style === 1) {
        style.width = 63 + 'px';
        style.height = 63 + 'px';
        style.lineHeight = 63 + 'px';
      } else if (this.facade.list_style === 2) {
        style.writingMode = 'vertical-rl';
        style.height = 63 + 'px';
        style.lineHeight = 30 + 'px';
        style.width = 30 + 'px';
      } else if (this.facade.list_style === 3) {
        style.writingMode = 'vertical-rl';
        style.height = 63 + 'px';
        style.lineHeight = 30 + 'px';
        style.width = 30 + 'px';
      }
      return style;
    },
    appointStyle: function () {
      let style = {};
      if (this.facade.list_style === 1) {
      } else if (this.facade.list_style === 2) {
        style.textAlign = 'center';
      } else if (this.facade.list_style === 3) {
        style.textAlign = 'center';
      }
      return style;
    },
    lineColor: function () {
      return {
        backgroundImage: `repeating-linear-gradient(180deg, ${this.facade.title_color}, ${this.facade.title_color} 4px, transparent 0, transparent 8px)`
      };
    }
  },
  filters: {
    setNumber: function (num) {
      return Number(num);
    }
  }
};
</script>
<style lang="less" scoped>
@import './element.less';
</style>
