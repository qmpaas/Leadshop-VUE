<template>
  <div class="le-matter">
    <el-breadcrumb class="he-link-text" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>
        <he-link href="plugins/features">营销玩法</he-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item class="he-link">
        <he-link href="features/coupon/index">优惠券管理</he-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item> 发放优惠券</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form label-width="193px" ref="form" class="le-send" :rules="rules" :model="form" v-loading="loading">
      <div class="le-card">
        <div class="le-card-header flex align-center">
          <span></span>
          <span>基本信息</span>
        </div>
        <div class="le-card-body">
          <el-form-item>
            <span slot="label" class="le-form-item__label">优惠券名称</span>
            <span class="le-form-item__text">{{ detail.name }}</span>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">剩余发放总量</span>
            <span class="le-form-item__text">{{ detail.over_num }}张</span>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">用券时间</span>
            <span class="le-form-item__text" v-if="detail.expire_type === 1"
              >领券当日起{{ detail.expire_day }}天可用</span
            >
            <span class="le-form-item__text" v-else-if="detail.expire_type === 2"
              >{{ detail.begin_time | timeFormat('yyyy-mm-dd hh:MM:ss') }}~{{
                detail.end_time | timeFormat('yyyy-mm-dd hh:MM:ss')
              }}</span
            >
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">门槛金额</span>
            <span class="le-form-item__text">{{
              detail.min_price === 0 || detail.min_price === null ? '无门槛' : detail.min_price + '元'
            }}</span>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">优惠金额</span>
            <span class="le-form-item__text">{{ detail.sub_price }}元</span>
          </el-form-item>
        </div>
      </div>
      <div class="le-card">
        <div class="le-card-header flex align-center">
          <span></span>
          <span>发放优惠券</span>
        </div>
        <div class="le-card-body">
          <el-form-item prop="coupon_list[0].num">
            <span slot="label" class="le-form-item__label">每人发放</span>
            <el-input
              class="le-form-item-small-input"
              v-model.number="form.coupon_list[0].num"
              :maxlength="6"
              @input.native="formatNum"
            >
              <template slot="append">张</template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">指定用户发放</span>
            <el-button
              class="le-btn"
              width="577"
              title="选择用户"
              module="users"
              v-popup.chooseUser="{ item: form.user_list }"
              action="chooseUser"
              >选择用户
            </el-button>
            <el-table
              v-if="form.user_list.length"
              :data="form.user_list"
              class="le-users-table"
              max-height="368px"
              row-class-name="le-table-row"
            >
              <el-table-column label="用户ID" width="120" prop="id"></el-table-column>
              <el-table-column label="用户昵称" prop="nickname">
                <template slot-scope="scope">
                  <he-icon size="18px" v-if="scope.row.oauth.type === 'weapp'" type="le-icon-xiaochengxu"></he-icon>
                  <he-icon size="18px" v-else-if="scope.row.oauth.type === 'wechat'" type="le-icon-wehcat"></he-icon>
                  {{ scope.row.nickname }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="160">
                <template slot-scope="scope">
                  <span class="le-button-text" @click="form.user_list.splice(scope.$index, 1)">移除</span>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
          <el-form-item>
            <span slot="label" class="le-form-item__label">指定用户标签发放</span>
            <el-button
              class="le-btn"
              action="setLabel"
              module="users"
              title="选择用户标签"
              width="704"
              v-popup.chooseLabel="{ label: form.label_list }"
              >选择用户标签
            </el-button>
            <div class="le-user-label flex flex-wrap">
              <div class="le-tag" v-for="(item, index) in form.label_list" :key="index">
                <span>{{ item.name }}</span>
                <i class="el-tag__close el-icon-close" @click.stop="delLabel(item, index)"></i>
              </div>
            </div>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <div class="le-cardpin" v-if="!disable">
      <el-button type="primary" :disabled="loading" :loading="loading" @click="submit()">提交</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'send',
  data() {
    return {
      loading: true,
      disable: false,
      form: {
        num: 1,
        user_list: [],
        label_list: [],
        coupon_list: [
          {
            num: 1,
            id: parseInt(this.$route.query.id)
          }
        ]
      },
      detail: {
        name: '优惠券名称',
        over_num: 1,
        begin_time: null,
        give_limit: null,
        sub_price: 0
      },
      rules: {
        'coupon_list[0].num': [
          {
            required: true,
            message: '请输入每人发放张数',
            trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    router: function (path) {
      this.$router.replace({
        path: path
      });
    },
    chooseUser: function (e) {
      this.form.user_list = e.item;
    },
    setLabel: function (data) {
      this.form.label_list = data.label;
    },
    delLabel: function (item, index) {
      this.$delete(this.form.label_list, index);
    },
    submit: function () {
      let _this = this;
      _this.loading = true;
      _this.$refs['form'].validate(valid => {
        if (valid) {
          let form = JSON.parse(JSON.stringify(_this.form));
          form.label_list = form.label_list.map(function (item) {
            return item.id;
          });
          form.user_list = form.user_list.map(function (item) {
            return item.id;
          });
          _this.$heshop
            .coupon(
              'post',
              {
                behavior: 'send'
              },
              form
            )
            .then(function (response) {
              setTimeout(function () {
                _this.detail.over_num = _this.detail.over_num - response[0].length;
                _this.$message.success('发放成功');
                _this.loading = false;
              }, 3000);
            })
            .catch(function (error) {
              _this.loading = false;
              if (error.status === 403) {
                const h = _this.$createElement;
                let arr = error.data.message.split('---------');
                let str = '';
                if (arr.length > 1) {
                  str = arr[1];
                } else {
                  str = arr[0];
                }
                _this.$confirm('提示', {
                  confirmButtonText: '我知道了',
                  showCancelButton: false,
                  message: h('div', null, [
                    h(
                      'p',
                      {
                        class: 'le-text-algin le-confirm-line'
                      },
                      [
                        h('span', {
                          class: 'el-icon-warning le-warning-icon'
                        }),
                        h(
                          'span',
                          {
                            class: 'le-confirm-title'
                          },
                          '发放失败'
                        )
                      ]
                    ),
                    h(
                      'p',
                      {
                        class: 'le-text-algin le-confirm-tip'
                      },
                      str
                    )
                  ])
                });
              } else {
                _this.$message.error(error.data.message);
              }
            });
        } else {
          this.loading = false;
        }
      });
    },
    getDetail: function () {
      let _this = this;
      this.$heshop
        .coupon('get', parseInt(this.$route.query.id))
        .then(function (response) {
          _this.loading = false;
          if (response.status === 0) {
            _this.disable = true;
            _this.$message.error('优惠券已下架');
          } else if (response.status === 2) {
            _this.disable = true;
            _this.$message.error('优惠券已失效');
          }
          _this.detail = response;
        })
        .catch(function (error) {
          _this.loading = false;
          _this.$message.error(error.data.message);
        });
    },
    formatNum: function (e) {
      e.target.value = e.target.value.replace(/[^\d.]/g, '');
      e.target.value = e.target.value.replace(/^0[^\.]+/g, '0');
    }
  },
  mounted() {
    this.getDetail();
  }
};
</script>

<style scoped lang="scss">
@import './css/send.less';
</style>
