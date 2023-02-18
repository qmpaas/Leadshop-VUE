<script type="text/javascript">
import { createNamespacedHelpers } from 'vuex';
import securityLogo from './../../assets/images/public-security.png';

const { mapActions, mapGetters } = createNamespacedHelpers('setting');

export default {
  data() {
    return {
      postData: {
        mobile: '',
        password: ''
      },
      loading: false,
      record_number_a: '',
      record_number_b: '',
      login_img: -1,
      brand_name: -1
    };
  },
  computed: {
    ...mapGetters({
      auth: 'getAuth',
      copyright_information: 'getCopyright'
    }),
    disabled: function () {
      return !(this.postData.mobile && this.postData.password);
    },
    loginImage: function ({ login_img }) {
      if (login_img && this.auth && login_img !== -1) {
        return {
          backgroundImage: `url(${login_img})`
        };
      } else if ((login_img === '' || !this.auth || login_img === -1) && this.isAuth) {
        return {
          backgroundImage: `url(${require('./image/login-background.png')})`
        };
      } else {
        return {};
      }
    },
    brandMame: function ({ brand_name }) {
      if (brand_name && this.auth && brand_name !== -1) {
        return {
          backgroundImage: `url(${brand_name})`
        };
      } else if ((brand_name === '' || !this.auth || brand_name === -1) && this.isAuth) {
        return {
          backgroundImage: `url(${require('./image/logo.png')})`
        };
      } else {
        return {};
      }
    },
    isAuth({ $store }) {
      return $store.state.setting.isAuth;
    }
  },
  mounted() {
    this.getRecord();
    this.getCopyright();
  },
  methods: {
    ...mapActions(['getSettingInfo']),
    submitForm() {
      if (this.disabled) return;
      this.loading = true;
      this.$heshop
        .login('post', this.postData)
        .then(data => {
          this.loading = false;
          this.$store.commit('apply/login', data);
          this.getSettingInfo();
          setTimeout(() => {
            this.$router.push({ path: `/panel/index` });
          }, 1000);
        })
        .catch(err => {
          this.loading = false;
          if (err.data && err.data.message) {
            this.$message.error(err.data.message);
          } else {
            this.$message.error('系统出错');
          }
        });
    },
    getRecord: function () {
      this.$heshop
        .setting(
          'put',
          {
            include: 'setting'
          },
          {
            keyword: 'web_setting'
          }
        )
        .then(res => {
          this.record_number_b = res.record_number_b;
          this.record_number_a = res.record_number_a;
        });
    },
    getCopyright() {
      this.$heshop
        .setting('put', {
          behavior: 'copyright_information'
        })
        .then(response => {
          this.login_img = response.login_img || '';
          this.brand_name = response.brand_name;
        })
        .catch(error => {
          //  Don't do
        });
    }
  },
  render() {
    const self = this;

    function keydownEnter(e) {
      if (e.keyCode === 13) {
        this.submitForm();
      }
    }

    return (
      <div class="le-login">
        <div class="le-login__content" style={self.loginImage}>
          <div class="le-content__body">
            <div class="le-body__icon" style={[self.brandMame]} />
            <div class="le-body__form">
              <div class="le-form__item">
                <div class="le-label">手机号</div>
                <el-input v-model={self.postData.mobile} autocomplete="off" class="le-value" />
              </div>
              <div class="le-form__item">
                <div class="le-label">密码</div>
                <el-input
                  v-model={self.postData.password}
                  nativeOnKeydown={keydownEnter.bind(self)}
                  autocomplete="off"
                  type="password"
                  class="le-value"
                />
              </div>
              <el-button
                loading={self.loading}
                class="le-login-submit"
                disabled={self.disabled}
                onClick={self.submitForm}>
                登录
              </el-button>
            </div>
          </div>
        </div>
        {(() => {
          if (self.record_number_a || self.record_number_b) {
            return (
              <div class="le-record flex align-center">
                <img class="le-publick-security" src={securityLogo} mode="" />
                <a
                  class="le-a"
                  href="http://www.beian.gov.cn/portal/registerSystemInfo?spm=5176.19720258.J_9220772140.112.8dc02c4amhFjAg"
                  type="__blank">
                  {self.record_number_a}
                </a>
                <a
                  class="le-a"
                  href="https://beian.miit.gov.cn/?spm=5176.19720258.J_9220772140.113.8dc02c4amhFjAg#/Integrated/index">
                  {self.record_number_b}
                </a>
              </div>
            );
          }
        })()}
      </div>
    );
  }
};
</script>
<style lang="less" scoped>
@import './login.less';
</style>
