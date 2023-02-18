<template>
  <div class="le-matter">
    <el-breadcrumb class="he-link-text" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <he-link href="plugins/features">营销玩法</he-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="he-link">
        <he-link href="features/coupon/index">优惠券管理</he-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{ isEdit ? '编辑优惠券' : '新建优惠券' }}
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="flex le-content" v-loading="loading">
      <div class="le-left">
        <div class="le-left-top">
          <el-scrollbar class="le-left-top_content">
            <div class="le-coupon-detail">
              <div class="le-coupon-share align-center flex flex-direction" v-if="form.enable_share">
                <he-icon type="le-icon-fenxiang" size="14px"></he-icon>
                <span>分享</span>
              </div>
              <div class="le-coupon-detail-top">
                <div class="le-coupon-doc-line flex justify-center">
                  <div class="le-coupon-doc-item" v-for="item in 17" :key="item">
                    <div class="le-coupon-doc"></div>
                  </div>
                </div>
                <div class="le-coupon-heade-body flex flex-direction align-center">
                  <div class="le-coupon-name">
                    {{ form.name ? form.name : '优惠券名称' }}
                  </div>
                  <div class="le-coupon-price">
                    {{ form.sub_price ? form.sub_price : '88' }}
                  </div>
                  <div class="le-coupon-condition">
                    <template v-if="form.min.type > 0"> 满{{ form.min.price }}可用</template>
                    <template v-else> 无门槛使用</template>
                    ，{{ form.appoint_type === 1 ? '全部商品可用' : '部分商品可用' }}
                  </div>
                  <button class="le-coupon-btn">立即使用</button>
                </div>
              </div>
              <div class="le-coupon-detail-center">
                <div class="le-coupon-doc"></div>
                <div class="le-coupon-line"></div>
                <div class="le-coupon-doc"></div>
              </div>
              <div class="le-coupon-detail-bottom">
                <div class="le-coupon-bottom-body">
                  <div class="le-coupon-title">可用时间</div>
                  <div class="le-coupon-text">
                    <template v-if="form.time.expire_type === 1"> 领取后{{ form.time.expire_day }}天内</template>
                    <template v-else>
                      <template v-if="form.time.begin_time && form.time.end_time">
                        {{ form.time.begin_time | timeFormat('yyyy.mm.dd hh:MM:ss') }}
                        -
                        {{ form.time.end_time | timeFormat('yyyy.mm.dd hh:MM:ss') }}
                      </template>
                      <template v-else> XXXX.XX.XX XX:XX:XX - XXXX.XX.XX XX:XX:XX</template>
                    </template>
                  </div>
                  <div class="le-coupon-title">使用说明</div>
                  <div class="le-coupon-text" v-html="form.content"></div>
                </div>
                <div class="le-coupon-doc-line flex justify-center">
                  <div class="le-coupon-doc-item" v-for="item in 17" :key="item">
                    <div class="le-coupon-doc"></div>
                  </div>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
        <div class="le-left-bottom">
          优惠券详情预览图
          <el-popover trigger="hover" content="使用在优惠券详情页" placement="top">
            <he-icon slot="reference" type="le-icon-zhushi" class="he-zhushi"></he-icon>
          </el-popover>
        </div>
      </div>
      <el-form class="flex-sub" ref="form" label-width="189px" :model="form" :rules="rules">
        <div class="le-card">
          <div class="le-card-header flex align-center">
            <span></span>
            <span>基本信息</span>
          </div>
          <div class="le-card-body">
            <el-form-item>
              <span slot="label" class="le-form-item__label">优惠券类型</span>
              <span class="le-item-form-text">满减优惠券</span>
            </el-form-item>
            <el-form-item prop="name">
              <span slot="label" class="le-form-item__label">优惠券名称</span>
              <el-input
                v-model="form.name"
                maxlength="8"
                placeholder="请输入优惠券名称"
                show-word-limit
                :disabled="examine"
              ></el-input>
            </el-form-item>
            <el-form-item prop="total_num">
              <span slot="label" class="le-form-item__label">发放总量</span>
              <el-input
                v-model.number="form.total_num"
                :maxlength="8"
                :disabled="examine"
                @input.native="inputNumberTotalNum"
              >
                <template slot="append">张</template>
              </el-input>
              <div class="le-item-form-prompt">编辑发放总量时只能增加不能减少，请谨慎设置</div>
            </el-form-item>
            <el-form-item prop="time" class="le-form-item-time">
              <span slot="label" class="le-form-item__label">用券时间</span>
              <div class="flex">
                <div>
                  <el-radio
                    v-model="form.time.expire_type"
                    @change="validateField('time')"
                    :label="2"
                    :disabled="isEdit"
                    ><span></span
                  ></el-radio>
                </div>
                <div>
                  <el-date-picker
                    type="datetime"
                    value-format="timestamp"
                    :disabled="form.time.expire_type === 1 || isEdit"
                    v-model="form.time.begin_time"
                    placeholder="开始时间"
                  >
                  </el-date-picker>
                  <span class="le-go le-item-form-text">至</span>
                  <el-date-picker
                    type="datetime"
                    value-format="timestamp"
                    :disabled="form.time.expire_type === 1 || isEdit"
                    v-model="form.time.end_time"
                    placeholder="结束时间"
                  >
                  </el-date-picker>
                  <div class="le-item-form-prompt">若当前时间超过优惠券的固定用券时间，则优惠券状态将变成已结束。</div>
                </div>
              </div>
              <div class="flex">
                <div>
                  <el-radio
                    v-model="form.time.expire_type"
                    @change="validateField('time')"
                    :label="1"
                    :disabled="isEdit"
                    ><span></span
                  ></el-radio>
                </div>
                <div>
                  <span class="le-form-item__label">领取当日起</span>
                  <el-input
                    class="le-form-item-small-input"
                    v-model.number="form.time.expire_day"
                    :maxlength="7"
                    @input.native="inputNumberDay"
                    :disabled="form.time.expire_type === 2 || isEdit"
                  >
                    <template slot="append">天</template>
                  </el-input>
                  <span class="le-form-item__label">可用</span>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
        <div class="le-card">
          <div class="le-card-header flex align-center">
            <span></span>
            <span>优惠内容</span>
          </div>
          <div class="le-card-body">
            <el-form-item prop="min">
              <span slot="label" class="le-form-item__label">门槛金额</span>
              <div>
                <el-radio v-model="form.min.type" :label="0" :disabled="isEdit">
                  <span class="le-item-form-text">无使用门槛</span>
                </el-radio>
              </div>
              <div class="flex">
                <div>
                  <el-radio v-model="form.min.type" :label="1" :disabled="isEdit">
                    <span></span>
                  </el-radio>
                </div>
                <div>
                  <span class="le-item-form-text">订单满</span>
                  <el-input
                    class="le-form-item-small-input"
                    @input.native="formatPrice"
                    v-model="form.min.price"
                    :maxlength="10"
                    :disabled="form.min.type === 0 || isEdit"
                  >
                    <template slot="append">元</template>
                  </el-input>
                  <span class="le-item-form-text">可用</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item prop="sub_price">
              <span slot="label" class="le-form-item__label">优惠金额</span>
              <span class="le-item-form-text">减免</span>
              <el-input
                class="le-form-item-small-input"
                @input.native="formatSubPrice"
                v-model="form.sub_price"
                :maxlength="10"
                :disabled="isEdit"
              >
                <template slot="append">元</template>
              </el-input>
              <div class="le-item-form-prompt">为控制成本，请谨慎填写</div>
            </el-form-item>
            <el-form-item prop="appoint_data">
              <span slot="label" class="le-form-item__label">适用商品</span>
              <div>
                <el-radio v-model="form.appoint_type" @change="changeAppoint" :label="1" :disabled="examine"
                  ><span class="le-item-form-text">全部商品</span>
                </el-radio>
              </div>
              <div>
                <el-radio v-model="form.appoint_type" @change="changeAppoint" :label="2" :disabled="examine"
                  ><span class="le-item-form-text">指定商品可用</span></el-radio
                >
              </div>
              <div class="le-des-goods" v-if="form.appoint_type === 2">
                <template v-if="!examine">
                  <el-button @click="getGoods" class="le-select-btn">选择商品</el-button>
                  <span class="le-item-form-prompt">最多添加500件商品</span>
                </template>
                <goods-select
                  ref="goodsSelect"
                  :is-tips="false"
                  :select-style="{ backgroundColor: '#ffffff' }"
                  v-model="form.appoint_data"
                >
                </goods-select>
                <el-table
                  v-if="form.appoint_data.length !== 0"
                  class="le-goods-table"
                  max-height="368px"
                  row-class-name="le-table-row"
                  :data="form.appoint_data"
                >
                  <el-table-column label="商品">
                    <template slot-scope="scope">
                      <div class="le-table-goods flex align-center">
                        <img :src="scope.row.slideshow && scope.row.slideshow[0]" alt="" />
                        <div class="he-line-2">{{ scope.row.name }}</div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="商品价格" prop="price" width="160"></el-table-column>
                  <el-table-column label="操作" width="80" v-if="!examine">
                    <template slot-scope="scope">
                      <span class="le-button-text" @click="form.appoint_data.splice(scope.$index, 1)">删除</span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div>
                <el-radio v-model="form.appoint_type" :label="3" @change="changeAppoint" :disabled="examine">
                  <span class="le-item-form-text">指定分类可用</span>
                </el-radio>
                <div class="le-des-group" v-if="form.appoint_type === 3">
                  <el-button
                    action="openAvGroup"
                    v-popup.chooseCategory="group.available"
                    title="选择分类"
                    width="801"
                    module="goods"
                    class="le-select-btn"
                    >选择分类
                  </el-button>
                  <span class="le-item-form-prompt">最多添加30个分类</span>
                  <div class="le-form-group">
                    <span class="le-group-item" v-for="(item, index) in group.available.result" :key="index"
                      >{{ item.value }}
                      <he-icon
                        class="le-group-item-delete"
                        @click.native="deleteTag('available', item, index)"
                        size="10px"
                        type="le-icon-fork"
                      ></he-icon>
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <el-radio v-model="form.appoint_type" @change="changeAppoint" :label="4" :disabled="examine"
                  ><span class="le-item-form-text">指定商品不可用</span></el-radio
                >
                <div class="le-des-goods" v-if="form.appoint_type === 4">
                  <el-button @click="getGoods" class="le-select-btn" :disabled="examine">选择商品</el-button>
                  <span class="le-item-form-prompt">最多添加500件商品</span>
                  <goods-select
                    ref="goodsSelect"
                    :is-tips="false"
                    :select-style="{ backgroundColor: '#ffffff' }"
                    v-model="form.appoint_data"
                  >
                  </goods-select>
                  <el-table
                    v-if="form.appoint_data.length > 0"
                    class="le-goods-table"
                    max-height="368px"
                    row-class-name="le-table-row"
                    :data="form.appoint_data"
                  >
                    <el-table-column label="商品">
                      <template slot-scope="scope">
                        <div class="le-table-goods flex align-center">
                          <img :src="scope.row.slideshow && scope.row.slideshow[0]" />
                          <div class="he-line-2">{{ scope.row.name }}</div>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="商品价格" prop="price" width="160"></el-table-column>
                    <el-table-column label="操作" width="80">
                      <template slot-scope="scope">
                        <span class="le-button-text" @click="form.appoint_data.splice(scope.$index, 1)">删除</span>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div>
                <el-radio v-model="form.appoint_type" @change="changeAppoint" :label="5" :disabled="examine"
                  ><span class="le-item-form-text">指定分类不可用</span></el-radio
                >
                <div class="le-des-group" v-if="form.appoint_type === 5">
                  <el-button
                    action="openUnGroup"
                    v-popup.chooseCategory="group.unavailable"
                    title="选择分类"
                    width="801"
                    module="goods"
                    class="le-select-btn"
                    >选择分类
                  </el-button>
                  <span class="le-item-form-prompt">最多添加30个分类</span>
                  <div class="le-form-group">
                    <span class="le-group-item" v-for="(item, index) in group.unavailable.result" :key="index"
                      >{{ item.value }}
                      <he-icon
                        class="le-group-item-delete"
                        @click.native="deleteTag('unavailable', item, index)"
                        size="10px"
                        type="le-icon-fork"
                      ></he-icon>
                    </span>
                  </div>
                </div>
              </div>
            </el-form-item>
          </div>
        </div>
        <div class="le-card">
          <div class="le-card-header flex align-center">
            <span></span>
            <span>发放领取</span>
          </div>
          <div class="le-card-body">
            <el-form-item prop="give_limit">
              <span slot="label" class="le-form-item__label">每人限领</span>
              <el-input
                class="le-form-item-small-input"
                v-model.number="form.give_limit"
                :disabled="examine"
                :maxlength="10"
                @input.native="inputNumberGiveLimit"
              >
                <template slot="append">张</template>
              </el-input>
              <div class="le-item-form-prompt">仅对用户主动领取有效，自动发放不生效，不填写则表明不限制</div>
            </el-form-item>
            <el-form-item>
              <span slot="label" class="le-form-item__label">分享设置</span>
              <el-checkbox v-model="form.enable_share" :true-label="1" :false-label="0" :disabled="examine">
                <span class="le-item-form-text">允许分享给好友领取</span>
              </el-checkbox>
              <div class="le-item-form-prompt">勾选，则优惠券可被分享转发</div>
            </el-form-item>
            <el-form-item prop="register_limit.value">
              <span slot="label" class="le-form-item__label">新客领取</span>
              <el-checkbox v-model="form.register_limit.type" :true-label="1" :false-label="0">
                <span class="le-item-form-text">自动发放给新注册的用户</span>
              </el-checkbox>
              <div class="le-item-form-prompt">勾选，则新用户授权登录后自动发放优惠券</div>
              <el-input
                class="le-form-item-small-input"
                v-model.number="form.register_limit.value"
                :maxlength="10"
                @input.native="inputRegisterLimit"
              >
                <template slot="append">张</template>
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div class="le-card">
          <div class="le-card-header flex align-center">
            <span></span>
            <span>其他设置</span>
          </div>
          <div class="le-card-body">
            <el-form-item prop="expire_remind">
              <span slot="label" class="le-form-item__label">到期提醒</span>
              <span class="le-item-form-text">到期前</span>
              <el-input
                class="le-form-item-small-input"
                v-model.number="form.expire_remind"
                :maxlength="10"
                :disabled="examine"
                @input.native="inputNumberExpireRemind"
              >
                <template slot="append">天</template>
              </el-input>
              <span class="le-item-form-text">提醒</span>
              <div class="le-form-item-expire-remind">
                请确保已经设置定时任务

                <span @click="toSettingPage">设置>基础设置</span>
              </div>
            </el-form-item>
            <el-form-item>
              <span slot="label" class="le-form-item__label">退款设置</span>
              <el-checkbox v-model="form.enable_refund" :true-label="1" :false-label="0" :disabled="examine">
                <span class="le-item-form-text">订单退款成功时优惠券失效</span>
              </el-checkbox>
              <div class="le-item-form-prompt">勾选，则因购买商品而发放的优惠券，在商品退款成功后，优惠券失效</div>
            </el-form-item>
            <el-form-item>
              <span slot="label" class="le-form-item__label">上架状态</span>
              <el-radio-group v-model="form.status" :disabled="examine">
                <el-radio :label="0">暂不上架</el-radio>
                <el-radio :label="1">立即上架</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item prop="content">
              <span slot="label" class="le-form-item__label">使用说明</span>
              <el-input
                type="textarea"
                :rows="8"
                resize="none"
                v-model="form.content"
                placeholder="请输入使用说明"
                :disabled="examine"
              >
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="le-cardpin" v-if="!examine">
      <el-button type="primary" :disabled="loading" @click="submit()">保存</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import goodsSelect from '../../components/goodsSelet/select.vue';

