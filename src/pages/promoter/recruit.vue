<!--
 * @Description: 分销招募
 * @Author: fjt
 * @Date: 2021-06-08 17:44:29
 * @LastEditTime: 2021-06-08 17:45:19
 * @LastEditors: fjt
-->
<script>
import mobileHead from './images/mobile-head.png';
import Editor from 'wangeditor';
import { getRecruitMake, saveRecruitMake } from './api';
import recruitmentPromotion from './components/recruitment-promotion.vue';
import { AlertMenu } from '../goods/components/edit';

const content = `
      <img src="https://qmxq.oss-cn-hangzhou.aliyuncs.com/promoter/recruit-1.png" width="100%" style="display: block">
      <div style="width: 100%;background-color: #3A18AB;overflow: hidden;">
        <div style="padding: 0 16px">
            <div style="background-color: #ffffff;border-radius: 8px;padding: 20px 20px;font-size: 13px;font-weight: 500;color: #222222;">【店铺名称】诚挚邀请你加入我们的分销员团队，无任何成本，不用您处理订单和售后，即可成为我们的分销员，你只需将高品质商品分享推荐给他人，赚取佣金。欢迎您和我们一起分享喜悦！</div>
        </div>
        <div style="position: relative;">
          <img src="https://qmxq.oss-cn-hangzhou.aliyuncs.com/promoter/recruit-2.png" width="100%" alt="">
          <span style="color: #fff;font-size: 16px;font-weight: 400;line-height: 24px;position: absolute;z-index: 10;top:34px;left: 16px">如何成为分销商</span>
          <div style="background-color: #fff;border-radius: 8px;margin: 0 16px;padding: 20px 20px;font-size: 13px;font-weight: 500;color: #222222;">
              √ 阅读此招募令内容，点击底部成为分销商按钮<br/>
              √ 根据指引，完成申请流程，提交申请信息
          </div>
        </div>
        <div style="position: relative;">
            <img src="https://qmxq.oss-cn-hangzhou.aliyuncs.com/promoter/recruit-3.png" width="100%" alt="">
            <span style="color: #fff;font-size: 16px;font-weight: 400;line-height: 24px;position: absolute;z-index: 10;top:34px;left: 16px">如何赚取佣金</span>
            <div style="background-color: #fff;border-radius: 8px;margin: 0 16px;padding: 20px 20px;font-size: 13px;font-weight: 500;color: #222222;">
                A. 点击商品详情页的【分享】按钮，将商品链接或商  &nbsp;&nbsp;&nbsp;&nbsp;品海报分享给好友<br/>
                B. 其他人通过分享的链接或海报，进入到商品详情页  &nbsp;&nbsp;&nbsp;&nbsp;并购买商品<br/>
                C. 订单过售后时间后，系统自动结算佣金
            </div>
          </div>
          <div style="position: relative;">
            <img src="https://qmxq.oss-cn-hangzhou.aliyuncs.com/promoter/recruit-4.png" width="100%" alt="">
            <span style="color: #fff;font-size: 16px;font-weight: 400;line-height: 24px;position: absolute;z-index: 10;top:34px;left: 16px">如何提现佣金</span>
            <div style="background-color: #fff;border-radius: 8px;margin: 0 16px;padding: 20px 20px;font-size: 13px;font-weight: 500;color: #222222;">
                A. 进入到分销员中心，查看待提现佣金<br/>
                B. 点击待提现佣金，进入到提现页面，根据指引，完  &nbsp;&nbsp;&nbsp;&nbsp;成提现申请<br/>
                C. 商家收到提现申请后，将佣金打款至提现账户
            </div>
          </div>
          <div style="position: relative;">
            <img src="https://qmxq.oss-cn-hangzhou.aliyuncs.com/promoter/recruit-5.png" width="100%" alt="">
            <span style="color: #fff;font-size: 16px;font-weight: 400;line-height: 24px;position: absolute;z-index: 10;top:34px;left: 16px">联系我们</span>
            <div style="background-color: #fff;border-radius: 8px;margin: 0 16px;padding: 8px 20px;">
                <div style="height: 50px;border-bottom: 1px solid #E5E5E5;line-height: 50px;">
                   <span style="font-size: 13px;font-weight: 500;color: #222222;display: inline-block;width: 60px;margin-right: 8px">联系人</span>
                   <span style="font-size: 13px;font-weight: 500;color: #999999;">请填写联系人姓名</span>
                </div>
                <div style="height: 50px;border-bottom: 1px solid #E5E5E5;line-height: 50px;">
                   <span style="font-size: 13px;font-weight: 500;color: #222222;display: inline-block;width: 60px;margin-right: 8px">手机号</span>
                   <span style="font-size: 13px;font-weight: 500;color: #999999;">请填写手机号</span>
                </div>
                <div style="height: 50px;line-height: 50px;">
                   <span style="font-size: 13px;font-weight: 500;color: #222222;display: inline-block;width: 60px;margin-right: 8px">邮箱</span>
                   <span style="font-size: 13px;font-weight: 500;color: #999999;">请填写邮箱</span>
                </div>
            </div>
          </div>
          <div style="background-color: #3A18AB;overflow: hidden;">
              <div ref="button" style="background-color: #FFB43E;text-align: center;width: calc(100% - 32px);height: 40px;line-height: 40px;border-radius: 20px;border: none;cursor: pointer;color: #fff;margin: 24px 16px;">申请成为分销商</div>
          </div>
      </div>
    `;

