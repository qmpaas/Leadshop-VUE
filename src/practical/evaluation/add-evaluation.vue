<template>
  <div class="le-main">
    <div class="le-card">
      <div class="le-title">评价库名称：{{ $route.query.name }}</div>
    </div>
    <div class="le-card">
      <el-table :data="evaluationList" cell-class-name="le-cell-table">
        <el-table-column min-width="156">
          <template slot="header">
            <span class="le-required">评价等级</span>
          </template>
          <template slot-scope="scope">
            <div>评分</div>
            <el-rate :colors="colors" v-model="scope.row.star"></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="name" width="572">
          <template slot="header">
            <span class="le-required">评价内容</span>
          </template>
          <template slot-scope="scope">
            <el-input
              placeholder="最少输入10个字，最多输入300个字"
              :maxlength="300"
              type="textarea"
              v-model="scope.row.content"
              resize="none"
              :rows="13"
            ></el-input>
          </template>
        </el-table-column>
        <el-table-column min-width="416" label="图片">
          <div slot-scope="scope">
            <vuedraggable v-model="scope.row.images">
              <div
                class="le-label__require-item"
                :class="{ 'le-label__require-image': index === 0 }"
                v-for="(item, index) in scope.row.images"
                :key="index"
              >
                <div class="select-cover__120">
                  <pictureDialog v-model="scope.row.images[index]" :limit="1">
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
                              scope.row.images.splice(index, 1);
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
            <div class="le-label__require-item" v-if="scope.row.images.length < 6">
              <div class="select-cover__120">
                <pictureDialog
                  @confirm="value => arrayConcat(value, scope.$index)"
                  :limit="6 - scope.row.images.length"
                  :max="9"
                >
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
          </div>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="del(scope.$index)" size="small"> 删除 </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button @click="pushNew" :disabled="evaluationList.length === 50" plain>添加评价 </el-button>
      <span class="le-prompt-text">一次最多添加50条评价</span>
    </div>
    <div class="le-cardpin">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable';

export default {
  name: 'add-evaluation',
  data() {
    return {
      evaluationList: [],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
    };
  },
  components: {
    vuedraggable
  },
  methods: {
    arrayConcat(value, index) {
      this.evaluationList[index].images.push(...value);
    },
    pushNew() {
      this.evaluationList.push({
        repository_id: this.$route.query.id,
        images: [],
        star: 5,
        content: ''
      });
    },
    del(index) {
      this.$delete(this.evaluationList, index);
    },
    save() {
      for (let i = 0; i < this.evaluationList.length; i++) {
        if (!this.evaluationList[i].content) {
          this.$message({
            type: 'error',
            message: '评价内容不能为空'
          });
          return;
        }
        if (this.evaluationList[i].content.length < 10) {
          this.$message({
            type: 'error',
            message: '评价内容不能少于10个字'
          });
          return;
        }
      }
      this.$heshop
        .plugin(
          'post',
          {
            include: 'evaluate',
            model: 'repository',
            behavior: 'evaluate'
          },
          {
            form: this.evaluationList
          }
        )
        .then(() => {
          this.$message({
            type: 'success',
            message: '保存成功'
          });
          this.$router.back();
        });
    }
  },
  mounted() {
    this.pushNew();
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.le-card {
  &:first-child {
    margin-bottom: 24px;
  }

  .le-required {
    &:before {
      content: '*';
      color: #f5212d;
    }
  }

  .le-title {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
  }

  .el-table {
    margin-bottom: 24px;
  }

  .le-label__require-item {
    float: left;
    margin-right: 8px;
    margin-bottom: 8px;
    border-radius: 4px;
    overflow: hidden;
  }

  /deep/ .le-cell-table {
    vertical-align: top;
    padding: 24px 0 16px 0;
  }

  .le-prompt-text {
    margin-left: 15px;
  }
}
</style>
