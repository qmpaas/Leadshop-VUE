<template>
  <el-form :model="form" label-width="125px" :rules="rules" ref="ruleForm" class="he-matter">
    <el-form-item label="发货信息">
      <div class="he-delivery-information">
        {{ value.item.buyer.name }} {{ value.item.buyer.mobile }}<br />
        {{ value.item.buyer.address }}
      </div>
    </el-form-item>
    <el-form-item label="发货方式">
      <el-radio-group v-model="type" @change="checkType">
        <el-radio :label="3">电子面单</el-radio>
        <el-radio :label="1">自己联系快递</el-radio>
        <el-radio :label="2">无需物流</el-radio>
      </el-radio-group>
    </el-form-item>
    <template v-if="type === 1">
      <el-form-item label="物流公司" prop="one.logistics_company">
        <el-autocomplete
          v-model="form.one.logistics_company"
          :fetch-suggestions="querySearchAsync"
          placeholder="请选择或输入物流公司"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="快递单号" prop="one.freight_sn">
        <el-input
          maxlength="20"
          placeholder="请输入快递单号"
          onkeyup="value=value.replace(/[\u4e00-\u9fa5]/ig,'')"
          v-model="form.one.freight_sn"
        ></el-input>
      </el-form-item>
    </template>
    <template v-else-if="type === 3">
      <el-form-item label="物流公司" prop="three.logistics_company" key="three.logistics_company">
        <el-select placeholder="请选择物流公司" v-model="form.three.logistics_company" @change="getAddress">
          <el-option v-for="item in companyList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货地址" prop="three.radio" key="three.radio" v-if="form.three.radio">
        <el-scrollbar class="he-address" style="height: 200px">
          <div v-for="(item, index) in list" :key="index" class="he-address__item">
            <el-radio
              v-model="form.three.radio"
              :style="form.three.radio === item.id ? 'background: rgba(98, 60, 235, 0.1);' : ''"
              :label="item.id"
              border
            >
              ({{ item.name }} 发) {{ item.province }}{{ item.city }}{{ item.district }}{{ item.address }}
              {{ item.mobile }}</el-radio
            >
          </div>
        </el-scrollbar>
      </el-form-item>
      <el-form-item label="快递单号" prop="three.freight_sn">
        <el-input disabled v-model="form.three.freight_sn"></el-input>
        <el-button @click="waybill" class="le-getnumber" style="margin-left: 8px" :disabled="!form.three.radio" plain
          >获取电子面单</el-button
        >
        <p class="le-prompt-text">
          请安装云打印，否则无法打印电子面单
          <el-button @click="openNew" class="le-button--text" type="text">安装教程</el-button>
        </p>
      </el-form-item>
    </template>
  </el-form>
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
    const checkSn = (rule, value, callback) => {
      if (!value) {
        if (this.type === 3) {
          callback('请获取电子单号');
        } else {
          callback('请输入快递单号');
        }
      }
      callback();
    };
    return {
      type: 3,
      form: {
        one: {
          logistics_company: '',
          code: 'unknown',
          freight_sn: '',
          order_sn: '',
          radio: null,
          type: 1
        },
        two: {
          logistics_company: '',
          code: 'unknown',
          freight_sn: '',
          order_sn: '',
          radio: null,
          type: 2
        },
        three: {
          logistics_company: '',
          code: 'unknown',
          freight_sn: '',
          order_sn: '',
          radio: null,
          type: 3
        }
      },
      rules: {
        freight_sn: [{ required: true, validator: checkSn, trigger: 'blur' }],
        logistics_company: [{ required: true, message: '请输入物流公司名称', trigger: 'change' }],
        radio: [{ required: true, message: '请选择发货地址', trigger: 'blur' }]
      },
      express: [],
      companyList: [],
      loading: false,
      timeout: null,
      list: []
    };
  },
  methods: {
    checkType() {},
    affirm(e) {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          const form = this.$_.cloneDeep(this.form[this.type === 1 ? 'one' : this.type === 2 ? 'two' : 'three']);

          for (let i = 0; i < this.express.length; i++) {
            if (this.express[i].value === form.logistics_company.trim()) {
              form.code = this.express[i].code;
            }
          }
          this.$heshop
            .orderafter('put', { id: this.value.item.id, behavior: 'exchangefreight' }, { merchant_freight_info: form })
            .then(() => {
              this.value.item.merchant_freight_info.freight_sn = form.freight_sn;
              this.value.item.merchant_freight_info.logistics_company = form.logistics_company;
              this.value.item.merchant_freight_info.type = this.type;
              this.value.item.merchant_freight_info.code = form.code;
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
    handleSelect(item) {
      this.form.one.code = item.label;
    },
    getAddress() {
      for (let i = 0; i < this.companyList.length; i++) {
        if (this.companyList[i].value === this.form.three.logistics_company.trim()) {
          this.form.three.code = this.companyList[i].code;
        }
      }
      this.$heshop
        .waybill('get', { behavior: 'option', code: this.form.three.code })
        .then(res => {
          this.list = res.data;
          if (res.data.length > 0) {
            this.form.three.radio = res.data[0].id;
            res.data.forEach(v => {
              if (v.status === 1) {
                this.form.three.radio = v.id;
              }
            });
          } else {
            this.form.three.radio = null;
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
            waybill_id: this.form.three.radio
          }
        )
        .then(response => {
          this.form.three.freight_sn = response.freight_sn;
          this.form.three.preview_image = response.preview_image;
        })
        .catch(error => {
          this.$message.error(error.data.message);
        });
    },
    openNew() {
      window.open('https://kbydy.cn/CloudPrint/intro');
    },
    async getExpress() {
      let _this = this;
      let response = await this.$heshop.search(
        'post',
        {
          include: 'setting'
        },
        {
          keyword: 'expressjson'
        }
      );
      response = response.map(item => {
        return { value: item.name, label: item.name, code: item.code };
      });
      _this.express = response;
      return _this.express;
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
    }
  },
  watch: {
    'value.item': {
      handler(newVal) {
        if (!newVal.merchant_freight_info) return;
        let { logistics_company, type, freight_sn, code } = newVal.merchant_freight_info;
        this.type = type;
        if (type === 1) {
          this.form.one.freight_sn = freight_sn;
          this.form.one.logistics_company = logistics_company;
          this.form.one.code = code;
          this.form.one.order_sn = newVal.order_sn;
          this.getExpress();
          this.getWaybillExpress();
        } else if (type === 3) {
          this.form.three.freight_sn = freight_sn;
          this.form.three.logistics_company = logistics_company;
          this.form.three.order_sn = newVal.order_sn;
          this.getWaybillExpress().then(() => {
            this.getAddress();
          });
        } else {
          this.form.two.order_sn = newVal.order_sn;
          this.getExpress();
          this.getWaybillExpress();
        }
      },
      immediate: true
    }
  },
  mounted() {}
};
</script>
<style scoped lang="scss">
.he-delivery-information {
  width: 269px;
  font-size: 14px;
  font-weight: 400;
  color: #000000;
  line-height: 20px;
  opacity: 0.85;
  padding-top: 6px;
}
/deep/.el-form-item:last-child {
  margin-bottom: 0 !important;
}
.he-address__item/deep/ {
  > .el-radio {
    display: flex;
    white-space: normal;
    word-break: break-all;
    height: auto;
    padding: 6px 15px 6px 10px;
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden;
}
</style>
