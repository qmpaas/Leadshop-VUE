<template>
  <control title="商品">
    <template slot="content">
      <el-form ref="form" :model="content" @submit.native.prevent label-width="80px" size="small" label-position="left">
        <div class="select-frame">
          <div class="select-frame__item">
            <photoSelect v-model="demo11"></photoSelect>
          </div>
          <el-form-item label="链接" label-width="50px">
            <hyperlinkSelect v-model="demo11">请选择跳转链接</hyperlinkSelect>
          </el-form-item>
        </div>
        <div class="select-photo">
          <el-form-item label="图标" label-width="50px">
            <div class="select-photo__item">
              <photoSelect v-model="demo11"></photoSelect>
            </div>
            <div class="select-photo__item">
              <photoSelect v-model="demo11"></photoSelect>
            </div>
          </el-form-item>
          <el-form-item label="名称" label-width="50px">
            <el-input
              type="text"
              @keyup.native.enter
              placeholder="输入名称"
              v-model="content.text"
              maxlength="4"
              show-word-limit
            >
            </el-input>
          </el-form-item>
          <el-form-item label="链接" label-width="50px">
            <hyperlinkSelect v-model="demo11">请选择跳转链接</hyperlinkSelect>
          </el-form-item>
        </div>
        <div class="select-cover">
          <div class="select-cover__item">
            <photoSelect></photoSelect>
          </div>
          <div class="select-cover__detail">
            <p>图片广告1</p>
            <el-form-item label="链接" label-width="40px">
              <hyperlinkSelect v-model="demo11">请选择跳转链接</hyperlinkSelect>
            </el-form-item>
          </div>
        </div>
        <div class="select-cover">
          <div class="select-cover__item">
            <photoSelect v-model="demo11"></photoSelect>
          </div>
          <div class="select-cover__detail">
            <el-form-item label="标题" label-width="40px">
              <el-input type="text" @keyup.native.enter placeholder="请输入标题" v-model="content.text" maxlength="10">
              </el-input>
            </el-form-item>
            <el-form-item label="链接" label-width="40px">
              <hyperlinkSelect v-model="demo11">请选择跳转链接</hyperlinkSelect>
            </el-form-item>
          </div>
        </div>
        <goodsSelet> </goodsSelet>
        <classifySelect> </classifySelect>
        <el-divider></el-divider>
        <div class="control-item-title">商品内容</div>
        <el-form-item label="商品名称">
          <convert v-model="content.is_title" on="显示" off="隐藏"></convert>
        </el-form-item>
        <el-form-item label="商品价格">
          <convert v-model="content.is_price" on="显示" off="隐藏"></convert>
        </el-form-item>
        <el-form-item label="商品按钮">
          <convert v-model="content.is_button" on="显示" off="隐藏"></convert>
        </el-form-item>
      </el-form>
    </template>
    <template slot="style">
      <el-form ref="form" :model="facade" @submit.native.prevent label-width="90px" size="mini" label-position="left">
        <div class="control-item-title">列表样式</div>
        <choice :data="listData" width="112px" group="list_style" v-model="facade.list_style"></choice>
        <el-divider></el-divider>
        <div class="control-item-title">卡片样式</div>
        <el-radio-group v-model="facade.card_style">
          <el-radio :label="1">无边白底</el-radio>
          <el-radio :label="2">卡片投影</el-radio>
          <el-radio :label="3">描边白底</el-radio>
          <el-radio :label="4">无边透明底</el-radio>
        </el-radio-group>
        <el-divider></el-divider>
        <div class="control-item-title">卡片倒角</div>
        <choice :data="cardData" group="chamfer_style" v-model="facade.chamfer_style"></choice>
        <el-divider></el-divider>
        <div class="control-item-title">距离设置</div>
        <el-form-item label="商品间距">
          <slider v-model="facade.margin" :min="0" :max="30"></slider>
        </el-form-item>
        <el-form-item label="左右边距">
          <slider v-model="facade.padding" :min="0" :max="30"></slider>
        </el-form-item>
      </el-form>
    </template>
  </control>
</template>
<script type="text/javascript">
import control from '@/components/control.vue';
import choice from '@/components/choice.vue';
import slider from '@/components/slider.vue';
import convert from '@/components/convert.vue';
import tag from '@/components/tag.vue';
import classifySelect from '@/components/classifySelect/select.vue';
import goodsSelet from '@/components/goodsSelet/select.vue';
import photoSelect from '@/components/photoSelect/select.vue';
import hyperlinkSelect from '../../../../components/hyperlinkSelect/select.vue';

export default {
  components: {
    control,
    choice,
    slider,
    convert,
    classifySelect,
    goodsSelet,
    photoSelect,
    hyperlinkSelect,
    tag
  },
  data() {
    return {
      demo11: '',
      listData: [
        {
          value: 1,
          icon: 'le-icon-graphic-figure',
          name: '大图模式'
        },
        {
          value: 2,
          icon: 'le-icon-graphic-columns',
          name: '一行两个'
        },
        {
          value: 3,
          icon: 'le-icon-graphic-list',
          name: '列表模式'
        },
        {
          value: 4,
          icon: 'le-icon-graphic-sliding',
          name: '横向滑动'
        }
      ],
      cardData: [
        {
          value: 0,
          icon: 'le-icon-graphic-angle',
          name: '直角'
        },
        {
          value: 1,
          icon: 'le-icon-rounded-line',
          name: '圆角'
        }
      ]
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
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
  }
};
</script>
<style lang="less" scoped>
@import '../attribute.less';
</style>
