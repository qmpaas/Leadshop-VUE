<!--
 * @Description: 
 * @Author: fjt
 * @Date: 2021-06-11 17:44:07
 * @LastEditTime: 2021-06-11 17:44:07
 * @LastEditors: fjt
-->
<template>
  <div class="le-main">
    <el-form
      class="le-card"
      v-loading="loading || submitLoading"
      ref="ruleForm"
      :model="form"
      :rules="rules"
      label-width="160px"
    >
      <el-form-item label="存储位置">
        <el-radio-group v-model="way" @change="switchChange">
          <el-radio :label="0">本地服务器</el-radio>
          <el-radio :label="1">阿里云OSS</el-radio>
          <el-radio :label="2">腾讯云COS</el-radio>
          <el-radio :label="3">七牛云存储</el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="way === 0">
        <el-form-item label="" prop="" class="le-tip">选择存储到本地服务器，无需配置信息</el-form-item>
      </template>
      <template v-if="way === 1">
        <el-form-item prop="oss.bucket" label=" 存储空间名称(Bucket)" key="oss_bucket">
          <el-input placeholder="请输入存储空间名称" v-model="form.oss.bucket"></el-input>
        </el-form-item>
        <el-form-item label="使用自定义域名" prop="is_cname" key="oss_is_cname">
          <el-switch :activeValue="true" :inactiveValue="false" v-model="form.oss.is_cname"></el-switch>
        </el-form-item>
        <el-form-item prop="oss.domain" label="域名(Endpoint)" key="oss_domain">
          <el-input placeholder="请输入域名" v-model="form.oss.domain"></el-input>
          <div class="le-prompt-text">示例: http://oss-xx-xxx-1.aliyuncs.com 或 http://mydomain.com</div>
        </el-form-item>
        <el-form-item label="AccessKey ID" prop="oss.access_key" key="oss_access_key">
          <el-input v-model="form.oss.access_key" placeholder="请输入AccessKey ID"></el-input>
        </el-form-item>
        <el-form-item label="AccessKey Secret" prop="oss.secret_key" key="oss_secret_key">
          <el-input v-model="form.oss.secret_key" placeholder="请输入AccessKey Secret"></el-input>
        </el-form-item>
      </template>
      <template v-if="way === 2">
        <el-form-item prop="cos.bucket" label="存储空间名称(Bucket)" key="cos_bucket">
          <el-input placeholder="请输入存储空间名称" v-model="form.cos.bucket"></el-input>
        </el-form-item>
        <el-form-item prop="cos.region" label="所属地域" key="cos_region">
          <el-input placeholder="请输入所属地域" v-model="form.cos.region"></el-input>
          <div class="le-prompt-text">示例: ap-shanghai 或 ap-shenzhen 或 ap-xxxxxx</div>
        </el-form-item>
        <el-form-item label="自定义域名" prop="" key="cos_domain">
          <el-input v-model="form.cos.domain" placeholder="请输入域名"></el-input>
          <div class="le-prompt-text">示例: http://mydomain.com</div>
        </el-form-item>
        <el-form-item label="Secretld" prop="cos.secret_id" key="cos_secret_id">
          <el-input v-model="form.cos.secret_id" placeholder="请输入Secretld"></el-input>
        </el-form-item>
        <el-form-item label="SecretKey" prop="cos.secret_key" Key="cos_secret_key">
          <el-input v-model="form.cos.secret_key" placeholder="请输入SecretKey"></el-input>
        </el-form-item>
      </template>
      <template v-if="way === 3">
        <el-form-item prop="qiniu.bucket" label=" 存储空间名称(Bucket)" key="qinin_bucket">
          <el-input placeholder="请输入存储空间名称" v-model="form.qiniu.bucket"></el-input>
        </el-form-item>
        <el-form-item prop="qiniu.domain" label="绑定域名" key="qinin_domain">
          <el-input placeholder="请输入域名" v-model="form.qiniu.domain"></el-input>
          <div class="le-prompt-text">示例: http://mydomain.com 或 http://xxxxxx.bkt.clouddn.com</div>
        </el-form-item>
        <el-form-item label="AccessKey(AK)" prop="qiniu.access_key" key="qiniu_access_key">
          <el-input v-model="form.qiniu.access_key" placeholder="请输入AccessKey(AK)"></el-input>
        </el-form-item>
        <el-form-item label="SecretKey(SK)" prop="qiniu.secret_key" key="qiniu_secret_key">
          <el-input v-model="form.qiniu.secret_key" placeholder="请输入SecretKey(SK)"></el-input>
        </el-form-item>
      </template>
    </el-form>
    <div class="le-cardpin">
      <el-button type="primary" :disabled="loading" :loading="submitLoading" @click="submit"> 保存 </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'cloud-storage',
  data() {
    return {
      loading: false,
      submitLoading: false,
      way: 0,
      form: {
        local: {},
        oss: {
          bucket: '',
          domain: '',
          is_cname: true,
          access_key: '',
          secret_key: ''
        },
        cos: {
          bucket: '',
          region: '',
          secret_id: '',
          secret_key: '',
          domain: ''
        },
        qiniu: {
          bucket: '',
          domain: '',
          access_key: '',
          secret_key: ''
        }
      },
      rules: {
        'oss.bucket': [
          {
            required: true,
            message: '请输入存储空间名称',
            trigger: 'blur'
          }
        ],
        'qiniu.bucket': [
          {
            required: true,
            message: '请输入存储空间名称',
            trigger: 'blur'
          }
        ],
        'cos.bucket': [
          {
            required: true,
            message: '请输入存储空间名称',
            trigger: 'blur'
          }
        ],
        'oss.domain': [
          {
            required: true,
            message: '请绑定域名',
            trigger: 'blur'
          }
        ],
        'qiniu.domain': [
          {
            required: true,
            message: '请输入域名',
            trigger: 'blur'
          }
        ],
        'oss.access_key': [
          {
            required: true,
            message: '请输入access_key',
            trigger: 'blur'
          }
        ],
        'oss.secret_key': [
          {
            required: true,
            message: '请输入secret_key',
            trigger: 'blur'
          }
        ],
        'cos.region': [
          {
            required: true,
            message: '请输入所属地域',
            trigger: 'blur'
          }
        ],
        'cos.secret_id': [
          {
            required: true,
            message: '请输入Secretld',
            trigger: 'blur'
          }
        ],
        'cos.secret_key': [
          {
            required: true,
            message: '请输入secret_key',
            trigger: 'blur'
          }
        ],
        'qiniu.secret_key': [
          {
            required: true,
            message: '请输入SecretKey(SK)',
            trigger: 'blur'
          }
        ],
        'qiniu.access_key': [
          {
            required: true,
            message: '请输入AccessKey(AK)',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    switchChange: function () {
      this.$refs.ruleForm.resetFields();
    },
    submit: function () {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.submitLoading = true;
          this.$heshop
            .setting('post', {
              keyword: 'storage_setting',
              content: {
                way: this.way,
                config: this.form
              }
            })
            .then(() => {
              this.submitLoading = false;
              this.$message.success('保存成功');
            })
            .catch(err => {
              this.submitLoading = false;
              this.$message.error(err.data.message);
            });
        } else {
          return false;
        }
      });
    },
    getSetting: function () {
      this.$heshop
        .search(
          'post',
          { include: 'setting' },
          {
            keyword: 'storage_setting'
          }
        )
        .then(res => {
          this.loading = false;
          this.form = res.content.config;
          this.way = res.content.way;
        })
        .catch(err => {
          this.loading = false;
          this.$message.error(err.data.message);
        });
    }
  },
  mounted() {
    this.getSetting();
  }
};
</script>

<style lang="scss" scoped>
.le-card {
  min-height: 339px;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
}
.le-tip ::v-deep.el-form-item__content {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
}
</style>
