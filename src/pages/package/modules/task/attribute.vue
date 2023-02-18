<template>
  <control title="任务中心">
    <template slot="content">
      <el-form ref="form" :model="content" @submit.native.prevent label-width="80px" size="small" label-position="left">
        <div class="control-item-title">积分任务</div>
        <taskPopup :visible.sync="dialogVisible" v-model="content.task">
          <div class="control-task" slot="task">
            <div class="control-task_header">
              {{ content.task.name }}送积分
              <i class="le-icon le-icon-cha2 select-photo__close" @click="handleDelete"></i>
            </div>
            <div class="control-task_body">
              <img class="control-task_icon" :src="content.task.icon" />
              <div class="control-task_title">{{ getRemark(content.task) }}</div>
              <div class="control-task_button">去攒积分</div>
              <div class="content-task-mark" @click="dialogVisible = true">
                <div class="content-task-bg"></div>
                <div class="content-task-h3">替换</div>
              </div>
            </div>
          </div>
          <div class="control-task_empty" slot="empty">
            <el-button @click="dialogVisible = true">添加积分任务</el-button>
          </div>
        </taskPopup>
        <div class="tips" style="height: 24px"></div>
        <el-form-item label="任务图标" v-if="content.task.icon">
          <div class="select-photo__item">
            <div class="select-photo__upload">
              <pictureDialog v-model="content.icon">
                <div slot="upload" class="select-cover__60-add">
                  <i class="le-icon le-icon-add select-cover__60-icon"></i>
                </div>
                <div slot="preview" slot-scope="scope" class="select-cover__60-edit">
                  <el-image :src="scope.url" fit="cover"></el-image>
                  <div class="select-cover__60-tips">替换</div>
                </div>
              </pictureDialog>
            </div>
          </div>
          <p class="tips">
            建议尺寸：80px*80px
            <span @click="handleDefault" style="color: #623ceb; font-size: 12px; cursor: pointer">恢复默认</span>
          </p>
        </el-form-item>
        <el-form-item label="按钮文字" v-if="content.task.icon">
          <el-input
            type="text"
            @keyup.native.enter="() => {}"
            placeholder="请输入按钮文字"
            v-model="content.title"
            maxlength="4"
            show-word-limit
          >
          </el-input>
        </el-form-item>
        <el-divider></el-divider>
        <div class="control-item-title" style="color: #595959">积分商品</div>
        <el-radio-group v-model="content.type">
          <el-radio :label="1">手动添加</el-radio>
          <el-radio :label="2">自动获取</el-radio>
        </el-radio-group>
        <div class="empty"></div>
        <goodsTask
          v-if="content.type == 1"
          v-model="content.goods"
          :number="50"
          :limit="50 - content.goods.length"
          @confirm="handleGoodsConfirm"
        ></goodsTask>
        <div v-if="content.type == 2">
          <div class="task-auto-goods">
            <el-form-item label="显示件数">
              <el-input
                type="text"
                @keyup.native.enter="() => {}"
                placeholder="请输入按钮文字"
                v-model="content.auto"
                style="width: 64px; display: inline-block"
                @blur="
                  e => {
                    if (e.target.value > 50) $message.error('最多显示50件商品');
                  }
                "
              >
              </el-input>
              <span style="color: #bfbfbf; font-weight: 400; font-size: 12px; padding-left: 8px">最多显示50件商品</span>
            </el-form-item>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="control-item-title">商品内容</div>
        <el-form-item label="商品名称">
          <convert v-model="content.is_title" on="显示" off="隐藏"></convert>
        </el-form-item>
        <el-form-item label="商品价格">
          <convert v-model="content.is_price" on="显示" off="隐藏"></convert>
        </el-form-item>
        <el-form-item label="购买按钮">
          <convert v-model="content.is_button" on="显示" off="隐藏"></convert>
        </el-form-item>
      </el-form>
    </template>
    <template slot="style">
      <el-form ref="form" :model="facade" @submit.native.prevent label-width="90px" size="mini" label-position="left">
        <div class="control-item-title">积分任务</div>
        <el-form-item label="标题背景颜色" label-width="100px">
          <colour v-model="facade.title_background" colour="#ffb525"></colour>
        </el-form-item>
        <el-form-item label="标题文字颜色" label-width="100px">
          <colour v-model="facade.title_color" colour="#ffffff"></colour>
        </el-form-item>
        <el-form-item label="内容背景颜色" label-width="100px">
          <colour v-model="facade.content_background" colour="#ffffff"></colour>
        </el-form-item>
        <el-form-item label="内容文字颜色" label-width="100px">
          <colour v-model="facade.content_color" colour="#666666"></colour>
        </el-form-item>
        <el-form-item label="按钮背景颜色" label-width="100px">
          <colour v-model="facade.button_background" colour="#ffb525"></colour>
        </el-form-item>
        <el-form-item label="按钮文字颜色" label-width="100px">
          <colour v-model="facade.button_color" colour="#ffffff"></colour>
        </el-form-item>
        <el-divider></el-divider>
        <div class="control-item-title">
          积分商品<br />
          列表样式
        </div>
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
        <el-divider></el-divider>
        <!-- v1.1.5新增背景颜色 -->
        <div class="control-item-title">颜色设置</div>
        <el-form-item label="背景颜色">
          <colour v-model="facade.background_color" colour="#F5F5F5"></colour>
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
import goodsTask from '@/components/goodsTask/select.vue';
import photoSelect from '@/components/photoSelect/select.vue';
import hyperlinkSelect from '@/components/hyperlinkSelect/select.vue';
import colour from '@/components/colour.vue';
import taskPopup from './taskPopup.vue';

