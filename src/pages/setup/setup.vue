<template>
  <div class="le-matter">
    <el-form ref="ruleForm" :model="ruleForm" label-width="217px" :rules="rules">
      <div class="le-card">
        <div class="el-row--flex is-align-middle">
          <span class="he-title-line"></span>
          <span class="he-title">基本设置</span>
        </div>
        <div class="le-line"></div>
        <div class="le-line"></div>
        <el-form-item label="经营状态" prop="pass">
          <el-radio-group v-model="ruleForm.basic_setting.run_status">
            <el-radio :label="1">营业</el-radio>
            <el-radio :label="0">打烊</el-radio>
          </el-radio-group>
          <div class="he-tips">设置打烊后，买家将无法支付订单，其他操作不受影响</div>
        </el-form-item>
        <el-form-item label="店铺名称" prop="store_setting.name">
          <el-input
            placeholder="请输入店铺名称"
            maxlength="15"
            v-model="ruleForm.store_setting.name"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="店铺LOGO" prop="store_setting.logo">
          <div class="select-cover__120">
            <pictureDialog v-model="ruleForm.store_setting.logo" :limit="1">
              <div slot="upload" class="select-cover__120-add">
                <i class="le-icon le-icon-add select-cover__120-icon"></i>
                <span class="select-cover__120-text">添加图片</span>
              </div>
              <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                <el-image :src="scope.url" fit="cover"></el-image>
                <div class="select-cover__120-tips">
                  <span>替换</span> |
                  <span @click.stop="e => (ruleForm.store_setting.logo = '')">删除</span>
                </div>
              </div>
            </pictureDialog>
          </div>
          <div class="he-tips">
            <span @click="reset" class="le-reset">重置为默认</span>
            建议尺寸：800*800像素
          </div>
        </el-form-item>
      </div>
      <div class="le-card">
        <div class="el-row--flex is-align-middle">
          <span class="he-title-line"></span>
          <span class="he-title">交易设置</span>
        </div>
        <div class="le-line"></div>
        <div class="le-line"></div>
        <el-form-item label="待付款订单自动取消">
          <el-switch v-model="ruleForm.trade_setting.cancel_status" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item label="待付款订单取消时间" v-if="ruleForm.trade_setting.cancel_status === 1">
          <el-input
            v-model="ruleForm.trade_setting.cancel_time"
            @keyup.native="ruleForm.trade_setting.cancel_time = oninput(ruleForm.trade_setting.cancel_time)"
          >
            <template slot="append">时</template>
          </el-input>
          <div class="he-tips">拍下订单在此时间段内未付款，订单将自动取消</div>
        </el-form-item>
        <el-form-item label="自动确认收货时间">
          <el-input
            v-model="ruleForm.trade_setting.received_time"
            @keyup.native="ruleForm.trade_setting.received_time = proving(ruleForm.trade_setting.received_time)"
          >
            <template slot="append">天</template>
          </el-input>
          <div class="he-tips">从发货到自动确认收货时间</div>
        </el-form-item>
        <el-form-item label="待评价订单默认好评时间">
          <el-input
            v-model="ruleForm.trade_setting.evaluate_time"
            @keyup.native="ruleForm.trade_setting.evaluate_time = proving(ruleForm.trade_setting.evaluate_time)"
          >
            <template slot="append">天</template>
          </el-input>
          <div class="he-tips">从确认收货时间开始计算</div>
        </el-form-item>
        <el-form-item label="售后时间">
          <el-input
            v-model="ruleForm.trade_setting.after_time"
            @keyup.native="ruleForm.trade_setting.after_time = proving(ruleForm.trade_setting.after_time)"
          >
            <template slot="append">天</template>
          </el-input>
          <div class="he-tips">从确认收货开始计算，可申请售后的时间</div>
        </el-form-item>
      </div>
      <div class="le-card">
        <div class="el-row--flex is-align-middle">
          <span class="he-title-line"></span>
          <span class="he-title">商品设置</span>
        </div>
        <div class="le-line"></div>
        <div class="le-line"></div>
        <el-form-item label="商品推荐">
          <div>
            <el-radio v-model="ruleForm.goods_setting.recommend_status" :label="1">自动推荐</el-radio>
            <div class="he-tips">系统自动推荐购买量最高的20件商品</div>
          </div>
          <div>
            <el-radio v-model="ruleForm.goods_setting.recommend_status" :label="2"
              >手动推荐
              <el-button
                class="he-recommend-btn"
                :disabled="ruleForm.goods_setting.recommend_status !== 2"
                @click="openGoods"
                type="primary"
                plain
              >
                <span>选择商品</span>
              </el-button>
            </el-radio>
            <goods-select
              ref="goodsSelect"
              :is-tips="false"
              :select-style="{ backgroundColor: '#ffffff' }"
              v-model="ruleForm.goods_setting.recommend_goods"
            >
              <span></span>
            </goods-select>
            <div class="he-tips">最多添加20件商品</div>
          </div>
        </el-form-item>
        <el-form-item label="商品推荐显示页面">
          <el-checkbox-group v-model="ruleForm.goods_setting.recommend_showpage">
            <el-checkbox label="goodsinfo">商品详情</el-checkbox>
            <el-checkbox label="pay_success">支付完成</el-checkbox>
            <el-checkbox label="personal_center">个人中心</el-checkbox>
            <el-checkbox label="orderinfo">订单详情</el-checkbox>
            <el-checkbox label="cart">购物车</el-checkbox>
            <el-checkbox label="coupon_detail">优惠券详情</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品详情页订单滚动">
          <el-switch v-model="ruleForm.goods_setting.order_list_roll" :active-value="1" :inactive-value="0"></el-switch>
          <el-popover placement="top" width="257" trigger="hover">
            <img class="he-example-img" src="./image/he-example.png" alt="" />
            <el-button slot="reference" type="text" class="he-example">示例</el-button>
          </el-popover>
        </el-form-item>
      </div>
      <div class="le-card">
        <div class="el-row--flex is-align-middle">
          <span class="he-title-line"></span>
          <span class="he-title">用户设置</span>
        </div>
        <div class="le-line"></div>
        <div class="le-line"></div>
        <el-form-item label="手机号授权场景">
          <el-checkbox-group v-model="ruleForm.mobile_auth">
            <el-checkbox label="join_shopping_cart">加入购物车</el-checkbox>
            <el-checkbox label="paybuy">购买支付</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="头像昵称授权场景">
          <el-checkbox-group v-model="ruleForm.userinfo_auth">
            <el-checkbox label="join_shopping_cart">加入购物车</el-checkbox>
            <el-checkbox label="paybuy">购买支付</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </div>
      <div class="le-card">
        <div class="el-row--flex is-align-middle">
          <span class="he-title-line"></span>
          <span class="he-title">分享设置</span>
        </div>
        <div class="le-line"></div>
        <div class="le-line"></div>
        <el-form-item label="分享封面图">
          <div class="select-cover__120">
            <pictureDialog v-model="ruleForm.share_setting.cover_img" :limit="1">
              <div slot="upload" class="select-cover__120-add">
                <i class="le-icon le-icon-add select-cover__120-icon"></i>
                <span class="select-cover__120-text">添加图片</span>
              </div>
              <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                <el-image :src="scope.url" fit="cover"></el-image>
                <div class="select-cover__120-tips">
                  <span>替换</span> |
                  <span @click.stop="e => (ruleForm.share_setting.cover_img = '')">删除</span>
                </div>
              </div>
            </pictureDialog>
          </div>
          <div class="he-tips">建议尺寸：800*640像素，不上传将默认使用logo图</div>
        </el-form-item>
        <el-form-item label="分享描述文字">
          <el-input
            placeholder="请输入分享描述文字"
            maxlength="20"
            v-model="ruleForm.share_setting.describe"
            show-word-limit
          ></el-input>
          <div class="he-tips">如不填写，则使用默认文案：欢迎光临XXX（XXX为店铺名）挑选好物</div>
        </el-form-item>
      </div>
      <div class="le-card">
        <div class="el-row--flex is-align-middle">
          <span class="he-title-line"></span>
          <span class="he-title">联系我们</span>
        </div>
        <div class="le-line"></div>
        <div class="le-line"></div>
        <el-form-item label="联系我们" class="le-store-contact">
          <span class="le-required-label" slot="label">联系我们</span>
          <div class="le-banner-phone">
            <el-checkbox v-model="ruleForm.store_setting.contact.phone.bool" disabled>电话联系</el-checkbox>
          </div>
          <div>
            <div class="le-item">
              <span class="le-label le-required-label">电话联系</span>
              <el-input
                placeholder="请输入手机号/座机"
                maxlength="15"
                v-model="ruleForm.store_setting.contact.phone.value"
              ></el-input>
            </div>
            <div>
              <div class="flex le-item">
                <span class="le-label">在线时间</span>
                <div>
                  <el-input
                    v-model="ruleForm.store_setting.contact.phone.time"
                    maxlength="25"
                    show-word-limit
                  ></el-input>
                  <div class="le-prompt-text">示例：周一至周五 25小时在线</div>
                </div>
              </div>
            </div>
          </div>
          <div class="le-banner-phone">
            <el-checkbox v-model="ruleForm.store_setting.contact.online.bool">在线客服</el-checkbox>
          </div>
          <div v-if="ruleForm.store_setting.contact.online.bool">
            <div class="flex le-item">
              <span class="le-label">在线时间</span>
              <div>
                <el-input
                  v-model="ruleForm.store_setting.contact.online.time"
                  maxlength="25"
                  show-word-limit
                ></el-input>
                <div class="le-prompt-text">示例：周一至周五 25小时在线</div>
              </div>
            </div>
          </div>
          <div class="le-banner-phone">
            <el-checkbox v-model="ruleForm.store_setting.contact.friend.bool">加好友联系</el-checkbox>
          </div>
          <template v-if="ruleForm.store_setting.contact.friend.bool">
            <div class="le-item flex">
              <span class="le-label le-required-label">加好友联系</span>
              <div>
                <div class="select-cover__120">
                  <pictureDialog v-model="ruleForm.store_setting.contact.friend.pic_url" :limit="1">
                    <div slot="upload" class="select-cover__120-add">
                      <i class="le-icon le-icon-add select-cover__120-icon"></i>
                      <span class="select-cover__120-text">上传二维码</span>
                    </div>
                    <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                      <el-image :src="scope.url" fit="cover"></el-image>
                      <div class="select-cover__120-tips">
                        <span>替换</span> |
                        <span @click.stop="e => (ruleForm.store_setting.contact.friend.pic_url = '')">删除</span>
                      </div>
                    </div>
                  </pictureDialog>
                </div>
                <div class="le-prompt-text">建议尺寸：800*800像素</div>
              </div>
            </div>
            <div class="le-item flex">
              <span class="le-label">二维码说明</span>
              <div>
                <el-input
                  maxlength="15"
                  show-word-limit
                  :disabled="!ruleForm.store_setting.contact.friend.bool"
                  v-model="ruleForm.store_setting.contact.friend.des"
                  placeholder="请输入二维码说明"
                ></el-input>
                <div class="le-prompt-text">示例：添加客服微信，咨询详情</div>
              </div>
            </div>
            <div class="flex le-item">
              <span class="le-label">在线时间</span>
              <div>
                <el-input
                  v-model="ruleForm.store_setting.contact.friend.time"
                  maxlength="25"
                  show-word-limit
                ></el-input>
                <div class="le-prompt-text">示例：周一至周五 25小时在线</div>
              </div>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="联系地址" prop="store_setting.addressList">
          <el-cascader
            :options="district"
            v-model="ruleForm.store_setting.addressList"
            placeholder="请选择省/市/区"
            :props="{ expandTrigger: 'hover' }"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="store_setting.address">
          <el-input placeholder="请输入详细地址" v-model="ruleForm.store_setting.address"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="le-cardpin">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>
