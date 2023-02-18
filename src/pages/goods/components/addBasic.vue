<template>
  <div>
    <el-form-item class="le-basic__name">
      <span class="le-label__require" slot="label">商品名称</span>
      <el-input
        type="textarea"
        placeholder="请输入商品名称"
        v-model="value.name"
        rows="3"
        maxlength="40"
        show-word-limit
      >
      </el-input>
    </el-form-item>
    <!-- 商品副标题 -->
    <el-form-item label="商品副标题">
      <el-input
        type="textarea"
        placeholder="请输入商品副标题"
        v-model="value.body.goods_introduce"
        rows="5"
        :maxlength="60"
        show-word-limit
        resize="none"
      />
      <el-popover placement="right" trigger="hover">
        <img src="./../image/goods-introduce-example.png" width="225" height="400" alt="" />
        <el-button slot="reference" type="text" class="le-introduce--btn">查看示例</el-button>
      </el-popover>
    </el-form-item>
    <el-form-item class="he-class">
      <span class="le-label__require" slot="label">商品分类</span>
      <template v-for="(item, index) in catObject.result">
        <el-tag
          type="info"
          class="le-cat__footer-tag"
          size="medium"
          closable
          @close="deleteTag(item, index)"
          :key="index"
          v-if="!item.children"
        >
          {{ item.value }}
        </el-tag>
      </template>
      <el-button plain action="getGroup" v-popup.chooseCategory="catObject" title="选择分类" width="801" module="goods"
        >选择分类
      </el-button>
      <he-link href="goods/groupPublish" target="_blank">
        <el-button type="text" class="he-class__button-new"> 新建分类 </el-button>
      </he-link>
      <span style="color: #623ceb">|</span>
      <el-button type="text" @click="getGroupList" class="he-class__button-new"> 刷新 </el-button>
    </el-form-item>
    <el-form-item label="商品参数">
      <el-scrollbar ref="myScrollbar" class="le-parameter" v-if="!$_.isEmpty(value.body.goods_args)">
        <div class="le-parameter--item" :key="index" v-for="(item, index) in value.body.goods_args">
          <el-form-item label="参数名" label-width="82px">
            <el-input
              maxlength="8"
              show-word-limit
              v-model="item.name"
              class="le-input--240"
              placeholder="请输入参数名"
            />
            <div class="le-prompt-text">示例：语言种类</div>
          </el-form-item>
          <el-form-item label="参数值" label-width="82px">
            <el-input
              v-model="item.value"
              resize="none"
              rows="5"
              type="textarea"
              class="le-input--600"
              placeholder="请输入参数名"
            />
            <div class="le-prompt-text">建议参数值之间用“；”隔开，示例：汉语；英语；法语；德语</div>
          </el-form-item>
          <div class="le-deletion le-icon le-icon-cha2" @click="deletionParameter(index)" />
        </div>
      </el-scrollbar>
      <div>
        <el-button plain @click="pushParameter">添加参数</el-button>
        <el-button
          plain
          width="704"
          action="getArgs"
          v-popup.chooseParameterTemplate="args"
          title="选择参数模板"
          module="goods"
          >选择参数模板</el-button
        >
        <he-link href="goods/parameterTemplateEdit" target="_blank">
          <el-button type="text" class="he-class__button-new"> 新建模板 </el-button>
        </he-link>
      </div>
    </el-form-item>
    <el-form-item class="le-banner">
      <span class="le-label__require" slot="label">商品轮播图</span>
      <vuedraggable v-model="value.slideshow">
        <div
          class="le-label__require-item"
          :class="{ 'le-label__require-image': index === 0 }"
          v-for="(item, index) in value.slideshow"
          :key="index"
        >
          <div class="select-cover__120">
            <pictureDialog v-model="value.slideshow[index]" :limit="1">
              <div slot="upload" class="select-cover__120-add">
                <i class="le-icon le-icon-add select-cover__120-icon"></i>
                <span class="select-cover__120-text">添加图片</span>
              </div>
              <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
                <el-image :src="scope.url" fit="cover"></el-image>
                <div class="select-cover__120-tips">
                  <span>替换</span> |
                  <span
                    @click.stop="
                      () => {
                        value.slideshow.splice(index, 1);
                      }
                    "
                    >删除</span
                  >
                </div>
              </div>
            </pictureDialog>
          </div>
        </div>
      </vuedraggable>
      <div class="le-label__require-item" v-if="value.slideshow.length < 9">
        <div class="select-cover__120">
          <pictureDialog @confirm="arrayConcat" :limit="9 - value.slideshow.length" :max="9">
            <div slot="upload" class="select-cover__120-add">
              <i class="le-icon le-icon-add select-cover__120-icon"></i>
              <span class="select-cover__120-text">添加图片</span>
            </div>
            <div slot="preview" slot-scope="scope" class="select-cover__120-add">
              <i class="le-icon le-icon-add select-cover__120-icon"></i>
              <span class="select-cover__120-text">添加图片</span>
            </div>
          </pictureDialog>
        </div>
      </div>
      <p class="he-tips" style="padding-left: 0; clear: both">
        建议尺寸：800*800,可拖拽改变图片顺序，首张图为主图，最多上传9张
      </p>
    </el-form-item>
    <el-form-item label="是否添加视频">
      <el-switch v-model="value.is_video" :active-value="1" :inactive-value="0"></el-switch>
    </el-form-item>
    <el-form-item label="视频来源" v-if="value.is_video">
      <el-radio-group v-model="value.videoType">
        <el-radio :label="1">素材库</el-radio>
        <el-radio :label="2">网络</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item v-if="value.is_video && value.videoType === 2">
      <span class="le-label__require" slot="label">主视频地址</span>
      <el-input class="le-video__input" v-model="value.video.url" placeholder="复制视频地址到这里"></el-input>
      <p class="he-tips" style="padding-left: 0">支持视频源地址和腾讯视频平台的网络视频</p>
    </el-form-item>
    <el-form-item v-if="value.is_video && value.videoType === 1">
      <span class="le-label__require" slot="label">主视频</span>
      <div class="select-cover__120">
        <videoDialog v-model="value.video">
          <div slot="upload" class="select-cover__120-add">
            <i class="le-icon le-icon-add select-cover__120-icon"></i>
            <span class="select-cover__120-text">添加视频</span>
          </div>
          <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
            <el-image :src="scope.url.cover" fit="cover"></el-image>
            <div class="select-cover__120-tips">替换视频</div>
          </div>
        </videoDialog>
      </div>
      <p class="he-tips" style="padding-left: 0">建议时长：10~30秒，宽高比 16:9</p>
    </el-form-item>
    <el-form-item v-if="value.is_video">
      <span slot="label">视频封面</span>
      <div class="select-cover__120">
        <pictureDialog v-model="value.video_cover" :limit="1">
          <div slot="upload" class="select-cover__120-add">
            <i class="le-icon le-icon-add select-cover__120-icon"></i>
            <span class="select-cover__120-text">添加图片</span>
          </div>
          <div slot="preview" slot-scope="scope" class="select-cover__120-edit">
            <el-image :src="scope.url" fit="cover"></el-image>
            <div class="select-cover__120-tips">
              <span>替换</span> | <span @click.stop="e => (value.video_cover = '')">删除</span>
            </div>
          </div>
        </pictureDialog>
      </div>
    </el-form-item>
  </div>