export default {
  components: {
    goodsSelect
  },
  data() {
    const checkTotal = (rule, value, callback) => {
      if (this.$route.query.id) {
        if (value < this.total_num) {
          callback(new Error('发放数量只能增加不能减少，请填写' + this.total_num + '以上的数字'));
        }
      }
      if (value < 1 || value > 10000000) {
        callback(new Error('请输入0~10000000之间的整数'));
      }
      callback();
    };
    const checkTime = (rule, value, callback) => {
      if (value.expire_type === 2) {
        let { begin_time, end_time } = value;
        if (!begin_time && !end_time) {
          callback(new Error('用券时间不能为空'));
        } else if (!begin_time) {
          callback(new Error('开始时间不能为空'));
        } else if (!end_time) {
          callback(new Error('结束时间不能为空'));
        } else if (begin_time > end_time) {
          callback(new Error('开始时间不能小于结束时间'));
        }
      } else {
        let { expire_day } = value;
        if (!expire_day && expire_day !== 0) {
          callback(new Error('用券时间不能为空'));
        }
        if (expire_day > 2000 || expire_day < 1) {
          callback(new Error('请输入1~2000之间的整数'));
        }
      }
      callback();
    };
    const checkMin = (rule, value, callback) => {
      if (value.type === 1) {
        if (!value.price) {
          callback(new Error('门槛金额不能为空'));
        }
        if (value.price <= 0) {
          callback(new Error('请输入0以上的整数或小数'));
        }
        if (Number(value) > 9999999) {
          callback(new Error('最高限制9999999'));
        }
      }
      callback();
    };
    const checkAppointData = (rule, value, callback) => {
      if (this.form.appoint_type !== 1) {
        if (value.length === 0) {
          callback(new Error('适用商品不能为空'));
        }
      }
      callback();
    };
    const checkSubPrice = (rule, value, callback) => {
      if (Number(value) <= 0) {
        callback(new Error('请输入0以上的整数或小数'));
      }
      if (Number(value) > 9999999) {
        callback(new Error('最高限制9999999'));
      }
      callback();
    };
    const checkMinPrice = (rule, value, callback) => {
      let { price, type } = value;
      if (type === 1) {
        if (Number(price) > 9999999) {
          callback(new Error('最高限制9999999'));
        }
      }
      callback();
    };
    const checkGiveLimit = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (value > 100 || value < 1) {
        callback(new Error('请输入1~100之间的整数'));
      }
      callback();
    };
    const checkExpireRemind = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (value > 2000 || value < 1) {
        callback(new Error('请输入1~2000之间的整数'));
      }
      callback();
    };
    const checkRegisterLimit = (rule, value, callback) => {
      if (this.form.register_limit.type === 1) {
        if (value > 100 || value < 1) {
          callback(new Error('请输入1~100之间的整数'));
        }
      }
      callback();
    };
    return {
      total_num: 120,
      loading: true,
      list: [],
      form: {
        name: '', // 优惠券名称
        type: 1,
        content: '使用规则：全部商品\n领取规则：无限制领取', // 适用说明
        give_limit: null, // 每人限领
        sub_price: '', // 优惠金额
        enable_share: 1, // 分享开关 0关 1开
        enable_refund: 1, // 退款失效开关 0关 1开
        expire_remind: null, // 到期提醒
        time: {
          expire_type: 2, // 1领取后N天过期，2指定有效期
          begin_time: null, // expire_type=2 时必填 用券开始时间
          end_time: null, // expire_type=2 时必填 用券开始时间
          expire_day: null // expire_type=1 时必填
        },
        total_num: '', // 发送总量
        appoint_type: 1, // 适用商品类型 1:全场通用 2:指定商品可用 3:指定分类可用 4:指定商品不可用 5:指定分类不可用
        appoint_data: [], // 指定数据
        min: {
          type: 0,
          price: null
        },
        status: 0,
        register_limit: {
          type: 0,
          value: 1
        }
      },
      group: {
        unavailable: {
          cat: [],
          result: []
        },
        available: {
          cat: [],
          result: []
        },
        tree: []
      },
      rules: {
        name: [
          { required: true, message: '请输入优惠券名称', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        total_num: [
          { required: true, message: '请输入发放总量', trigger: 'blur' },
          { validator: checkTotal, trigger: ['change', 'blur'] }
        ],
        time: [{ required: true, validator: checkTime, trigger: ['blur', 'change'] }],
        min: [
          { required: true, validator: checkMin, trigger: ['blur', 'change'] },
          { validator: checkMinPrice, trigger: ['blur', 'change'] }
        ],
        sub_price: [
          { required: true, message: '请输入优惠金额', trigger: 'blur' },
          { validator: checkSubPrice, trigger: ['blur', 'change'] }
        ],
        content: [{ required: true, message: '请输入使用说明', trigger: 'blur' }],
        appoint_data: [{ required: true, validator: checkAppointData, trigger: ['blur'] }],
        give_limit: [{ validator: checkGiveLimit, trigger: ['blur', 'change'] }],
        expire_remind: [{ validator: checkExpireRemind, trigger: ['blur', 'change'] }],
        'register_limit.value': [{ validator: checkRegisterLimit, trigger: ['blur', 'change'] }]
      },
      userContentStr: '使用规则：全部商品\n',
      receiveContentStr: '领取规则：无限制领取'
    };
  },
  async mounted() {
    await this.getGroup();
    if (this.$route.query.id) {
      await this.getDetail(parseInt(this.$route.query.id));
      this.loading = false;
    } else {
      this.loading = false;
    }
  },
  methods: {
    getDetail: function (id) {
      let _this = this;
      return new Promise(function (resolve, reject) {
        _this.$heshop
          .coupon('get', id)
          .then(function (response) {
            let {
              appoint_data_list,
              name,
              expire_type,
              id,
              begin_time,
              give_limit,
              expire_day,
              sub_price,
              appoint_type,
              min_price,
              end_time,
              expire_remind,
              content,
              enable_share,
              enable_refund,
              total_num,
              status,
              register_limit
            } = response;
            if (expire_type === 2) {
              begin_time = parseInt(begin_time + '000');
              end_time = parseInt(end_time + '000');
            }
            let min = {};
            if (Number(min_price) === 0) {
              min = {
                type: 0,
                price: null
              };
            } else {
              min = {
                type: 1,
                price: min_price
              };
            }
            _this.total_num = total_num;
            _this.form = {
              id: parseInt(id),
              name: name,
              time: {
                expire_type,
                begin_time,
                end_time,
                expire_day
              },
              min,
              sub_price,
              appoint_type,
              appoint_data: appoint_data_list,
              give_limit,
              expire_remind,
              content,
              enable_share,
              enable_refund,
              total_num,
              status,
              register_limit: {
                type: register_limit === 0 ? 0 : 1,
                value: register_limit
              }
            };
            if (appoint_type === 3 || appoint_type === 5) {
              let list = _this.group.tree;
              let cat = [];
              list.forEach(function (cat1) {
                cat.push(cat1);
                if (cat1.children) {
                  cat1.children.forEach(cat2 => {
                    cat.push(cat2);
                    if (cat2.children) {
                      cat2.children.forEach(cat3 => {
                        cat.push(cat3);
                      });
                    }
                  });
                }
              });
              if (appoint_type === 3) {
                // 指定分类可用
                for (let j = 0; j < appoint_data_list.length; j++) {
                  for (let i = 0; i < cat.length; i++) {
                    if (appoint_data_list[j].id === cat[i].id) {
                      _this.group.available.result.push(cat[i]);
                    }
                  }
                }
              } else if (appoint_type === 5) {
                // 指定分类不可用
                for (let j = 0; j < appoint_data_list.length; j++) {
                  for (let i = 0; i < cat.length; i++) {
                    if (appoint_data_list[j].id === cat[i].id) {
                      _this.group.unavailable.result.push(cat[i]);
                    }
                  }
                }
              }
            }
            resolve();
          })
          .catch(function (error) {
            reject();
            _this.$message.error(error.data.message);
          });
      });
    },
    getGoods: function () {
      this.$refs.goodsSelect.open();
    },
    validateField: function (prop) {
      this.$refs['form'].clearValidate(prop);
    },
    changeAppoint: function () {
      this.form.appoint_data.splice(0, this.form.appoint_data.length);
    },
    formatSubPrice: function (e) {
      e.target.value = e.target.value.replace(/[^\d.]/g, '');
      e.target.value = e.target.value.replace(/\.{2,}/g, '.');
      e.target.value = e.target.value.replace(/^\./g, '0.');
      e.target.value = e.target.value.replace(/^0[^\.]+/g, '0');
      e.target.value = e.target.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
      this.form.sub_price = e.target.value;
    },
    formatPrice: function (e) {
      e.target.value = e.target.value.replace(/[^\d.]/g, '');
      e.target.value = e.target.value.replace(/\.{2,}/g, '.');
      e.target.value = e.target.value.replace(/^\./g, '0.');
      e.target.value = e.target.value.replace(/^0[^\.]+/g, '0');
      e.target.value = e.target.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
      this.form.min.price = e.target.value;
    },
    inputNumberDay: function (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
      this.form.time.expire_day = e.target.value;
    },
    inputNumberGiveLimit: function (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
      this.form.give_limit = e.target.value;
    },
    inputRegisterLimit: function (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
      this.form.register_limit.value = e.target.value;
    },
    inputNumberExpireRemind: function (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
      this.form.expire_remind = e.target.value;
    },
    inputNumberTotalNum: function (e) {
      e.target.value = e.target.value.replace(/[^\d]/g, '');
      this.form.total_num = e.target.value;
    },
    async getGroup() {
      try {
        let group = await this.$heshop.group('get', {
          include: 'goods'
        });
        this.group.available.cat = group;
        this.group.unavailable.cat = group;
        group = this.$heshop
          .toTree({
            parentKey: 'parent_id',
            idKey: 'id',
            parentId: 0,
            childrenKey: 'children'
          })
          .on(group)
          .get();
        group.forEach(cat1 => {
          cat1.value = cat1.name;
          if (cat1.children) {
            cat1.children.forEach(cat2 => {
              cat2.value = `${cat1.value} > ${cat2.name}`;
              if (cat2.children) {
                cat2.children.forEach(cat3 => {
                  cat3.value = `${cat2.value} > ${cat3.name}`;
                });
              }
            });
          }
        });
        this.group.tree = group;
      } catch (error) {
        this.$message.error(error.data.message);
      }
    },
    openAvGroup: function (object) {
      let list = [];
      for (let i = 0; i < object.result.length; i++) {
        let item = object.result[i];
        if (!item.children) list.push(item);
      }
      this.group.available.result = list;
      this.form.appoint_data = list;
    },
    openUnGroup: function (object) {
      let list = [];
      for (let i = 0; i < object.result.length; i++) {
        let item = object.result[i];
        if (!item.children) list.push(item);
      }
      this.group.unavailable.result = list;
      this.form.appoint_data = list;
    },
    deleteTag: function (key, item, index) {
      this.group[key].result.splice(index, 1);
      this.form.appoint_data = this.group[key].result.map(v => {
        return v.id;
      });
    },
    toSettingPage: function () {
      const newPage = this.$router.resolve({ path: '/setup/index' });
      window.open(newPage.href, '_blank');
    },
    submit: function () {
      let _this = this;
      this.loading = true;
      this.$refs['form'].validate(valid => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(_this.form));
          form.begin_time = form.time.begin_time;
          form.expire_type = form.time.expire_type;
          form.end_time = form.time.end_time;
          form.expire_day = form.time.expire_day;
          for (let key in form) {
            if ((!form[key] || form[key] == '') && form[key] !== 0) delete form[key];
          }
          if (form.expire_type === 2) {
            form.end_time = form.end_time + '';
            form.end_time = parseInt(form.end_time.substring(0, form.end_time.length - 3));
            form.begin_time = form.begin_time + '';
            form.begin_time = parseInt(form.begin_time.substring(0, form.begin_time.length - 3));
          }
          if (form.min.type === 0) {
            form.min_price = 0;
          } else {
            form.min_price = form.min.price;
          }
          if (form.appoint_type !== 1) {
            form.appoint_data = form.appoint_data.map(function (item) {
              return item.id;
            });
          }
          if (form.register_limit.type === 0) {
            form.register_limit = 0;
          } else {
            form.register_limit = Number(form.register_limit.value);
          }
          delete form.time;
          delete form.min;
          if (_this.form.id) {
            _this.$heshop
              .coupon('put', form)
              .then(function () {
                _this.loading = false;
                _this.$router.push({
                  path: '/features/coupon/success',
                  query: {
                    id: _this.$route.query.id,
                    isEdit: 1
                  }
                });
              })
              .catch(function (error) {
                _this.loading = false;
                _this.$message.error(error.data.message);
              });
          } else {
            _this.$heshop
              .coupon('post', form)
              .then(function (response) {
                _this.loading = false;
                _this.$router.push({
                  path: '/features/coupon/success',
                  query: {
                    id: response
                  }
                });
              })
              .catch(function (error) {
                _this.loading = false;
                _this.$message.error(error.data.message);
              });
          }
        } else {
          _this.loading = false;
        }
      });
    }
  },
  computed: {
    isEdit: function () {
      return !!this.$route.query.id;
    },
    examine: function () {
      return !!this.$route.query.examine;
    }
  },
  watch: {
    'form.appoint_type': {
      handler(val) {
        if (this.loading) return;
        this.userContentStr = `使用规格：${
          val === 1
            ? '全部商品\n'
            : val === 2
            ? '指定商品可用\n'
            : val === 3
            ? '指定分类可用\n'
            : val === 4
            ? '指定商品不可用\n'
            : val === 5
            ? '指定分类不可用\n'
            : ''
        }`;
        this.form.content = this.userContentStr + this.receiveContentStr;
      }
    },
    'form.give_limit': {
      handler(val) {
        if (this.loading) return;
        this.receiveContentStr = `领取规则：${val ? '每人限领' + val + '张' : '无限制领取'}`;
        this.form.content = this.userContentStr + this.receiveContentStr;
      }
    }
  }
};
</script>
<style lang="less" scoped="true">
@import './css/detail.less';
</style>
