<template>
  <div class="picture-selet">
    <div class="picture-selet__detail">
      <el-card>
        <div slot="header" class="clearfix">
          <span>分组名称</span>
          <span style="float: right; padding: 0; font-size: 14px; color: #8c8c8c; font-weight: 400">操作</span>
        </div>
        <div class="picture-selet__detail-group">
          <el-scrollbar :style="{ height: '632px' }">
            <el-radio-group v-model="index">
              <ul>
                <li>
                  <el-radio class="picture-selet__detail-radio" :label="-1">
                    <img src="http://manongyun.oss-cn-hangzhou.aliyuncs.com/Qmpaas/le-icon-folder.png" />
                    <span>全部</span>
                  </el-radio>
                  <div class="picture-selet__detail-action"></div>
                </li>
                <li v-for="(item, index) in groupList" :key="index">
                  <el-radio class="picture-selet__detail-radio" :label="index">
                    <img src="http://manongyun.oss-cn-hangzhou.aliyuncs.com/Qmpaas/le-icon-folder.png" />
                    <el-input placeholder="请输入内容" :maxlength="8" v-model="item.name" v-if="is_edit === item.id">
                      <el-button
                        slot="append"
                        type="primary"
                        @click="
                          e => {
                            UpdateGroupItem(item);
                            is_edit = -1;
                          }
                        "
                        >确认
                      </el-button>
                    </el-input>
                    <span v-else>{{ item.name }}</span>
                  </el-radio>
                  <div class="picture-selet__detail-action" v-if="index">
                    <span type="text" @click="is_edit = item.id">编辑</span>
                    |
                    <span type="text" @click="handleGroupDelete(item.id, 2)">删除</span>
                  </div>
                </li>
              </ul>
            </el-radio-group>
          </el-scrollbar>
          <div class="picture-selet__detail-group-add">
            <Dialog title="新建分组" @confirm="value => handleMakeGroup({ id: 0, name: value, type: fileType })">
              <el-button plain>新建分组</el-button>
            </Dialog>
          </div>
        </div>
      </el-card>
      <div class="picture-selet__layout">
        <div class="picture-selet__header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
              <span @click="handleCrumbItem(item, index)">{{ item.name || item.title_name }}</span>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="picture-selet__content">
          <div class="picture-selet__tools">
            <div class="picture-selet__action" v-if="index > -1">
              <Upload :action="uploadFile" :multiple="true" :onSuccess="uploadFileSuccess" autoUpload>
                <el-button type="primary">上传图片</el-button>
              </Upload>
            </div>
            <div class="picture-selet__action" v-if="is_make">
              <Dialog
                title="创建子级分组"
                @confirm="value => handleMakeGroup({ id: groupInfo.id, name: value, type: fileType }, 2)"
              >
                <el-button plain>创建子级分组</el-button>
              </Dialog>
            </div>
            <div class="picture-selet__action" v-if="photoList.length > 0">
              <el-checkbox v-model="checkAll" @change="handleAllChange" :indeterminate="isIndeterminate">
                当前页全选
              </el-checkbox>
            </div>
            <div class="picture-selet__action" v-if="photoList.length > 0">
              <el-button @click="handleDeletes" :disabled="is_delete">删除</el-button>
            </div>
            <div class="picture-selet__action" v-if="photoList.length > 0">
              <Group :disabled="is_move" @confirm="handleMoveList">
                <el-button :disabled="is_move">移动至</el-button>
              </Group>
            </div>
            <div class="picture-selet__action" v-if="photoList.length > 0">
              <Rename title="重命名" :disabled="is_rename" v-model="checkedData" @confirm="handleRenameItem">
                <el-button :disabled="is_rename" @click="handleRenameItem">重命名</el-button>
              </Rename>
            </div>
          </div>
          <ul v-if="photoList.length > 0" v-loading="loading" style="min-width: 600px">
            <li class="picture-select__content-loading" v-if="upLoading">
              <label class="picture-selet__content-label">
                <div class="picture-selet__content-item">
                  <div class="picture-selet__content-item-photo flex flex-direction align-center justify-center">
                    <span class="le-icon le-icon-morentupian"></span>
                    <img src="./../images/loading.gif" alt="" />
                  </div>
                  <el-button type="text">上传中...</el-button>
                </div>
              </label>
            </li>
            <li v-for="(item, index) in photoList" :key="item.id">
              <label class="picture-selet__content-label" @dblclick.stop="handleDblClick(item)">
                <input class="picture-selet__content-input" type="checkbox" :value="item" v-model="checkedData" />
                <div class="picture-selet__content-item">
                  <div class="picture-selet__content-close">
                    <i class="le-icon le-icon-tick"></i>
                  </div>
                  <div class="picture-selet__content-item-photo">
                    <div class="picture-selet__content-item-cover">
                      <Picture :src="item.url" v-if="item.type > 0"></Picture>
                      <Picture
                        v-else
                        src="http://manongyun.oss-cn-hangzhou.aliyuncs.com/Qmpaas/le-icon-folder.png"
                      ></Picture>
                    </div>
                  </div>
                  <el-button type="text">{{ item.title_name }}</el-button>
                </div>
              </label>
            </li>
          </ul>
          <div v-else class="picture-selet__content-empty">
            <div>
              <Picture src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/gallery_bg.png"></Picture>
              <p>该分组下暂无内容</p>
            </div>
          </div>
          <div class="picture-selet__paging">
            <el-pagination
              background
              @current-change="handleSizeChange"
              layout="prev, pager, next,jumper"
              :page-size="pageInfo.size"
              :current-page="pageInfo.current"
              :total="pageInfo.total"
            ></el-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import Picture from '@/components/image.vue';
