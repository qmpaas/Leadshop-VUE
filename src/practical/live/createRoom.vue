<template>
  <div class="le-main">
    <el-form :model="form" :rules="rules" label-width="217px" ref="form" v-loading="loading">
      <div class="le-card">
        <div class="le-card--header flex align-center">
          <span class="le-sign"></span>
          <span>基本信息</span>
        </div>
        <el-form-item label="直播类型">
          手机直播
          <div class="le-prompt-text" v-if="form.type === 0">通过“小程序直播”小程序开播</div>
          <div class="le-prompt-text" v-else>
            通过第三方推流设备发起直播，请自行定义画面宽高比
            <el-popover placement="top" trigger="hover">
              <span class="le-popover-content">
                横屏画面：适用于宽高比为“16:9、4:3、1.85:1”的视频<br />
                竖屏画面：适用于适用于宽高比为“9:16、2:3”的视频
              </span>
              <i slot="reference" class="le-icon-zhushi le-icon"></i>
            </el-popover>
          </div>
        </el-form-item>
        <el-form-item label="直播间名称" prop="name">
          <el-input
            placeholder="请输入直播间名称"
            :minlength="3"
            :maxlength="17"
            v-model="form.name"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="直播时间" prop="time">
          <el-date-picker
            v-model="form.time"
            type="datetimerange"
            range-separator="至"
            size="small"
            value-format="timestamp"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="主播昵称" prop="anchor_name">
          <el-input placeholder="请输入主播昵称" maxlength="15" v-model="form.anchor_name" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="主播微信号" prop="anchor_wechat">
          <el-input placeholder="请输入主播微信号" v-model="form.anchor_wechat"></el-input>
          <img
            style="display: block"
            v-if="anchorNotVerified"
            src="./images/verify-qr-code.png"
            width="160px"
            height="160px"
            alt=""
          />
        </el-form-item>
        <el-form-item label="主播副号">
          <el-input placeholder="请输入主播副号" v-model="form.sub_wechat"></el-input>
          <div class="le-prompt-text">
            直播时，主播副号能在主播端进行推送商品，抽奖等操作。仅从主播端小程序进入时，副号身份才生效。若从观众端进入，副号身份不生效。
          </div>
        </el-form-item>
        <el-form-item label="官方收录">
          <el-radio-group v-model="form.is_feeds_public">
            <el-radio :label="1">开启</el-radio>
            <el-radio :label="0">关闭</el-radio>
          </el-radio-group>
          <div class="le-prompt-text">开启后本场直播将有可能被官方推荐</div>
        </el-form-item>
      </div>
      <div class="le-card">
        <div class="le-card--header flex align-center">
          <span class="le-sign"></span>
          <span>直播间配置</span>
        </div>
        <div class="le--line--title">分享卡片样式配置</div>
        <div class="le-content flex">
          <div style="width: 375px; height: 346px; position: relative">
            <div
              style="
                position: absolute;
                width: 238px;
                height: 190px;
                top: 92px;
                left: 77px;
                background-size: 100% 100%;
                background-repeat: no-repeat;
                background-color: #5b5c7d;
              "
              :style="{ backgroundImage: `url(${form.share_img})` }"
            />
            <img src="./images/share-card-cover.png" alt="" width="375px" height="346px" />
          </div>
          <div class="le-right">
            <el-form-item label="分享卡片封面">
              <div class="select-cover__120">
                <pictureDialog v-model="form.share_img" :limit="1">
                  <div slot="upload" class="select-cover__120-add">
                    <i class="le-icon le-icon-add select-cover__120-icon"></i>
                    <span class="select-cover__120-text">添加图片</span>
                  </div>
                  <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                    <el-image :src="scope.url" fit="cover"></el-image>
                    <div class="select-cover__120-tips">
                      <span>替换</span> |
                      <span @click.stop="e => (form.share_img = '')">删除</span>
                    </div>
                  </div>
                </pictureDialog>
              </div>
              <div class="le-prompt-text">
                用户在微信对话框内分享的直播间将以分享卡片的形式呈现。<br />
                建议尺寸：800像素 * 640像素，图片大小不得超过100kb。
              </div>
            </el-form-item>
          </div>
        </div>
        <div class="le--line--title">官方收录样式配置</div>
        <div class="le-content flex">
          <div style="width: 375px; height: 200px; position: relative">
            <div :style="{ backgroundImage: `url(${form.feedsImg})` }" class="le-live-1" />
            <img
              src="./images/le-live-number.png"
              width="84px"
              height="20px"
              style="position: absolute; top: 18px; left: 18px; z-index: 11"
            />
            <img src="./images/live-card-cover.png" alt="" width="375px" height="200px" />
          </div>
          <div class="le-right">
            <el-form-item label="直播卡片封面">
              <div class="select-cover__120">
                <pictureDialog v-model="form.feedsImg" :limit="1">
                  <div slot="upload" class="select-cover__120-add">
                    <i class="le-icon le-icon-add select-cover__120-icon"></i>
                    <span class="select-cover__120-text">添加图片</span>
                  </div>
                  <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                    <el-image :src="scope.url" fit="cover"></el-image>
                    <div class="select-cover__120-tips">
                      <span>替换</span> |
                      <span @click.stop="e => (form.feedsImg = '')">删除</span>
                    </div>
                  </div>
                </pictureDialog>
              </div>
              <div class="le-prompt-text">
                图片建议大小为 800像素 * 800像素。<br />
                图片大小不超过 100KB。<br />
                图片内容遵循平台规范后更容易被推荐。<br />
                了解官方收录
                <el-popover placement="top" trigger="hover">
                  <span class="le-popover-content">
                    官方收录包括以下两个渠道：<br />
                    <br />
                    小程序搜索<br />
                    用户可从“发现>小程序>小程序搜索框”，或“下拉微信首页任务栏<br />
                    小程序搜索框“搜索相关小程序。如果该小程序近期有直播则会被推<br />
                    荐展示。<br />
                    <br />
                    直播间详情卡<br />
                    用户点击直播间左上角小程序头像可打开直播间详情卡，卡片内会推<br />
                    荐该小程序近期的直播。
                  </span>
                  <i slot="reference" class="le-icon-zhushi le-icon"></i>
                </el-popover>
              </div>
            </el-form-item>
          </div>
        </div>
        <div class="le--line--title">直播间样式配置</div>
        <div class="le-content flex">
          <div
            style="
              height: 816px;
              width: 375px;
              position: relative;
              background-size: 100% 100%;
              background-repeat: no-repeat;
            "
            :style="[backgroundStyle]"
          >
            <img src="./images/live-room-head.png" width="375" height="104" alt="" />
            <div
              style="position: absolute; width: 375px; bottom: 44px; padding-right: 10px"
              class="flex justify-between"
            >
              <div style="padding-left: 10px">
                <img src="./images/live-comment.png" v-if="!form.close_comment" width="261" height="36" alt="" />
              </div>
              <div>
                <img
                  src="./images/live-Shelf.png"
                  v-if="!form.close_goods"
                  width="36"
                  style="margin-left: 10px"
                  height="36"
                  alt=""
                />
                <img
                  src="./images/live-like.png"
                  v-if="!form.close_like"
                  width="36"
                  style="margin-left: 10px"
                  height="36"
                  alt=""
                />
              </div>
            </div>
          </div>
          <div class="le-right">
            <el-form-item label="直播间背景墙">
              <div class="select-cover__120">
                <pictureDialog v-model="form.cover_img" :limit="1">
                  <div slot="upload" class="select-cover__120-add">
                    <i class="le-icon le-icon-add select-cover__120-icon"></i>
                    <span class="select-cover__120-text">添加图片</span>
                  </div>
                  <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                    <el-image :src="scope.url" fit="cover"></el-image>
                    <div class="select-cover__120-tips">
                      <span>替换</span> |
                      <span @click.stop="() => (form.cover_img = '')">删除</span>
                    </div>
                  </div>
                </pictureDialog>
              </div>
              <div class="le-prompt-text">
                直播间背景墙是每个直播间的默认背景。<br />
                建议尺寸：1080像素 * 1920像素，图片大小不得超过 2M
              </div>
            </el-form-item>
            <el-form-item label="直播间功能">
              <el-checkbox class="le-checkbox-block" v-model="form.close_comment" :false-label="1" :true-label="0"
                >评论
              </el-checkbox>
              <el-checkbox class="le-checkbox-block" v-model="form.close_goods" :false-label="1" :true-label="0"
                >商品货架
              </el-checkbox>
              <el-checkbox class="le-checkbox-block" v-model="form.close_like" :false-label="1" :true-label="0"
                >点赞
              </el-checkbox>
            </el-form-item>
            <el-form-item label="拓展功能">
              <el-checkbox class="le-checkbox-block" v-model="form.close_replay" :false-label="1" :true-label="0"
                >回放
              </el-checkbox>
              <el-checkbox class="le-checkbox-block" v-model="form.close_kf" :false-label="1" :true-label="0"
                >客服
              </el-checkbox>
              <div class="le-prompt-text">需要微信公众平台-小程序添加客服人员才生效</div>
            </el-form-item>
          </div>
        </div>
      </div>
    </el-form>
    <div class="le-cardpin">
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'createRoom',
  data() {
    const checkAnchor_wechat = (rule, value, callback) => {
      if (!value) {
        callback('请输入主播微信号');
      }
      if (this.anchorNotVerified) {
        callback('主播未验证，请扫描下方二维码进行身份验证');
      }
      callback();
    };
    const checkName = (rule, value, callback) => {
      if (value.length < 3) {
        callback('直播标题必须为3-17个字（一个字等于两个英文字符或特殊字符）');
      }
      callback();
    };
    return {
      form: {
        type: 0,
        name: '',
        anchor_name: '',
        anchor_wechat: '',
        sub_wechat: '',
        time: [],
        is_feeds_public: 1,
        feedsImg: '',
        cover_img: '',
        share_img: '',
        close_like: 1,
        close_goods: 1,
        close_comment: 1,
        close_share: 1,
        close_replay: 1,
        close_kf: 1,
        screen_type: 1,
        old_goods_list: []
      },
      rules: {
        name: [
          { required: true, message: '请输入直播间名称', trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        time: [{ required: true, message: '请输入直播时间', trigger: 'change' }],
        anchor_name: [{ required: true, message: '请输入主播昵称', trigger: 'blur' }],
        anchor_wechat: [
          { required: true, message: '请输入主播微信号', trigger: 'blur' },
          { validator: checkAnchor_wechat, trigger: ['change', 'blur'] }
        ]
      },
      anchorNotVerified: false,
      loading: false
    };
  },
  mounted() {
    this.getDetail();
  },
  computed: {
    backgroundStyle() {
      if (this.form.cover_img) {
        return {
          backgroundImage: `url(${this.form.cover_img})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%'
        };
      } else {
        return {
          background: 'linear-gradient(0deg, #171839 0%, #4C4E77 65%, #50536F 100%)'
        };
      }
    }
  },
  methods: {
    // 保存提交
    submit() {
      this.anchorNotVerified = false;
      this.$refs['form'].clearValidate('anchor_wechat');
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          const form = JSON.parse(JSON.stringify(this.form));
          form.start_time = form.time[0].toString().slice(0, form.time[0].toString().length - 3);
          form.end_time = form.time[1].toString().slice(0, form.time[1].toString().length - 3);
          delete form.time;
          this.$heshop
            .live('post', form)
            .then(() => {
              if (this.$route.query.roomid) {
                this.$message.success('编辑成功');
                localStorage.removeItem('editRoom');
              } else {
                this.$message.success('创建成功');
              }
              this.$router.back();
              this.loading = false;
            })
            .catch(error => {
              if (error.data.message === '主播微信号未实名认证') {
                this.anchorNotVerified = true;
                this.$refs['form'].validateField('anchor_wechat');
              } else {
                this.$message.error(error.data.message);
              }
              this.loading = false;
            });
        }
      });
    },
    // 获取直播详情
    getDetail() {
      if (this.$route.query.roomid) {
        let storage = localStorage.getItem('editRoom');
        storage = JSON.parse(storage);
        storage.time = [new Date(storage.start_time).getTime(), new Date(storage.end_time).getTime()];
        this.form = storage;
        this.form.type = storage.live_type;
        this.form.feedsImg = storage.feeds_img_base64;
        this.form.share_img = storage.share_img_base64;
        this.form.cover_img = storage.cover_img_base64;
      }
    }
  }
};
</script>

<style lang="less" scoped="true">
@import './../index.less';

.le-cardpin {
  z-index: 2001;
}

.le-card:first-child {
  margin-bottom: 24px;
}

.le--line--title {
  height: 42px;
  background: #f3f5f7;
  border-radius: 4px;
  line-height: 42px;
  padding-left: 15px;
  margin-bottom: 24px;
}

.le--line--title:before {
  content: '*';
  color: #f5212d;
}

.le-content {
  margin-bottom: 24px;
}

.le-card div.le-content :nth-child(1) {
  margin-bottom: 0;
}

.le-checkbox-block {
  display: block;
}

.le-icon-zhushi {
  color: #bbbfc8;
  cursor: pointer;
  margin-left: 4px;
}

.le-popover-content {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  line-height: 16px;
}

.le-live-1 {
  position: absolute;
  z-index: 10;
  top: 9px;
  left: 10px;
  background: #5b5c7d;
  width: 190px;
  height: 178px;
  background-size: 100% 100%;
}
</style>