<script type="text/javascript">
import district from './../order/components/district.json';
import goodsSelect from '../../components/goodsSelet/select.vue';
import floatNum from '@/lib/function/floatNum';
import { createNamespacedHelpers } from 'vuex';

const { mapActions } = createNamespacedHelpers('setting');

export default {
  components: {
    goodsSelect
  },
  data() {
    return {
      ruleForm: {
        basic_setting: {
          run_status: 0,
          restore_status: 0,
          restore_time: ''
        },
        store_setting: {
          contact: {
            phone: {
              bool: true,
              value: '',
              time: ''
            },
            online: {
              bool: false,
              time: ''
            },
            friend: {
              bool: false,
              des: '添加客服微信，咨询详情',
              time: '',
              pic_url: ''
            }
          },
          name: '',
          logo: '',
          abstract: '',
          phone: {
            time: [],
            mobile: ''
          },
          address: '',
          addressList: [],
          contact_des: '',
          contact_img: ''
        },
        trade_setting: {
          cancel_status: 1,
          cancel_time: 24,
          received_time: 7,
          evaluate_status: 1,
          evaluate_time: 60,
          after_time: 7,
          exchange_status: 1,
          pay_way: ['wechat', 'alipay']
        },
        goods_setting: {
          recommend_status: 1,
          recommend_showpage: [],
          recommend_goods: [],
          evaluate_show: 1,
          order_list_roll: 1,
          sales_show: 0,
          soldout_show: 0
        },
        mobile_auth: [],
        userinfo_auth: [],
        share_setting: {
          cover_img: '',
          describe: ''
        },
        location_setting: {
          tencent_key: ''
        }
      },
      district: [],
      crontab: '',
      rules: {
        'store_setting.name': [{ required: true, message: '请输入店铺名称', trigger: 'blur' }],
        'store_setting.logo': [{ required: true, message: '请设置店铺LOGO', trigger: 'change' }],
        'store_setting.addressList': [{ required: true, message: '请选择省/市/区', trigger: 'change' }],
        'store_setting.address': [{ required: true, message: '请输入详细地址', trigger: 'blur' }]
      }
    };
  },
  watch: {
    'ruleForm.goods_setting.recommend_goods': {
      handler(val) {
        if (val.length > 20) {
          this.ruleForm.goods_setting.recommend_goods = val.slice(0, 20);
        }
      }
    }
  },
  async mounted() {
    this.getSetting();
    this.getDistrict(district);
    // this.getCrontab();
    this.district = district;
  },
  methods: {
    ...mapActions(['getSettingInfo']),
    getSetting: function () {
      this.$heshop
        .search(
          'post',
          { include: 'setting' },
          {
            keyword: 'setting_collection'
          }
        )
        .then(res => {
          let data = res.content;

          let pay_way = [];
          for (let i in data.trade_setting.pay_way) {
            if (data.trade_setting.pay_way[i].value) {
              pay_way.push(i);
            }
          }
          data.trade_setting.pay_way = pay_way;

          let recommend_showpage = [];
          for (let i in data.goods_setting.recommend_showpage) {
            if (data.goods_setting.recommend_showpage[i].value) {
              recommend_showpage.push(i);
            }
          }
          data.goods_setting.recommend_showpage = recommend_showpage;
          data.goods_setting.recommend_goods === undefined ? (data.goods_setting.recommend_goods = []) : null;
          let new_mobile_auth = [];
          for (let i in data.user_setting.mobile_auth) {
            if (data.user_setting.mobile_auth[i].value) {
              new_mobile_auth.push(i);
            }
          }
          data.mobile_auth = new_mobile_auth;

          let new_userinfo_auth = [];
          for (let i in data.user_setting.userinfo_auth) {
            if (data.user_setting.userinfo_auth[i].value) {
              new_userinfo_auth.push(i);
            }
          }
          data.userinfo_auth = new_userinfo_auth;
          data.basic_setting.restore_time = +data.basic_setting.restore_time;
          data.store_setting.contact = data.store_setting.contact
            ? data.store_setting.contact
            : {
                phone: {
                  bool: true,
                  value: '',
                  time: ''
                },
                online: {
                  bool: false,
                  time: ''
                },
                friend: {
                  bool: false,
                  des: '添加客服微信，咨询详情',
                  time: '',
                  pic_url: ''
                }
              };
          data.share_setting = data.share_setting
            ? data.share_setting
            : {
                cover_img: '',
                describe: ''
              };
          data.location_setting = data.location_setting
            ? data.location_setting
            : {
                tencent_key: ''
              };
          this.ruleForm = data;
        })
        .catch(error => {
          console.error(error);
        });
    },
    // getCrontab: function () {
    //   let _this = this;
    //   this.$heshop
    //     .crontab('post')
    //     .then(function (response) {
    //       _this.crontab = response;
    //     })
    //     .catch(function (error) {});
    // },
    save: function () {
      let { friend, phone } = this.ruleForm.store_setting.contact;
      if (!phone.value) {
        this.$message.error('电话联系不能为空');
        return;
      }
      if (friend.bool) {
        if (!friend.pic_url) {
          this.$message.error('加好友联系不能为空');
          return;
        }
      }
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          if (!this.ruleForm.store_setting.logo) {
            this.ruleForm.store_setting.logo = 'https://qmxq.oss-cn-hangzhou.aliyuncs.com/home.png';
          }
          let basic_setting = JSON.parse(JSON.stringify(this.ruleForm.basic_setting));
          let share_setting = JSON.parse(JSON.stringify(this.ruleForm.share_setting));
          if (basic_setting.restore_time) {
            let str = new Date(basic_setting.restore_time).getTime().toString();
            str.slice(0, str.length - 3);
            basic_setting.restore_time = str;
          }
          let store_setting = JSON.parse(JSON.stringify(this.ruleForm.store_setting));
          store_setting.province = store_setting.addressList[0];
          store_setting.city = store_setting.addressList[1];
          store_setting.district = store_setting.addressList[2];
          let trade_setting = JSON.parse(JSON.stringify(this.ruleForm.trade_setting));
          let pay_way = {
            wechat: {
              title: '微信',
              value: false
            },
            alipay: {
              title: '支付宝',
              value: false
            }
          };
          trade_setting.pay_way.forEach(item => {
            for (let key in pay_way) {
              if (item === key) {
                pay_way[key].value = true;
              }
            }
          });
          trade_setting.pay_way = pay_way;
          let goods_setting = JSON.parse(JSON.stringify(this.ruleForm.goods_setting));
          let recommend_showpage = {
            goodsinfo: {
              title: '商品详情',
              value: false
            },
            pay_success: {
              title: '支付完成',
              value: false
            },
            personal_center: {
              title: '个人中心',
              value: false
            },
            orderinfo: {
              title: '订单详情',
              value: false
            },
            cart: {
              title: '购物车',
              value: false
            },
            coupon_detail: {
              title: '优惠券详情',
              value: false
            }
          };
          goods_setting.recommend_showpage.forEach(item => {
            for (let key in recommend_showpage) {
              if (item === key) {
                recommend_showpage[key].value = true;
              }
            }
          });
          goods_setting.recommend_showpage = recommend_showpage;
          let mobile_auth = JSON.parse(JSON.stringify(this.ruleForm.mobile_auth));
          let new_mobile_auth = {
            join_shopping_cart: {
              title: '加入购物车',
              value: false
            },
            paybuy: {
              title: '支付购买',
              value: false
            },
            get_tickets: {
              title: '获取卡券',
              value: false
            }
          };
          mobile_auth.forEach(item => {
            for (let key in new_mobile_auth) {
              if (item === key) {
                new_mobile_auth[key].value = true;
              }
            }
          });
          let userinfo_auth = JSON.parse(JSON.stringify(this.ruleForm.userinfo_auth));
          let new_userinfo_auth = {
            join_shopping_cart: {
              title: '加入购物车',
              value: false
            },
            paybuy: {
              title: '支付购买',
              value: false
            },
            get_tickets: {
              title: '获取卡券',
              value: false
            }
          };
          userinfo_auth.forEach(item => {
            for (let key in new_userinfo_auth) {
              if (item === key) {
                new_userinfo_auth[key].value = true;
              }
            }
          });
          this.$heshop
            .setting('post', {
              keyword: 'setting_collection',
              content: {
                basic_setting: basic_setting,
                store_setting: store_setting,
                trade_setting: trade_setting,
                goods_setting: goods_setting,
                user_setting: {
                  mobile_auth: new_mobile_auth,
                  userinfo_auth: new_userinfo_auth
                },
                share_setting: share_setting,
                location_setting: this.$_.cloneDeep(this.ruleForm.location_setting)
              }
            })
            .then(() => {
              this.getSettingInfo();
              this.$message.success('保存成功');
            })
            .catch(error => {
              console.error(error);
              this.$message.error('保存失败');
            });
        } else {
          return false;
        }
      });
    },
    getDistrict: function (district) {
      for (let i = 0; i < district.length; i++) {
        district[i].label = district[i].name;
        district[i].value = district[i].name;
        if (district[i].list) {
          district[i].children = district[i].list;
          this.getDistrict(district[i].children);
        }
      }
    },
    openGoods: function () {
      this.$refs.goodsSelect.open();
    },
    reset: function () {
      let origin = window.location.origin;
      this.ruleForm.store_setting.logo = origin + '/static/images/home.png';
    },
    oninput: function (value) {
      return floatNum(value);
    },
    proving: function (val) {
      val = val.replace(/[^\.\d]/g, '');
      val = val.replace('.', '');
      return val;
    },
    copy: function (content) {
      var copyDom = document.createElement('div');
      copyDom.innerText = content;
      copyDom.style.position = 'absolute';
      copyDom.style.top = '0px';
      copyDom.style.right = '-9999px';
      document.body.appendChild(copyDom);
      //创建选中范围
      var range = document.createRange();
      range.selectNode(copyDom);
      //移除剪切板中内容
      window.getSelection().removeAllRanges();
      //添加新的内容到剪切板
      window.getSelection().addRange(range);
      //复制
      var successful = document.execCommand('copy');
      copyDom.parentNode.removeChild(copyDom);
      try {
        var msg = successful ? 'successful' : 'failed';
      } catch (err) {}
      this.$message.success('复制成功');
    }
  }
};
</script>
<style lang="less" scoped="true">
@import './setup.less';

