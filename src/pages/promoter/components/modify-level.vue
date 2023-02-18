<script>
import { editLevel, promoterLevelList } from '../api';

export default {
  name: 'modify-level',
  data() {
    return {
      list: [],
      form: {
        level: null
      },
      rules: {
        level: [
          {
            required: true,
            message: '请选择分销商等级'
          }
        ]
      }
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
    },
    info: {
      type: [Object]
    }
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
  mounted() {
    // 获取分销等级列表
    promoterLevelList().then(response => {
      this.list = response.map(item => {
        let newItem = {
          ...item,
          disabled: false
        };
        if (newItem.level === this.info.level) {
          newItem.disabled = true;
        }
        return newItem;
      });
    });
  },
  render() {
    const self = this;
    return (
      <el-dialog
        visible={self.showDialog}
        title="修改分销商等级"
        width="456px"
        top="30vh"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <el-form props={{ model: self.form, rules: self.rules }} ref="form" label-width="140px">
          <el-form-item label="当前分销商等级">
            <span class="level-title">{self.info.level_name}</span>
          </el-form-item>
          <el-form-item label="修改分销商等级" prop="level">
            <el-select class="le-input--200" v-model={self.form.level}>
              {self.list.map((item, index) => {
                return <el-option key={index} disabled={item.disabled} label={item.name} value={item.level} />;
              })}
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer">
          <el-button onClick={() => (self.showDialog = false)}>取消</el-button>
          <el-button type="primary" onClick={self.submit}>
            确定
          </el-button>
        </div>
      </el-dialog>
    );
  },
  methods: {
    // 提交修改等级
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          editLevel(this.info.UID, this.form.level).then(() => {
            this.showDialog = false;
            const item = this.list.find(item => {
              return item.level === this.form.level;
            });
            this.info.level_name = item.name;
            this.info.level = item.level;
            this.form.level = null;
            this.$message({
              type: 'success',
              message: '修改分销商等级成功'
            });
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.el-dialog .el-dialog__body {
  padding-bottom: 0;
}

.level-title:extend(.font-family-yahei) {
  font-size: 14px;
  font-weight: 400;
  color: #262626;
}
</style>
