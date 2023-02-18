<!--
 * @Description: 排行榜
 * @Author: fjt
 * @Date: 2021-07-06 17:32:10
 * @LastEditTime: 2021-07-06 11:09:20
 * @LastEditors: fjt
-->
<script>
import mobileHead from './images/mobile-head.png';
import { getPromoterRank, savePromoterRank } from './api';
import mobileTimeSwitch from './images/mobile-time-switch.png';
import mobileProfilePicture from './images/mobile-profile-picture.png';

const bg_url = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/promoter-ranking-list.png';

export default {
  name: 'leaderboard',
  data() {
    const integerRex = /^[1-9]\d*$/;
    return {
      loading: true,
      disabled: true,
      form: {
        enable: 1, //0关闭  1开启
        bg_url: '', //  背景图
        ranking_num: '',
        ranking_dimension: [] // 排名维度  ["total_bonus", "all_children", "total_money"]
      },
      rules: {
        ranking_num: [
          {
            required: true,
            validator: (rule, value, callback) => {
              const errStr = '请输入1~100之间的整数';

              if (!integerRex.test(value)) {
                callback(errStr);
                return;
              }
              if (this.$_.toSafeInteger(value) > 100) {
                callback(errStr);
              }
              callback();
            }
          }
        ],
        ranking_dimension: [
          {
            required: true,
            message: '请至少选择一个排名维度'
          }
        ]
      }
    };
  },
  computed: {
    ranking_dimension({ form }) {
      let ranking_dimension = ['', '', ''];
      form.ranking_dimension.forEach(item => {
        if (item === 'total_bonus') {
          ranking_dimension[0] = item;
        } else if (item === 'all_children') {
          ranking_dimension[1] = item;
        } else if (item === 'total_money') {
          ranking_dimension[2] = item;
        }
      });
      ranking_dimension = ranking_dimension.filter(item => {
        return item;
      });
      return ranking_dimension;
    }
    // 列表头像样式
  },
  methods: {
    submit() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          const form = this.$_.cloneDeep(this.form);
          let array = new Array(3);
          array[0] = form.ranking_dimension.find(item => {
            return item === 'total_bonus';
          });
          array[1] = form.ranking_dimension.find(item => {
            return item === 'all_children';
          });
          array[2] = form.ranking_dimension.find(item => {
            return item === 'total_money';
          });
          array = array.filter(function (item) {
            return item;
          });
          form.ranking_dimension = array;
          savePromoterRank(form)
            .then(() => {
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    getPromoterRank()
      .then(response => {
        if (!this.$_.isEmpty(response)) {
          this.form = response.content;
        } else {
          this.form.bg_url = bg_url;
        }
        this.loading = false;
        this.disabled = false;
      })
      .catch(() => {
        this.loading = false;
        this.disabled = false;
      });
  },
  render() {
    const self = this;
    const dimension = [
      {
        label: 'total_bonus',
        name: '累计佣金'
      },
      {
        label: 'all_children',
        name: '当前下线'
      },
      {
        label: 'total_money',
        name: '累计销售金额'
      }
    ];
    let users = [];
    let userNum = this.$_.toSafeInteger(this.form.ranking_num);
    users = Array.from({ length: userNum });

    return (
      <div class="le-main">
        <el-form
          class="flex"
          label-width="124px"
          ref="form"
          props={{ model: self.form, rules: self.rules }}
          v-loading={self.loading}>
          <div class="le-card le-left">
            <div class="le-left--content">
              <div class="le-text">排行榜</div>
              <img src={mobileHead} alt="" width="338" height="80" />
              {(() => {
                if (self.form.enable === 0) {
                  return (
                    <div class="le-nothing flex align-center justify-center">
                      <span>未启用</span>
                    </div>
                  );
                } else {
                  return (
                    <el-scrollbar class="le-left--list">
                      <img src={self.form.bg_url} width="338" height="180" style="position: absolute;top: 0;" alt="" />
                      {(() => {
                        if (self.form.ranking_dimension.length > 1) {
                          return (
                            <div class="switch-bar flex">
                              <div class="bar-box flex">
                                {self.ranking_dimension.map((item, index) => {
                                  return (
                                    <div key={index} class={[{ active: index === 0 }, 'flex-sub bar-item']}>
                                      {item === 'total_bonus'
                                        ? '累计佣金'
                                        : item === 'all_children'
                                        ? '当前下线'
                                        : '累计销售金额'}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                      })()}
                      <div
                        style={[
                          {
                            marginTop: self.form.ranking_dimension.length > 1 ? '0' : '145px',
                            borderRadius: self.form.ranking_dimension.length > 1 ? '0' : '8px 8px 0 0'
                          }
                        ]}
                        class={['le-content', self.$_.isEmpty(self.form.ranking_dimension) ? '' : 'le-padding']}>
                        {(() => {
                          if (self.$_.isEmpty(self.form.ranking_dimension)) {
                            return <div class="le-noting">请选择排名维度</div>;
                          } else {
                            return [
                              [
                                self.ranking_dimension[0] !== 'all_children' ? (
                                  <img style="margin-bottom: 18px" src={mobileTimeSwitch} alt="" />
                                ) : null
                              ],
                              [
                                <div class="le-my--rank flex align-center">
                                  <div class="le-noun">
                                    我的
                                    <br />
                                    排名
                                  </div>
                                  <img
                                    class="le-profile--picture"
                                    src={mobileProfilePicture}
                                    width="36"
                                    height="36"
                                    alt=""
                                  />
                                  <div class="">
                                    <div class="le-user--name">用户4</div>
                                    <div class="le-user-aid">
                                      {self.ranking_dimension[0] === 'total_bonus'
                                        ? '累计佣金'
                                        : self.ranking_dimension[0] === 'all_children'
                                        ? '当前下线'
                                        : '累计销售金额'}
                                      :{self.ranking_dimension[0] !== 'all_children' ? '￥' : ''}25 排名:4
                                    </div>
                                  </div>
                                </div>
                              ],
                              [
                                <table class="le-table">
                                  <thead class="table--head">
                                    <tr>
                                      <th>排名</th>
                                      <th>用户</th>
                                      <th>
                                        {self.ranking_dimension[0] === 'total_bonus'
                                          ? '累计佣金'
                                          : self.ranking_dimension[0] === 'all_children'
                                          ? '当前下线'
                                          : '累计销售金额'}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody class="table--body">
                                    <tr class="item--empty">
                                      <td colSpan="3" />
                                    </tr>
                                    {users.slice(0, 100).map((item, index) => {
                                      return [
                                        [
                                          <tr key={index} class="le-table--item">
                                            <td class="item-rank">
                                              {(() => {
                                                if (index > 2) {
                                                  return index + 1;
                                                } else {
                                                  return (
                                                    <img
                                                      className="rank-img"
                                                      width="26"
                                                      height="26"
                                                      src={require(`./images/rank-${index + 1}.png`)}
                                                      alt=""
                                                    />
                                                  );
                                                }
                                              })()}
                                            </td>
                                            <td>
                                              <div class="flex align-center">
                                                <div
                                                  class="avatar-box flex align-center justify-center"
                                                  style={{
                                                    backgroundColor:
                                                      index === 0
                                                        ? '#FFE692'
                                                        : index === 1
                                                        ? '#BEC1D1'
                                                        : index === 2
                                                        ? '#FAB56F'
                                                        : 'transparent'
                                                  }}>
                                                  <img src={mobileProfilePicture} width="34" height="34" />
                                                </div>
                                                <span>用户{index + 1}</span>
                                              </div>
                                            </td>
                                            <td>{self.ranking_dimension[0] !== 'all_children' ? '￥' : ''}25</td>
                                          </tr>
                                        ],
                                        [
                                          <tr class="item--empty">
                                            <td colSpan="3" />
                                          </tr>
                                        ]
                                      ];
                                    })}
                                  </tbody>
                                </table>
                              ]
                            ];
                          }
                        })()}
                      </div>
                    </el-scrollbar>
                  );
                }
              })()}
            </div>
          </div>
          <div class="le-card flex-sub le-right">
            <div class="le-card-head flex align-center">
              <span class="le-card-line" />
              <span>编辑排行榜</span>
            </div>
            <el-form-item label="是否启用排行榜" prop="name">
              <el-radio-group v-model={self.form.enable}>
                <el-radio label={1}>启用</el-radio>
                <el-radio label={0}>禁用</el-radio>
              </el-radio-group>
              <div class="le-prompt-text">启用后，将在分销中心显示排行榜的入口</div>
            </el-form-item>
            {(() => {
              if (self.form.enable === 1) {
                return [
                  [
                    <el-form-item label="背景图">
                      <div class="select-cover__120">
                        <pictureDialog
                          v-model={self.form.bg_url}
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
                                    <span>替换</span>
                                  </div>
                                </div>
                              );
                            }
                          }}
                        />
                      </div>
                      <div class="he-tips">
                        <el-button type="text" onClick={() => (self.form.bg_url = bg_url)} class="le-reset">
                          重置为默认
                        </el-button>
                        <span class="le-prompt-text">建议尺寸：750像素 * 400像素</span>
                      </div>
                    </el-form-item>
                  ],
                  [
                    <el-form-item label="排名数" prop="ranking_num">
                      <el-input
                        class="le-input--240"
                        v-model={self.form.ranking_num}
                        maxlength="3"
                        placeholder="请输入排名数"
                      />
                    </el-form-item>
                  ],
                  [
                    <el-form-item label="排名维度" prop="ranking_dimension">
                      <el-checkbox-group v-model={self.form.ranking_dimension}>
                        {dimension.map((item, index) => {
                          return (
                            <el-checkbox label={item.label} key={index}>
                              {item.name}
                            </el-checkbox>
                          );
                        })}
                      </el-checkbox-group>
                    </el-form-item>
                  ]
                ];
              }
            })()}
          </div>
        </el-form>
        <div class="le-cardpin">
          <el-button
            type="primary"
            loading={self.loading && !self.disabled}
            disabled={self.disabled}
            onClick={self.submit}>
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

img {
  display: block;
}

.le-left {
  width: 380px;
  border: 1px solid #dcdfe6;
  border-radius: 40px;
  margin-right: 24px;
  padding: 37px 20px;
  min-height: 679px;
}

.le-left--content {
  border: 1px solid #dcdfe6;
  height: 605px;
  overflow: hidden;
  position: relative;
  background: #f5f5f5;

  .le-text:extend(.font-family-yahei) {
    font-size: 16px;
    font-weight: bold;
    color: #262626;
    text-align: center;
    position: absolute;
    width: 100%;
    top: 50px;
  }

  .le-left--list {
    width: 100%;
    height: calc(100% - 80px);
    position: relative;
    z-index: 1;

    .le-content {
      width: 338px;
      min-height: 383px;
      background: #ffffff;
      //border-radius: 16px 16px 0 0;
      z-index: 1;
      position: relative;
      padding: 14px;

      .le-noting:extend(.font-family-yahei) {
        font-size: 14px;
        font-weight: 400;
        color: #595959;
        line-height: 44px;
        text-align: center;
        margin-top: 26px;
      }

      .le-my--rank {
        height: 64px;
        background: #ffffff;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.06);
        border-radius: 8px;
        margin: 0 0 20px 0;
        padding: 14px;
      }

      .avatar-box {
        width: 38px;
        height: 38px;
        margin: 0 14px 0 10px;
        //border: 2px solid #acacac;
        border-radius: 50%;
        //background-color: red;
      }

      .le-profile--picture {
        display: block;
        margin: 0 14px 0 0;
      }

      .le-noun:extend(.font-family-yahei) {
        width: 24px;
        height: 26px;
        font-size: 12px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
        margin-right: 10px;
      }

      .le-user--name:extend(.font-family-yahei) {
        font-size: 12px;
        font-weight: 400;
        color: #222222;
        line-height: 22px;
      }

      .le-user-aid:extend(.font-family-yahei) {
        font-size: 10px;
        font-weight: 400;
        color: #999999;
        line-height: 14px;
      }

      .le-table {
        width: 100%;

        .table--head {
          text-align: left;
          color: #999999;

          th {
            padding-left: 10px;
          }
        }

        .table--body {
          margin-top: 10px;
        }
      }

      .le-table--item {
      }

      .item-rank {
        text-align: center;
        line-height: 100%;
        width: 40px;
        height: 40px;
      }

      .rank-img {
        margin: 0 auto;
      }

      .item--empty {
        height: 15px;
      }
    }

    .switch-bar {
      width: 336px;
      height: 40px;
      margin-top: 142px;
      z-index: 10;
      border-radius: 8px 8px 0 0;
      position: relative;
      align-items: flex-end;

      .bar-item:extend(.font-family-yahei) {
        height: 36px;
        line-height: 36px;
        text-align: center;
        background: #4267b4;
        font-size: 13px;
        font-weight: 400;
        color: #ffffff;

        &:nth-child(2) {
          border-bottom-left-radius: 8px;
        }
      }

      .bar-box {
        width: 336px;
        height: 36px;
        background: #ffffff;
        align-items: flex-end;
      }

      .bar-item.active {
        height: 40px;
        line-height: 40px;
        background: #ffffff !important;
        border-radius: 8px 8px 0 0;
        color: #222222;
      }
    }
  }

  .le-nothing:extend(.font-family-yahei) {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
  }
}

.le-card-head {
  margin-bottom: 24px;
}

.le-right {
  height: 450px;

  .le-reset {
    padding: 0 8px 0 0;
  }

  .select-cover__120 {
    border-radius: 4px;
    overflow: hidden;
  }
}
</style>
