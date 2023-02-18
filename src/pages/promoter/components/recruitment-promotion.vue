<!--
 * @Description: 招募令推广
 * @Author: fjt
 * @Date: 2021-07-06 17:32:10
 * @LastEditTime: 2021-07-06 11:09:20
 * @LastEditors: fjt
-->
<script>
import copy from './../../../lib/function/copy.js';
import { getQrcode } from '../api';
import downloadBase64File from '../../../lib/function/downloadBase64File.js';

export default {
  name: 'recruitment-promotion',
  data() {
    return {
      platform: 'weapp', // weapp 小程序 wechat 公众号
      form: {
        weapp: {},
        wechat: {}
      }
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
        title="推广"
        width="533px"
        top="30vh"
        on={{
          ['update:visible']: e => {
            self.showDialog = e;
          }
        }}>
        <div class="flex">
          <div class="left">
            <div
              class={[
                {
                  active: self.platform === 'weapp'
                },
                'left-item'
              ]}
              onClick={() => (self.platform = 'weapp')}>
              微信小程序
            </div>
            <div
              class={[
                {
                  active: self.platform === 'wechat'
                },
                'left-item'
              ]}
              onClick={() => (self.platform = 'wechat')}>
              公众号
            </div>
          </div>
          <div class="right">
            <div class="right--title">
              {self.platform === 'weapp' ? '小程序路径' : self.platform === 'wechat' ? '公众号路径' : null}
            </div>
            <el-input value={self.form[self.platform].url} disabled={true} class="le-input--300">
              <el-button
                slot="append"
                onClick={() => {
                  copy({
                    content: self.form[self.platform].url,
                    success: function () {
                      self.$message.success('复制成功');
                    }
                  });
                }}>
                复制
              </el-button>
            </el-input>
            <el-button
              class="download--btn"
              plain={true}
              onClick={() => {
                downloadBase64File(self.form[self.platform].image, '招募令');
              }}>
              下载
              {self.platform === 'weapp' ? '小程序' : self.platform === 'wechat' ? '公众号' : null}码
            </el-button>
          </div>
        </div>
      </el-dialog>
    );
  },
  mounted() {
    // 获取推广二维码
    const data = {
      page: 'promoter/pages/recruit',
      scene: 'behavior=recruiting&invite_id=0'
    };
    getQrcode(data).then(response => {
      this.form = response;
    });
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.left {
  width: 120px;
  height: 126px;
  border-right: 1px solid #dcdfe6;

  .left-item:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #595959;
    text-align: center;
    line-height: 38px;
    cursor: pointer;

    &.active {
      color: #623ceb;
    }
  }
}

.right {
  width: 300px;
  height: 126px;
  margin-left: 33px;
  margin-bottom: 20px;

  .right--title:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #595959;
    line-height: 46px;
  }

  .le-input--300 ::v-deep {
    .el-input__inner {
      cursor: default;
    }

    .el-input-group__append:extend(.font-family-yahei) {
      padding: 0 12px;
      background-color: #623ceb;
      font-weight: 500;
      color: #ffffff;
    }
  }

  .download--btn {
    margin-top: 16px;
  }
}
</style>
