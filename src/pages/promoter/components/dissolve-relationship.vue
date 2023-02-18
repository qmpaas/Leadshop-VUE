<!--
 * @Description: 解除关系
 * @Author: fjt
 * @Date: 2021-07-06 17:32:10
 * @LastEditTime: 2021-07-06 11:09:20
 * @LastEditors: fjt
-->
<script>
import { auditApply, transferDistributor } from '../api';

export default {
  name: 'dissolve-relationship',
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
        title="确认解除关系"
        width="496px"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <el-form label-width="129px" class="le-form">
          <el-form-item label="解除关系的处理">
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
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;选择后，下线用户将成为新的分销商的一级下线
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
    // 分配
    submit() {
      if (this.form.radio === 1) {
        if (!this.form.transfer_id) {
          this.$message.error('请输入新分销商的手机号搜索');
          return;
        }
      } else {
        this.form.transfer_id = null;
      }
      auditApply(this.info.UID, 'dispense', this.form).then(() => {
        this.$emit('confirm');
        this.$message.success('解除关系成功');
        this.showDialog = false;
      });
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';
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
