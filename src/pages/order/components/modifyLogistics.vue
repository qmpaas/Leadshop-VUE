<template>
  <div class="he-matter" v-loading="loading">
    <div class="he-delivery flex">
      <div class="he-delivery-left flex-shrink-0">收货信息</div>
      <div class="he-delivery-right flex-grow-1">
        {{ packagesinfo.buyer.name }} {{ packagesinfo.buyer.mobile }}<br />
        {{
          packagesinfo.buyer.province +
          packagesinfo.buyer.city +
          packagesinfo.buyer.district +
          packagesinfo.buyer.address
        }}
      </div>
    </div>
    <div class="pk-content">
      <el-tabs @tab-click="chooseTab" class="pk-content-text" ref="getFirstTab">
        <el-tab-pane :label="`包裹${index + 1}`" v-for="(item, index) in this.packagesinfo.freight" :key="index">
          <el-table class="pk-content__goods" :data="item.goods" style="width: 400px" max-height="326">
            <el-table-column label="商品" width="300">
              <template slot-scope="scope">
                <div class="flex align-center justify-center" style="margin-left: -5px !important">
                  <el-image class="goods__pic flex-shrink-0" :src="scope.row.goods.goods_image"></el-image>
                  <div class="goods__info flex-grow-1 flex justify-center flex-direction">
                    <div class="goods__info__top">{{ scope.row.goods.goods_name }}</div>
                    <div class="goods__info__down">{{ scope.row.goods.show_goods_param }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :data="item.goods" label="发货数量" width="100">
              <template slot-scope="scope">
                <div>{{ scope.row.bag_goods_number }}</div>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-form :model="form" :rules="rules" ref="ruleForm" class="modify-express">
      <el-form-item label="发货方式" class="ship-item">
        <el-radio-group v-model="expressType" @change="radioChange">
          <el-radio :label="3">电子面单</el-radio>
          <el-radio :label="1">自己联系快递</el-radio>
          <el-radio :label="2">无需物流</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="expressType === 3">
        <el-form-item label="物流公司" class="ship-item" prop="logistics_company">
          <el-select placeholder="请选择物流公司" v-model="form.logistics_company" @change="selectElec">
            <el-option v-for="(item, index) in companyList" :key="index" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发货地址" prop="radio" key="three.radio" v-if="form.radio" class="ship-item">
          <el-scrollbar class="he-address" style="height: 200px">
            <div v-for="(item, index) in list" :key="index" class="he-address__item">
              <el-radio
                v-model="form.radio"
                :style="form.radio === item.id ? 'background: rgba(98, 60, 235, 0.1);' : ''"
                :label="item.id"
                border
                style="width: 420px; white-space: normal"
              >
                ({{ item.name }} 发) {{ item.province }}{{ item.city }}{{ item.district }}{{ item.address }}
                {{ item.mobile }}</el-radio
              >
            </div>
          </el-scrollbar>
        </el-form-item>
        <el-form-item label="快递单号" prop="freight_sn" class="ship-item">
          <el-input maxlength="20" disabled placeholder="请获取电子面单" v-model="form.freight_sn"></el-input>
          <el-button style="width: 132px; margin-left: 8px; height: 32px" class="text2" @click="waybill"
            >获取电子面单</el-button
          >
        </el-form-item>
        <el-form-item label=" " class="ship-item" style="margin-top: 16px !important">
          <div class="text1">请安装云打印，否则无法打印电子面单</div>
          <el-button type="text" class="text3" @click="openNew">安装教程</el-button>
        </el-form-item>
      </template>
      <template v-if="expressType === 1">
        <el-form-item label="物流公司" class="ship-item" prop="logistics_company">
          <el-autocomplete
            v-model="form.logistics_company"
            :fetch-suggestions="querySearchAsync"
            placeholder="请选择物流公司"
            @select="handleSelectExpress"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="快递单号" prop="freight_sn" class="ship-item">
          <el-input
            maxlength="20"
            onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
            placeholder="请输入快递单号"
            v-model="form.freight_sn"
          ></el-input>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'modifyLogistics',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      loading: true,
      expressType: 5,
      form: {
        type: Number,
        logistics_company: '',
        freight_sn: '',
        code: '',
        radio: null,
        id: null
      },
      rules: {
        freight_sn: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
        logistics_company: [{ required: true, message: '请输入物流公司名称', trigger: 'change' }]
      },
      express: [],
      timeout: null,
      packagesinfo: {
        buyer: {}
      },
      companyList: [],
      list: []
    };
  },
  methods: {
    radioChange(eback) {
      if (eback === 2) {
        this.form.type = eback;
        this.form.logistics_company = '';
        this.form.code = '';
        this.form.freight_sn = '';
        this.form.radio = null;
        this.list = [];
        delete this.form.preview_image;
      } else {
        this.form.type = eback;
      }
    },
    openNew() {
      window.open('https://kbydy.cn/CloudPrint/intro');
    },
    affirm(e) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.$heshop
            .order('put', { behavior: 'editfreight' }, this.form)
            .then(() => {
              this.$message.success('修改物流成功');
              let { handleClose } = e;
              handleClose();
            })
            .catch(err => {
              if (err.data[0]) {
                err.data.forEach(v => {
                  this.$message.error(v.message);
                });
              } else {
                this.$message.error(err.data.message);
              }
            });
        } else {
          return false;
        }
      });
    },
    querySearchAsync(queryString, cb) {
      let restaurants = this.express;
      let results = queryString ? restaurants.filter(this.createStateFilter(queryString)) : restaurants;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 500 * Math.random());
    },
    createStateFilter(queryString) {
      return state => {
        return state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0;
      };
    },
    getShipPackagesInfo() {
      this.$heshop
        .order('get', { id: this.value.item.id, behavior: 'order_bag' })
        .then(res => {
          this.packagesinfo = res;
          // debugger
          this.form.id = res.freight[0].id;
          this.expressType = res.freight[0].type;
          this.form.logistics_company = res.freight[0].logistics_company;
          this.form.freight_sn = res.freight[0].freight_sn;
          this.form.code = res.freight[0].code;
          this.form.type = res.freight[0].type;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.data.message);
        });
    },
    chooseTab(e) {
      for (let i = 0; i < this.packagesinfo.freight.length; i++) {
        if (e.index == i) {
          this.form.id = this.packagesinfo.freight[i].id;
          this.expressType = this.packagesinfo.freight[i].type;
          this.form.logistics_company = this.packagesinfo.freight[i].logistics_company;
          this.form.freight_sn = this.packagesinfo.freight[i].freight_sn;
          this.form.code = this.packagesinfo.freight[i].code;
          this.form.type = this.packagesinfo.freight[i].type;
        }
      }
    },
    handleSelectExpress(item) {
      this.form.logistics_company = item.label;
      this.form.code = item.code;
    },
    async getWaybillExpress() {
      let response = await this.$heshop.search(
        'post',
        {
          include: 'setting'
        },
        {
          keyword: 'waybilljson'
        }
      );
      this.companyList = response.map(item => {
        return { value: item.name, label: item.name, code: item.code };
      });
    },
    selectElec(e) {
      for (let i = 0; i < this.companyList.length; i++) {
        if (this.companyList[i].value === e) {
          this.form.code = this.companyList[i].code;
        }
      }
      this.$heshop
        .waybill('get', { behavior: 'option', code: this.form.code })
        .then(res => {
          this.list = res.data;
          if (res.data.length > 0) {
            this.form.radio = res.data[0].id;
            res.data.forEach(v => {
              if (v.status === 1) {
                this.form.radio = v.id;
              }
            });
          } else {
            this.form.radio = null;
          }
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    waybill() {
      this.$heshop
        .waybill(
          'post',
          {
            behavior: 'select'
          },
          {
            order_sn: this.value.item.order_sn,
            waybill_id: this.form.radio
          }
        )
        .then(response => {
          this.form.freight_sn = response.freight_sn;
          this.form.preview_image = response.preview_image;
        })
        .catch(error => {
          this.$message.error(error.data.message);
        });
    }
  },
  mounted() {
    this.getShipPackagesInfo();
    this.$heshop
      .search(
        'post',
        {
          include: 'setting'
        },
        {
          keyword: 'expressjson'
        }
      )
      .then(response => {
        this.express = response.map(item => {
          return { value: item.name, label: item.name, code: item.code };
        });
      });
    this.getWaybillExpress();
  }
};
</script>
<style scoped lang="scss">
.he-matter {
  position: relative;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  .he-delivery {
    width: 960px;
    height: 72px;
    background: #f5f7fa;
    border-radius: 8px;
    &-left {
      width: 57px;
      height: 15px;
      margin-left: 16px;
      margin-top: 20px;
    }
    &-right {
      margin-left: 15px;
      margin-top: 19px;
    }
  }
  .pk-content {
    width: 960px;
    max-height: 440px;
    min-height: 500px;
    /deep/ .el-tabs__item {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8c8c8c;
    }
    /deep/ .el-tabs__header {
      margin-bottom: 0px !important;
      margin-left: 10px;
    }
    &__goods {
      margin-top: 24px;
      .goods__pic {
        width: 48px;
        height: 48px;
      }
      .goods__info {
        margin-left: 10px;
        &__top {
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
        &__down {
          font-size: 12px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #595959;
          opacity: 0.65;
        }
      }
    }
  }
  .modify-express {
    position: absolute;
    top: 120px;
    left: 439px;
    .ship-item {
      display: flex;
      margin-top: 24px;
      margin-bottom: 0px !important;
      /deep/ .el-form-item__label {
        float: none;
        text-align: left;
        width: 80px;
      }
      /deep/ .el-form-item__content {
        display: flex;
        align-items: center;
        flex: 1;
        margin-left: 0px !important;
      }
      .text1 {
        width: 205px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #bfbfbf;
      }
      .text2 {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #bfbfbf;
      }
      .text3 {
        margin-left: 7px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #623ceb;
      }
    }
  }
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
  .el-radio--mini.is-bordered {
    height: auto;
    padding: 6px 15px 6px 10px;
  }
}
</style>