.he-title-line {
  width: 4px;
  height: 16px;
  background: #623ceb;
  display: inline-block;
}

.le-reset {
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #623ceb;
  cursor: pointer;
}

.he-title {
  font-size: 16px;
  font-weight: 400;
  color: #000000;
  opacity: 0.85;
  margin-left: 12px;
}

.le-matter /deep/ .el-form-item .el-form-item__content .el-date-editor .el-input__inner {
  padding-left: 30px;
}

.le-matter /deep/ .el-date-editor {
  margin-top: 16px;
}

/deep/ .el-textarea {
  height: 200px;
}

/deep/ .el-textarea .el-textarea__inner {
  resize: none;
  height: 200px;
}

.le-matter /deep/ .el-form-item__content .el-input.el-input-group.el-input-group--append {
  width: 200px;
}

.he-tips {
  font-size: 12px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  margin-right: 8px;
}

.he-recommend-btn {
  margin-left: 17px;
  width: 104px;
  height: 32px;
  background: #ffffff !important;
  border: 1px solid #623ceb;
  border-radius: 4px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #623ceb;
}

.he-recommend-btn[disabled] {
  color: #bfbfbf !important;
  border: 1px solid #dcdfe6 !important;
}

.he-recommend-btn[disabled]:hover {
  color: #bfbfbf !important;
}

