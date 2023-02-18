<template>
  <div>
    <el-form v-loading="loading" ref="form" class="le-main le-card" :rules="rules" :model="form" label-width="217px">
      <el-form-item label="选择商品" class="le-search--id" prop="goods">
        <el-button plain @click="getGoodDetail" :disabled="Object.keys(form.goods).length > 0">选择商品</el-button>
        <goods-select
          ref="goodsSelect"
          :is-tips="false"
          :select-style="{ backgroundColor: '#ffffff' }"
          v-model="form.goods"
          @confirm="confirmGoods"
        >
        </goods-select>
        <div class="flex le-goods" v-if="Object.keys(form.goods).length > 0">
          <el-image class="le-goods--image" :src="form.goods.slideshow[0]"></el-image>
          <div class="le-goods--name flex-sub">
            {{ form.goods.name }}
          </div>
          <el-button type="text" @click="form.goods = {}" v-if="!disabledEdit">移除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="商品名称" prop="goods_name">
        <el-input
          :disabled="disabledEdit"
          v-model="form.goods_name"
          maxlength="14"
          show-word-limit
          placeholder="请输入商品名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品封面" prop="pic_url">
        <div class="select-cover__120" :class="[disabledEdit ? 'le-still' : '']">
          <pictureDialog v-model="form.pic_url" :disabled="disabledEdit" :limit="1">
            <div slot="upload" class="select-cover__120-add">
              <i class="le-icon le-icon-add select-cover__120-icon"></i>
              <span class="select-cover__120-text">添加图片</span>
            </div>
            <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
              <el-image :src="scope.url" fit="cover"></el-image>
              <div class="select-cover__120-tips" v-if="!disabledEdit">
                <span>替换</span> |
                <span @click.stop="e => (form.pic_url = '')">删除</span>
              </div>
            </div>
          </pictureDialog>
        </div>
        <div class="le-prompt-text">建议尺寸：300像素 * 300像素，图片大小不得超过1M</div>
      </el-form-item>
      <el-form-item label="商品价格" prop="price_type">
        <el-radio-group v-model="form.price_type" @change="priceTypeChange">
          <el-radio :label="1">一口价</el-radio>
          <el-radio :label="2">价格区间</el-radio>
          <el-radio :label="3">折扣价</el-radio>
        </el-radio-group>
        <div v-if="form.price_type === 1">
          <el-input @input="formatNum(form.price, 'price')" v-model="form.price">
            <template slot="append">元</template>
          </el-input>
        </div>
        <div v-else-if="form.price_type === 2" class="le-small-input">
          <el-input @input="formatNum(form.price, 'price')" v-model="form.price">
            <template slot="append">元</template>
          </el-input>
          <span>至</span>
          <el-input @input="formatNum(form.price2, 'price2')" v-model="form.price2">
            <template slot="append">元</template>
          </el-input>
        </div>
        <div v-else-if="form.price_type === 3" class="le-small-input">
          <span>原价</span>
          <el-input @input="formatNum(form.price, 'price')" v-model="form.price">
            <template slot="append">元</template>
          </el-input>
          <span>现价</span>
          <el-input @input="formatNum(form.price2, 'price2')" v-model="form.price2">
            <template slot="append">元</template>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
    <div class="le-cardpin">
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script type="text/javascript">
import goodsSelect from '../../components/goodsSelet/index.vue';

