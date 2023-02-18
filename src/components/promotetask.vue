<template>
  <div class="le-matter le-promote flex" v-loading="loading">
    <div class="le-menu">
      <div class="le-menu__item" @click="active = 0" :class="{ 'le-menu__active': active === 0 }">微信小程序</div>
      <div class="le-menu__item" @click="active = 1" :class="{ 'le-menu__active': active === 1 }">公众号</div>
    </div>
    <div class="le-not-config flex flex-direction align-center" v-if="active === 0 && notConfig">
      <div class="le-title flex align-center">
        <he-icon type="le-icon-zhushi" class="le-icon-zhushi" size="32px"></he-icon>
        <span>提示</span>
      </div>
      <div class="le-content">小程序信息未配置或未发布最新小程序线上版本，无法使用推广功能</div>
    </div>
    <template v-if="(active === 0 && !notConfig) || active === 1">
      <div class="le-poster" :style="[height]">
        <div class="le-zoom" id="poster-goods" v-if="promoteType === 'goods'">
          <div class="le-img-box">
            <img class="le-img" :src="getGoodsCover(newData.slideshow)" alt="" />
            <img class="le-box" src="@/assets/images/box_scores.png" />
          </div>
          <div class="le-content flex">
            <div class="le-left flex-sub flex flex-direction justify-between">
              <div>
                <div class="le-price">
                  <span class="le-sell-price">{{ newData.task.task_number }}积分+￥{{ newData.task.task_price }}</span>
                  <div>
                    <span class="le-line-price">￥{{ newData.line_price }}</span>
                    <span class="le-sell-number" v-if="newData.sales + newData.virtual_sales > 0"
                      >已售{{ newData.sales + newData.virtual_sales }}</span
                    >
                  </div>
                </div>
                <div class="le-name">
                  {{ newData.name | getName }}
                </div>
              </div>
              <div class="le-shop flex align--center">
                <img class="le-shop__img" :src="store_info.logo" alt="" />
                <span class="le-shop__name">{{ store_info.name }}</span>
              </div>
            </div>
            <div class="le-right">
              <img class="le-qrcode" :src="qrcodeImg" alt="" />
              <div class="le-text">长按识别{{ active === 0 ? `小程序` : `公众号` }}码</div>
            </div>
          </div>
        </div>
        <div class="le-zoom" id="poster-coupon" v-if="promoteType === 'coupon'">
          <div class="le-poster__content">
            <div class="le-store flex">
              <img class="le-store-logo" :src="store_info.logo" alt="" />
              <div>
                <div class="le-store-name">{{ store_info.name }}</div>
                <div class="le-store-desc">送你一张优惠券</div>
              </div>
            </div>
            <div class="le-poster-coupon">
              <img src="@/assets/images/qrcode-coupon-background.png" alt="" />
              <div class="le-content le-content-number">
                <span class="le-content-price">{{ newData.sub_price }}</span>
                <span class="le-content-condition">{{
                  Number(newData.min_price) === 0 ? '无门槛使用' : '满' + newData.min_price + '可用'
                }}</span>
              </div>
              <div class="le-content le-conetent-name">{{ newData.name }}</div>
              <div class="le-content le-content-date">
                可用时间:<template v-if="newData.expire_type === 1">领取当日起{{ newData.expire_day }}天内</template
                ><template v-if="newData.expire_type === 2">
                  {{ newData.begin_time | timeFormat('yyyy.mm.dd hh:MM:ss') }}-{{
                    newData.end_time | timeFormat('yyyy.mm.dd hh:MM:ss')
                  }}
                </template>
              </div>
            </div>
            <div class="le-qrcode-conent flex flex-direction align-center justify-center">
              <img :src="qrcodeImg" alt="" />
              <div class="le-text">长按识别{{ active === 0 ? `小程序` : `公众号` }}码</div>
            </div>
          </div>
        </div>
        <div
          class="le-zoom"
          id="poster-other"
          v-else-if="promoteType === 'group' || promoteType === 'index' || promoteType === 'pages'"
        >
          <div class="le-poster__content">
            <img
              class="le-poster__icon"
              :src="
                promoteType === 'group' ? newData.icon : promoteType === 'pages' ? store_info.logo : store_info.logo
              "
              alt=""
            />
            <div class="le-poster__name">
              {{ promoteType === 'group' ? newData.name : promoteType === 'pages' ? store_info.name : store_info.name }}
            </div>
            <div class="le-poster__shop" v-if="promoteType === 'group'">
              {{ store_info.name }}
            </div>
            <div class="le-hr"></div>
            <img :src="qrcodeImg" class="le-qrcode" alt="" />
            <div class="le-text">长按识别{{ active === 0 ? `小程序` : `公众号` }}码</div>
          </div>
        </div>
      </div>
      <div class="le-edit flex-sub">
        <div class="le-title">
          {{ active === 0 ? `小程序路径` : `公众号链接` }}
        </div>
        <el-input :value="url" class="le-url" disabled>
          <el-button @click="copy()" slot="append"> 复制 </el-button>
        </el-input>
        <el-button class="le-btn" @click="downLoad">下载海报</el-button>
        <el-button class="le-btn" @click="downLoadQrcode">仅下载{{ active === 0 ? `小程序` : `公众号` }}码</el-button>
      </div>
    </template>
  </div>