import Upload from './upload.vue';
import Dialog from './dialog.vue';
import Group from './group.vue';
import Rename from './rename.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapState, mapActions, mapMutations } = createNamespacedHelpers('photo');
export default {
  components: {
    Picture,
    Upload,
    Dialog,
    Group,
    Rename
  },
  props: {
    fileType: {
      type: [String, Number, Boolean, Object, Array],
      default: 1
    }
  },
  provide() {
    return {
      uploader: this
    };
  },
  data() {
    return {
      index: -1,
      /**
       * 编辑ID
       * @type {Number}
       */
      is_edit: 0,
      /**
       * 选中值
       * @type {Array}
       */
      checkedData: [],
      /**
       * 是否全选
       * @type {Boolean}
       */
      checkAll: false,
      /**
       * 半选中状态
       * @type {Boolean}
       */
      isIndeterminate: false,
      /**
       * 数据加载
       * @type {Boolean}
       */
      loading: false,
      /**
       * 处理分级
       */
      breadcrumb: [
        {
          id: -1,
          name: '全部'
        }
      ],
      upLoading: false
    };
  },
  /**
   * 数据监听
   * @type {Object}
   */
  watch: {
    index(value) {
      this.checkedData = [];
      let groupInfo = null;
      if (value == -1) {
        groupInfo = {
          id: -1,
          name: '全部'
        };
      } else {
        groupInfo = this.groupList[value];
      }
      this.breadcrumb = [groupInfo];
      //设置当前分组信息
      this.setGroupInfo(groupInfo);
      //加载当前分组数组
      this.LoadPhotoList({
        id: groupInfo.id,
        current: 1,
        pageSize: 15
      });
    },
    checkedData(value) {
      if (value.length == this.photoList.length && value.length !== 0) {
        this.isIndeterminate = false;
        this.checkAll = true;
      } else {
        if (value.length > 0) {
          this.isIndeterminate = true;
        } else {
          this.checkAll = false;
          this.isIndeterminate = false;
        }
      }
    }
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    ...mapState(['groupList', 'groupInfo', 'photoList', 'pageInfo']),
    /**
     * 是否创建
     * @return {Boolean} [description]
     */
    is_make() {
      if (this.groupInfo.name === '全部') {
        return false;
      }
      if (this.groupInfo.name === '未分组') {
        return false;
      }
      let path = this.groupInfo.path || this.groupInfo.url || '0';
      return path.split('-').length < 3;
    },
    /**
     * 移动
     * @return {Boolean} [description]
     */
    is_move() {
      if (this.checkedData.length < 1) {
        return true;
      }
      let s = JSON.stringify(this.checkedData);
      return s.indexOf('"type":0') > -1;
    },
    /**
     * 是否删除
     * @return {Boolean} [description]
     */
    is_delete() {
      if (this.checkedData.length < 1) {
        return true;
      }
      let s = JSON.stringify(this.checkedData);
      if (s.indexOf('"type":0') > -1) {
        if (this.checkedData.length > 1) {
          return true;
        }
      }
      return s.indexOf('"type":1') > -1 && s.indexOf('"type":0') > -1;
    },
    /**
     * 是否重命名
     * @return {Boolean} [description]
     */
    is_rename() {
      if (this.checkedData.length === 0) {
        return true;
      }
      if (this.checkedData.length > 1) {
        return true;
      }
      let s = JSON.stringify(this.checkedData);
      return s.indexOf('"type":1') > -1 && s.indexOf('"type":0') > -1;
    }
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.LoadGroupList().then(() => {
      this.LoadPhotoList({
        id: -1,
        current: 1,
        pageSize: 15
      });
    });
  },
  methods: {
    ...mapMutations(['setGroupInfo']),
    ...mapActions([
      'LoadGroupList',
      'LoadPhotoList',
      'InterGroupItem',
      'UpdateGroupItem',
      'DeleteGroupItem',
      'DeletePhotoList',
      'MovePhotoList',
      'UpdatePhotoItem',
      'upadteGroupInfo'
    ]),
    /**
     * 执行创建分组
     * @return {[type]} [description]
     */
    handleMakeGroup(option, type = 1) {
      this.loading = true;
      this.InterGroupItem(option)
        .then(value => {
          if (type == 1) {
            this.index = -1;
            this.upadteGroupInfo({
              id: -1,
              name: '全部'
            });
            //重载分组列表
            this.LoadGroupList().then(() => {});
            this.loading = false;
          }
          if (type == 2) {
            setTimeout(() => {
              let id = value.parent_id || this.groupInfo.id;
              //重载当前分组列表
              this.LoadPhotoList({ id: id, current: 1, pageSize: 15 }).then(() => {
                this.loading = false;
              });
              this.checkedData = [];
            }, 500);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 执行删除数据
     * @return {[type]} [description]
     */
    handleGroupDelete(id, type = 1) {
      this.loading = true;
      this.$confirm('此分组及子级分组的图片都将移至未分组中， 是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          this.DeleteGroupItem({ id, type })
            .then(() => {
              if (type == 1) {
                setTimeout(() => {
                  //重载当前分组列表
                  this.LoadPhotoList({ id: this.groupInfo.id, current: 1, pageSize: 15 }).then(() => {
                    this.loading = false;
                  });
                  this.checkedData = [];
                }, 500);
              }
              if (type == 2) {
                this.index = -1;
                this.LoadGroupList().then(() => {
                  this.loading = false;
                  this.LoadPhotoList({
                    id: -1,
                    current: 1,
                    pageSize: 15
                  });
                  this.checkedData = [];
                });
                this.loading = false;
              }
            })
            .catch(() => {
              this.loading = false;
            });
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * 处理上传
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    uploadFile(e) {
      this.upLoading = true;
      //此处执行POST提交方法
      if (this.photoList.length === 15) {
        this.photoList.splice(this.photoList.length - 1, 1);
      }
      return new Promise((reslove, reject) => {
        //将文件流数据转Base64数据
        let oFReader = new FileReader();
        oFReader.readAsDataURL(e);
        oFReader.onload = oFREvent => {
          this.$heshop
            .uploadV2({
              type: 1,
              title: e.name,
              group_id: this.groupInfo.id,
              content: oFREvent.target.result
            })
            .then(data => {
              this.loading = false;
              reslove(data);
            })
            .catch(err => {
              this.loading = false;
              this.upLoading = false;
              reject(err);
            });
        };
      });
    },
    // 上传文件成功回调
    async uploadFileSuccess(event) {
      await this.LoadPhotoList({ id: this.groupInfo.id, current: 1, pageSize: 15 });
      this.upLoading = false;
    },
    /**
     * 数据全选
     * @return {[type]} [description]
     */
    handleAllChange(value) {
      this.isIndeterminate = false;
      if (value) {
        this.checkedData = this.photoList;
      } else {
        this.checkedData = [];
      }
    },
    /**
     * 分页
     * @return {[ty3pe]} [description]
     */
    handleSizeChange(mumber = 1) {
      //重载当前分组列表
      // debugger
      this.LoadPhotoList({ id: this.groupInfo.id, current: mumber, pageSize: 15 });
      this.checkedData = [];
    },
    /**
     * 执行删除数据
     * @return {[type]} [description]
     */
    handleDeletes() {
      this.loading = true;
      let arr = [];
      let type = 0;
      for (let index in this.checkedData) {
        let item = this.checkedData[index];
        if (item.id) {
          type = item.type;
          arr.push(item.id);
        }
      }
      if (type === 0) {
        if (arr[0]) {
          let id = arr[0];
          this.handleGroupDelete(id);
        }
      } else {
        this.$confirm('是否确认删除选中内容', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        })
          .then(() => {
            //处理素材删除
            this.DeletePhotoList(arr).then(() => {
              //重载当前分组列表
              this.LoadPhotoList({ id: this.groupInfo.id, current: 1, pageSize: 15 }).then(() => {
                this.loading = false;
              });
              this.checkedData = [];
            });
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    /**
     * 照片移动至
     * @return {[type]} [description]
     */
    handleMoveList(group_id) {
      let _array = [];
      this.checkedData.map(item => {
        _array.push(item.id);
      });
      this.MovePhotoList({ list: _array, group_id }).then(() => {
        //重载当前分组列表
        this.LoadPhotoList({ id: this.groupInfo.id, current: 1, pageSize: 15 });
        this.checkedData = [];
      });
    },
    /**
     * 内容重命名
     * @return {[type]} [description]
     */
    handleRenameItem(data) {
      if (data.type == 0) {
        this.UpdateGroupItem(data).then(() => {
          //重载当前分组列表
          this.LoadPhotoList({ id: this.groupInfo.id, current: this.pageInfo.current, pageSize: 15 });
          this.checkedData = [];
        });
      } else {
        if (data.id) {
          this.UpdatePhotoItem(data).then(() => {
            //重载当前分组列表
            this.LoadPhotoList({ id: this.groupInfo.id, current: this.pageInfo.current, pageSize: 15 });
            this.checkedData = [];
          });
        }
      }
    },
    /**
     * 双击点击事件
     * @return {[type]} [description]
     */
    handleDblClick(value) {
      //执行数据加载
      if (value.type === 0) {
        //设置当前分组信息
        this.setGroupInfo(value);
        //面包屑
        this.breadcrumb.push(value);
        //重载当前分组列表
        this.LoadPhotoList({ id: value.id, current: 1, pageSize: 15 });
        this.checkedData = [];
      }
    },
    /**
     * 处理样式数据
     * @return {[type]} [description]
     */
    handleCrumbItem(value, index) {
      if (index === 0) {
        this.upadteGroupInfo(value);
        this.breadcrumb = [value];
        //重置图片数据信息
        this.LoadPhotoList({ id: value.id, current: 1, pageSize: 15 });
        this.checkedData = [];
      }
      if (index === 1) {
        if (this.breadcrumb.length > 2) {
          this.breadcrumb.pop();
        }
        let value = this.breadcrumb[1];
        this.upadteGroupInfo(value);
        //重置图片数据信息
        this.LoadPhotoList({ id: value.id, current: 1, pageSize: 15 });
        this.checkedData = [];
      }
    },
    groupNameCheck(name) {
      if (name.length > 8) {
        return name.substr(0, 8);
      } else {
        return name;
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import './style.less';
</style>
