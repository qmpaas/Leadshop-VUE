<template>
  <el-form class="le-matter" label-width="120px" :model="form" :rules="rules" @submit.native.prevent>
    <div class="le-announcement">
      批量发货注意事项： <br />
      1. 请先按照模板填写订单号、物流公司、物流单号信息。物流单号不可写成E+22的科学计数法<br />
      2. 未成功发货的订单，可下载【失败记录】查看详细的失败原因，对症修改<br />
      3. 发货订单数据，最大不超过1000条（支持csv、xls、xlsx，文件大小请控制在2MB以内）<br />
      4. 物流公司名称，请填写全称，如圆通速递，不可填写为圆通<br />
    </div>
    <div class="le-header le-card">
      <el-form-item label="批量发货类型">
        <el-radio-group v-model="form.type" @change="changeRadio">
          <el-radio :label="1">手动填写物流信息（传统模式）</el-radio>
          <el-radio :label="2">自动获取电子面单</el-radio>
        </el-radio-group>
        <div class="le-prompt-text">
          选择自动获取电子面单，则发货模板中
          <span style="color: #262626">仅需要填写订单号</span>，快递单号将自动获取
        </div>
        <div class="le-editor" v-if="form.type === 1">
          <el-button class="le-button le-text" plain>
            <a :href="origin + '/static/files/bulk-shipping-template.xlsx'" download="批量发货模板.xlsx"
              >下载批量发货模板</a
            >
          </el-button>
          <button class="le-button le-default" @click="bulkShipping">批量发货</button>
          <input
            ref="upload"
            type="file"
            style="display: none"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv,application/vnd.ms-excel"
            @change="upload"
          />
        </div>
      </el-form-item>
      <el-form-item label="物流公司" prop="logistics_company" v-if="form.type === 2">
        <el-select placeholder="请选择物流公司" v-model="form.logistics_company" @change="getAddress">
          <el-option v-for="(item, index) in express" :key="index" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发货地址" prop="radio" v-if="form.type === 2 && addressList.length > 0">
        <el-scrollbar class="he-address">
          <div v-for="(item, index) in addressList" :key="index" class="he-address__item">
            <el-radio
              v-model="form.radio"
              :style="form.radio === item.id ? 'background: rgba(98, 60, 235, 0.1);' : ''"
              :label="item.id"
              border
            >
              ({{ item.name }} 发) {{ item.province }}{{ item.city }}{{ item.district }}{{ item.address }}
              {{ item.mobile }}</el-radio
            >
          </div>
        </el-scrollbar>
      </el-form-item>
      <el-form-item label="" class="le-editor" v-if="form.type === 2">
        <el-button plain :disabled="!form.radio" @click="downloadFile"> 下载批量发货模板 </el-button>
        <el-button
          class="le-waybill--btn"
          type="primary"
          @click="bulkShipping"
          :disabled="!form.logistics_company || !form.radio"
          >批量发货</el-button
        >
        <input
          ref="uploadWaybill"
          type="file"
          style="display: none"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.csv,application/vnd.ms-excel"
          @change="upload"
        />
      </el-form-item>
    </div>
    <div class="le-search le-card">
      <span class="le-label">发货时间</span>
      <el-date-picker class="le-search-date" v-model="time_start" type="datetime" placeholder="开始日期">
      </el-date-picker>
      <span class="le-label">至</span>
      <el-date-picker class="le-search-date" v-model="time_end" type="datetime" placeholder="结束日期">
      </el-date-picker>
      <div class="le-editor">
        <button class="le-button le-default" @click="getSearch">筛选</button>
        <el-button @click="empty" style="margin-left: 10px">清空</el-button>
      </div>
    </div>
    <div class="le-body le-card">
      <el-table class="le-table" row-class-name="le-table-row" height="680" :data="list">
        <el-table-column label="发货编号">
          <template slot-scope="scope">
            {{ scope.row.handle_sn }}
          </template>
        </el-table-column>
        <el-table-column label="发货订单数">
          <template slot-scope="scope">
            {{ scope.row.order_number }}
          </template>
        </el-table-column>
        <el-table-column label="成功发货订单数">
          <template slot-scope="scope">
            {{ scope.row.success_number }}
          </template>
        </el-table-column>
        <el-table-column label="操作时间">
          <template slot-scope="scope">{{ scope.row.created_time | timeFormat('yyyy-mm-dd hh:MM:ss') }} </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <button
              v-if="scope.row.order_number !== scope.row.success_number"
              class="le-button le-text le-table--operating__btn"
              @click="exportData(scope.row.id)"
            >
              失败记录
            </button>
            <template v-else> — — </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="le-pagination flex justify-end align-center">
        <el-pagination
          background
          layout="prev, pager, next, jumper"
          @current-change="currentChange"
          :current-page="page.current"
          :page-count="page.count"
        >
        </el-pagination>
      </div>
    </div>
    <he-loading title="文件上传处理中，请稍后..." :show="loading"></he-loading>
    <el-dialog :visible.sync="dialogVisible" width="30%" top="35vh">
      <div style="text-align: center; margin-top: 43px">
        <i class="le-icon le-icon-zhushi"></i>
        <div class="le-dialog-text">
          {{
            dialogType === 1
              ? '文件格式错误，请使用csv、xls、xlsx的格式文件'
              : dialogType === 2
              ? '文件大小超过2MB，请压缩或删减内容后上传'
              : '订单数据量超过1000条，请删减后分多次上传'
          }}
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">重新上传</el-button>
      </span>
    </el-dialog>
  </el-form>
