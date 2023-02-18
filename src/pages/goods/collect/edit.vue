<template>
  <el-form label-width="170px" :model="form" :rules="rules" ref="form" v-loading="loading">
    <div class="le-prompt">
      支持商品采集的平台：阿里巴巴 、淘宝、京东 、拼多多、天猫<br />
      商品采集设置：<span class="le-prompt-router" @click="router()">商品采集-接口设置</span>
    </div>
    <div class="le-form">
      <el-form-item label="商品详情地址" prop="links">
        <el-input
          type="textarea"
          v-model="form.links"
          :rows="12"
          resize="none"
          placeholder="多条地址，请用换行区分，一次最多添加10条"
        ></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="cats">
        <template v-for="(item, index) in group.result">
          <el-tag
            effect="plain"
            type="info"
            size="medium"
            class="le-form-groupTag"
            closable
            @close="deleteTag(item, index)"
            :key="index"
            v-if="!item.children"
          >
            {{ item.value }}
          </el-tag>
        </template>
        <el-button plain action="getGroup" v-popup.chooseCategory="group" title="选择分类" width="801" module="goods"
          >选择分类</el-button
        >
      </el-form-item>
      <el-form-item label="商品图片">
        <el-radio-group v-model="form.download">
          <el-radio :label="1">下载至本地</el-radio>
          <el-radio :label="0">使用图片链接</el-radio>
        </el-radio-group>
        <div class="le-prompt-text">选择使用图片链接，则采集平台的商品图片失效时，图片链接也将失效</div>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-radio-group v-model="form.is_sale">
          <el-radio :label="0">暂不上架</el-radio>
          <el-radio :label="1">立即上架</el-radio>
        </el-radio-group>
      </el-form-item>
    </div>
    <he-loading :show="load" title="正在采集中，请稍后..."></he-loading>
    <div class="le-cardpin">
      <el-button type="primary" @click="saveForm" :disabled="loading">保存</el-button>
    </div>
  </el-form>
</template>