.he-recommend-btn:hover {
  color: #623ceb !important;
}

.he-recommend-btn:focus {
  color: #623ceb !important;
}

.he-disabled-btn {
  background: #f3f5f7 !important;
  border-radius: 4px;
  border: none;
}

.he-disabled-btn span {
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #000000 !important;
  opacity: 0.45;
}

.he-example {
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #623ceb;
  padding: 0 9px !important;
}

.he-example-img {
  width: 225px;
  height: 400px;
}

.goods-selet {
  padding-bottom: 0;
  padding-top: 0;

  ::v-deep .goods-selet-list {
    margin-top: -20px;
  }
}

.le-copy {
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #623ceb;
  padding: 0 9px !important;
  cursor: pointer;
}

.le-store-contact /deep/ {
  .le-contact__radio {
    margin-bottom: 10px;
  }

  .el-form-item:last-child {
    margin-bottom: 0;
  }
}

.le-store-contact {
  .le-required-label::before {
    content: '*';
    color: red;
  }

  .le-banner-phone {
    height: 42px;
    line-height: 42px;
    background: #f3f5f7;
    border-radius: 4px;
    padding-left: 16px;
    margin-bottom: 24px;
  }

  /deep/ .el-checkbox__label {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626 !important;
  }

  .le-item {
    margin-bottom: 24px;

    .le-label {
      display: inline-block;
      width: 140px;
      text-align: right;
      padding-right: 16px;
    }
  }
}
</style>