export default {
  components: {
    goodsSelect
  },
  data() {
    const checkGoodsId = (rule, value, callback) => {
      if (isNaN(value)) {
        callback('请输入正整数');
      }
      callback();
    };
    const checkPrice = (rule, value, callback) => {
      if (value === 1) {
        if (!this.form.price) {
          callback('请输入商品价格');
        }
      } else if (value === 2) {
        if (!this.form.price || !this.form.price2) {
          callback('请输入商品价格');
        }
        if (this.form.price > this.form.price2) {
          callback('请正确书写价格区间');
        }
      } else if (value === 3) {
        if (!this.form.price || !this.form.price2) {
          callback('请输入商品价格');
        }
      }
      callback();
    };
    const checkGoodsName = (rule, value, callback) => {
      if (value.length > 14) {
        callback('商品名称最大为14字符');
      }
      callback();
    };

    const checkGoods = (rule, value, callback) => {
      if (!value || Object.keys(value).length === 0) {
        callback('请选择商品');
      }
      callback();
    };
    return {
      is_show: null,
      form: {
        my_goods_id: null,
        goods_name: '',
        pic_url: '',
        price_type: 1,
        price: '',
        price2: '',
        page_url: '',
        goods: {}
      },
      rules: {
        my_goods_id: [{ validator: checkGoodsId, trigger: 'blur' }],
        price_type: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
          { validator: checkPrice, trigger: 'blur' }
        ],
        pic_url: [{ required: true, message: '请添加商品封面', trigger: 'blur' }],
        goods_name: [
          { required: true, message: '请添加商品名称', trigger: 'blur' },
          { validator: checkGoodsName, trigger: 'blur' }
        ],
        goods: [{ required: true, validator: checkGoods, trigger: 'blur' }]
      },
      loading: false
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    disabledEdit() {
      return this.$route.query.status && this.$route.query.status === '2';
    }
  },
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
    const { goodsId } = this.$route.query;
    if (goodsId) {
      const storage = JSON.parse(localStorage.getItem('editLiveGood'));
      this.form = storage;
      if (!storage.is_show) this.is_show = true;
      this.form = {
        my_goods_id: null,
        goods_name: storage.name,
        pic_url: storage.cover_img_base64,
        price_type: storage.price_type,
        price: storage.price,
        price2: storage.price2,
        page_url: storage.new_url,
        goods_id: storage.goods_id,
        goods: storage.goods ? storage.goods : {}
      };
    }
  },
  methods: {
    priceTypeChange() {
      this.form.price = '';
      this.form.price2 = '';
      this.$refs['form'].clearValidate('price_type');
    },
    // 获取商品图片和名字
    getGoodDetail() {
      this.$refs.goodsSelect.handleClick();
      // this.$refs["form"].clearValidate();
      // this.loading = true;
      // this.$heshop.goods('get', parseInt(this.form.my_goods_id)).then(response => {
      //   this.form.pic_url = response.slideshow[0];
      //   this.form.goods_name = response.name;
      //   this.form.page_url = this.form.my_goods_id;
      //   if (response.name.length > 14) {
      //     this.$refs['form'].validateField('goods_name');
      //   }
      //   this.loading = false;
      // }).catch(error => {
      //   this.loading = false;
      //   this.$heshop.error(error.data.message);
      // });
    },
    submit() {
      this.$refs['form'].clearValidate();
      this.$refs['form'].validate(valid => {
        if (valid) {
          this.loading = true;
          const form = JSON.parse(JSON.stringify(this.form));
          form.page_url = form.goods.id;
          delete form.my_goods_id;
          delete form.goods;
          this.$heshop
            .livegoods('post', form)
            .then(() => {
              this.loading = false;
              this.$router.back();
            })
            .catch(error => {
              this.loading = false;
              this.$message.error(error.data.message);
            });
        }
      });
    },
    formatNum(val, key) {
      let temp = val.toString();
      temp = temp.replace(/。/g, '.');
      temp = temp.replace(/[^\d.]/g, ''); //清除"数字"和"."以外的字符
      temp = temp.replace(/^\./g, ''); //验证第一个字符是数字
      temp = temp.replace(/\.{2,}/g, ''); //只保留第一个, 清除多余的
      temp = temp.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.');
      temp = temp.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3'); //只能输入两个小数
      this.form[key] = temp;
    },
    confirmGoods(val) {
      this.form.goods_name = val.name;
    }
  }
};
</script>

<style lang="less" scoped="true">
@import './../index.less';

.le-main {
  padding-top: 40px;
}

.el-radio-group {
  margin-bottom: 5px;
}

.le-search--id::v-deep {
  .el-input-group__append {
    padding: 0 10px;
  }
}

.le-still ::v-deep {
  .select-cover__120-edit {
    cursor: not-allowed !important;
  }
}

.le-small-input::v-deep {
  .el-input {
    width: 150px;
  }

  > span {
    display: inline-block;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #595959;
    padding: 0 9px;
  }
}

.le-goods {
  width: 580px;
  height: 72px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  margin-top: 15px;
  padding: 12px 24px;
}

.le-goods--image {
  width: 48px;
  height: 48px;
}

.le-goods--name {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  line-height: 24px;
  height: 48px;
  margin-left: 24px;
  margin-right: 20px;
}

::v-deep .el-button[disabled] {
  color: #bfbfbf !important;
  border: 1px solid #dcdfe6 !important;
}
</style>
