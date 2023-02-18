<script>
import { auditApply, transferDistributor } from '../api';

export default {
  name: 'clear-out',
  data() {
    return {
      form: {
        radio: 0,
        transfer_id: ''
      },
      list: [],
      loading: false,
      showItem: null
    };
  },
  props: {
    value: {
      type: Boolean,
      default: false
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
  render() {
    const self = this;
    return (
      <el-dialog
        visible={self.showDialog}
        title="清退分销商"
        width="512px"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <div class="le-hint">清退分销商后，此分销商与所有下线的上下级关系将被解除</div>
        <el-form label-width="129px" class="le-form">
          <el-form-item label="清退后的关系处理">
            <el-radio-group v-model={self.form.radio}>
              <div class="radio-item">
                <el-radio label={0}>自由绑定分销商</el-radio>
                <div class="le-prompt-text">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择后，下线用户将重新自由绑定分销商
                </div>
              </div>
              <div class="radio-item">
                <el-radio label={1}>转移给指定分销商</el-radio>
                <div class="le-prompt-text">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择后，下线分销商和下线用户将转移给新的分销商
                </div>
                <el-select
                  loading={self.loading}
                  filterable={true}
                  remote={true}
                  placeholder="请输入新分销商的手机号搜索"
                  onChange={self.selectMobile}
                  v-model={self.form.select}
                  disabled={self.form.radio !== 1}
                  remote-method={self.remoteMethod}>
                  {self.list.map((item, key) => {
                    return <el-option key={key} label={item.mobile} value={item} />;
                  })}
                </el-select>
              </div>
            </el-radio-group>
            {(() => {
              if (self.showItem) {
                return <div class="show--item">{self.showItem.show_value}</div>;
              }
            })()}
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
    async remoteMethod(query) {
      if (query !== '') {
        this.loading = true;
        const response = await transferDistributor({
          uid: this.info.UID,
          mobile: query
        });
        this.list = response.filter(item => {
          item.mobile = item.mobile.toString();
          return item.mobile.indexOf(query) > -1;
        });
        this.loading = false;
      }
    },
    selectMobile(item) {
      this.showItem = item;
      this.form.transfer_id = item.UID;
    },
    submit() {
      if (this.form.radio === 1) {
        if (!this.form.transfer_id) {
          this.$message.error('请输入新分销商的手机号搜索');
          return;
        }
      } else {
        this.form.transfer_id = null;
      }
      auditApply(this.info.UID, 'repel', this.form).then(response => {
        this.$emit('confirm', {
          transferName: this.showItem?.realname
        });
        this.info.status = 4;
        this.info.transfer_id = response.transfer_id;
        this.info.repel_time = new Date().getTime() / 1000;
        this.showDialog = false;
        this.$message.success('清退分销商成功');
      });
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.le-hint:extend(.font-family-yahei) {
  width: 432px;
  height: 40px;
  line-height: 40px;
  background: #fff5d1;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 400;
  color: #262626;
  padding-left: 15px;
  margin-bottom: 25px;
}

.radio-item {
  &:first-child {
    margin-bottom: 32px;
    margin-top: 10px;
  }

  &:last-child {
    /deep/ .el-input {
      margin-top: 8px;
    }
  }
}

.le-form /deep/ .el-form-item {
  margin-bottom: 0;

  .el-input {
    width: 280px;
  }

  .show--item {
    width: 280px;
    height: 40px;
    background: #f3f5f7;
    border-radius: 8px;
    line-height: 40px;
    padding-left: 15px;
    margin-top: 12px;
  }
}
</style>
