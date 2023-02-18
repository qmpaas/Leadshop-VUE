<script>
import { createNamespacedHelpers } from 'vuex';
const { mapGetters } = createNamespacedHelpers('setting');
export default {
  inject: ['uploader'],
  props: {
    type: String,
    action: {
      type: Function,
      default: function () {}
    },
    name: {
      type: String,
      default: 'file'
    },
    multiple: Boolean,
    accept: String,
    onProgress: Function,
    onSuccess: Function,
    onError: Function,
    beforeUpload: Function,
    onPreview: {
      type: Function,
      default: function () {}
    },
    onRemove: {
      type: Function,
      default: function () {}
    },
    fileList: Array,
    autoUpload: Boolean,
    listType: String,
    disabled: Boolean,
    limit: Number,
    onExceed: Function
  },
  data() {
    return {
      mouseover: false,
      reqs: {}
    };
  },
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    ...mapGetters({
      getStorage: 'getStorage',
      version: 'getVersion'
    })
  },
  methods: {
    /**
     * 判断是否是图片
     * @param  {[type]}  str [description]
     * @return {Boolean}     [description]
     */
    isImage(str) {
      return str.indexOf('image') !== -1;
    },
    /**
     * 出发变动
     * @param  {[type]} ev [description]
     * @return {[type]}    [description]
     */
    handleChange(ev) {
      const files = ev.target.files;

      if (!files) return;
      this.uploadFiles(files);
    },
    /**
     * 获取上传文件列表
     * @param  {[type]} files [description]
     * @return {[type]}       [description]
     */
    async uploadFiles(files) {
      let postFiles = Array.prototype.slice.call(files);
      if (!this.multiple) {
        postFiles = postFiles.slice(0, 1);
      }

      if (postFiles.length === 0) {
        return;
      }
      let num = 0;
      let _l = 0;
      // this.$message({
      //   message: '文件正在上传，请稍后……',
      //   type: 'info',
      //   duration: 1000
      // });
      for (let index in postFiles) {
        let rawFile = postFiles[index];
        if (Object.prototype.toString.call(rawFile) === '[object File]') {
          _l++;
        }
      }
      for (let index in postFiles) {
        let rawFile = postFiles[index];
        if (this.autoUpload) {
          if (Object.prototype.toString.call(rawFile) === '[object File]') {
            let ret = await this.upload(rawFile);
            if (ret) {
              num++;
            }
            if (num === _l) {
              setTimeout(() => {
                this.$message.success('上传成功');
              }, 1000);
            }
          }
        }
      }
    },
    /**
     * 执行上传
     * @param  {[type]} rawFile [description]
     * @return {[type]}         [description]
     */
    async upload(rawFile) {
      let _size = this.getStorage.pic_limit;
      if (_size != -1) {
        if (rawFile.size / 1024 / 1024 > _size) {
          setTimeout(() => {
            this.$message({
              message: '超过上传大小限制，最大' + _size + 'M',
              type: 'warning'
            });
          }, 1000);
          return false;
        }
      }

      this.$refs.input.value = null;
      //判断是否存在前置钩子
      if (!this.beforeUpload) {
        return this.post(rawFile);
      }
      const before = this.beforeUpload(rawFile);
      //异步处理前置钩子，完成后再执行上传方法
      if (before && before.then) {
        await before.then(
          async processedFile => {
            const fileType = Object.prototype.toString.call(processedFile);
            //判断数据类型
            if (fileType === '[object File]' || fileType === '[object Blob]') {
              if (fileType === '[object Blob]') {
                processedFile = new File([processedFile], rawFile.name, {
                  type: rawFile.type
                });
              }
              for (const p in rawFile) {
                if (rawFile.hasOwnProperty(p)) {
                  processedFile[p] = rawFile[p];
                }
              }
              await this.post(processedFile);
            } else {
              await this.post(rawFile);
            }
          },
          () => {
            this.onRemove(null, rawFile);
          }
        );
      } else if (before !== false) {
        await this.post(rawFile);
      } else {
        this.onRemove(null, rawFile);
      }
      return true;
    },
    /**
     * 处理处理执行
     * @param  {[type]} file [description]
     * @return {[type]}      [description]
     */
    abort(file) {
      const { reqs } = this;
      if (file) {
        let uid = file;
        if (file.uid) uid = file.uid;
        if (reqs[uid]) {
          reqs[uid].abort();
        }
      } else {
        Object.keys(reqs).forEach(uid => {
          if (reqs[uid]) reqs[uid].abort();
          delete reqs[uid];
        });
      }
    },
    /**
     * 执行点击事件
     * @return {[type]} [description]
     */
    handleClick() {
      if (!this.disabled) {
        this.$refs.input.value = null;
        this.$refs.input.click();
      }
    },
    /**
     * 键盘点击
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    handleKeydown(e) {
      if (e.target !== e.currentTarget) return;
      if (e.keyCode === 13 || e.keyCode === 32) {
        this.handleClick();
      }
    },
    /**
     * 数据提交接口
     * @param  {[type]} rawFile [description]
     * @return {[type]}         [description]
     */
    post(rawFile) {
      let _this = this;
      let { reqs } = this;
      return new Promise(function (resolve, reject) {
        let { uid } = rawFile;
        const req = _this.action(rawFile, _this.uploader.groupID);
        reqs[uid] = req;
        if (req && req.then) {
          req
            .then(res => {
              _this.onSuccess(res, rawFile);
              delete reqs[uid];
              resolve(res);
            })
            .catch(err => {
              if (_this.onError) {
                _this.onError(err, rawFile);
              } else {
                setTimeout(() => {
                  if (err.data[0]) {
                    _this.$message.error(err.data[0].message);
                  } else {
                    _this.$message.error(err.data.message);
                  }
                }, 1000);
              }
              delete _this.reqs[uid];
              reject(err);
            });
        }
      });
    }
  },
  /**
   * 编译DOM结构
   * @param  {[type]} h [description]
   * @return {[type]}   [description]
   */
  render(h) {
    let { handleClick, drag, name, handleChange, multiple, accept, listType, uploadFiles, disabled, handleKeydown } =
      this;
    //设置上传样式
    const data = {
      class: {
        'el-upload': true
      },
      on: {
        click: handleClick,
        keydown: handleKeydown
      }
    };
    //设置样式处理
    data.class[`el-upload--${listType}`] = true;
    return (
      <div {...data} tabindex="0">
        {this.$slots.default}
        <input
          class="el-upload__input"
          type="file"
          ref="input"
          name={name}
          on-change={handleChange}
          multiple={multiple}
          accept={accept}></input>
      </div>
    );
  }
};
</script>
