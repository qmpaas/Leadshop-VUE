<script>
import { addPromoter, promoterLevelList, userPromoter } from '../api';

export default {
  name: 'add-distributor',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      // 等级列表
      levelList: [],
      form: {
        UID: '',
        level: null,
        mobile: '',
        realname: '',
        search: ''
      },
      rules: {
        search: [
          {
            required: true,
            message: '请输入ID/昵称搜索'
          }
        ],
        level: [
          {
            required: true,
            message: '请选择分销商等级'
          }
        ]
      },
      loading: false,
      timeout: null
    };
  },
  computed: {
    showDialog: {
      get({ value }) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  render() {
    const self = this;
    return (
      <el-dialog
        class="le-form"
        visible={self.showDialog}
        title="添加分销商"
        width="496px"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <el-form
          props={{ model: self.form, rules: self.rules }}
          ref="form"
          label-width="136px"
          v-loading={self.loading}>
          <el-form-item label="用户搜索" prop="search">
            <el-autocomplete
              v-model={self.form.search}
              fetch-suggestions={self.querySearchAsync}
              placeholder="请输入ID/昵称搜索"
              class="le-input--240"
              on-select={self.handleSelect}
              scopedSlots={{
                default({ item }) {
                  return (
                    <div class="flex justify-between">
                      <span>{item.nickname}</span>
                      <span>ID:{item.id}</span>
                    </div>
                  );
                }
              }}></el-autocomplete>
          </el-form-item>
          <el-form-item label="分销商等级" prop="level">
            <el-select v-model={self.form.level} class="le-input--240">
              {self.levelList.map((item, index) => {
                return <el-option key={index} label={item.name} value={item.level} />;
              })}
            </el-select>
          </el-form-item>
          <el-form-item label="姓名">
            <el-input v-model={self.form.realname} class="le-input--240" placeholder="请输入姓名" />
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model={self.form.mobile} class="le-input--240" placeholder="请输入手机号" />
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button onClick={() => (self.showDialog = false)}>取消</el-button>
          <el-button type="primary" onClick={self.submit}>
            添加
          </el-button>
        </div>
      </el-dialog>
    );
  },
  mounted() {
    // 获取分销商等级列表
    promoterLevelList().then(response => {
      this.levelList = response;
    });
  },
  methods: {
    // 提交表单
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          addPromoter(this.form)
            .then(() => {
              this.$emit('confirm');
              this.showDialog = false;
              this.$message.success('添加分销商成功');
            })
            .catch(() => {
              //  Don't do
            });
        } else {
          return false;
        }
      });
    },
    querySearchAsync(query, cb) {
      if (query) {
        userPromoter(query).then(response => {
          response = response.map(item => {
            return {
              ...item,
              value: item.nickname
            };
          });
          if (response.length) {
            cb(response);
          } else {
            this.$message({
              type: 'info',
              message: '不存在该用户'
            });
          }
        });
      } else {
        cb();
      }
    },
    handleSelect(data) {
      this.form.UID = data.id;
    }
  }
};
</script>

<style scoped lang="scss">
@import './../index.less';

.le-input--240.el-select /deep/ .el-input {
  width: 240px;
}

.le-input--240.el-autocomplete /deep/ .el-input {
  width: 240px;
}
</style>
