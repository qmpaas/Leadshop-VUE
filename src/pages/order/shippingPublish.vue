<template>
  <div class="le-matter">
    <div class="le-header">
      <span class="le-header__left" @click="router">包邮规则</span>
      <i class="el-icon-arrow-right"></i>
      <span class="le-header__right">{{ ruleForm.id ? '编辑规则' : '新建规则' }}</span>
    </div>
    <el-form :model="ruleForm" label-width="176px" :rules="rules" @submit.native.prevent>
      <div class="le-form-card">
        <el-form-item label="规则名称" prop="name">
          <el-input v-model="ruleForm.name" maxlength="10" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="包邮类型" prop="isParent">
          <div>
            <el-radio v-model="ruleForm.type" :label="1">订单满额包邮</el-radio>
            <p class="he-tips">订单金额满足条件时，选用此规则的该商品包邮</p>
          </div>
          <div>
            <el-radio v-model="ruleForm.type" :label="2">订单满件包邮</el-radio>
            <p class="he-tips">订单件数满足条件时，选用此规则的该商品包邮</p>
          </div>
          <div>
            <el-radio v-model="ruleForm.type" :label="3">商品满额包邮</el-radio>
          </div>
          <div>
            <el-radio v-model="ruleForm.type" :label="4">商品满件包邮</el-radio>
          </div>
        </el-form-item>
        <el-form-item label="包邮信息" prop="free_area">
          <el-table :data="ruleForm.free_area">
            <el-table-column label="包邮区域">
              <template slot-scope="scope">
                <span style="font-size: 14px" v-if="scope.row.str">{{ scope.row.str }}</span>
                <span style="font-size: 14px" :key="item.id" v-else v-for="(item, index) in scope.row.area"
                  >{{ index !== 0 ? '，' : '' }}{{ item.name }}</span
                >
              </template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <div style="display: flex; align-items: center">
                  <el-button
                    width="810"
                    type="text"
                    title="选择配送区域"
                    :id="scope.$index + '_edit'"
                    class="he-class__button-new"
                    module="order"
                    action="setItem"
                    v-popup.setDistrict="{
                      index: scope.$index,
                      select: scope.row.area,
                      unchecked: unchecked
                    }"
                  >
                    编辑
                  </el-button>
                  <span style="background: #623ceb; height: 14px; width: 1px"></span>
                  <popconfirm
                    width="328px"
                    @confirm="deleteItem({ index: scope.$index })"
                    title="确定删除该运费区域吗？"
                  >
                    <el-button type="text" class="he-class__button-new">删除</el-button>
                  </popconfirm>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="
                ruleForm.type === 1
                  ? '订单满额包邮（元）'
                  : ruleForm.type === 2
                  ? '订单满件包邮（件）'
                  : ruleForm.type === 3
                  ? '商品满额包邮（元）'
                  : ruleForm.type === 4
                  ? '商品满件包邮（件）'
                  : ''
              "
            >
              <template slot-scope="scope">
                <el-input
                  v-model="scope.row.number"
                  @keyup.native="scope.row.number = floatNum(scope.row.number)"
                ></el-input>
              </template>
            </el-table-column>
          </el-table>
          <div
            class="he-button"
            action="setDistrict"
            title="选择配送区域"
            width="801"
            v-popup.setDistrict="{ unchecked: unchecked }"
            module="order"
          >
            新增包邮区域
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div class="le-cardpin">
      <el-button @click="$router.back()">取消</el-button>
      <el-button @click="save" type="primary">保存</el-button>
    </div>
  </div>
</template>
<script type="text/javascript">
import popconfirm from '@/components/popconfirm.vue';
import floatNum from '@/lib/function/floatNum';