export default {
  components: {
    control,
    choice,
    slider,
    colour,
    convert,
    classifySelect,
    goodsTask,
    photoSelect,
    hyperlinkSelect,
    tag,
    taskPopup
  },
  data() {
    return {
      dialogVisible: false,
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
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {
    'content.task.icon'(value) {
      this.content.icon = value;
    }
  },
  methods: {
    getRemark(task) {
      // if (task.keyword == "sustain") {
      //   return task.remark;
      // }
      // // if (task.keyword == "goods" || task.keyword == "order") {
      // //   return task.remark + "\n" + task.prompt;
      // // } else {
      // //   if (task.remark) {
      // //     let data = task.remark.split("，");
      // //     return data[0] + "\n" + data[1];
      // //   }
      // // }
      if (task.remark) {
        let data = task.remark.split('，');
        if (task.keyword == 'signin') {
          return data[0] + '，' + data[1];
        }
        return data[0] + '\n' + data[1];
      }
      return '';
    },
    handleDefault() {
      this.content.icon = this.content.task.icon;
    },
    handleDelete() {
      this.content.task = {};
    },
    handleGoodsConfirm(data) {
      // let goods = this.content.goods || [];
      // goods = JSON.parse(JSON.stringify(goods));
      // goods.push.apply(goods, data);
      // this.content.goods = goods.splice(0, 20);
    }
  }
};
</script>
<style lang="less" scoped>
@import '../attribute.less';

.control-task_empty {
  .el-button {
    width: 100%;
  }
}

.task-auto-goods {
  width: 336px;
  height: 64px;
  background: #f3f5f7;
  border-radius: 4px;
  padding: 16px;
}

.control-task {
  position: relative;
  width: 710px;
  height: 212px;
  transform: scale(0.47);
  transform-origin: 0 0;
  background: #ffffff;

  filter: grayscale(100%);
  -webkit-filter: grayscale(100%);
  -moz-filter: grayscale(100%);
  -ms-filter: grayscale(100%);
  -o-filter: grayscale(100%);
  filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  -webkit-filter: grayscale(1);

  .select-photo__close {
    position: absolute;
    font-size: 32px;
    right: -16px;
    top: -16px;
    color: #b1b1b1;
    width: 32px;
    line-height: 32px;
    height: 32px;
    display: none;
  }

  &:hover .select-photo__close {
    display: block;
  }

  &:hover .content-task-mark {
    display: block;
  }

  .content-task-mark {
    display: none;
    cursor: pointer;
    position: absolute;
    width: 100%;
    height: 64px;
    left: 0;
    bottom: 0;
    z-index: 100;

    .content-task-bg {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.4);
      border-radius: 4px;
      z-index: 101;
    }

    .content-task-h3 {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 102;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #ffffff;
      text-align: center;
      line-height: 64px;
      font-size: 28px;
    }
  }

  &_body {
    position: absolute;
    left: 0;
    top: 72px;
    width: 710px;
    height: 140px;
    background: #ffffff;
    border-radius: 0px 0px 16px 16px;
    border: 1px solid #ffb525;
  }

  &_header {
    position: absolute;
    left: 0;
    top: 0;
    width: 710px;
    height: 72px;
    background: #ffb525;
    border-radius: 16px 16px 0px 0px;
    font-size: 28px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #fffffe;
    line-height: 72px;
    padding-left: 23px;
  }

  &_icon {
    width: 72px;
    height: 72px;
    position: absolute;
    left: 34px;
    top: 34px;
  }

  &_button {
    position: absolute;
    right: 24px;
    top: 42px;
    width: 140px;
    height: 56px;
    background: #ffb525;
    border-radius: 28px;
    font-size: 24px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 56px;
    text-align: center;
  }

  &_title {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    position: absolute;
    top: 38px;
    left: 120px;
    white-space: pre;
    height: 64px;
    line-height: 32px;
    display: table-cell;
    vertical-align: middle;
    width: 400px;
    overflow: hidden;
    word-wrap: break-word;
    text-overflow: ellipsis;
    // white-space: nowrap;
  }

  &_tips {
    font-size: 26px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    line-height: 32px;
    position: absolute;
    top: 70px;
    left: 120px;
  }
}
</style>
