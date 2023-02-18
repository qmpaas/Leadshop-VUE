<template>
  <div v-loading="loading">
    <div class="pk-content">
      <el-tabs @tab-click="chooseTab" class="pk-content-text">
        <el-tab-pane :label="`包裹${index + 1}`" v-for="(item, index) in this.packagesinfo.freight" :key="index">
          <div class="pk-content-pic" v-for="(good, Iindex) in item.goods" :key="Iindex">
            <el-image
              fit="cover"
              :src="good.goods.goods_image"
              style="width: 48px; height: 48px; margin-left: 8px"
            ></el-image>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <template v-if="targetPackage.type === 1 || targetPackage.type === 3">
      <div class="le-header flex align-center">
        <span class="le-header--label">物流公司:</span>
        <span class="le-header--value">{{ targetPackage.logistics_company }}</span>
        <span class="le-header--label">快递单号:</span>
        <span class="le-header--value">{{ targetPackage.freight_sn }}</span>
        <span @click="copyTrackingNumber" class="le-header--copy">复制</span>
        <input id="copy-tracking-number" :value="targetPackage.freight_sn" />
      </div>
      <div class="le-body">
        <div style="padding: 20px" v-if="state !== 0" class="le-desc">{{ message }}</div>
        <logistics-step :list="list" v-if="state === 0"></logistics-step>
      </div>
    </template>
    <template v-else>
      <el-form label-width="110px" class="le-matter">
        <el-form-item label="发货方式：">
          <span class="le-text">无需物流</span>
        </el-form-item>
      </el-form>
    </template>
  </div>
</template>
<script>
import logisticsStep from './logisticsStep';

export default {
  name: 'logisticsInformation',
  components: {
    logisticsStep
  },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      list: [],
      loading: true,
      state: 1,
      message: '',
      packagesinfo: {},
      targetPackage: {}
    };
  },
  methods: {
    getShipPackagesInfo() {
      this.$heshop
        .order('get', { id: this.value.id, behavior: 'order_bag' })
        .then(res => {
          this.packagesinfo = res;
          this.targetPackage = res.freight[0];
          if (this.targetPackage.type !== 2) {
            this.getExpress(this.targetPackage);
          }
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.data.message);
        });
    },
    getExpress: function (pkinfo) {
      let _this = this;
      this.$heshop
        .express('post', {
          no: pkinfo.freight_sn,
          mobile: this.value.buyer.mobile,
          name: pkinfo.logistics_company,
          code: pkinfo.code
        })
        .then(function (res) {
          _this.state = res.state;
          if (parseInt(res.state) !== 0) {
            _this.message = res.message;
          } else {
            _this.list = res.list;
          }
          _this.loading = false;
        })
        .catch(function (err) {
          _this.loading = false;
          if (err.status === 403) {
            _this.$message.error(err.data.message);
          }
        });
    },
    affirm(e) {
      let { handleClose } = e;
      handleClose();
    },
    copyTrackingNumber: function () {
      let input = document.getElementById('copy-tracking-number');
      input.select();
      document.execCommand('copy');
      this.$message.success('复制成功');
    },
    chooseTab(e) {
      for (let i = 0; i < this.packagesinfo.freight.length; i++) {
        if (e.index == i) {
          this.targetPackage = this.packagesinfo.freight[i];
        }
      }
      if (this.targetPackage.type !== 2) {
        this.getExpress(this.targetPackage);
      }
    }
  },
  mounted() {
    this.getShipPackagesInfo();
  }
};
</script>
<style scoped lang="scss">
.pk-content {
  width: 660px;
  height: 120px;
  /deep/ .el-tabs__item {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #8c8c8c;
  }
  /deep/ .el-tabs__header {
    margin-bottom: 0px !important;
  }
  /deep/ .el-tab-pane {
    display: flex;
    margin-top: 16px;
  }
}
.le-header {
  width: 660px;
  height: 40px;
  background: #f3f5f7;
  .le-header--label {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #8c8c8c;
    margin-right: 12px;
    margin-left: 24px;
  }
  .le-header--value {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
  }
  .le-header--copy {
    font-size: 12px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #623ceb;
    opacity: 0.85;
    padding: 0 14px;
    margin: 0 10px;
    cursor: pointer;
  }
}

.le-body {
  width: 660px;
  height: 260px;
  margin-top: 4px;
  border: 1px solid #dcdfe6;
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
.le-desc {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  line-height: 18px;
}
.le-time-line {
  width: 658px;
  padding-left: 40px;
  padding-top: 24px;

  .le-time-item {
    position: relative;
    border-left: 1px solid #e5e5e5;
    min-height: 50px;
    padding-bottom: 23px;
    .le-item-content {
      margin-left: 20px;
      position: absolute;
      top: -3px;
    }

    .le-datetime {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 18px;
      margin-top: 11px;
    }
  }
  .le-time-item:last-child {
    border-left: none;
  }

  .le-dot {
    height: 10px;
    width: 10px;
    border-radius: 50%;
    position: absolute;
    left: -5px;
  }
  .le-dot--default {
    background: #dcdfe6;
  }
  .le-dot--first {
    background-color: #623ceb;
  }
}
#copy-tracking-number {
  background-color: #ffffff;
  border: none;
  opacity: 0;
  position: absolute;
  z-index: -10;
}
.le-matter {
  /deep/ .el-form-item__label {
    text-align: left;
  }
}
</style>
