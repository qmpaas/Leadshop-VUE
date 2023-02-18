<script>
import {
  createPromoterLevel,
  getPromoterSetting,
  promoterLevelDetail,
  promoterLevelEdit,
  promoterLevelOption
} from './api';

export default {
  name: 'level-editor',
  data() {
    const number = /(^[\d]|^[1-9][\d]*)($|[\.][\d]{0,2}$)/;
    const checkFirst = (rule, value, callback) => {
      if (!number.test(value)) {
        callback('请输入小数位为两位的数字');
        return;
      }
      value = Number(value);
      if (value > 100) {
        callback('请输入小于100的数字');
        return;
      }
      if (this.level_number >= 2) {
        if (this.level_number === 2) {
          if (value < this.form.second) {
            callback('一级分销佣金需大于等于二级分销佣金');
          }
        }
       if (this.level_number === 3) {
         if (value < this.form.second || value < this.form.third) {
           callback('一级分销佣金需大于等于二级分销佣金和三级分销佣金');
         }
       }
      }

      if (this.form.level > 1) {
        let level = this.form.level;
        // 上一个分销佣金
        const levelList = this.$_.cloneDeep(this.levelList).reverse();
        const item = levelList.find(item => {
          return item.level < level && item.first;
        });
        if (item) {
          // 上一个分销等级的一级佣金
          const first = Number(item.first);
          if (value < first) {
            callback(`一级分销佣金需大于等于【${item.name}】的一级分销佣金${first}%`);
          }
        }
        const nextLevelList = this.$_.cloneDeep(this.levelList);
        const nextItem = nextLevelList.find(item => {
          return item.level > level && item.first;
        });
        if (nextItem) {
          const first = Number(nextItem.first);
          if (value > first) {
            callback(`一级分销佣金需小于等于【${nextItem.name}】的一级分销佣金${first}%`);
          }
        }
      }
      callback();
    };

    const checkSecond = (rule, value, callback) => {
      if (!number.test(value)) {
        callback('请输入小数位为两位的数字');
        return;
      }
      value = Number(value);
      if (value > 100) {
        callback('请输入小于100的数字');
        return;
      }
      if (this.level_number > 2) {
        if (value < this.form.third) {
          callback('二级分销佣金需大于等于三级分销佣金');
        }
      }

      if (value > this.form.first) {
        callback('二级分销佣金需小于等于一级分销佣金');
      }

      callback();
    };

    const checkThird = (rule, value, callback) => {
      if (!number.test(value)) {
        callback('请输入小数位为两位的数字');
        return;
      }
      value = Number(value);
      if (value > 100) {
        callback('请输入小于100的数字');
        return;
      }
      if (value > Number(this.form.second)) {
        callback('三级分销佣金需小于等于二级分销佣金');
      }

      callback();
    };

    const checkUpdateType = (rule, value, callback) => {
      let condition = this.form.condition;
      let array = [];
      array = Object.keys(condition).map(item => {
        return {
          key: item,
          value: condition[item]
        };
      });
      const index = array.findIndex(item => {
        return item.value.checked;
      });
      if (index < 0) {
        callback('条件必须选一个');
      }
      for (let i = 0; i < array.length; i++) {
        if (array[i].value.checked) {
          if (!array[i].value.num) {
            callback('值不能为空');
            return;
          }
        }
      }
      callback();
    };
    return {
      form: {
        name: '',
        level: null,
        first: '', // 一级分销金
        second: '', // 二级分销金
        third: '', // 三级分销金
        update_type: 1, // 1任意条件  2所有
        is_auto: 1, // 0不允许  1允许
        condition: {
          all_children: {
            checked: false,
            num: null
          },
          total_bonus: {
            checked: false,
            num: null
          },
          total_money: {
            checked: false,
            num: null
          }
        }
      },
      levelList: [],
      rules: {
        level: [
          {
            required: true,
            message: '请选择等级'
          }
        ],
        name: [
          {
            required: true,
            message: '请输入等级名称'
          }
        ],
        first: [
          {
            required: true,
            validator: checkFirst,
            trigger: ['blur']
          }
        ],
        second: [
          {
            required: true,
            validator: checkSecond,
            trigger: ['blur']
          }
        ],
        third: [
          {
            required: true,
            validator: checkThird,
            trigger: ['blur']
          }
        ],
        update_type: [
          {
            required: true,
            validator: checkUpdateType,
            trigger: ['change']
          }
        ]
      },
      loading: true,
      disabled: true,
      level_number: 1
    };
  },
  async mounted() {
    // 等级列表
    const site = await getPromoterSetting();
    this.level_number = site.content.level_number;
    const list = await promoterLevelOption();
    this.levelList = list.list;
    const id = this.$route.query.id;
    // 获取分销等级详情
    if (id) {
      this.loading = true;
      const detail = await promoterLevelDetail(id);
      for (let i = 0; i < this.levelList.length; i++) {
        this.levelList[i].disabled = this.levelList[i].level !== detail.level;
      }
      this.form = detail;
    }
    this.loading = false;
    this.disabled = false;
  },
  methods: {
    routerBack() {
      this.$router.back();
    },
    // 保存
    async submit() {
      try {
        await this.$refs['form'].validate();
        this.loading = true;
        const id = this.$route.query.id;
        if (!id) {
          await createPromoterLevel(this.form);
        } else {
          await promoterLevelEdit(id, this.form);
        }
        this.loading = false;
        this.routerBack();
      } catch (e) {
        this.loading = false;
      }
    },
    // 选择等级
    selectionLevel(index, item) {
      if (item.disabled) {
        return;
      }
      this.form.level = index + 1;
      if (index === 0) {
        this.form.is_auto = 0;
        return;
      }
      this.form.is_auto = 1;
    }
  },
  render() {
    const self = this;
    return (
      <div class="le-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>
            <a onClick={this.routerBack}>分销等级</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>{self.$route.query.id ? '编辑' : '添加'}分销商等级</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
          label-width="193px"
          v-loading={self.loading}
          ref="form"
          props={{model: self.form, rules: self.rules}}>
          <div class="le-card le-card-margin">
            <div class="le-card-head flex align-center">
              <span class="le-card-line"/>
              <span>等级信息</span>
            </div>
            <div class="le-card-body">
              <el-form-item label="选择等级" prop="level">
                <div class="flex flex-wrap le-level--box">
                  {self.levelList.map((item, index) => {
                    const level = self.form.level;
                    return (
                      <div
                        onClick={self.selectionLevel.bind(self, index, item)}
                        class={[
                          {
                            active: index + 1 === level,
                            'le-level--disabled': item.disabled
                          },
                          'le-level--selection'
                        ]}
                        key={index}>
                        {item.name}
                      </div>
                    );
                  })}
                </div>
              </el-form-item>
              <el-form-item label="等级名称" prop="name">
                <el-input
                  class="le-small--input"
                  placeholder="请输入等级名称"
                  v-model={self.form.name}
                  maxlength="8"
                  show-word-limit={true}
                />
              </el-form-item>
            </div>
          </div>
          <div class="le-card le-card-margin">
            <div class="le-card-head flex align-center">
              <span class="le-card-line"/>
              <span>等级佣金</span>
            </div>
            <div class="le-card-body">
              <el-form-item label="一级分销佣金" prop="first">
                <el-input
                  class="le-small--input"
                  v-model={self.form.first}
                  nativeOn={{
                    input(e) {
                      e.target.value = e.target.value.replace(/[^\d.]/g, '');
                      e.target.value = e.target.value.replace(/\.{2,}/g, '.');
                      e.target.value = e.target.value.replace(/^\./g, '0.');
                      e.target.value = e.target.value.replace(/^0[^\.]+/g, '0');
                      e.target.value = e.target.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                      e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
                      self.form.first = e.target.value;
                    }
                  }}>
                  <template slot="append">%</template>
                </el-input>
              </el-form-item>
              {
                (() => {
                  if (self.level_number >= 2) {
                    return <el-form-item label="二级分销佣金" prop="second">
                      <el-input
                        class="le-small--input"
                        v-model={self.form.second}
                        nativeOn={{
                          input(e) {
                            e.target.value = e.target.value.replace(/[^\d.]/g, '');
                            e.target.value = e.target.value.replace(/\.{2,}/g, '.');
                            e.target.value = e.target.value.replace(/^\./g, '0.');
                            e.target.value = e.target.value.replace(/^0[^\.]+/g, '0');
                            e.target.value = e.target.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                            e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
                            self.form.second = e.target.value;
                          }
                        }}>
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  }
                })()
              }
              {
                (() => {
                  if (self.level_number === 3) {
                    return <el-form-item label="三级分销佣金" prop="third">
                      <el-input
                        class="le-small--input"
                        v-model={self.form.third}
                        nativeOn={{
                          input(e) {
                            e.target.value = e.target.value.replace(/[^\d.]/g, '');
                            e.target.value = e.target.value.replace(/\.{2,}/g, '.');
                            e.target.value = e.target.value.replace(/^\./g, '0.');
                            e.target.value = e.target.value.replace(/^0[^\.]+/g, '0');
                            e.target.value = e.target.value.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
                            e.target.value = e.target.value.replace(/^(\d+)\.(\d\d).*$/, '$1.$2');
                            self.form.third = e.target.value;
                          }
                        }}>
                        <template slot="append">%</template>
                      </el-input>
                    </el-form-item>
                  }
                })()
              }
            </div>
          </div>
          <div class="le-card le-card-margin">
            <div class="le-card-head flex align-center">
              <span class="le-card-line"/>
              <span>等级升级</span>
            </div>
            <div class="le-card-body">
              <el-form-item label="自动升级">
                <el-radio-group v-model={self.form.is_auto} disabled={self.form.level === 1}>
                  <el-radio label={1}>允许自动升级</el-radio>
                  <el-radio label={0}>禁止自动升级</el-radio>
                </el-radio-group>
                <div class="le-prompt-text">选择允许自动升级后，将在用户的等级中心显示等级的升级条件和佣金比例</div>
              </el-form-item>
              {(() => {
                if (self.form.level !== 1 && self.form.is_auto === 1) {
                  return (
                    <el-form-item label="升级条件" prop="update_type">
                      <el-radio-group v-model={self.form.update_type}>
                        <el-radio label={1}>满足以下任意条件</el-radio>
                        <el-radio label={2}>满足以下全部条件</el-radio>
                      </el-radio-group>
                      <div>
                        <div class="flex" style="margin-top: 15px">
                          <el-checkbox class="le-condition--item" v-model={self.form.condition.total_bonus.checked}>
                            <div class="flex align-center">
                              <span class="le-label">累计佣金</span>
                            </div>
                          </el-checkbox>
                          <div>
                            <el-input
                              class="le-input--200"
                              v-model={self.form.condition.total_bonus.num}
                              disabled={!self.form.condition.total_bonus.checked}>
                              <template slot="append">元</template>
                            </el-input>
                          </div>
                        </div>
                        <div class="flex" style="margin-top: 15px">
                          <el-checkbox class="le-condition--item" v-model={self.form.condition.all_children.checked}>
                            <div class="flex align-center">
                              <span class="le-label">当前下线数</span>
                            </div>
                          </el-checkbox>
                          <div>
                            <el-input
                              class="le-input--200"
                              v-model={self.form.condition.all_children.num}
                              disabled={!self.form.condition.all_children.checked}>
                              <template slot="append">人</template>
                            </el-input>
                          </div>
                        </div>
                        <div class="flex" style="margin-top: 15px">
                          <el-checkbox class="le-condition--item" v-model={self.form.condition.total_money.checked}>
                            <div class="flex align-center">
                              <span class="le-label">累计销售金额</span>
                            </div>
                          </el-checkbox>
                          <div>
                            <el-input
                              class="le-input--200"
                              v-model={self.form.condition.total_money.num}
                              disabled={!self.form.condition.total_money.checked}>
                              <template slot="append">元</template>
                            </el-input>
                          </div>
                        </div>
                      </div>
                    </el-form-item>
                  );
                }
              })()}
            </div>
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

.le-level--box {
  width: 450px;
}

.le-level--selection:extend(.font-family-yahei) {
  width: 80px;
  height: 32px;
  line-height: 30px;
  text-align: center;
  background: #ffffff;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 400;
  color: #595959;
  margin: 0 8px 8px 0;

  &.active {
    background-color: #623ceb;
    color: #ffffff;
  }
}

.le-level--disabled {
  background: #f3f5f7;
  color: #8c8c8c;
  border: none;
}

.le-small--input {
  width: 240px;

  ::v-deep.el-input-group__append {
    padding: 0 17px;
  }
}

.le-condition--item {
  margin-rigt: 15px;

  .le-label {
    color: #595959 !important;
    margin-right: 15px;
  }

  .el-input {
    width: 200px;

    ::v-deep.el-input-group__append {
      padding: 0 17px;
    }
  }
}
</style>