</template>
<script>
import vuedraggable from 'vuedraggable';

export default {
  name: 'addBasic',
  components: {
    vuedraggable
  },
  props: {
    value: {
      type: Object
    }
  },
  data() {
    return {
      catObject: {
        cat: [],
        result: []
      },
      catTree: [],
      args: {
        result: []
      }
    };
  },
  computed: {},
  mounted() {
    this.getGroupList().then(res => {
      this.catTree = res;
    });
  },
  methods: {
    /**
     * [arrayConcat description]
     * @return {[type]} [description]
     */
    arrayConcat(value) {
      for (var i in value) {
        if (Object.prototype.toString.call(value[i]) === '[object String]') {
          this.value.slideshow.push(value[i]);
        }
      }
    },
    deleteTag: function (item, index) {
      this.catObject.result.splice(index, 1);
      let path = item.path.split('-').map(Number);
      let level = path.length;
      if (level === 3) {
        let p_deleted = false; //父级是否被删除,保证每次只删除一个
        let p2_deleted = false; //父父级是否被删除,保证每次只删除一个
        this.catObject.result.forEach((v, k) => {
          if (v.id === path[1]) {
            if (!p2_deleted) {
              p2_deleted = true;
              this.catObject.result.splice(k, 1);
            }
            this.catObject.result.forEach((v2, k2) => {
              if (v2.id === path[2]) {
                if (!p_deleted) {
                  p_deleted = true;
                  this.catObject.result.splice(k2, 1);
                }
              }
            });
          }
        });
      } else if (level === 2) {
        let p_deleted = false;
        this.catObject.result.forEach((v, k) => {
          if (v.id === path[1]) {
            if (!p_deleted) {
              p_deleted = true;
              this.catObject.result.splice(k, 1);
            }
          }
        });
      }
      this.value.group = this.catObject.result.map(v => {
        return v.id;
      });
    },
    getGroup: function (e) {
      this.value.group = e.result.map(v => {
        return v.id;
      });
    },
    getArgs: function (e) {
      for (let i = 0; i < e.result.length; i++) {
        for (let j = 0; j < e.result[i].content.length; j++) {
          this.value.body.goods_args.push(e.result[i].content[j]);
        }
      }
      this.$nextTick().then(() => {
        this.$refs.myScrollbar.wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight;
      });
    },
    async getGroupList() {
      const res = await this.$heshop.group('get', { include: 'goods' });
      this.catObject.cat = res;
      let data = JSON.parse(JSON.stringify(res));
      let catList = this.$heshop
        .toTree({
          parentKey: 'parent_id',
          idKey: 'id',
          parentId: 0,
          childrenKey: 'children'
        })
        .on(data)
        .get();
      catList.forEach(cat1 => {
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
      return catList;
    },
    // 添加参数
    pushParameter() {
      this.value.body.goods_args.push({
        name: '',
        value: ''
      });
      this.$nextTick().then(() => {
        this.$refs.myScrollbar.wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight;
      });
    },
    // 删除参数
    deletionParameter(index) {
      this.$delete(this.value.body.goods_args, index);
    }
  },
  watch: {
    'value.slideshow': {
      handler(newVal, oldVal) {
        if (typeof this.$refs.form != 'undefined' && newVal != oldVal) {
          setTimeout(() => {
            this.$refs.form.validateField('slideshow');
          }, 10);
        }
      },
      immediate: true
    },
    'value.video': {
      handler(newVal, oldVal) {
        if (typeof this.$refs.form != 'undefined' && newVal != oldVal) {
          this.$refs.form.validateField('video');
        }
      },
      immediate: true
    },
    value: {
      handler(value) {
        let newVal = value.group;
        let data = [];
        newVal.forEach(id => {
          this.catTree.forEach(item => {
            if (item.id == id) {
              data.push(item);
            }
            if (item.children) {
              item.children.forEach(item2 => {
                if (item2.id == id) {
                  data.push(item2);
                }
                if (item2.children) {
                  item2.children.forEach(item3 => {
                    if (item3.id == id) {
                      data.push(item3);
                    }
                  });
                }
              });
            }
          });
        });
        this.catObject.result = data;
      },
      deep: true
    }
  }
};
</script>
<style lang="less">
.le-basic__name .el-textarea .el-textarea__inner {
  resize: none;
}
.le-introduce--btn {
  display: block;
  padding: 8px 0 0 0 !important;
}
.el-form-item__content .le-cat__footer-tag {
  margin-right: 8px;
  background-color: #ffffff;
  border: 1px solid #bebebe;
}

.le-label__require:before {
  content: '*';
  color: red;
}

.he-class__button.el-button--primary {
  background-color: #ffffff;
}

.le-label__require-item {
  border-radius: 4px;
  position: relative;
  margin-right: 8px;
  margin-bottom: 8px;
  overflow: hidden;
  float: left;
}

.le-label__require-image {
  box-sizing: border-box;
  border: 1px solid #fbad15;
}

.le-label__require-image:before {
  content: '主图';
  position: absolute;
  font-size: 14px;
  text-align: center;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  width: 100px;
  height: 25px;
  line-height: 25px;
  transform: rotate(-45deg);
  transform-origin: 38% 220%;
  background: #fbad15;
  z-index: 10;
}

.el-button--text.he-class__button-new.el-button--mini {
  font-size: 14px;
  font-weight: 500;
  color: #623ceb;
  line-height: 22px;
  padding: 0 14px;
  margin: 0;
}

.he-upload {
  width: 120px;
  height: 120px;
}

.le-video__input.el-input {
  width: 500px !important;
}

.le-banner .select-cover__120-edit {
  cursor: pointer;
}
.le-parameter {
  width: 740px;
  margin-bottom: 15px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  .el-scrollbar__wrap {
    max-height: 640px;
  }
  .le-deletion {
    height: auto;
    cursor: pointer;
    position: absolute;
    right: 0;
    top: 0;
    width: 16px;
    transform: translate(50%, -50%);
    opacity: 0;
  }
}
.le-parameter--item {
  width: 706px;
  height: 244px;
  background: #f3f5f7;
  border-radius: 4px;
  margin: 0 auto 24px auto;
  padding-top: 24px;
  position: relative;
  &:first-child {
    margin-top: 24px;
  }
  .le-input--600 {
    width: 600px;
  }
  .le-input--240 {
    width: 240px;
  }
  &:hover {
    .le-deletion {
      opacity: 1;
    }
  }
}
</style>
