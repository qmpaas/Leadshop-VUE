<template>
  <control title="微信直播">
    <div class="empty"></div>
    <template slot="content">
      <el-form ref="form" :model="content" @submit.native.prevent label-width="73px" size="mini" label-position="left">
        <div class="control-item-title">添加直播间</div>
        <el-form-item label="直播间数量" label-width="100px">
          <el-input v-model.number="liveNUmber"></el-input>
          <div class="tips">最多添加10个直播间</div>
        </el-form-item>
        <el-divider></el-divider>
        <div class="control-item-title">商品内容</div>
        <el-form-item label="商品">
          <convert v-model="content.isShowGoods" on="显示" off="隐藏"></convert>
        </el-form-item>
        <el-divider></el-divider>
        <div class="control-item-title">查看更多</div>
        <el-form-item label="按钮显示">
          <convert v-model="content.more.isShow" on="显示" off="隐藏"></convert>
        </el-form-item>
        <el-form-item label="按钮文字">
          <el-input v-model="content.more.text" maxlength="4" show-word-limit></el-input>
        </el-form-item>
        <el-form-item label="按钮颜色">
          <colour v-model="content.more.color" colour="#999999"></colour>
        </el-form-item>
      </el-form>
    </template>
    <template slot="style">
      <el-form ref="form" :model="facade" @submit.native.prevent label-width="90px" size="mini" label-position="left">
        <div class="control-item-title">列表样式</div>
        <choice :data="listData" width="112px" group="list_style" v-model="facade.list_style"></choice>
        <el-divider></el-divider>
        <div class="control-item-title">距离设置</div>
        <el-form-item label="卡片间距">
          <slider v-model="facade.cardSpacing" :min="0" :max="30"></slider>
        </el-form-item>
        <el-form-item label="左右边距">
          <slider v-model="facade.leftRightMargins" :min="0" :max="30"></slider>
        </el-form-item>
        <el-divider></el-divider>
        <div class="control-item-title">颜色设置</div>
        <el-form-item label="背景颜色">
          <colour v-model="facade.background_color" colour="#f5f5f5"></colour>
        </el-form-item>
      </el-form>
    </template>
  </control>
</template>

<script type="text/javascript">
import control from '@/components/control.vue';
import colour from '@/components/colour.vue';
import choice from '@/components/choice.vue';
import slider from '@/components/slider.vue';
import convert from '@/components/convert.vue';

export default {
  components: {
    control,
    colour,
    choice,
    slider,
    convert
  },
  data() {
    return {
      listData: [
        {
          value: 1,
          icon: 'le-icon-graphic-figure',
          name: '一行一个'
        },
        {
          value: 2,
          icon: 'le-icon-graphic-columns',
          name: '一行两个'
        },
        {
          value: 3,
          icon: 'le-icon-zuotuyouzi',
          name: '左图右字'
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
    },
    liveNUmber: {
      get() {
        let value = this.content.number;
        if (value <= 1) {
          return 1;
        } else if (value >= 10) {
          return 10;
        } else {
          return value;
        }
      },
      set(val) {
        if (!val) val = 1;
        if (val >= 10) val = 10;
        this.content.number = val;
      }
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