<script>
import { MessageBox } from 'element-ui';
import heLoading from '../../../components/heloading2.vue';
export default {
  data() {
    const checkGroup = (rule, value, callback) => {
      callback();
    };
    const checkLinks = (rule, value, callback) => {
      let data = value.split('\n').filter(item => item);
      if (data.length > 10) {
        callback('商品详情地址限制10条');
      }
      callback();
    };
    return {
      loading: true,
      load: false,
      form: {
        cats: [],
        links: '',
        download: 0,
        is_sale: 0,
        catsText: []
      },
      group: {
        cat: [],
        result: []
      },
      catTree: [],
      rules: {
        links: [
          { required: true, message: '请输入商品详情地址', trigger: 'blur' },
          { validator: checkLinks, trigger: ['blur', 'change'] }
        ],
        cats: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
          { validator: checkGroup, trigger: ['blur', 'change'] }
        ]
      }
    };
  },
  components: {
    heLoading
  },
  methods: {
    async getGroupList() {
      const res = await this.$heshop.group('get', { include: 'goods' });
      this.group.cat = res;
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
    deleteTag: function (item, index) {
      this.group.result.splice(index, 1);
      let path = item.path.split('-').map(Number);
      let level = path.length;
      if (level === 2) {
        let p_deleted = false;
        let list = this.group.result;
        for (let i = 0; i < list.length; i++) {
          if (list[i].id === path[1] && !p_deleted) {
            this.group.result.splice(i, 1);
          }
        }
      } else if (level === 3) {
        let p_deleted = false;
        let p2_deleted = false;
        this.group.result.forEach((v, k) => {
          if (v.id === path[1]) {
            if (!p2_deleted) {
              p2_deleted = true;
              this.group.result.splice(k, 1);
            }
          }
        });
        this.group.result.forEach((v2, k2) => {
          if (v2.id === path[2]) {
            if (!p_deleted) {
              p_deleted = true;
              this.catObject.result.splice(k2, 1);
            }
          }
        });
      }
      this.form.cats = this.group.result.map(v => {
        return v.id;
      });
    },
    getGroup: function (e) {
      this.form.cats = e.result.map(v => {
        return v.id;
      });
      this.$refs['form'].clearValidate('cats');
    },
    router: function () {
      const newRouter = this.$router.resolve({
        path: '/setup/interfaceSet'
      });
      window.open(newRouter.href, '_blank');
    },
    goback: function () {
      this.$router.push({
        path: '/goods/collect/list'
      });
      this.closeMessageBox();
    },
    closeMessageBox: function () {
      MessageBox.close();
    },
    saveForm: function () {
      let _this = this;
      this.load = true;
      this.$refs['form'].validate(bool => {
        if (bool) {
          let group = this.group.result.filter(item => {
            if (!item.children) return item;
          });
          group = group.map(function (item) {
            return item.value;
          });
          this.form.catsText = group;
          let data = JSON.parse(JSON.stringify(this.form));
          data.links = data.links.split('\n').filter(item => item);
          this.$heshop
            .collect('post', data)
            .then(function (response) {
              _this.load = false;
              let str = response + '件商品采集已提交成功';
              const h = _this.$createElement;
              _this.$confirm('提示', {
                showConfirmButton: false,
                showCancelButton: false,
                message: h('div', null, [
                  h(
                    'p',
                    {
                      class: 'le-text-algin le-confirm-line'
                    },
                    [
                      h('span', {
                        class: 'le-icon-chenggong le-icon'
                      }),
                      h(
                        'span',
                        {
                          class: 'le-confirm-title'
                        },
                        '提交成功'
                      )
                    ]
                  ),
                  h(
                    'p',
                    {
                      class: 'le-text-algin le-confirm-tip'
                    },
                    str
                  ),
                  h(
                    'div',
                    {
                      class: 'le-text-algin le-btn-box'
                    },
                    [
                      h(
                        'span',
                        {
                          class: 'le-btn',
                          on: {
                            click: _this.goback
                          }
                        },
                        '查看采集记录'
                      ),
                      h(
                        'span',
                        {
                          class: 'le-line'
                        },
                        ' | '
                      ),
                      h(
                        'span',
                        {
                          class: 'le-btn',
                          on: {
                            click: _this.closeMessageBox
                          }
                        },
                        '继续采集'
                      )
                    ]
                  )
                ])
              });
            })
            .catch(function (error) {
              _this.$message.error(error.data.message);
              _this.load = false;
            });
        } else {
          this.load = false;
        }
      });
    }
  },
  mounted() {
    let _this = this;
    this.getGroupList()
      .then(res => {
        this.catTree = res;
        this.loading = false;
      })
      .catch(function () {
        _this.loading = false;
      });
  }
};
</script>

<style lang="scss">
.le-prompt {
  height: 68px;
  background: #fff5d1;
  border-radius: 8px;
  padding: 16px 0 16px 20px;
  font-size: 12px;
  color: #595959;
  line-height: 18px;
  .le-prompt-router {
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #623ceb;
    line-height: 16px;
    cursor: pointer;
  }
}
.le-form {
  background: #ffffff;
  border-radius: 16px;
  margin-top: 24px;
  padding: 40px 0 18px 0;
  overflow: hidden;
  .le-form-groupTag {
    margin-right: 8px;
  }
}
.le-icon-chenggong {
  font-size: 28px;
  color: #53c41a;
  margin-right: 15px;
}
.le-confirm-title {
  font-size: 18px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  line-height: 22px;
}
.le-confirm-tip {
  font-size: 12px !important;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #8c8c8c;
  line-height: 22px;
  margin-top: 15px !important;
}
.le-text-algin {
  text-align: center;
}
.le-btn-box {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #623ceb;
  line-height: 12px;
  margin-top: 27px;
  .le-line {
    margin: 0 10px;
  }
  .le-btn {
    cursor: pointer;
  }
}
</style>
