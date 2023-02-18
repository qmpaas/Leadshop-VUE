<script>
const expandedState = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/float-open.png';
const toTop = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/float-toTop.png';
const backPage = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/float-backPage.png';
const personalCenter = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/float-personal-center.png';
const index = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/float-index.png';
const cart = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/float-cart.png';
const tell = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/float-tell.png';
const stowedState = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/float-close.png';
import vuedraggable from 'vuedraggable';
import hyperlinkSelect from '@/components/hyperlinkSelect/select.vue';

export default {
  name: 'float-window',
  components: {
    vuedraggable,
    hyperlinkSelect
  },
  data() {
    return {
      form: {
        status: 0,
        stowedState: '',
        expandedState: '',
        button: [],
        move: 0,
        buttonIcon: {
          index: '',
          cart: '',
          tell: '',
          personalCenter: '',
          toTop: '',
          backPage: ''
        },
        pages: [],
        channel: [],
        customize: []
      }
    };
  },
  render() {
    return (
      <div>
        <div class="le-main flex">
          <div class="le-card">
            <div class="content">
              <img src={require('./../../assets/images/icon-phone-header.png')} width="340" height="88" alt="" />
              <div class="float-btn flex flex-direction align-end">
                {(() => {
                  if (this.form.status === 1 && this.form.button.length < 4) {
                    return (
                      <div class="flex flex-direction">
                        {this.form.button.map((item, index) => {
                          return <img key={index} class="button" src={this.form.buttonIcon[item]} alt="" />;
                        })}
                      </div>
                    );
                  } else if (this.form.status === 1 && this.form.button.length >= 4) {
                    return (
                      <div class="box flex flex-wrap">
                        {this.form.button.map((item, index) => {
                          return (
                            <div class="btn" key={index}>
                              <img class="button" src={this.form.buttonIcon[item]} alt="" />
                              <span>
                                {(() => {
                                  switch (item) {
                                    case 'index':
                                      return '首页';
                                    case 'cart':
                                      return '购物车';
                                    case 'tell':
                                      return '联系客服';
                                    case 'personalCenter':
                                      return '个人中心';
                                    case 'toTop':
                                      return '返回顶部';
                                    case 'backPage':
                                      return '返回上页';
                                  }
                                })()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  } else if (this.form.status === 2 && this.form.customize.length < 4) {
                    return this.form.customize.map((item, key) => {
                      return <img src={item.img} alt="" width="39" style="margin-bottom: 8px" height="39" key={key} />;
                    });
                  } else if (this.form.status === 2 && this.form.customize.length >= 4) {
                    return (
                      <div class="box flex flex-wrap">
                        {this.form.customize.map((item, index) => {
                          return (
                            <div class="btn flex align-center flex-direction" key={index}>
                              <img class="button" src={item.img} alt="" />
                              <span>{item.name}</span>
                            </div>
                          );
                        })}
                      </div>
                    );
                  }
                })()}
                {(() => {
                  if (
                    (this.form.status === 1 && this.form.button.length >= 1) ||
                    (this.form.status === 2 && this.form.customize.length >= 1)
                  ) {
                    return (
                      <div>
                        <img src={this.form.stowedState} class="close" />
                      </div>
                    );
                  }
                })()}
              </div>
            </div>
          </div>
          <div class="le-card flex-sub">
            <div class="le-title">启用设置</div>
            <el-radio-group v-model={this.form.status}>
              <el-radio label={1}>启用普通模式</el-radio>
              <el-radio label={2}>启用自定义模式</el-radio>
              <el-radio label={0}>不启用悬浮窗</el-radio>
            </el-radio-group>
            {(() => {
              if (this.form.status !== 0) {
                return (
                  <div>
                    <div class="le-line"></div>
                    <div class="le-title">移动设置</div>
                    <el-radio-group v-model={this.form.move}>
                      <el-radio label={0}>不可移动</el-radio>
                      <el-radio label={1}>可移动</el-radio>
                    </el-radio-group>
                    <div class="le-line"></div>
                    <div class="le-title">内容设置</div>
                    <div class="item">
                      <span class="le-prompt-text">图标尺寸建议88px*88px</span>
                      <el-button
                        class="reset-btn"
                        type="text"
                        onClick={() => {
                          this.form.expandedState = expandedState;
                          this.form.stowedState = stowedState;
                          this.form.buttonIcon.toTop = toTop;
                          this.form.buttonIcon.backPage = backPage;
                          this.form.buttonIcon.personalCenter = personalCenter;
                          this.form.buttonIcon.index = index;
                          this.form.buttonIcon.cart = cart;
                          this.form.buttonIcon.tell = tell;
                        }}>
                        恢复默认
                      </el-button>
                    </div>
                    <div class="flex item">
                      <div class="le-label">收起展开</div>
                      <div>
                        <div class="flex">
                          <div class="open-close">
                            <div class="upload-image">
                              <pictureDialog
                                v-model={this.form.stowedState}
                                limit={1}
                                scopedSlots={{
                                  upload() {
                                    return <div style="width: 60px;height: 60px" />;
                                  },
                                  preview(scope) {
                                    return (
                                      <div class="upload-image-preview">
                                        <el-image style="width: 60px;height: 60px" src={scope.url} fit="cover" />
                                        <div class="replace">
                                          <span>替换</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                }}
                              />
                            </div>
                            <div class="le-prompt-text">收起状态</div>
                          </div>
                          <div class="open-close">
                            <div class="upload-image">
                              <pictureDialog
                                v-model={this.form.expandedState}
                                limit={1}
                                scopedSlots={{
                                  upload() {
                                    return <div style="width: 60px;height: 60px" />;
                                  },
                                  preview(scope) {
                                    return (
                                      <div class="upload-image-preview">
                                        <el-image style="width: 60px;height: 60px" src={scope.url} fit="cover" />
                                        <div class="replace">
                                          <span>替换</span>
                                        </div>
                                      </div>
                                    );
                                  }
                                }}
                              />
                            </div>
                            <div class="le-prompt-text">展开状态</div>
                          </div>
                        </div>
                        <div class="le-prompt-text">包含3个及以上悬浮按钮时，启用收起展开</div>
                      </div>
                    </div>
                    <div class="flex item button">
                      <div class="le-label">悬浮按钮</div>
                      {(() => {
                        if (this.form.status === 1) {
                          return (
                            <div>
                              <el-checkbox-group v-model={this.form.button}>
                                <el-checkbox label="index">首页</el-checkbox>
                                <el-checkbox label="cart">购物车</el-checkbox>
                                <el-checkbox label="tell">联系客服</el-checkbox>
                                <el-checkbox label="personalCenter">个人中心</el-checkbox>
                                <el-checkbox label="toTop">返回顶部</el-checkbox>
                                <el-checkbox label="backPage">返回上页</el-checkbox>
                              </el-checkbox-group>
                              <vuedraggable class="flex" v-model={this.form.button}>
                                {this.form.button.map((item, key) => {
                                  return (
                                    <div class="open-close" key={key}>
                                      <div class="upload-image">
                                        <pictureDialog
                                          v-model={this.form.buttonIcon[item]}
                                          limit={1}
                                          scopedSlots={{
                                            upload() {
                                              return <div style="width: 60px;height: 60px" />;
                                            },
                                            preview(scope) {
                                              return (
                                                <div class="upload-image-preview">
                                                  <el-image
                                                    style="width: 60px;height: 60px"
                                                    src={scope.url}
                                                    fit="cover"
                                                  />
                                                  <div class="replace">
                                                    <span>替换</span>
                                                  </div>
                                                </div>
                                              );
                                            }
                                          }}
                                        />
                                      </div>
                                      <div class="le-prompt-text">
                                        {(() => {
                                          switch (item) {
                                            case 'index':
                                              return '首页';
                                            case 'cart':
                                              return '购物车';
                                            case 'tell':
                                              return '联系客服';
                                            case 'personalCenter':
                                              return '个人中心';
                                            case 'toTop':
                                              return '返回顶部';
                                            case 'backPage':
                                              return '返回上页';
                                          }
                                        })()}
                                      </div>
                                    </div>
                                  );
                                })}
                              </vuedraggable>
                            </div>
                          );
                        } else {
                          return (
                            <div class="flex flex-direction align-start">
                              <vuedraggable v-model={this.form.customize}>
                                {this.form.customize.map((item, key) => {
                                  return (
                                    <div class="customize-box" key={key}>
                                      <span
                                        class="le-icon le-icon-cha2"
                                        onClick={() => {
                                          this.$delete(this.form.customize, key);
                                        }}
                                      />
                                      <div class="head">
                                        <span class="le-icon le-icon-tuoye"></span>
                                        <span>按钮{key + 1}</span>
                                      </div>
                                      <div class="body flex">
                                        <div class="upload">
                                          <pictureDialog
                                            v-model={item.img}
                                            limit={1}
                                            scopedSlots={{
                                              upload() {
                                                return (
                                                  <div class="upload-upload flex flex-direction align-center justify-center">
                                                    <div>
                                                      <div class="le-icon le-icon-add"></div>
                                                    </div>
                                                    <div class="text">添加图片</div>
                                                  </div>
                                                );
                                              },
                                              preview(scope) {
                                                return (
                                                  <div class="upload-image-preview">
                                                    <el-image
                                                      style="width: 80px;height: 80px"
                                                      src={scope.url}
                                                      fit="cover"
                                                    />
                                                    <div class="replace">
                                                      <span>替换</span>
                                                    </div>
                                                  </div>
                                                );
                                              }
                                            }}
                                          />
                                        </div>
                                        <div class="flex-sub flex flex-direction justify-around">
                                          <div class="flex align-center">
                                            <div class="label">名称</div>
                                            <el-input v-model={item.name} maxlength="4" show-word-limit />
                                          </div>
                                          <div class="flex align-center">
                                            <div class="label">链接</div>
                                            <hyperlinkSelect class="hyperlinkSelect" v-model={item.link}>
                                              请选择跳转链接
                                            </hyperlinkSelect>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                              </vuedraggable>
                              <el-button
                                class="add-btn"
                                disabled={this.form.customize.length >= 6 ? 'disabled' : false}
                                plain={true}
                                onClick={() => {
                                  this.form.customize.push({
                                    img: '',
                                    link: {},
                                    name: ''
                                  });
                                }}>
                                添加悬浮按钮
                              </el-button>
                              <div class="le-prompt-text">最多添加6个悬浮按钮</div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                    <div class="le-line"></div>
                    <div>
                      <div class="le-title">应用设置</div>
                      <div class="flex item">
                        <div class="le-label">页面选择</div>
                        <el-checkbox-group v-model={this.form.pages}>
                          <el-checkbox label="index">首页</el-checkbox>
                          <el-checkbox label="page">微页面</el-checkbox>
                          <el-checkbox label="goods-list">商品列表</el-checkbox>
                          <el-checkbox label="goods-detail">商品详情</el-checkbox>
                          <el-checkbox label="submit">结算页面</el-checkbox>
                          <el-checkbox label="order-list">订单列表</el-checkbox>
                          <el-checkbox label="after-order">售后记录</el-checkbox>
                          <el-checkbox label="order-detail">订单详情</el-checkbox>
                          <el-checkbox label="after-detail">售后详情</el-checkbox>
                          <el-checkbox label="promoter">分销商中心</el-checkbox>
                        </el-checkbox-group>
                      </div>
                      <div class="flex item">
                        <div class="le-label">渠道选择</div>
                        <el-checkbox-group v-model={this.form.channel}>
                          <el-checkbox label="applet">小程序商城</el-checkbox>
                          <el-checkbox label="wechat">公众号商城</el-checkbox>
                        </el-checkbox-group>
                      </div>
                    </div>
                  </div>
                );
              }
            })()}
          </div>
        </div>
        <div class="le-cardpin">
          <el-button type="primary" onClick={this.submit}>
            保存
          </el-button>
        </div>
      </div>
    );
  },
  mounted() {
    this.loadData();
  },
  methods: {
    submit() {
      this.$heshop
        .setting('post', {
          keyword: 'float_window',
          content: this.form
        })
        .then(() => {
          this.$message({
            message: '保存成功',
            type: 'success'
          });
        })
        .catch(() => {
          this.$message.error('加载配置信息失败，请检查网络');
        });
    },
    loadData() {
      this.$heshop
        .search(
          'post',
          { include: 'setting' },
          {
            keyword: 'float_window'
          }
        )
        .then(response => {
          if (response) {
            this.form = response.content;
          } else {
            this.form.expandedState = expandedState;
            this.form.stowedState = stowedState;
            this.form.buttonIcon.toTop = toTop;
            this.form.buttonIcon.backPage = backPage;
            this.form.buttonIcon.personalCenter = personalCenter;
            this.form.buttonIcon.index = index;
            this.form.buttonIcon.cart = cart;
            this.form.buttonIcon.tell = tell;
            this.form.move = 0;
          }
        });
    }
  }
};
</script>

<style scoped lang="scss">
.le-main {
  .le-card:first-child {
    height: 679px;
    margin-right: 24px;
    border: 1px solid #dcdfe6;

    .content {
      width: 342px;
      height: 607px;
      background: #f5f5f5;
      border: 1px solid #dcdfe6;
      position: relative;
    }

    .float-btn {
      position: absolute;
      bottom: 41px;
      right: 13px;

      .close {
        width: 38px;
        height: 38px;
      }

      .button {
        width: 39px;
        height: 39px;
        margin-bottom: 8px;
      }

      .box {
        width: 200px;
        height: 166px;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 20px;
        margin-bottom: 8px;
        padding: 15px 18px;

        span {
          height: 12px;
        }

        .btn {
          font-size: 11px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 9px;
          width: 48px;
          text-align: center;
          margin-right: 7px;

          &:nth-child(3n) {
            margin-right: 0;
          }
        }
      }
    }
  }

  .le-card:last-child {
    padding: 32px;

    .le-title {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      margin-bottom: 15px;
    }

    .le-line {
      width: 828px;
      height: 2px;
      background: #f3f5f7;
      margin: 24px 0;
    }

    .button {
      .open-close {
        width: 60px;
        margin-top: 15px;
      }
    }

    .item {
      margin-bottom: 15px;

      .le-prompt-text {
        text-align: center;
      }

      .open-close {
        margin-right: 16px;

        .le-prompt-text {
          margin-top: 7px;
        }
      }
    }

    .le-label {
      width: 85px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #262626;
      margin-right: 15px;
      text-align: right;
    }

    .upload-image {
      width: 60px;
      height: 60px;
      border-radius: 4px;
      border: 1px solid #dcdfe6;
      cursor: pointer;

      &:hover .replace {
        display: block;
      }

      .upload-image-preview {
        position: relative;
        width: 60px;
        height: 60px;
      }

      .replace {
        width: 60px;
        height: 32px;
        background: rgba(0, 0, 0, 0.4);
        border-radius: 4px;
        position: absolute;
        bottom: 0;
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
        text-align: center;
        line-height: 32px;
        display: none;
      }
    }

    .customize-box {
      width: 336px;
      height: 152px;
      background: #ffffff;
      box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.05);
      border-radius: 8px;
      margin-bottom: 16px;
      cursor: pointer;
      padding: 19px 24px 24px 24px;
      position: relative;

      &:hover .le-icon-cha2 {
        display: block;
      }

      .le-icon-cha2 {
        position: absolute;
        font-size: 16px;
        opacity: 0.3;
        right: 0;
        top: 0;
        width: auto;
        height: auto;
        transform: translate(50%, -50%);
        display: none;
      }

      .head {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #595959;

        .le-icon-tuoye {
          font-size: 20px;
          color: #dcdfe6;
          margin-right: 4px;
        }
      }

      .body {
        .el-input {
          width: 147px;
        }

        .upload {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          margin-right: 15px;

          .upload-image-preview {
            width: 80px;
            height: 80px;
            position: relative;
            &:hover .replace {
              display: block;
            }
            .replace {
              position: absolute;
              bottom: 0;
              font-size: 14px;
              font-family: Microsoft YaHei;
              font-weight: 400;
              color: #ffffff;
              width: 80px;
              height: 32px;
              line-height: 32px;
              text-align: center;
              background: rgba(0, 0, 0, 0.4);
              border-radius: 4px;
              display: none;
            }
          }
          .upload-upload {
            width: 80px;
            height: 80px;
            border: 1px dashed #dcdfe6;
            background: rgba(0, 0, 0, 0.02);
            border-radius: 4px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #8c8c8c;
            .le-icon-add {
              font-size: 26px;
              color: #d9d9d9;
              width: auto;
              height: auto;
            }
          }
        }
      }

      .label {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #595959;
        margin-right: 15px;
      }

      .hyperlinkSelect {
        /deep/ .el-button--text {
          padding: 0;
          color: #623ceb;
        }
      }
    }
  }
}

/deep/ .add-btn.el-button.el-button--default {
  &[disabled] {
    color: #bfbfbf !important;
    border: 1px solid #dcdfe6 !important;
  }
}

.reset-btn {
  padding: 0 0 0 15px;
}
</style>
