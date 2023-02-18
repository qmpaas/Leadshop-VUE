<template>
  <div style="min-height: 277px" class="he-matter" v-loading="loading">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <div class="he-delivery flex">
        <div class="he-delivery-left flex-shrink-0">收货信息</div>
        <div class="he-delivery-right flex-grow-1">
          {{ shipinfo.buyer.name }} {{ shipinfo.buyer.mobile }}<br />
          {{ shipinfo.buyer.province + shipinfo.buyer.city + shipinfo.buyer.district + shipinfo.buyer.address }}
        </div>
      </div>
      <div class="select-goods flex">
        <div class="select-goods-left flex-shrink-0">选择商品</div>
        <el-table
          ref="shipGoodsTable"
          class="select-goods-right flex-grow-1"
          :data="form.goods_list"
          style="width: 100%"
          max-height="326"
          @selection-change="selectionChange"
          row-key="id"
          header-row-class-name="header-row-class-name"
          row-class-name="row-class-name"
        >
          <el-table-column type="selection" width="50" :selectable="canSelect"></el-table-column>
          <el-table-column label="商品" width="300">
            <template slot-scope="scope">
              <div class="flex align-center justify-center">
                <el-image class="goods__pic flex-shrink-0" :src="scope.row.goods_image"></el-image>
                <div class="goods__info flex-grow-1 flex justify-center flex-direction">
                  <div class="goods__info__top">{{ scope.row.goods_name }}</div>
                  <div class="goods__info__down">{{ scope.row.show_goods_param }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="已发数量/未发数量" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.send_number + '/' + scope.row.wait_number }}</div>
            </template>
          </el-table-column>
          <el-table-column label="发货数量" width="150">
            <template slot-scope="scope">
              <div class="flex flex-direction justify-start send_number">
                <el-input
                  ref="inputAtt"
                  v-model="scope.row.check_goods.number"
                  style="width: 97px; height: 32px"
                  onkeyup="value=value.replace(/[^\d]/g,'')"
                  :disabled="scope.row.wait_number === 0"
                ></el-input>
                <div class="goods__send">
                  {{ scope.row.check_goods.number > scope.row.wait_number ? '不能超过未发数量' : '' }}
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template slot-scope="scope">
              <el-tag size="medium" type="warning" effect="plain" v-if="scope.row.wait_number !== 0">待发货</el-tag>
              <el-tag size="medium" type="success" v-else>已发货</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="包裹">
            <template slot-scope="scope">
              <div v-for="(bg, Bindex) in scope.row.bag" :key="Bindex">
                <div>{{ '包裹' + bg.bag_name_num + ':' + bg.bag_goods_number + '件' }}</div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-form-item label="发货方式" class="ship-item">
        <el-radio-group v-model="expressType">
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
                style="width: 420px; white-space: normal"
                border
              >
                ({{ item.name }} 发) {{ item.province }}{{ item.city }}{{ item.district }}{{ item.address }}
                {{ item.mobile }}
              </el-radio>
            </div>
          </el-scrollbar>
        </el-form-item>
        <el-form-item label="快递单号" prop="freight_sn" class="ship-item">
          <el-input maxlength="20" disabled placeholder="请获取电子面单" v-model="form.freight_sn"></el-input>
          <el-button style="width: 132px; margin-left: 8px; height: 32px" class="text2" @click="waybill"
            >获取电子面单
          </el-button>
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
  name: 'orderShipping',
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      waiting_status: false,
      loading: true,
      expressType: 2,
      form: {
        type: 2,
        logistics_company: '',
        freight_sn: '',
        code: '',
        goods_list: [],
        radio: null
      },
      rules: {
        freight_sn: [{ required: true, message: '请输入快递单号', trigger: 'blur' }],
        logistics_company: [{ required: true, message: '请输入物流公司名称', trigger: 'change' }]
      },
      express: [],
      shipinfo: {
        buyer: {}
      },
      companyList: [],
      list: [],
      timeout: null,
      selectList: []
    };
  },
  watch: {
    shipinfo: {
      handler(newVal) {
        // this.form.goods_list = newVal.goods.map(v => {
        //   if (v.check_goods.number.length !== 0 && v.check_goods.number <= v.wait_number) {
        //     return {
        //       order_goods_id: parseInt(v.check_goods.order_goods_id),
        //       number: parseInt(v.check_goods.number)
        //     };
        //   }
        // });
        // this.form.goods_list = this.form.goods_list.filter(v => {
        //   return v;
        // });
      },
      deep: true
    },
    expressType: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.form.type = newVal;
          this.form.logistics_company = '';
          this.form.code = '';
          this.form.freight_sn = '';
          this.form.radio = null;
          this.list = [];
          delete this.form.preview_image;
        }
      }
    }
  },
  methods: {
    cellChange(rowinfo, colinfo) {
      if ((rowinfo.check_goods.number.length !== 0 || colinfo.label === '发货数量') && rowinfo.wait_number !== 0) {
        this.$refs.shipGoodsTable.toggleRowSelection(rowinfo);
      }
    },
    openNew() {
      window.open('https://kbydy.cn/CloudPrint/intro');
    },
    affirm(e) {
      // if (this.$_.isEmpty(this.form.goods_list)) {
      //   this.$message({
      //     type: 'error',
      //     message:'请选择发货商品'
      //   })
      //   return;
      // }
      if (this.waiting_status) {
        return;
      }
      let newArray = [];
      this.selectList.forEach(item => {
        // this.form.goods_list
        const one = this.form.goods_list.find(obj => {
          if (obj.id === item.id) {
            return {
              order_goods_id: parseInt(obj.check_goods.order_goods_id),
              number: parseInt(obj.check_goods.number)
            };
          }
        });
        newArray.push(one);
      });
      newArray = newArray.map(item => {
        return {
          order_goods_id: parseInt(item.check_goods.order_goods_id),
          number: parseInt(item.check_goods.number)
        };
      });
      const form = this.$_.cloneDeep(this.form);
      form.goods_list = newArray;
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.waiting_status = true;
          this.$heshop
            .order('put', { id: this.value.item.id, behavior: 'send' }, form)
            .then(res => {
              this.waiting_status = false;
              this.value.item.status = res.status;
              this.$message.success('发货成功');
              let { handleClose } = e;
              handleClose();
            })
            .catch(err => {
              this.waiting_status = false;
              this.$message.error(err.data.message);
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
    handleSelectExpress(item) {
      this.form.logistics_company = item.label;
      this.form.code = item.code;
    },
    getShipGoodsInfo() {
      this.$heshop
        .order('get', { id: this.value.item.id, behavior: 'order_goods' })
        .then(res => {
          res.goods.forEach(element => {
            element.check_goods = {
              order_goods_id: element.id,
              number: ''
            };
          });
          this.shipinfo = res;
          this.form.goods_list = res.goods;
          this.loading = false;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.data.message);
        });
    },
    selectionChange(selection) {
      this.selectList = selection;
      // this.form.goods_list = selection.map(v => {
      //   if (v.check_goods.number.length !== 0 && v.check_goods.number <= v.wait_number) {
      //     return {
      //       order_goods_id: parseInt(v.check_goods.order_goods_id),
      //       number: parseInt(v.check_goods.number)
      //     };
      //   }
      // });
      // this.form.goods_list = this.form.goods_list.filter(v => v !== undefined);
      // this.form.goods_list = selection.map(v => {
      //   return {
      //     order_goods_id: parseInt(v.check_goods.order_goods_id),
      //     number: typeof v.check_goods.number !== Number ? '' : parseInt(v.check_goods.number)
      //   };
      // });
    },
    canSelect(row, index) {
      if (row.wait_number === 0) {
        return false;
      } else {
        return true;
      }
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
      response = response.map(item => {
        return { value: item.name, label: item.name, code: item.code };
      });
      this.companyList = response;
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
    this.getShipGoodsInfo();
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

  .select-goods {
    max-height: 326px;
    min-height: 130px;
    width: 960px;
    margin-top: 24px;

    &-left {
      width: 70px;
      margin-top: 19px;

      &::before {
        content: '*';
        color: #f56c6c;
        margin-right: 4px;
      }
    }

    &-right {
      margin-left: 16px;
      color: #595959;

      /deep/ .el-table__row {
        height: 73px;
      }

      // /deep/ .el-table-column--selection {
      //   .cell {
      //     margin-left: -10px;
      //   }
      // }
      .goods__pic {
        width: 48px;
        height: 48px;
      }
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
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }
    }

    .goods__send {
      font-size: 12px;
      font-family: Microsoft YaHei;
      color: #f5212d;
      line-height: 1;
      height: 15px;
      //margin-top: 2px;
    }
  }

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
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #623ceb;
    }
  }
}

.select-goods-right /deep/ {
  .send_number {
    height: 50px;
    padding-top: 5px;
  }

  .header-row-class-name {
    .el-table-column--selection .cell {
      padding-left: 14px;
    }
  }

  .row-class-name {
    td:nth-child(4) {
      padding-top: 10px;
      padding-bottom: 0;

      .el-input {
        margin-bottom: 1px;
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
