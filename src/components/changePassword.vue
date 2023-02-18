<template>
  <el-form class="le-changePassword" ref="form" :rules="rules" label-width="110px" :model="form">
    <el-form-item label="当前密码" prop="old_password">
      <el-input placeholder="请输入当前密码" type="password" v-model="form.old_password"></el-input>
    </el-form-item>
    <el-form-item label="新密码" prop="new_password1">
      <el-input placeholder="请输入新密码" type="password" v-model="form.new_password1"></el-input>
    </el-form-item>
    <el-form-item label="确认新密码" prop="new_password2">
      <el-input placholder="请再次输入新密码" type="password" v-model="form.new_password2"></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'changePassword',
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.form.new_password1) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      form: {
        old_password: '',
        new_password1: '',
        new_password2: ''
      },
      rules: {
        old_password: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
        new_password1: [{ required: true, message: '请输入新密码', trigger: 'blur' }],
        new_password2: [{ required: true, validator: validatePass, trigger: 'blur' }]
      }
    };
  },
  methods: {
    affirm: function (e) {
      let _this = this;
      this.$refs['form'].validate(valid => {
        if (valid) {
          _this.$heshop
            .passport('put', _this.form)
            .then(function (res) {
              let { handleClose } = e;
              handleClose();
              _this.$emit('input', true);
            })
            .catch(function (error) {
              if (error.status === 403) {
                _this.$message(error.data.message);
              }
            });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
