<template>
  <control title="优惠券">
    <h4>风格选择</h4>
    <choose :data="styleData" v-model="content.style" width="342px" height="86px"></choose>
    <div class="empty"></div>
    <template slot="content">
      <el-form ref="form" :model="content" @submit.native.prevent label-width="90px" size="mini" label-position="left">
        <div class="control-item-title">添加优惠券</div>
        <el-radio-group class="le-radio-group" v-model="content.autoplay">
          <el-radio :label="0">手动添加</el-radio>
          <el-radio :label="1">自动获取</el-radio>
        </el-radio-group>
        <template v-if="content.autoplay === 0">
          <dragrank v-model="content.data" :edit="false" title-key="name"></dragrank>
          <div class="button-adddata">
            <coupon-select :limit="10" v-model="content.data">
              <el-button :disabled="content.data.length == 10">添加优惠券</el-button>
            </coupon-select>
            <p class="tips">最多添加10张优惠券，拖拽可改变顺序</p>
          </div>
        </template>
        <template v-else>
          <div class="le-coupon-num">
            <div class="control-item-title">优惠券数</div>
            <el-input
              v-model.number="content.number"
              :maxlength="2"
              @input="inputNumber"
              placeholder="请输入10以内的整数"
            ></el-input>
          </div>
        </template>
      </el-form>
    </template>
    <template slot="style">
      <el-form ref="form" :model="facade" @submit.native.prevent label-width="90px" size="mini" label-position="left">
        <div class="control-item-title">列表样式</div>
        <choice :data="listData" width="80px" group="list_style" v-model="facade.list_style"></choice>
        <el-divider></el-divider>
        <div class="control-item-title">颜色设置</div>
        <el-form-item label="背景颜色">
          <colour v-model="facade.background_color" colour="#fff5e1"></colour>
        </el-form-item>
        <el-form-item label="文字颜色">
          <colour v-model="facade.title_color" colour="#ff830b"></colour>
        </el-form-item>
      </el-form>
    </template>
  </control>
</template>
<script type="text/javascript">
import control from '@/components/control.vue';
import choose from '@/components/choose.vue';
import colour from '@/components/colour.vue';
import choice from '@/components/choice.vue';
import dragrank from '@/components/dragrank.vue';
import couponSelect from '@/components/couponSelect/select.vue';

export default {
  components: {
    control,
    choose,
    colour,
    choice,
    dragrank,
    couponSelect
  },
  data() {
    return {
      styleData: [
        {
          value: 1,
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/coupon-style-1.png'
        },
        {
          value: 2,
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/coupon-style-2.png'
        },
        {
          value: 3,
          src: 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/coupon-style-3.png'
        }
      ],
      listData: [
        {
          value: 1,
          name: '一行一个'
        },
        {
          value: 2,
          name: '一行两个'
        },
        {
          value: 3,
          name: '横向滑动'
        }
      ]
    };
  },
  computed: {
    content: {
      get() {
        return this.$store.getters.content;
      },
      set(value) {
        let data = {
          key: 'content',
          value: value
        };
        this.$store.commit('finish/setAttribute', data);
      }
    },
    facade: {
      get() {
        return this.$store.getters.facade;
      },
      set(value) {
        let data = {
          key: 'facade',
          value: value
        };
        this.$store.commit('finish/setAttribute', data);
      }
    }
  },
  methods: {
    inputNumber: function (val) {
      val = val.replace(/[^0-9]/g, '');
      if (!val) {
      } else {
        val = parseInt(val);
        if (val > 10) {
          val = 10;
        }
      }
      this.content.number = val;
    }
  }
};
</script>
<style lang="less" scoped>
@import '../attribute.less';

.le-switch {
  margin-left: 62px;
}

.le-icon-zhushi {
  color: #bbbfc8;
}

.le-radio-group {
  margin-bottom: 17px;
}

.le-coupon-num {
  width: 336px;
  height: 92px;
  background: #f3f5f7;
  border-radius: 4px;
  padding: 0 16px;
}
</style>
