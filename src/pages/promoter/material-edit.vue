<script>
import mobileHead from './images/mobile-head.png';
import mobileInput from './images/mobile-input.png';
import mobileGood from './images/material-good.png';
import materialVideo from './images/material-video.png';
import goodsSelect from '../../components/goodsSelet/index.vue';
import vuedraggable from 'vuedraggable';
import { createPromotermaterial, editPromotermaterial, promotermaterialDetail } from './api';

export default {
  name: 'material-edit',
  components: {
    vuedraggable,
    goodsSelect
  },
  data() {
    return {
      loading: false,
      form: {
        name: '',
        type: 1,
        content: '',
        pic_list: [],
        video_list: [],
        goods: {}
      },
      rules: {
        name: [
          {
            required: true,
            message: '素材名称不能为空',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '素材文案不能为空',
            trigger: 'blur'
          }
        ],
        pic_list: [
          {
            required: true,
            message: '图片不能为空',
            trigger: 'change'
          }
        ],
        video_list: [
          {
            required: true,
            message: '视频不能为空',
            trigger: 'change'
          }
        ],
        video_cover: [
          {
            required: true,
            message: '视频封面不能为空',
            trigger: 'change'
          }
        ]
      }
    };
  },
  methods: {
    routerBack() {
      this.$router.back(-1);
    },
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          const form = this.$_.cloneDeep(this.form);
          if (!this.$_.isEmpty(form.goods)) {
            form.goods_id = form.goods.id;
          } else {
            form.goods_id = 0;
          }
          let id = this.$route.query.id;
          if (id) {
            editPromotermaterial(id, form).then(() => {
              this.loading = false;
              this.routerBack();
            });
          } else {
            createPromotermaterial(form).then(() => {
              this.loading = false;
              this.routerBack();
            });
          }
        } else {
          return false;
        }
      });
    },
    arrayConcat(value) {
      this.$refs['form'].clearValidate('pic_list');
      value.forEach(item => {
        this.form.pic_list.push(item);
      });
    },
    deleteImg(index) {
      event.stopPropagation();
      this.$delete(this.form.pic_list, index);
    },
    getDetail() {
      promotermaterialDetail(parseInt(this.$route.query.id)).then(response => {
        response.goods = response.goods ? response.goods : {};
        this.form = response;
      });
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.getDetail();
    }
  },
  render() {
    const self = this;
    const typeList = [
      {
        name: '全部',
        type: 0
      },
      {
        name: '图片',
        type: 1
      },
      {
        name: '视频',
        type: 2
      }
    ];
    return (
      <div class="le-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <a onClick={self.routerBack}>素材中心</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>{self.$route.query.id ? '编辑素材' : '添加素材'}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
          ref="form"
          v-loading={self.loading}
          props={{ model: self.form, rules: self.rules }}
          class="flex le-content"
          label-width="124px">
          <div class="le-left le-card">
            <div class="le-left--content">
              <div class="le-text">素材中心</div>
              <img src={mobileHead} alt="" width="338" height="80" />
              <img src={mobileInput} width="338" height="50" alt="" />
              <div class="le-switch flex">
                {typeList.map((item, index) => {
                  return (
                    <div
                      key={index}
                      class={[
                        {
                          active: self.form.type === item.type
                        },
                        'flex-sub',
                        'le-switch--item'
                      ]}>
                      {item.name}
                      <span class="le-line" />
                    </div>
                  );
                })}
              </div>
              <div class="le-left--list">
                <div class="le-content--text">
                  {(() => {
                    if (!self.form.content) {
                      return '素材文案';
                    } else {
                      return self.form.content;
                    }
                  })()}
                </div>
                {(() => {
                  if (self.form.type === 1) {
                    return (
                      <div class="le-picture flex flex-wrap">
                        {(() => {
                          if (self.form.pic_list.length > 0) {
                            return self.form.pic_list.map((item, index) => {
                              return <img class="le-image" src={item} width="98" key={index} height="98" />;
                            });
                          } else {
                            return <img src={mobileGood} width="98" height="98" />;
                          }
                        })()}
                      </div>
                    );
                  } else {
                    let src;
                    if (self.$_.isEmpty(self.form.video_cover)) {
                      src = materialVideo;
                    } else {
                      src = self.form.video_cover;
                    }
                    return <img class="le-video" src={src} width="312" height="176" />;
                  }
                })()}
                <div class="flex align-center le-footer justify-between">
                  <div>
                    {(() => {
                      if (!self.$_.isEmpty(self.form.goods)) {
                        return <span class="le-more">查看商品</span>;
                      }
                    })()}
                    <span>分享0</span>
                  </div>
                  <div class="le-button">
                    <el-button type="primary" plain={true} round={true}>
                      一键发圈
                    </el-button>
                    <el-button type="primary" plain={true} round={true}>
                      发动态
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="le-right le-card flex-sub">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>编辑素材</span>
            </div>
            <el-form-item label="素材名称" prop="name">
              <el-input placeholder="请输入素材名称" v-model={self.form.name} show-word-limit={true} maxlength={10} />
            </el-form-item>
            <el-form-item label="素材类型">
              <el-radio-group
                v-model={self.form.type}
                on-change={() => {
                  // 切换的时候清除图片验证
                  self.$refs['form'].clearValidate('pic_list');
                }}>
                <el-radio label={1}>图片</el-radio>
                <el-radio label={2}>视频</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="素材文案" class="le-textarea" prop="content">
              <el-input
                resize="none"
                rows={13}
                placeholder="请输入素材文案"
                v-model={self.form.content}
                type="textarea"
                show-word-limit={true}
              />
            </el-form-item>
            {(() => {
              if (self.form.type === 1) {
                return (
                  <el-form-item label="图片" class="le-pic_list" prop="pic_list" key="pic_list">
                    <div>
                      <vuedraggable v-model={self.form.pic_list}>
                        {self.form.pic_list.map((item, index) => {
                          return (
                            <div
                              key={index}
                              class={[
                                {
                                  'le-label__require-image': index === 0
                                },
                                'le-label__require-item'
                              ]}>
                              <div class="select-cover__120">
                                <pictureDialog
                                  v-model={self.form.pic_list[index]}
                                  scopedSlots={{
                                    upload() {
                                      return (
                                        <div class="select-cover__120-add">
                                          <i class="le-icon le-icon-add select-cover__120-icon" />
                                          <span class="select-cover__120-text">添加图片</span>
                                        </div>
                                      );
                                    },
                                    preview(scope) {
                                      return (
                                        <div class="select-cover__120-edit">
                                          <el-image src={scope.url} fit="cover" />
                                          <div class="select-cover__120-tips">
                                            <span>替换</span> |
                                            <span onClick={self.deleteImg.bind(self, index)}>删除</span>
                                          </div>
                                        </div>
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                        {(() => {
                          if (self.form.pic_list.length < 9) {
                            return (
                              <div class="select-cover__120 le-label__require-item">
                                <pictureDialog
                                  on-confirm={self.arrayConcat}
                                  limit={9 - self.form.pic_list.length}
                                  max={9}
                                  scopedSlots={{
                                    upload() {
                                      return (
                                        <div class="select-cover__120-add">
                                          <i class="le-icon le-icon-add select-cover__120-icon" />
                                          <span class="select-cover__120-text">添加图片</span>
                                        </div>
                                      );
                                    },
                                    preview() {
                                      return (
                                        <div>
                                          <i class="le-icon le-icon-add select-cover__120-icon" />
                                          <span class="select-cover__120-text">添加图片</span>
                                        </div>
                                      );
                                    }
                                  }}
                                />
                              </div>
                            );
                          }
                        })()}
                      </vuedraggable>
                    </div>
                    <div class="le-prompt-text">建议尺寸：1000像素 * 1000像素，可拖拽改变图片顺序，最多上传9张</div>
                  </el-form-item>
                );
              } else {
                return [
                  [
                    <el-form-item label="视频" prop="video_list" key="video_list">
                      <div class="select-cover__120">
                        <videoDialog
                          v-model={self.form.video_list}
                          on-confirm={() => {
                            //   手动触发表单验证
                            self.$refs.form.validateField('video_list');
                          }}
                          scopedSlots={{
                            upload() {
                              return (
                                <div class="select-cover__120-add">
                                  <i class="le-icon le-icon-add select-cover__120-icon" />
                                  <span class="select-cover__120-text">添加视频</span>
                                </div>
                              );
                            },
                            preview(scope) {
                              return (
                                <div class="select-cover__120-edit">
                                  <el-image src={scope.url.cover} fit="cover" />
                                  <div class="select-cover__120-tips">替换视频</div>
                                </div>
                              );
                            }
                          }}
                        />
                      </div>
                      <div class="le-prompt-text">建议时长：10~30秒，宽高比 16:9</div>
                    </el-form-item>
                  ],
                  [
                    <el-form-item label="视频封面" prop="video_cover" key="video_cover">
                      <div class="select-cover__120">
                        <pictureDialog
                          v-model={self.form.video_cover}
                          on-confirm={() => {
                            //   手动触发表单验证
                            self.$refs.form.validateField('video_cover');
                          }}
                          limit={1}
                          scopedSlots={{
                            upload() {
                              return (
                                <div class="select-cover__120-add">
                                  <i class="le-icon le-icon-add select-cover__120-icon" />
                                  <span class="select-cover__120-text">添加图片</span>
                                </div>
                              );
                            },
                            preview(scope) {
                              return (
                                <div class="select-cover__120-edit">
                                  <el-image src={scope.url} fit="cover" />
                                  <div class="select-cover__120-tips">
                                    <span>替换</span> |
                                    <span
                                      onClick={event => {
                                        event.stopPropagation();
                                        self.form.video_cover = '';
                                      }}>
                                      删除
                                    </span>
                                  </div>
                                </div>
                              );
                            }
                          }}
                        />
                      </div>
                      <div class="le-prompt-text">建议尺寸：750像素 * 422像素</div>
                    </el-form-item>
                  ]
                ];
              }
            })()}
            <el-form-item label="关联商品">
              {!self.$_.isEmpty(self.form.goods)}
              <el-button
                type="primary"
                disabled={!self.$_.isEmpty(self.form.goods)}
                onClick={() => {
                  self.$refs.goodsSelect.handleClick();
                }}
                plain={true}
                class="le-related--products">
                选择商品
              </el-button>
              <goods-select
                ref="goodsSelect"
                is-tips={false}
                type="radio"
                select-style={{ backgroundColor: '#ffffff' }}
                v-model={self.form.goods}
              />
              {(() => {
                if (!self.$_.isEmpty(self.form.goods)) {
                  return (
                    <div class="le-goods flex align-center">
                      <el-image src={self.form.goods.slideshow[0]} />
                      <div class="flex-sub goods-name">{self.form.goods.name}</div>
                      <el-button type="text" onClick={() => (self.form.goods = {})}>
                        移除
                      </el-button>
                    </div>
                  );
                }
              })()}
            </el-form-item>
          </div>
        </el-form>
        <div class="le-cardpin">
          <el-button type="primary" loading={self.loading} onClick={self.submit}>
            保存
          </el-button>
        </div>
      </div>
    );
  }
};
</script>

<style scoped lang="less">
@import './index.less';

.le-left {
  width: 380px;
  border: 1px solid #dcdfe6;
  border-radius: 40px;
  margin-right: 24px;
  padding: 37px 20px;

  .le-video {
    margin-top: 10px;
    border-radius: 8px;
  }

  .le-more:extend(.font-family-yahei) {
    font-size: 13px;
    font-weight: 400;
    color: #3273ea;
    margin-right: 6px;
    cursor: pointer;
  }
}

.le-content {
  margin-top: 24px;
}

.le-left--content {
  border: 1px solid #dcdfe6;
  height: 100%;
  overflow: hidden;
  position: relative;
  background: #f5f5f5;

  img {
    display: block;
  }

  .le-text:extend(.font-family-yahei) {
    font-size: 16px;
    font-weight: bold;
    color: #262626;
    text-align: center;
    position: absolute;
    width: 100%;
    top: 50px;
  }

  .le-switch {
    width: 100%;
    height: 52px;
    background: #f5f5f5;
    padding: 0 16px;
  }

  .le-switch--item:extend(.font-family-yahei) {
    font-size: 13px;
    font-weight: 400;
    color: #666666;
    text-align: center;
    padding: 18px 0 21px 0;
    cursor: pointer;
    line-height: 1;

    &.active {
      color: #623ceb;
      position: relative;

      .le-line {
        display: block;
        width: 24px;
        height: 2px;
        position: absolute;
        background: #623ceb;
        left: 50%;
        top: 40px;
        transform: translateX(-50%);
      }
    }
  }

  .le-left--list {
    width: 100%;
    height: 100%;
    background: #ffffff;
    border-radius: 16px 16px 0 0;
    padding: 18px 13px;
  }

  .le-content--text:extend(.font-family-yahei) {
    font-size: 14px;
    font-weight: 400;
    color: #222222;
    line-height: 18px;
    word-wrap: break-word;
    word-break: normal;
  }

  .le-picture {
    margin-top: 12px;

    .le-image {
      margin-right: 8px;
      margin-bottom: 8px;
      border-radius: 8px;
    }

    .le-image {
      &:nth-child(3),
      &:nth-child(6),
      &:nth-child(9) {
        margin-right: 0;
      }
    }
  }

  .le-footer:extend(.font-family-yahei) {
    height: 36px;
    margin-top: 10px;
    font-size: 13px;
    font-weight: 400;
    color: #cccccc;

    .le-button {
      .el-button {
        border-radius: 13px;
        background-color: #fff;
        padding: 6px 9px;
        height: 26px;
        border-color: #623ceb;

        &:hover,
        &:focus {
          background-color: #fff;
          color: #623ceb;
          border-color: #623ceb;
        }
      }
    }
  }
}

.le-right {
  .le-card-head {
    margin-bottom: 24px;
  }

  .le-label__require-item {
    border-radius: 4px;
    position: relative;
    margin-right: 8px;
    margin-bottom: 8px;
    overflow: hidden;
    display: inline-block;
  }

  .select-cover__120-edit {
    cursor: move;
  }

  .select-cover__120-tips {
    cursor: pointer;
  }

  .le-pic_list {
    width: 780px;
  }

  .le-textarea {
    ::v-deep .el-textarea__inner,
    .el-textarea {
      width: 400px;
    }

    ::v-deep .el-input__count {
      right: 19px;
    }
  }

  .le-related--products {
    background: #ffffff;

    &:hover,
    &:focus {
      background: #ffffff;
      color: #623ceb;
    }

    &[disabled] {
      border: 1px solid #dcdfe6;
      color: #bfbfbf;
    }
  }

  .le-goods {
    width: 580px;
    height: 72px;
    border: 1px solid #dcdfe6;
    border-radius: 8px;
    padding: 12px 24px;
    margin-top: 16px;

    .el-image {
      width: 48px;
      height: 48px;
      margin-right: 20px;
    }

    .goods-name:extend(.font-family-yahei) {
      font-size: 14px;
      font-weight: 400;
      color: #262626;
      line-height: 20px;
    }
  }
}
</style>
