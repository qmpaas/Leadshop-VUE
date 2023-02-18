<template>
  <div class="wechatLive" :style="[backgroundColor]">
    <div class="le-head flex justify-between">
      <div class="le-title">直播间</div>
      <div class="flex align-center" :style="[arrowRightColor]" v-if="content.more.isShow">
        <span class="le-more-text">{{ content.more.text }}</span>
        <i class="le-icon le-icon-arrow-right"></i>
      </div>
    </div>
    <div class="le-body" :style="[bodyStyle]" :class="listStyle === 2 ? 'flex flex-wrap' : ''">
      <div
        class="le-item"
        :class="[listStyle === 1 ? ' le-item-one' : listStyle === 2 ? ' le-item-two' : 'le-item-three']"
        :key="index"
        :style="[itemMarinBottom]"
        v-for="(item, index) in content.number"
      >
        <div
          class="le-item--box flex"
          :style="[itemStyle(index)]"
          :class="[listStyle === 1 ? 'flex-direction' : listStyle === 2 ? 'flex-direction' : '']"
        >
          <div class="le-image-box">
            <img
              width="100%"
              height="100%"
              style="object-fit: cover"
              src="./../../../../assets/images/wechat-live.png"
            />
            <div class="le-status-tag">
              <img class="le-icon" src="./../../../../assets/images/live-status.gif" width="12px" height="12px" />
              <span>直播中</span>
            </div>
            <div class="le-user flex align-center" v-if="listStyle !== 3">
              <el-avatar class="le-user-avatar" icon="el-icon-user-solid"></el-avatar>
              <span class="le-user-name">主播名</span>
            </div>
          </div>
          <div class="le-content" :class="listStyle === 3 ? 'flex-sub' : ''">
            <div class="le-live-name">直播间名称</div>
            <div class="le-user flex align-center" v-if="listStyle === 3">
              <el-avatar class="le-user-avatar" icon="el-icon-user-solid"></el-avatar>
              <span class="le-user-name">主播名</span>
            </div>
            <div class="le-goods flex" v-if="showGoods">
              <img class="le-img" src="./../../../../assets/images/supplies.png" width="40px" height="40px" alt="" />
              <div>
                <div class="le-name">商品名称</div>
                <div class="le-price">￥999.99</div>
              </div>
            </div>
          </div>
        </div>
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
    return {};
  },
  computed: {
    backgroundColor() {
      return {
        backgroundColor: this.facade.background_color
      };
    },
    arrowRightColor() {
      return {
        color: this.content.more.color
      };
    },
    listStyle() {
      return this.facade.list_style;
    },
    itemStyle() {
      return function (index) {
        let style = {};
        if (this.listStyle === 2 && index % 2 === 0) {
          style.marginRight = this.facade.cardSpacing / 2 + 'px';
        }
        if (this.listStyle === 2 && index % 2 === 1) {
          style.marginLeft = this.facade.cardSpacing / 2 + 'px';
        }
        return style;
      };
    },
    showGoods() {
      return this.content.isShowGoods;
    },
    itemMarinBottom() {
      return {
        marginBottom: this.facade.cardSpacing + 'px'
      };
    },
    bodyStyle() {
      return {
        paddingLeft: this.facade.leftRightMargins + 'px',
        paddingRight: this.facade.leftRightMargins + 'px'
      };
    }
  }
};
</script>

<style lang="less" scoped>
@import './element.less';
</style>