export default {
  components: {
    recruitmentPromotion
  },
  data() {
    return {
      form: {
        title: '',
        content: content
      },
      rules: {
        title: [
          {
            required: true,
            message: '页面标题不能为空'
          }
        ]
      },
      loading: true,
      disabled: true,
      editor: null,
      // 推广招募令
      showRecruitmentPromotion: false
    };
  },
  mounted() {
    const editor = new Editor('#editor');
    editor.config.height = 587;
    editor.menus.extend('alertMenuKey', AlertMenu);
    editor.config.uploadFile = () => {
      this.$refs.pictureDialog.handleClick();
    };

    editor.config.menus = [
      'head',
      'bold',
      'fontSize',
      'fontName',
      'italic',
      'underline',
      'strikeThrough',
      'indent',
      'foreColor',
      'backColor',
      'justify',
      'image',
      'undo',
      'redo',
      'alertMenuKey'
    ];
    editor.config.showFullScreen = false;
    editor.config.zIndex = 99;
    editor.create();
    this.editor = editor;
    this.editor.config.onchange = newHtml => {
      this.form.content = newHtml;
    };
    getRecruitMake().then(response => {
      this.form = response;
      this.editor.txt.html(this.form.content);
      this.loading = false;
      this.disabled = false;
    });
  },
  render() {
    const self = this;
    return (
      <div class="le-main flex">
        <div class="le-mobilePreview">
          <div class="content--title">{self.form.title}</div>
          <img height="80px" width="340px" class="le-mobile-head" src={mobileHead} />
          <div class="le-mobileContent" domPropsinnerHTML={self.form.content} />
        </div>
        <div class="flex-sub">
          <div class="le-card">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>基础信息</span>
            </div>
            <el-form
              label-width="133px"
              class="le-form"
              props={{
                model: self.form,
                rules: self.rules
              }}>
              <el-form-item label="页面标题" prop="title">
                <el-input v-model={self.form.title} maxlength="8" show-word-limit={true} />
              </el-form-item>
              <el-form-item label="页面样式">
                <el-button type="text" onClick={self.reset}>
                  恢复默认
                </el-button>
              </el-form-item>
              <el-form-item label="推广招募">
                <el-button type="text" onClick={() => (self.showRecruitmentPromotion = true)}>
                  推广
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="le-card">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>页面编辑</span>
            </div>
            <div class="le-editor" id="editor" />
          </div>
        </div>
        <div class="le-cardpin">
          <el-button
            type="primary"
            loading={self.loading && !self.disabled}
            disabled={self.disabled}
            onClick={self.saveRecruitMake}>
            保存
          </el-button>
        </div>
        {
          // 招募令推广
          (() => {
            if (self.showRecruitmentPromotion) {
              return <recruitmentPromotion v-model={self.showRecruitmentPromotion} />;
            }
          })()
        }
        <pictureDialog on-confirm={self.confirm} ref="pictureDialog" limit={10} max={10} />
      </div>
    );
  },
  methods: {
    confirm: function (value) {
      let editor = this.editor;
      for (let i = 0; i < value.length; i++) {
        editor.cmd.do('insertHTML', `<img style="width: 100%" src="${value[i]}"/>`);
      }
    },
    saveRecruitMake() {
      this.loading = true;
      saveRecruitMake(this.form)
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 回复默认招募令
    reset() {
      this.$confirm('确认恢复默认样式？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      })
        .then(() => {
          this.editor.txt.html(content);
          this.$message({
            type: 'success',
            message: '恢复默认样式成功!'
          });
        })
        .catch(() => {
          //  Don't do
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import './index.less';

.le-mobilePreview {
  width: 380px;
  background: #ffffff;
  border-radius: 40px;
  border: 1px solid #dcdfe6;
  padding: 39px 20px 39px 20px;
  margin-right: 24px;
  position: relative;

  .content--title:extend(.font-family-yahei) {
    font-size: 16px;
    font-weight: bold;
    color: #262626;
    position: absolute;
    left: 50%;
    top: 90px;
    transform: translateX(-50%);
  }

  .le-mobile-head {
    display: block;
    border: 1px solid #dcdfe6;
    border-top-right-radius: 4px;
    border-top-left-radius: 4px;
  }

  .le-mobileContent {
    width: 340px;
    border: 1px solid #dcdfe6;
    border-top: none;
    height: calc(100% - 80px);
  }
}

.le-card:first-child {
  margin-bottom: 24px;
}

.le-form ::v-deep {
  overflow: hidden;
  margin-top: 39px;

  .el-form-item__content .el-button--text:extend(.font-family-yahei) {
    padding: 9px 0;
    font-weight: 400;
    font-size: 14px;
  }

  .el-form-item:last-child {
    margin-bottom: 0;
  }
}

.le-editor {
  width: 416px;
  margin-top: 39px;
}

/* table 样式 */
table {
  border-top: 1px solid #ccc;
  border-left: 1px solid #ccc;
}

table td,
table th {
  border-bottom: 1px solid #ccc;
  border-right: 1px solid #ccc;
  padding: 3px 5px;
}

table th {
  border-bottom: 2px solid #ccc;
  text-align: center;
}

/* blockquote 样式 */
blockquote {
  display: block;
  border-left: 8px solid #d0e5f2;
  padding: 5px 10px;
  margin: 10px 0;
  line-height: 1.4;
  font-size: 100%;
  background-color: #f1f1f1;
}

/* code 样式 */
code {
  display: inline-block;
  *display: inline;
  *zoom: 1;
  background-color: #f1f1f1;
  border-radius: 3px;
  padding: 3px 5px;
  margin: 0 3px;
}

pre code {
  display: block;
}

/* ul ol 样式 */
ul,
ol {
  margin: 10px 0 10px 20px;
}

/deep/ .w-e-toolbar {
  z-index: 10 !important;
}

/deep/ .w-e-text-container {
  z-index: 9 !important;
}

/deep/ .w-e-menu[data-title='图片'] {
  display: none;
}

/deep/ .w-e-tooltip-item-wrapper:last-child {
  display: none;
}
</style>