</template>
<script>
import html2canvas from 'html2canvas';
import copy from '@/lib/function/copy.js';

export default {
  name: 'promote',
  props: {
    value: {
      type: Object,
      default: function () {
        return '';
      }
    }
  },
  computed: {
    promoteType: function () {
      return this.value.promoteType;
    },
    newData: function () {
      return this.value.data;
    },
    qrcodeImg: function () {
      if (this.qrcode) {
        if (this.active === 0) {
          return this.qrcode.weapp.image;
        } else {
          return this.qrcode.wechat.image;
        }
      } else {
        return '';
      }
    },
    url: function () {
      if (this.qrcode) {
        if (this.active === 0) {
          return this.qrcode.weapp.url;
        } else {
          return this.qrcode.wechat.url;
        }
      } else {
        return '';
      }
    },
    height: function () {
      let style = {};
      if (this.promoteType === 'coupon') {
        style.height = '262px';
      } else if (this.promoteType === 'goods') {
        style.height = '334px';
      } else {
        style.height = '232px';
      }
      return style;
    },
    notConfig: function () {
      if (this.qrcode && this.qrcode.weapp && !this.qrcode.weapp.image) {
        return true;
      } else {
        return false;
      }
    }
  },
  data() {
    return {
      loading: false,
      active: 0,
      store_info: {},
      qrcode: null
    };
  },
  methods: {
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
      return this.ipAddress + '/le-default-goods-bg.png';
    },
    getStore() {
      let _this = this;
      return new Promise(function (resolve, reject) {
        _this.$heshop
          .search('post', { include: 'setting' }, { keyword: 'setting_collection', content_key: 'store_setting' })
          .then(res => {
            _this.store_info = res;
            resolve();
          })
          .catch(err => {
            console.error(err);
            reject();
          });
      });
    },
    getQrcode() {
      let _this = this;
      let data = {};
      if (this.promoteType === 'goods') {
        data.page = 'pages/goods/detail';
        data.scene = 'id=' + _this.newData.id;
      } else if (this.promoteType === 'coupon') {
        data.page = 'pages/coupon/detail';
        data.scene = 'id=' + _this.newData.id + '&couponShare=1';
      } else if (this.promoteType === 'group') {
        data.page = 'pages/categories/index';
        data.scene = 'id=' + _this.newData.id;
      } else if (this.promoteType === 'index') {
        data.page = 'pages/index/index';
      } else if (this.promoteType === 'pages') {
        data.page = 'pages/index/index';
        data.scene = 'id=' + _this.newData.id;
      }
      return new Promise(function (resolve, reject) {
        _this.$heshop
          .qrcode('post', data)
          .then(res => {
            _this.qrcode = res;
            resolve();
          })
          .catch(err => {
            _this.loading = false;
            if (err.status === 403) {
              _this.$message.error(err.data.message);
            }
            reject();
          });
      });
    },
    copy: function () {
      let _this = this;
      copy({
        content: _this.active === 0 ? _this.qrcode.weapp.url : _this.qrcode.wechat.url,
        success: function () {
          _this.$message.success('复制成功');
        }
      });
    },
    downLoad() {
      let id = '';
      if (this.promoteType === 'goods') {
        id = 'poster-goods';
      } else if (this.promoteType === 'coupon') {
        id = 'poster-coupon';
      } else if (this.promoteType === 'group') {
        id = 'poster-other';
      } else if (this.promoteType === 'index') {
        id = 'poster-other';
      } else if (this.promoteType === 'pages') {
        id = 'poster-other';
      }
      let name = '';
      if (this.promoteType === 'goods') {
        name = this.newData.name;
      } else if (this.promoteType === 'coupon') {
        name = this.newData.name;
      } else if (this.promoteType === 'group') {
        name = this.newData.name;
      } else if (this.promoteType === 'index') {
        name = this.store_info.name;
      }
      document.getElementById(id).style.transform = 'scale(1)';
      new html2canvas(document.getElementById(id), {
        backgroundColor: 'transparent',
        useCORS: true
      }).then(canvas => {
        let base64 = canvas.toDataURL('image/jpeg');
        this.downloadFile(base64, name);
      });
      document.getElementById(id).style.transform = 'scale(0.32)';
    },
    downLoadQrcode() {
      let name = '';
      if (this.promoteType === 'goods') {
        name = this.newData.name;
      } else if (this.promoteType === 'coupon') {
        name = this.newData.name;
      } else if (this.promoteType === 'group') {
        name = this.newData.name;
      } else if (this.promoteType === 'index') {
        name = this.store_info.name;
      }
      if (this.active === 0) {
        this.downloadFile(this.qrcode.weapp.image, name);
      } else {
        this.downloadFile(this.qrcode.wechat.image, name);
      }
    },
    downloadFile(content, fileName) {
      //下载base64图片
      let base64ToBlob = function (code) {
        let parts = code.split(';base64,');
        let contentType = parts[0].split(':')[1];
        let raw = window.atob(parts[1]);
        let rawLength = raw.length;
        let uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], {
          type: contentType
        });
      };
      let aLink = document.createElement('a');
      let blob = base64ToBlob(content); //new Blob([content]);
      let evt = document.createEvent('HTMLEvents');
      evt.initEvent('click', true, true); //initEvent 不加后两个参数在FF下会报错  事件类型，是否冒泡，是否阻止浏览器的默认行为
      aLink.download = fileName;
      aLink.href = URL.createObjectURL(blob);
      aLink.click();
    }
  },
  mounted() {
    this.loading = true;
    let _this = this;
    Promise.all([this.getStore(), this.getQrcode()])
      .then(function () {
        _this.loading = false;
      })
      .catch(function (err) {
        _this.$message.error(err.message);
        _this.loading = false;
      });
  },
  filters: {
    getName(name) {
      if (name.length > 20) {
        return name.slice(0, 20) + '...';
      } else {
        return name;
      }
    }
  }
};
</script>
<style scoped lang="scss">
.le-promote {
  padding: 0 0 20px 0;

  .le-menu {
    width: 140px;
    border-right: 1px solid #dcdfe6;
  }

  .le-menu__item {
    line-height: 1;
    text-align: center;
    padding: 12px 0;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    cursor: pointer;
  }

  .le-menu__active {
    color: #623ceb;
  }

  .le-poster {
    width: 240px;
    margin: 0 16px 0 32px;
  }

  .le-zoom {
    transform: scale(0.32);
    transform-origin: 0 0;
  }

  #poster-goods {
    width: 750px;
    height: 1046px;
    padding: 32px;
    background-color: RGBA(242, 244, 246, 1);

    .le-img-box {
      width: 686px;
      height: 686px;
      border-radius: 16px;
      position: relative;
    }

    .le-box {
      position: absolute;
      left: 0;
      top: 0;
      width: 686px;
      height: 686px;
    }

    .le-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 686px;
      height: 686px;
      border-radius: 16px;
    }

    .le-content {
      width: 686px;
      height: 280px;
      background: #ffffff;
      /*box-shadow: 0 0 32px 0 rgba(33, 34, 36, 0.06);*/
      border-radius: 16px;
      margin-top: 16px;
      padding: 32px;

      .le-left {
        .le-price {
          .le-sell-price {
            font-size: 40px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #f5212d;
          }

          .le-line-price {
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: 500;
            text-decoration: line-through;
            color: rgba(0, 0, 0, 0.45);
          }

          .le-sell-price:before {
            content: '';
            font-size: 80%;
          }

          .le-sell-number {
            font-size: 28px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.45);
            margin-left: 23px;
          }
        }

        .le-name {
          font-size: 30px;
          line-height: 40px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.85);
        }

        .le-shop {
          .le-shop__img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }

          .le-shop__name {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            color: rgba(0, 0, 0, 0.65);
            line-height: 48px;
          }
        }
      }

      .le-right {
        margin-left: 59px;
        width: 180px;
        text-align: center;

        .le-qrcode {
          width: 180px;
          height: 180px;
        }

        .le-text {
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          color: rgba(0, 0, 0, 0.45);
        }
      }
    }
  }

  #poster-other {
    width: 750px;
    height: 728px;
    background: #f3f5f7;
    padding: 104px 32px 32px 32px;

    .le-poster__content {
      width: 686px;
      height: 592px;
      background: #ffffff;
      border-radius: 16px;
      position: relative;
      text-align: center;
      padding: 115px 69px 0 69px;

      .le-poster__icon {
        width: 160px;
        height: 160px;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 50%;
        transform: translate(-50%, -50%);
      }

      .le-poster__name {
        font-size: 32px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
      }

      .le-poster__shop {
        font-size: 24px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.65);
        margin-top: 18px;
      }

      .le-hr {
        width: 548px;
        height: 1px;
        background-color: #d7d7d7;
        margin-top: 65px;
      }

      .le-qrcode {
        width: 180px;
        height: 180px;
        margin-top: 51px;
      }

      .le-text {
        font-size: 22px;
        font-family: PingFang SC;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.45);
        margin-top: 15px;
      }
    }
  }

  #poster-coupon {
    width: 750px;
    height: 818px;
    background: #f3f5f7;
    padding: 38px 32px 32px 32px;

    .le-poster__content {
      width: 686px;
      height: 748px;
      background: #ffffff;
      border-radius: 16px;
      padding: 0 69px;
      overflow: hidden;

      .le-store {
        margin-top: 58px;

        .le-store-logo {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          margin-right: 25px;
        }

        .le-store-name {
          font-size: 24px;
          line-height: 32px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #222222;
        }

        .le-store-desc {
          font-size: 22px;
          line-height: 32px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #999999;
        }
      }

      .le-poster-coupon {
        margin-top: 32px;
        height: 200px;
        width: 100%;
        position: relative;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          position: absolute;
          z-index: 0;
        }

        .le-content {
          position: relative;
          z-index: 1;
          color: #fff;
          margin-left: 48px;

          .le-content-price {
            font-size: 58px;
            font-family: DIN;
            font-weight: bold;
            color: #ffffff;
            line-height: 58px;
          }

          .le-content-price::before {
            content: '￥';
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            line-height: 14px;
          }

          .le-content-condition {
            font-size: 24px;
            font-family: PingFang SC;
            font-weight: 500;
            line-height: 14px;
            margin-left: 8px;
          }
        }

        .le-content-number {
          margin-top: 33px;
        }

        .le-conetent-name {
          line-height: 40px;
          font-size: 30px;
          font-family: PingFang SC;
          font-weight: 500;
          margin-top: 13px;
        }

        .le-content-date {
          font-size: 20px;
          font-family: PingFang SC;
          font-weight: 400;
          line-height: 32px;
        }
      }

      .le-qrcode-conent {
        margin-top: 64px;
        height: 329px;
        border-top: 1px solid #d7d7d7;

        img {
          width: 180px;
          height: 180px;
          margin-bottom: 8px;
        }

        .le-text {
          font-size: 22px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #999999;
          margin-top: 8px;
        }
      }
    }
  }

  .le-edit {
    .le-title {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
      margin: 13px 0;
    }

    .le-url {
      width: 100%;
      margin-bottom: 16px;

      /deep/.el-input-group__append {
        width: 59px;
        height: 34px;
        padding: 0;
        background: #623ceb;
        text-align: center;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #ffffff;
        position: relative;
        top: -1px;

        .el-button--default {
          padding: 0;
        }
      }

      /deep/.el-input__inner {
        background-color: RGBA(243, 245, 247, 1);
        padding-right: 0;
      }
    }

    .le-btn {
      border: 1px solid #623ceb;
      background: #ffffff;
      border-radius: 4px;
      font-weight: 400;
      color: #623ceb;
      font-family: Microsoft YaHei;
      font-size: 12px;
      height: 32px;
    }

    .le-btn:first-child {
      width: 96px;
    }

    .le-btn:last-child {
      width: 128px;
    }
  }

  .le-not-config {
    width: 556px;
    height: 262px;
    margin-left: 32px;
    padding-top: 53px;

    .le-title {
      font-size: 18px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      line-height: 22px;
    }

    .le-content {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 22px;
      margin: 21px 0 32px 0;
    }

    .le-icon-zhushi {
      color: rgba(255, 130, 38, 1);
      margin-right: 15px;
    }
  }
}
</style>
