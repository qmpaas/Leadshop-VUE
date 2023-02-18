<template>
  <el-dialog :visible.sync="showDialog" title="编辑评价" width="568px" top="10vh" :modal-append-to-body="true">
    <el-form label-width="88px" :model="form" :rules="rules" ref="form">
      <el-form-item label="评价等级" prop="star">
        <el-rate style="line-height: 42px" :colors="colors" v-model="form.star"></el-rate>
      </el-form-item>
      <el-form-item label="评价内容" prop="content">
        <el-input
          placeholder="最少输入10个字，最多输入300个字"
          :maxlength="300"
          resize="none"
          :rows="13"
          v-model="form.content"
          show-word-limit
          style="width: 400px"
          type="textarea"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片">
        <vuedraggable v-model="form.images">
          <div
            class="le-label__require-item"
            :class="{ 'le-label__require-image': index === 0 }"
            v-for="(item, index) in form.images"
            :key="index"
          >
            <div class="select-cover__120">
              <pictureDialog v-model="form.images[index]" :limit="1">
                <div slot="upload" class="select-cover__120-add">
                  <i class="le-icon le-icon-add select-cover__120-icon"></i>
                  <span class="select-cover__120-text">添加图片</span>
                </div>
                <div slot="preview" slot-scope="item" class="select-cover__120-edit">
                  <el-image :src="item.url" fit="cover"></el-image>
                  <div class="select-cover__120-tips">
                    <span>替换</span> |
                    <span
                      @click.stop="
                        () => {
                          form.images.splice(index, 1);
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
        <div class="le-label__require-item" v-if="form.images.length < 6">
          <div class="select-cover__120">
            <pictureDialog @confirm="value => arrayConcat(value)" :limit="6 - form.images.length" :max="9">
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
      </el-form-item>
    </el-form>
    <div slot="footer" class="le-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="submit"> 确定 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import vuedraggable from 'vuedraggable';

export default {
  name: 'edit-evaluation',
  components: { vuedraggable },
  props: {
    value: {
      type: Boolean
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      form: {
        star: 0,
        images: []
      },
      rules: {
        star: [
          {
            required: true,
            message: '等级不能为空',
            trigger: 'blur'
          }
        ],
        content: [
          {
            required: true,
            message: '评价内容不能为空'
          },
          { min: 10, max: 300, message: '长度在 10 到 300 个字符', trigger: 'blur' }
        ]
      },
      colors: ['#99A9BF', '#F7BA2A', '#FF9900']
    };
  },
  computed: {
    showDialog: {
      get({ value }) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    arrayConcat(value) {
      this.form.images.push(...value);
    },
    submit() {
      this.$refs['form'].validate(value => {
        if (value) {
          this.$heshop
            .plugin(
              'put',
              {
                include: 'evaluate',
                model: 'repository',
                behavior: 'evaluate'
              },
              {
                content: this.form.content,
                id: this.form.id,
                star: this.form.star,
                images: this.form.images
              }
            )
            .then(() => {
              this.info.images = this.form.images;
              this.info.star = this.form.star;
              this.info.content = this.form.content;
              this.showDialog = false;
              this.$message({
                type: 'success',
                message: '编辑评价成功'
              });
            });
        }
      });
    }
  },
  watch: {
    value: {
      handler(val) {
        if (val) {
          this.form = this.$_.cloneDeep(this.info);
        }
      }
    }
  }
};
</script>

<style scoped lang="less">
.le-label__require-item {
  float: left;
  margin-right: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
}
</style>
