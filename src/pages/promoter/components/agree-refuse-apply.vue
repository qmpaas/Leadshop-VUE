<script>
import { auditApply } from '../api';

export default {
  name: 'agree-refuse-apply',
  data() {
    return {
      // 拒绝理由
      note: ''
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    info: {
      type: [Object]
    },
    type: {
      type: String
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
    },
    // 表单信息
    applyContent({ info }) {
      return info.apply_content || [];
    }
  },
  render() {
    const self = this;
    return (
      <el-dialog
        class="le-form"
        visible={self.showDialog}
        title="申请分销商"
        width="576px"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <el-form label-width="136px">
          <el-form-item label="用户">
            <span
              class={[
                self.info.type
                  ? self.info.type === 'weapp'
                    ? 'le-icon-xiaochengxu'
                    : 'le-icon-wehcat'
                  : self.info.user.type === 'weapp'
                  ? 'le-icon-xiaochengxu'
                  : 'le-icon-wehcat',
                'le-icon'
              ]}
            />
            {self.info.nickname}
          </el-form-item>
          {self.applyContent.map((item, index) => {
            return (
              <el-form-item label={item.name} key={index}>
                <span class="apply-value">{item.value}</span>
              </el-form-item>
            );
          })}
          {(() => {
            if (self.type === 'refuse') {
              return (
                <el-form-item label="拒绝理由">
                  <el-input
                    type="textarea"
                    v-model={self.note}
                    rows="10"
                    class="le-input--280"
                    placeholder="请输入拒绝理由"
                    resize="none"
                    maxlength="200"
                    show-word-limit={true}
                  />
                </el-form-item>
              );
            }
          })()}
        </el-form>
        <div slot="footer">
          <el-button onClick={() => (self.showDialog = false)}>取消</el-button>
          <el-button type="primary" onClick={self.submit}>
            {self.type === 'refuse' ? '拒绝' : self.type === 'pass' ? '通过审核' : ''}
          </el-button>
        </div>
      </el-dialog>
    );
  },
  methods: {
    submit() {
      let success = '';
      let data = {};
      let status = null;
      if (this.type === 'refuse') {
        success = '拒绝分销商申请成功';
        data.note = this.note;
        status = 3;
      } else if (this.type === 'pass') {
        success = '通过分销商申请成功';
        status = 2;
      }
      auditApply(this.info.UID, this.type, data).then(response => {
        this.showDialog = false;
        this.$message.success(success);
        this.info.status = status;
        if (status == 2) {
          if (typeof this.info.realname != 'undefined') {
            this.info.realname = response.apply_content[0].value;
          } else if (typeof this.info.user != 'undefined' && typeof this.info.user.realname != 'undefined') {
            this.info.user.realname = response.apply_content[0].value;
          }
          this.info.invite_nickname = response.invite_nickname;
        }
        this.info.join_time = new Date().getTime() / 1000;
        this.$emit('update:info', this.info);
      });
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.le-form {
  /deep/ .el-form-item__content:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
  }

  /deep/ .el-dialog__body {
    padding-bottom: 0;
  }

  /deep/ .el-dialog__footer {
    padding-bottom: 40px;
  }

  /deep/ .el-form-item--mini {
    margin-bottom: 5px;
  }

  /deep/ .el-form-item--mini:last-child {
    margin-bottom: 24px;
  }
}

.le-icon-wehcat,
.le-icon-xiaochengxu {
  font-size: 16px;
  margin-right: 8px;
}

.apply-value:extend(.font-family-yahei) {
  font-size: 14px;
  font-weight: 400;
  color: #262626;
}
</style>
