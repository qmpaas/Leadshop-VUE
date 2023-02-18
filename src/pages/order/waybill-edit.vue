<script>
import { createWaybill, expressJson, getArea, putWaybill, waybillDetail } from './api';

export default {
  name: 'waybill-edit',
  data() {
    return {
      form: {
        mobile: '',
        name: '',
        address: '',
        code: '',
        area: []
      },
      rules: {
        area: [
          {
            required: true,
            message: '发货地区不能为空'
          }
        ],
        name: [
          {
            required: true,
            message: '姓名不能为空'
          }
        ],
        mobile: [
          {
            required: true,
            message: '联系方式不能为空'
          }
        ],
        address: [
          {
            required: true,
            message: '发货详细地址不能为空'
          }
        ],
        code: [
          {
            required: true,
            message: '快递公司不能为空'
          }
        ]
      },
      district: [],
      companyList: [],
      loading: false,
      disabled: false
    };
  },
  methods: {
    routerBack() {
      this.$router.back(-1);
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          let form = this.$_.cloneDeep(this.form);
          form.province = form.area[0];
          form.city = form.area[1];
          form.district = form.area[2];
          delete form.area;
          if (!this.$route.query.id) {
            createWaybill(form).then(() => {
              this.routerBack();
              this.loading = false;
            });
          } else {
            putWaybill(form).then(() => {
              this.routerBack();
              this.loading = false;
            });
          }
        }
      });
    }
  },
  mounted() {
    getArea().then(response => {
      this.district = response;
    });
    expressJson().then(response => {
      this.companyList = response.filter(item => {
        if (item.is_waybill) {
          return item;
        }
      });
    });
    if (this.$route.query.id) {
      this.loading = true;
      this.disabled = true;
      waybillDetail(this.$route.query.id).then(response => {
        this.form = response;
        this.form.area = [response.province, response.city, response.district];
        this.loading = false;
        this.disabled = false;
      });
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-breadcrumb separator-class="el-icon-arrow-right" class="he-link-text">
          <el-breadcrumb-item class="he-link">
            <a onClick={self.routerBack}> 电子面单</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            {(() => {
              return self.$route.query.id ? '编辑' : '新增';
            })()}
            电子面单
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
          label-width="193px"
          ref="form"
          v-loading={self.loading}
          props={{
            rules: self.rules,
            model: self.form
          }}>
          <div class="le-card">
            <div class="le-card--head flex align-center">
              <span class="le-sign" />
              <span>快递公司</span>
            </div>
            <el-form-item label="快递公司" prop="code">
              <el-select v-model={self.form.code} placeholder="请选择快递公司">
                {self.companyList.map((item, index) => {
                  return <el-option key={index} label={item.value} value={item.label}></el-option>;
                })}
              </el-select>
            </el-form-item>
          </div>
          <div class="le-card">
            <div class="le-card--head flex align-center">
              <span class="le-sign" />
              <span>发货人信息</span>
            </div>
            <el-form-item label="姓名" prop="name">
              <el-input placeholder="请输入姓名" v-model={self.form.name} />
            </el-form-item>
            <el-form-item label="联系方式" prop="mobile">
              <el-input placeholder="请输入联系方式" v-model={self.form.mobile} />
            </el-form-item>
            <el-form-item label="发货地区" prop="area">
              <el-cascader
                options={self.district}
                v-model={self.form.area}
                placeholder="请选择发货地区"
                props={{ expandTrigger: 'hover' }}
              />
            </el-form-item>
            <el-form-item label="发货详细地址" prop="address">
              <el-input placeholder="请输入发货详细地址" v-model={self.form.address} />
            </el-form-item>
          </div>
        </el-form>
        <div class="le-cardpin">
          <el-button
            type="primary"
            disabled={self.disabled}
            loading={self.loading && !self.disabled}
            onClick={self.submit}>
            保存
          </el-button>
        </div>
      </div>
    );
  }
};
</script>

<style scoped lang="less">
.le-card {
  margin-top: 24px;
}
</style>
