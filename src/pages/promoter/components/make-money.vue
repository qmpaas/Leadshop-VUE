<script>
import { finance } from '../api';

export default {
  name: 'make-money',
  data() {
    return {
      content: ''
    };
  },
  props: {
    value: {
      type: Boolean,
      default: true
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
    }
  },
  render() {
    const self = this;
    return (
      <el-dialog
        visible={self.showDialog}
        title="打款"
        width={self.type === 'agree' ? '376px' : '496px'}
        top="30vh"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <el-form label-width="120px">
          <el-form-item label="实际打款金额">
            <span class="price">￥{self.info.actual_price}</span>
          </el-form-item>
          {(() => {
            if (self.type === 'refuse') {
              return (
                <el-form-item label="拒绝理由">
                  <el-input
                    type="textarea"
                    v-model={self.content}
                    rows="8"
                    class="le-input--280"
                    placeholder="请输入拒绝理由"
                    resize="none"
                    maxlength="100"
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
            {self.type === 'refuse' ? '拒绝打款' : self.type === 'agree' ? '确定打款' : ''}
          </el-button>
        </div>
      </el-dialog>
    );
  },
  methods: {
    // 提交打款申请回馈
    submit() {
      const status = this.type === 'agree' ? 2 : this.type === 'refuse' ? 3 : null;
      finance(this.info.id, status, this.content)
        .then(() => {
          this.info.status = status;
          if (status === 2) {
            this.$message({
              type: 'success',
              message: '打款成功'
            });
          } else {
            this.$message({
              type: 'success',
              message: '拒绝打款成功'
            });
          }
          this.$emit('confirm');
        })
        .catch(error => {
          if (error.data.message === '产品权限验证失败,请查看您当前是否具有该产品的权限') {
            this.$emit('update:showPaymentFailed', true);
          } else {
            this.$message({
              type: 'error',
              message: error.data.message
            });
          }
        })
        .finally(() => {
          this.showDialog = false;
        });
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.price:extend(.font-family-yahei) {
  width: 71px;
  height: 12px;
  font-size: 14px;
  font-weight: 400;
  color: #262626;
}

.el-form-item:last-child {
  margin-bottom: 0;
}
</style>
