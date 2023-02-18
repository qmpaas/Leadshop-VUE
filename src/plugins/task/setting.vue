<template>
  <div class="task-setting">
    <div class="task-setting_left">
      <div class="__phone">
        <div class="__phone_window">
          <div class="header">
            <img class="header-bg" src="@/assets/images/icon-phone-header.png" />
            <h3>我的积分</h3>
          </div>
          <taskPhone :task="task" />
        </div>
      </div>
    </div>
    <div class="task-setting_right">
      <el-form :model="form" ref="dynamicValidateForm">
        <el-card class="__card">
          <div slot="header" class="__card_clearfix">
            <h3>基础信息</h3>
          </div>
          <div class="__card_body" style="padding-left: 64px">
            <el-form-item label="优惠叠加">
              <el-checkbox :true-label="1" :false-label="0" v-model="form.coupon_stacking">优惠券</el-checkbox>
              <p>勾选则表明积分商城商品可叠加优惠券使用</p>
            </el-form-item>
            <el-form-item label="积分退还">
              <el-checkbox :true-label="1" :false-label="0" v-model="form.integral_return"
                >退款订单退还积分</el-checkbox
              >
              <p>勾选则表明购买的积分商城商品退款成功后，被使用的积分退还给买家</p>
            </el-form-item>
            <el-form-item label="积分清零">
              <el-checkbox :true-label="1" :false-label="0" v-model="form.integral_reset">积分清零</el-checkbox>
            </el-form-item>
            <div style="padding-left: 86px">
              <el-form-item label="每年">
                <el-date-picker
                  popper-class="task-date"
                  style="width: 200px"
                  v-model="form.change_time.start"
                  format="MM-dd"
                  type="date"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
                <span> 清零当年 </span>
                <el-date-picker
                  popper-class="task-date"
                  style="width: 200px"
                  v-model="form.change_time.end"
                  format="MM-dd"
                  type="date"
                  placeholder="选择日期时间"
                >
                </el-date-picker>
                <span> 前累积的积分 </span>
                <p style="padding-left: 40px">示例：每年12月31日清零当年6月30日前累积的积分</p>
              </el-form-item>
              <!-- 清零前那一天发送提醒就好了 -->
              <el-form-item label="清零前">
                <el-input v-model="form.reset_remind" style="width: 130px">
                  <template slot="append">天</template>
                </el-input>
                <span> 提醒用户</span>
              </el-form-item>
              <el-form-item label="定时任务">
                <el-input v-model="url" style="width: 290px" :disabled="true"></el-input>
                <span @click="copy(url)" style="color: #623ceb; cursor: pointer"> 复制链接</span>
                <p style="padding-left: 70px">
                  请将定时任务链接，配置到服务器。<a
                    target="_blank"
                    href="https://help.leadshop.vip/3045042"
                    style="color: #623ceb"
                    >查看配置教程</a
                  >
                </p>
              </el-form-item>
            </div>
          </div>
        </el-card>
        <el-card class="__card">
          <div slot="header" class="__card_clearfix">
            <h3>积分任务</h3>
          </div>
          <div class="__card_body">
            <div class="__card_body_item">
              <h3>购买任务</h3>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[0].status">购买商品</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="消费">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>消费</span>
                  <el-input class="__card_input" v-model="task[0].total" :disabled="!task[0].status">
                    <template slot="append">元</template>
                  </el-input>
                  获
                  <el-input class="__card_input" v-model="task[0].acquire" :disabled="!task[0].status" id="v1">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="每日最多送">
                  <el-input class="__card_input" v-model="task[0].maximum" :disabled="!task[0].status" id="v2">
                    <template slot="append">次</template>
                  </el-input>
                  <span>积分</span>
                </el-form-item>
              </div>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[1].status">完成下单</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="每下">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>每下</span>
                  <el-input class="__card_input" v-model="task[1].total" :disabled="!task[1].status" id="v3">
                    <template slot="append">笔</template>
                  </el-input>
                  <span>订单,获</span>
                  <el-input class="__card_input" v-model="task[1].acquire" :disabled="!task[1].status" id="v4">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="每日最多送">
                  <el-input class="__card_input" v-model="task[1].maximum" :disabled="!task[1].status" id="v5">
                    <template slot="append">次</template>
                  </el-input>
                  <span>积分</span>
                </el-form-item>
              </div>
            </div>
            <div class="__card_body_item">
              <h3>活跃任务</h3>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[2].status">签到</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="每日签到，获">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>每日签到，获</span>
                  <el-input class="__card_input" v-model="task[2].acquire" :disabled="!task[2].status" id="v6">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[3].status">连续签到</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="连续签到">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>连续签到</span>
                  <el-input class="__card_input" v-model="task[3].total" :disabled="!task[3].status" id="v7">
                    <template slot="append">天</template>
                  </el-input>
                  获
                  <el-input class="__card_input" v-model="task[3].acquire" :disabled="!task[3].status" id="v8">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[4].status">分享转发</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="每日分享转发">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>每日分享转发</span>
                  <el-input class="__card_input" v-model="task[4].total" :disabled="!task[4].status" id="v9">
                    <template slot="append">次</template>
                  </el-input>
                  <span>及以上，获</span>
                  <el-input class="__card_input" v-model="task[4].acquire" :disabled="!task[4].status" id="v10">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[5].status">浏览商品</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="每日浏览商品">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>每日浏览商品</span>
                  <el-input class="__card_input" v-model="task[5].total" :disabled="!task[5].status" id="v11">
                    <template slot="append">件</template>
                  </el-input>
                  <span>及以上，获</span>
                  <el-input class="__card_input" v-model="task[5].acquire" :disabled="!task[5].status" id="v12">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[6].status">邀请好友</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="每邀请好友">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>每邀请好友</span>
                  <el-input class="__card_input" v-model="task[6].total" :disabled="!task[6].status" id="v13">
                    <template slot="append">人</template>
                  </el-input>
                  获
                  <el-input class="__card_input" v-model="task[6].acquire" :disabled="!task[6].status" id="v14">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
                <el-form-item label="每人每日最高获">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>每人每日最高获</span>
                  <el-input class="__card_input" v-model="task[6].maximum" :disabled="!task[6].status" id="v15">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
            <div class="__card_body_item">
              <h3>基础任务</h3>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[7].status">完善个人信息</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="选择信息">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>选择信息</span>
                  <el-checkbox-group v-model="task[7].extend" :disabled="!task[7].status">
                    <el-checkbox v-for="(item, keys) in bindingextend" :label="item.value" :key="keys">{{
                      item.label
                    }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="完善后，获">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>完善后，获</span>
                  <el-input class="__card_input" v-model="task[7].acquire" :disabled="!task[7].status" id="v16">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
              </div>
              <el-form-item class="__card_body_item_status">
                <el-checkbox :true-label="1" :false-label="0" v-model="task[8].status">绑定手机号</el-checkbox>
              </el-form-item>
              <div style="padding-left: 86px">
                <el-form-item label="绑定后，获">
                  <span slot="label"><strong style="color: red; padding-right: 3px">*</strong>绑定后，获</span>
                  <el-input class="__card_input" v-model="task[8].acquire" :disabled="!task[8].status" id="v17">
                    <template slot="append">积分</template>
                  </el-input>
                </el-form-item>
              </div>
            </div>
          </div>
        </el-card>
        <el-card class="__card">
          <div slot="header" class="__card_clearfix">
            <h3>积分规则</h3>
          </div>
          <div class="__card_body">
            <el-form-item label="积分规则" prop="integral_rules">
              <div class="__card_body_textarea">
                <el-input type="textarea" rows="20" v-model="form.integral_rules"></el-input>
              </div>
            </el-form-item>
          </div>
        </el-card>
        <div class="task-card-footer">
          <el-button>取消</el-button>
          <el-button type="primary" @click="handleSubmit">保存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
<script type="text/javascript">
import taskPhone from './components/phone/setting.vue';
export default {
  components: {
    taskPhone
  },
  data() {
    var checkScore = (rule, value, callback) => {};
    return {
      is_verify: true,
      url: '',
      bindingextend: [
        { value: 'avatar', label: '头像' },
        { value: 'realname', label: '姓名' },
        { value: 'gender', label: '性别' },
        { value: 'birthday', label: '生日' },
        { value: 'area', label: '地区' },
        { value: 'wechat', label: '微信号' }
      ],
      task: [
        {
          name: '购买商品',
          type: 1,
          keyword: 'goods',
          total: 3,
          acquire: 6,
          maximum: 30,
          status: 0,
          url: 'plugins/task/mall',
          extend: [],
          prompt: '',
          remark: '消费%s元，获得%s积分'
        },
        {
          name: '完成下单',
          type: 1,
          keyword: 'order',
          total: 3,
          acquire: 6,
          maximum: 30,
          status: 0,
          url: '',
          extend: [],
          prompt: '',
          remark: '每下%s笔订单，获得%s积分'
        },
        {
          name: '每日签到',
          type: 1,
          keyword: 'signin',
          total: 1,
          acquire: 10,
          maximum: 10,
          status: 0,
          url: 'plugins/task/index',
          extend: [],
          prompt: '',
          remark: '每日签到，获得%s积分'
        },
        {
          name: '连续签到',
          type: 1,
          keyword: 'sustain',
          total: 7,
          acquire: 100,
          maximum: 100,
          status: 0,
          url: 'plugins/task/index',
          extend: [],
          prompt: '',
          remark: '连续签到%s天，获得额外%s积分'
        },
        {
          name: '分享转发',
          type: 1,
          keyword: 'share',
          total: 3,
          acquire: 6,
          maximum: 6,
          status: 0,
          url: 'pages/index/index',
          extend: [],
          prompt: '在分享转发%s次，即可获得积分',
          remark: '每日分享转发%s次及以上，获得%s积分'
        },
        {
          name: '浏览商品',
          type: 1,
          keyword: 'browse',
          total: 3,
          acquire: 6,
          maximum: 6,
          status: 0,
          url: 'pages/goods/list',
          extend: [],
          prompt: '在浏览%s件商品，即可获得积分',
          remark: '每日浏览商品%s件及以上，获得%s积分'
        },
        {
          name: '邀请好友',
          type: 1,
          keyword: 'invite',
          total: 3,
          acquire: 6,
          maximum: 30,
          status: 0,
          url: 'pages/index/index',
          extend: [],
          prompt: '在邀请%s人，即可获得积分',
          remark: '每邀请好友%s人，获得%s积分'
        },
        {
          name: '完善信息',
          type: 2,
          keyword: 'perfect',
          total: 1,
          acquire: 20,
          maximum: 20,
          status: 0,
          url: 'pages/user/index',
          extend: [],
          prompt: '',
          remark: '完善个人信息，获得%s积分'
        },
        {
          name: '绑定手机',
          type: 2,
          keyword: 'binding',
          total: 1,
          acquire: 20,
          maximum: 20,
          status: 0,
          url: 'pages/user/index',
          extend: ['phone'],
          prompt: '',
          remark: '绑定手机号，获得%s积分'
        }
      ],
      form: {
        coupon_stacking: false,
        integral_return: false,
        integral_reset: false,
        change_time: {
          start: '',
          end: ''
        },
        reset_remind: 15,
        integral_rules:
          '积分商品暂时只支持兑换商城商品 \n积分任务 \n1. 购买商品：消费X元，获X积分消费的金额，即订单的实付款，其中也包括运费金额；购买的商品申请退款成功，不扣减积分；  \n2. 完成下单：下单指对订单付款，每下X笔订单，获X积分付款的订单，申请退款成功，不扣减积分；  \n3. 分享转发：生成分享海报/发送给好友/分享到朋友圈均为分享转发操作  \n4. 浏览商品：打开商品详情页同一件商品浏览多次，统计为1次； \n5. 邀请好友：好友通过分享的海报、链接、微信卡片、朋友圈进入到商城；  \n6. 完善个人信息：填写完要求的所有信息已完善过信息；  \n7. 绑定手机号：绑定手机号不支持解绑，只支持换手机号绑定； \n8. 签到：签到打卡'
      }
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {},
  /**
   * 页面渲染前
   * @return {[type]} [description]
   */
  created() {},
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {},
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.handleLoaddata();
  },
  methods: {
    /**
     * 验证
     * @return {[type]} [description]
     */
    blurVerify(fun) {
      let e = window.event;
      fun(e);
    },
    /**
     * 判断是否整数
     * @param  {[type]}  obj [description]
     * @return {Boolean}     [description]
     */
    isInteger(obj) {
      return obj % 1 === 0;
    },
    /**
     * [$message description]
     * @param  {[type]} argument [description]
     * @return {[type]}          [description]
     */
    messageerror(msg) {
      this.is_verify = false;
      this.$message.error(msg);
    },
    /**
     * 获取数据
     * @return {[type]} [description]
     */
    handleLoaddata() {
      this.$heshop
        .plugin('get', { include: 'task', model: 'base' })
        .then(res => {
          this.form = res.form;
          this.url = res.url;
          //用于处理时间反向解析问题
          if (this.form) {
            let date = {
              start: this.form.change_time.start ? new Date(this.form.change_time.start) : new Date(),
              end: this.form.change_time.end ? new Date(this.form.change_time.end) : new Date()
            };
            this.form.change_time = date;
          }
          if (res.task.length) {
            this.task = res.task;
          }
        })
        .catch(err => {
          this.messageerror('加载配置信息失败，请检查网络');
        });
    },
    /**
     * 执行数据提交
     * @return {[type]} [description]
     */
    handleSubmit() {
      if (this.form.reset_remind <= 0) {
        this.messageerror('清零前提醒必须大于0天');
        return;
      }

      if (!this.isInteger(this.form.reset_remind)) {
        this.messageerror('清零前提醒必须为整数');
        return;
      }
      let is_submit = true;
      //最笨最傻的办法进行判断
      //简直写到吐血
      //以下方法实属无奈，后期时间充裕的情况下，自己写一个验证类进行处理
      for (let index in this.task) {
        let item = this.task[index];
        if (item.status) {
          if (item.total < 0) {
            this.messageerror('不能设置为负数');
            is_submit = false;
            return;
          }
          if (parseFloat(item.acquire) < 0) {
            this.messageerror('不能设置为负数');
            is_submit = false;
            return;
          }
          if (parseFloat(item.maximum) < 0) {
            this.messageerror('不能设置为负数');
            is_submit = false;
            return;
          }
          if (index < 1) {
            if (item.total == '' || item.total == null) {
              this.messageerror('消费金额不能为空');
              is_submit = false;
              return;
            }

            if (!this.isfloat(item.total)) {
              this.messageerror('消费金额格式不正确');
              is_submit = false;
              return;
            }
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('积分必须为整数');
              is_submit = false;
              return;
            }

            if (!this.isInteger(item.maximum)) {
              this.messageerror('次数必须为整数');
              is_submit = false;
              return;
            }

            if (parseFloat(item.maximum) > 999999999999999) {
              this.messageerror('每日最多送积分值操作最大长度');
              is_submit = false;
              return;
            }
          }

          if (index == 1) {
            if (item.total == '' || item.total == null) {
              this.messageerror('消费金额不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.total)) {
              this.messageerror('下单数量必须为整数');
              is_submit = false;
              return;
            }
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('积分必须为整数');
              is_submit = false;
              return;
            }

            if (!this.isInteger(item.maximum)) {
              this.messageerror('次数必须为整数');
              is_submit = false;
              return;
            }

            if (parseFloat(item.maximu) > 999999999999999) {
              this.messageerror('每日最多送积分值操作最大长度');
              is_submit = false;
              return;
            }
          }
          if (index == 2) {
            if (item.total == '' || item.total == null) {
              this.messageerror('消费金额不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.total)) {
              this.messageerror('下单数量必须为整数');
              is_submit = false;
              return;
            }
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('积分不能为空');
              is_submit = false;
              return;
            }
          }
          if (index == 3) {
            if (item.total == '' || item.total == null) {
              this.messageerror('连续签到天数不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.total)) {
              this.messageerror('连续签到天数必须为整数');
              is_submit = false;
              return;
            }
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('连续签到获得积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('连续签到获得积分必须为整数');
              is_submit = false;
              return;
            }
          }
          if (index == 4) {
            if (item.total == '' || item.total == null) {
              this.messageerror('分享转发次数不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.total)) {
              this.messageerror('分享转发次数必须为整数');
              is_submit = false;
              return;
            }
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('分享转发获得积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('分享转发获得积分必须为整数');
              is_submit = false;
              return;
            }
          }
          if (index == 5) {
            if (item.total == '' || item.total == null) {
              this.messageerror('浏览商品次数不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.total)) {
              this.messageerror('浏览商品次数必须为整数');
              is_submit = false;
              return;
            }
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('浏览商品获得积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('浏览商品获得积分必须为整数');
              is_submit = false;
              return;
            }
          }

          if (index == 5) {
            if (item.total == '' || item.total == null) {
              this.messageerror('浏览商品次数不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.total)) {
              this.messageerror('浏览商品次数必须为整数');
              is_submit = false;
              return;
            }
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('浏览商品获得积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('浏览商品获得积分必须为整数');
              is_submit = false;
              return;
            }
          }

          if (index == 6) {
            if (item.total == '' || item.total == null) {
              this.messageerror('邀请好友人数不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.total)) {
              this.messageerror('邀请好友人数必须为整数');
              is_submit = false;
              return;
            }
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('邀请好友获积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('邀请好友获积分必须为整数');
              is_submit = false;
              return;
            }
            if (item.maximum == '' || item.maximum == null) {
              this.messageerror('邀请好友获最高或积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.maximum)) {
              this.messageerror('邀请好友获最高或积分必须为整数');
              is_submit = false;
              return;
            }
            if (parseFloat(item.acquire) > parseFloat(item.maximum)) {
              this.messageerror('邀请好友每日的积分限制数，必须大于单次获取的积分数');
              is_submit = false;
              return;
            }
            if (item.maximum < 1) {
              this.messageerror('每日最多送积分不能为0');
              is_submit = false;
              return;
            }
            if (parseFloat(item.maximum) > 999999999999999) {
              this.messageerror('每日最多送积分值操作最大长度');
              is_submit = false;
              return;
            }
          }

          if (index == 7) {
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('完善个人信息获积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('完善个人信息获积分必须为整数');
              is_submit = false;
              return;
            }
          }

          if (index == 8) {
            if ((item.acquire == '') | (item.acquire == null)) {
              this.messageerror('绑定手机获积分不能为空');
              is_submit = false;
              return;
            }
            if (!this.isInteger(item.acquire)) {
              this.messageerror('绑定手机获积分必须为整数');
              is_submit = false;
              return;
            }
          }
        }
      }
      if (is_submit == false) {
        return false;
      }
      //用于处理时间格式化问题
      if (this.form && this.form.integral_reset) {
        let date = {
          start: this.dateFormat('YYYY-mm-dd HH:MM', this.form.change_time.start),
          end: this.dateFormat('YYYY-mm-dd HH:MM', this.form.change_time.end)
        };
        this.form.change_time = date;
      }
      this.$heshop
        .plugin(
          'post',
          { include: 'task', model: 'base' },
          {
            form: this.form,
            task: this.task
          }
        )
        .then(res => {
          localStorage.removeItem('ndfWxbOhLIIHVZeR');
          this.$message({
            message: '保存成功',
            type: 'success'
          });
          this.handleLoaddata();
        })
        .catch(err => {
          this.messageerror('保存失败，请检查网络');
        });
    },
    dateFormat(fmt, date) {
      if (date) {
        try {
          let ret;
          const opt = {
            'Y+': date.getFullYear().toString(), // 年
            'm+': (date.getMonth() + 1).toString(), // 月
            'd+': date.getDate().toString(), // 日
            'H+': date.getHours().toString(), // 时
            'M+': date.getMinutes().toString(), // 分
            'S+': date.getSeconds().toString() // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
          };
          for (let k in opt) {
            ret = new RegExp('(' + k + ')').exec(fmt);
            if (ret) {
              fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, '0'));
            }
          }
          return fmt;
        } catch (err) {
          this.messageerror('时间格式错误');
          return '';
        }
      } else {
        return '';
      }
    },
    /**
     * 拷贝URL链接
     * @param  {[type]} content [description]
     * @return {[type]}         [description]
     */
    copy(content) {
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
    },
    /**
     * 判断浮点型
     * @param  {[type]} oNum [description]
     * @return {[type]}      [description]
     */
    isfloat(oNum) {
      if (!oNum) return false;
      var strP = /^\d+(\.\d+)?$/;
      if (!strP.test(oNum)) return false;
      try {
        if (parseFloat(oNum) != oNum) return false;
      } catch (ex) {
        return false;
      }
      return true;
    }
  }
};
</script>
<style lang="less" scoped="true">
@import './task.less';

.task-setting {
  /deep/ .el-card__header {
    padding-bottom: 0;
  }

  .el-form-item__content {
    p {
      padding: 0;
      margin: 0;
      line-height: 20px;
      padding-left: 70px;
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #bfbfbf;
      line-height: 30px;
    }
  }

  .__card_body {
    /deep/ .__card_body_item {
      border: 2px solid #f5f7fa;
      border-radius: 8px;
      padding: 0;
      margin: 0 0 24px 0;

      .__card_body_item_status {
        padding-left: 64px;
      }

      .el-form-item--mini.el-form-item {
        margin-bottom: 12px;
      }

      h3 {
        padding: 0;
        margin: 0;
        width: 100%;
        height: 48px;
        line-height: 48px;
        padding-left: 21px;
        background: #f5f7fa;
        border-radius: 8px 8px 0px 0px;
        font-weight: 400;
        color: #595959;
        margin-bottom: 32px;
      }
    }

    .el-textarea.el-input--mini {
      width: 600px;
      background: #ffffff;
      border-radius: 4px;
    }
  }
}
</style>