</template>
<script>
import heLoading from '../../components/heloading2.vue';
import XLSX from 'xlsx';

export default {
  name: 'bulkShipping',
  components: {
    heLoading
  },
  data() {
    return {
      origin: '',
      list: [],
      time_start: '',
      time_end: '',
      loading: false,
      page: {
        size: 20,
        current: 1,
        count: 1
      },
      dialogVisible: false,
      dialogType: 1,
      form: {
        radio: null,
        logistics_company: '',
        type: 1
      },
      express: [],
      addressList: [],
      copyData: {},
      rules: {
        logistics_company: [
          {
            required: true,
            message: '物流公司不能为空'
          }
        ],
        radio: [
          {
            required: true,
            message: '发货地址不能为空'
          }
        ]
      }
    };
  },
  methods: {
    currentChange: function (e) {
      this.page.current = e;
      this.getList();
    },
    bulkShipping: function () {
      if (this.form.type === 1) {
        this.$refs.upload.click();
      } else {
        if (!this.form.logistics_company || !this.form.radio) return;
        this.$refs.uploadWaybill.click();
      }
    },
    getSearch() {
      this.page.current = 1;
      this.getList();
    },
    empty() {
      this.time_start = '';
      this.time_end = '';
      this.page.current = 1;
      this.getList();
    },
    getList: function () {
      let time = {};
      if (this.time_start) {
        time.time_start = new Date(this.time_start).getTime().toString().substr(0, 10);
      }
      if (this.time_end) {
        time.time_end = new Date(this.time_end).getTime().toString().substr(0, 10);
      }
      this.$heshop
        .orderhandle('get', time)
        .page(this.page.current, this.page.size)
        .then(res => {
          let { data, headers } = res;
          this.list = data;
          this.page = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count'],
            size: +headers['x-pagination-per-page'],
            total: +headers['x-pagination-total-count']
          };
        })
        .catch(() => {
          this.$message.error('获取失败');
        });
    },
    upload() {
      let files = null;
      if (this.form.type === 1) {
        files = this.$refs.upload.files;
      } else {
        files = this.$refs.uploadWaybill.files;
      }
      this.readExcel(files);
    },
    readExcel(files) {
      // 表格导入
      let _this = this;
      if (files.length <= 0) {
        // 如果没有文件名
        return false;
      } else if (!/\.(csv|xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        this.dialogVisible = true;
        this.dialogType = 1;
        return false;
      } else if (files[0].size / 1024 / 1024 > 2) {
        this.dialogVisible = true;
        this.dialogType = 2;
        return false;
      }

      this.loading = true;
      const fileReader = new FileReader();
      fileReader.onload = ev => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          const wsname = workbook.SheetNames[0]; // 取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]); // 生成json表格内容
          let list = [];
          if (list.length > 1000) {
            this.dialogVisible = true;
            this.dialogType = 3;
            return false;
          }
          ws.forEach(v => {
            if (this.form.type === 1) {
              list.push([v['订单号'] ?? '', v['物流公司'] ?? '', v['物流单号'] ?? '']);
            } else {
              list.push([v['订单号'] ?? '']);
            }
          });
          if (this.form.type === 1) {
            _this.$heshop
              .orderhandle('post', list)
              .then(() => {
                _this.$message.success('操作成功');
                _this.loading = false;
                _this.getList();
              })
              .catch(err => {
                console.error(err);
                _this.loading = false;
                _this.$message.error(err.data.message);
              });
          } else {
            let postBody = {};
            postBody.list = list;
            postBody.waybill_id = this.form.radio;
            _this.$heshop
              .orderhandle(
                'post',
                {
                  behavior: 'waybill'
                },
                postBody
              )
              .then(() => {
                _this.$message.success('操作成功');
                _this.loading = false;
                _this.getList();
              })
              .catch(err => {
                console.error(err);
                _this.loading = false;
                _this.$message.error(err.data.message);
              });
          }

          // 重写数据
          if (this.form.type === 1) {
            _this.$refs.upload.value = '';
          } else {
            _this.$refs.uploadWaybill.value = '';
          }
        } catch (e) {
          _this.loading = false;
          _this.$message.error('系统错误');
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    exportData: function (id) {
      let _this = this;
      this.loading = true;
      this.$heshop
        .orderhandle('get', id)
        .then(res => {
          let header = [];
          if (res.error_data.length > 0 && res.error_data[0].length > 2) {
            header = ['订单号', '物流公司', '物流单号', '失败描述'];
          } else {
            header = ['订单号', '失败描述'];
          }
          let data = res.error_data;
          require.ensure([], function () {
            _this.$h.Export2Excel.export_json_to_excel({
              header,
              data,
              filename: name + '批量发货失败记录(' + _this.$moment(new Date()).format('YYYYMMDDHHmmss') + ')'
            });
            _this.loading = false;
          });
        })
        .catch(function (err) {
          _this.loading = false;
          _this.$message.error(err.data.message);
        });
    },
    changeRadio(e) {
      if (e === 1) {
        this.copyData = this.$_.cloneDeep(this.form);
      }
      if (e === 2) {
        let _this = this;
        this.$heshop
          .search(
            'post',
            {
              include: 'setting'
            },
            {
              keyword: 'waybilljson'
            }
          )
          .then(response => {
            _this.express = response.map(item => {
              return { value: item.name, label: item.name, code: item.code };
            });
            if (!this.$_.isEmpty(this.copyData)) {
              this.form = this.$_.cloneDeep(this.copyData);
              this.form.type = 2;
            }
          });
      } else {
        this.form.logistics_company = '';
        this.form.radio = null;
      }
    },
    getAddress() {
      for (let i = 0; i < this.express.length; i++) {
        if (this.express[i].value === this.form.logistics_company.trim()) {
          this.form.code = this.express[i].code;
        }
      }
      this.$heshop
        .waybill('get', { behavior: 'option', code: this.form.code })
        .then(res => {
          this.addressList = res.data;
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
    downloadFile() {
      const a = document.createElement('a');
      a.setAttribute('download', '批量发货模板.xlsx');
      a.setAttribute('href', this.origin + '/static/files/bulk-shipping-template-waybill.xlsx');
      a.click();
    }
  },
  mounted() {
    this.origin = window.location.origin;
    this.getList();
  }
};
</script>
<style scoped lang="scss">
@import './bulkShipping.less';
/deep/.le-table--operating__btn {
  padding-left: 0;
}
</style>