export default {
  components: {
    popconfirm
  },
  name: 'shippingPublish',
  computed: {
    checkList: function () {
      for (let i = 0; i < this.ruleForm.free_area.length; i++) {}
    }
  },
  data() {
    return {
      ruleForm: {
        id: null,
        name: '',
        type: 1,
        free_area: []
      },
      rules: {
        name: [{ required: true, message: '请输入规则名称', trigger: 'blur' }],
        free_area: [{ required: true, message: '请输入包邮信息', trigger: 'change' }],
        goods_show: [{ required: true, trigger: 'change' }]
      },
      catObject: {
        cat: [],
        result: null
      },
      unchecked: { selectDistrict: [] }
    };
  },
  async mounted() {
    let id = this.$getQueryVariable('id');
    if (id) this.getDetail(parseInt(id));
  },
  methods: {
    save() {
      if (this.ruleForm.free_area.length === 0) {
        this.$message.error('包邮区域不能为空');
        return;
      }
      for (let i = 0; i < this.ruleForm.free_area.length; i++) {
        if (!this.ruleForm.free_area[i].number) {
          if (this.ruleForm.type === 1 || this.ruleForm.type === 3) {
            this.$message.error('包邮金额不能为空');
          } else {
            this.$message.error('包邮件数不能为空');
          }
          return;
        }
      }
      if (this.ruleForm.id) {
        this.$heshop
          .packagefreerules('put', parseInt(this.ruleForm.id), this.ruleForm)
          .then(() => {
            this.$message.success('编辑成功');
            this.$router.back();
          })
          .catch(err => {
            let msg = err.data.message || err.data[0].message;
            this.$message.error(msg);
          });
      } else {
        this.$heshop
          .packagefreerules('post', this.ruleForm)
          .then(() => {
            this.$message.success('添加成功');
            this.$router.back();
          })
          .catch(err => {
            let msg = err.data.message || err.data[0].message;
            this.$message.error(msg);
          });
      }
    },
    deleteTag() {
      this.catObject.result = null;
    },
    getDetail(id) {
      let _this = this;
      _this.unchecked.selectDistrict = [];
      this.$heshop
        .packagefreerules('get', id)
        .then(res => {
          this.ruleForm = res;
          res.free_area.forEach(line => {
            line.area.forEach(item => {
              _this.unchecked.selectDistrict.push(item);
            });
          });
        })
        .catch(err => {
          this.$message.error(err.data.message);
        });
    },
    setDistrict(e) {
      let list = e.select;
      let str = '';
      for (let i = 0; i < list.length; i++) {
        if (list[i].isIndeterminate) {
          let item = list[i];
          for (let j = 0; j < item.list.length; j++) {
            let obj = item.list[j];
            if (obj.isIndeterminate) {
              for (let m = 0; m < obj.list.length; m++) {
                str += `${obj.list[m].name},`;
              }
            } else {
              str += `${obj.name},`;
            }
          }
        } else {
          str += `${list[i].name},`;
        }
      }
      str = str.slice(0, str.length - 1);
      this.ruleForm.free_area.push({
        str: str,
        area: e.select,
        number: 0
      });
      this.unchecked.selectDistrict = [];
      this.ruleForm.free_area.forEach(line => {
        line.area.forEach(item => {
          this.unchecked.selectDistrict.push(item);
        });
      });
    },
    setItem(e) {
      let list = e.select;
      let str = '';
      for (let i = 0; i < list.length; i++) {
        if (list[i].isIndeterminate) {
          let item = list[i];
          for (let j = 0; j < item.list.length; j++) {
            let obj = item.list[j];
            if (obj.isIndeterminate) {
              for (let m = 0; m < obj.list.length; m++) {
                str += `${obj.list[m].name},`;
              }
            } else {
              str += `${obj.name},`;
            }
          }
        } else {
          str += `${list[i].name},`;
        }
      }
      str = str.slice(0, str.length - 1);
      if (e.select.length > 0) {
        this.$set(this.ruleForm.freight_rules[e.index], 'area', e.select);
        this.$set(this.ruleForm.freight_rules[e.index], 'str', str);
      } else {
        this.deleteItem(e);
      }
      let _this = this;
      _this.unchecked.selectDistrict = [];
      this.ruleForm.free_area.forEach(line => {
        line.area.forEach(item => {
          _this.unchecked.selectDistrict.push(item);
        });
      });
    },
    deleteItem(e) {
      let _this = this;
      _this.unchecked.selectDistrict = [];
      this.$delete(this.ruleForm.free_area, e.index);
      this.ruleForm.free_area.forEach(line => {
        line.area.forEach(item => {
          _this.unchecked.selectDistrict.push(item);
        });
      });
    },
    router: function () {
      this.$router.back();
    },
    floatNum: function (val) {
      if (this.ruleForm.type === 2 || this.ruleForm.type === 4) {
        return val.replace(/[^0-9]/g, '');
      } else {
        return floatNum(val);
      }
    }
  }
};
</script>
<style lang="less" scoped="true">
.le-header {
  margin-bottom: 24px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
}

.he-link {
  font-weight: bold;
  transition: color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  color: #303133;
  text-decoration: none;
  cursor: pointer;
}

.he-tips {
  line-height: 13px;
  font-size: 12px;
  font-weight: 500;
  color: #000000;
  opacity: 0.45;
  margin: 0 0 10px 0;
  padding-left: 20px;
}

.he-link {
  font-size: 12px;
  font-weight: 500;
  color: #623ceb;
  margin-left: 8px;
  opacity: 1;
}

.he-button {
  width: 132px;
  height: 32px;
  border: 1px solid #623ceb;
  border-radius: 4px;
  color: #623ceb;
  margin: 16px 0 16px 0;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

.le-form-card {
  border-radius: 16px;
  background-color: #ffffff;
  padding: 24px;
}

/deep/ .le-form-card .he-class__button-new {
  font-size: 14px;
  padding: 10px;
  color: #623ceb;
}
</style>
