<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-05-25 13:20:27
 * @LastEditTime: 2021-05-27 17:03:58
 * @LastEditors: fjt
-->
<template>
  <el-form class="le-GroupTemplate" :model="form" :rules="rules" label-width="68px" ref="form" v-loading="loading">
    <el-form-item label="规格名" prop="param_name" ref="form" class="le-form-input">
      <el-input placeholder="请输入规格名" v-model="form.param_name" maxlength="10" show-word-limit></el-input>
    </el-form-item>
    <el-form-item label="规格值" class="le-form-input" prop="value">
      <el-input placeholder="请输入规格值" v-model="form.value" maxlength="20" show-word-limit>
        <el-button slot="append" @click="appendList">添加</el-button>
      </el-input>
      <div class="le-prompt-text">最多添加200个规格值</div>
    </el-form-item>
    <el-form-item prop="param_data">
      <el-scrollbar class="le-group-list">
        <div class="le-group-content" v-if="form.param_data.length > 0">
          <el-tag
            class="le-tag"
            type="info"
            effect="plain"
            size="medium"
            v-for="(item, index) in form.param_data"
            :key="index"
            closable
            @close="delItem(index)"
          >
            {{ item }}</el-tag
          >
        </div>
        <div v-else class="le-group-nothing">暂无规格值，请添加</div>
      </el-scrollbar>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    value: {
      type: [Object, Array]
    }
  },
  data() {
    const checkData = (rule, value, callback) => {
      if (value.length === 0) {
        callback('请添加规格值');
      }
      callback();
    };
    return {
      form: {
        value: '',
        param_name: '',
        param_data: []
      },
      rules: {
        param_name: [{ required: true, message: '请输入规格名', trigger: 'blur' }],
        param_data: [{ validator: checkData, trigger: ['blur'] }]
      },
      loading: false
    };
  },
  methods: {
    appendList: function () {
      if (!this.form.value) return;
      let newArr = this.form.param_data;
      for (let i = 0; i < newArr.length; i++) {
        if (this.form.value === newArr[i]) {
          this.$message.warning('已存在相同规格值');
          return;
        }
      }
      if (this.form.param_data.length >= 200) return;
      this.form.param_data.push(this.form.value);
      this.form.value = '';
      this.$refs['form'].clearValidate('param_data');
    },
    delItem: function (index) {
      this.form.param_data.splice(index, 1);
    },
    affirm: function (e) {
      let { handleClose } = e;
      this.loading = true;
      let _this = this;
      this.$refs['form'].validate(bool => {
        if (bool) {
          if (Object.prototype.toString.call(this.value) === '[object Object]') {
            _this.$heshop
              .goodstemplate('put', this.value.item.id, _this.form)
              .then(function () {
                _this.value.item.param_name = _this.form.param_name;
                _this.value.item.param_data = _this.form.param_data;
                _this.loading = false;
                _this.$message.success('规格模板保存成功');
                handleClose();
              })
              .catch(function (error) {
                _this.loading = false;
                _this.$message.error(error.data.message);
              });
          } else {
            _this.$heshop
              .goodstemplate('post', _this.form)
              .then(function () {
                _this.loading = false;
                _this.$message.success('规格模板保存成功');
                handleClose();
              })
              .catch(function (error) {
                _this.loading = false;
                _this.$message.error(error.data.message);
              });
          }
        } else {
          _this.loading = false;
        }
      });
    }
  },
  mounted() {
    if (Object.prototype.toString.call(this.value) === '[object Object]') {
      this.form.param_data = JSON.parse(JSON.stringify(this.value.item.param_data));
      this.form.param_name = this.value.item.param_name;
    }
  }
};
</script>

<style lang="scss" scoped>
.le-GroupTemplate {
  overflow: hidden;
}
.le-group-list {
  width: 640px;
  height: 160px;
  background: #f3f5f7;
  border-radius: 8px;
  margin-top: 15px;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .le-group-content {
    padding: 12px;
  }
  .le-tag {
    margin-right: 8px;
  }
}
.le-form-input {
  /deep/.el-input {
    width: 405px;
  }
}
.le-GroupTemplate .le-form-input:nth-child(2) {
  margin-bottom: 0;
  /deep/.el-input-group__append {
    width: 60px;
    .el-button {
      padding: 9px 17px;
    }
  }
}

.le-group-nothing {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #8c8c8c;
  text-align: center;
  margin-top: 21px;
}
</style>
