<template>
  <div class="le-matter">
    <div class="le-header flex align-center">
      <img class="le-header-log" src="../../assets/images/leashop.png" alt="" />
      <div class="le-header-name">LEADSHOP一键更新</div>
    </div>
    <div class="le-body">
      <el-scrollbar style="height: 100%">
        <div class="le-card">
          <div class="update-info" v-if="status == 1">
            <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/install/update.gif" alt="更新下载安装中，请稍后" />
            <h3>更新下载安装中，请稍后...</h3>
            <p>更新完成前请勿关闭窗口</p>
          </div>
          <div class="update-info" v-if="status == 2">
            <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/install/succeed.png" alt="更新下载安装中，请稍后" />
            <h4>
              {{ msg || '更新完成' }}
            </h4>
            <p>
              <router-link to="/">
                <el-button type="primary"> 回到后台首页 </el-button>
              </router-link>
            </p>
          </div>
          <div class="update-info" v-if="status == 3">
            <img src="http://qmxq.oss-cn-hangzhou.aliyuncs.com/install/error.png" alt="更新下载安装中，请稍后" />
            <h4>
              {{ msg || '更新遇到未知错误，请重试' }}
            </h4>
            <p>
              <el-button type="primary" @click="updateSystem(token)">点此重试</el-button>
            </p>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import axios from 'axios';

export default {
  name: 'changelog',
  computed: {
    ...mapGetters({
      getStore: 'setting/getStore'
    })
  },
  data() {
    return {
      status: 1,
      msg: '',
      token: ''
    };
  },
  methods: {
    /**
     * 执行系统更新
     * @return {[type]} [description]
     */
    updateSystem(token = '') {
      this.status = 1;
      let that = this;
      //let origin = "http://www.qmpaas.com" || window.location.origin;
      let origin = window.location.origin;
      axios({
        method: 'GET',
        url: origin + '/install.php?_update=1&_token=' + token
      })
        .then(function (response) {
          let data = response.data;
          if (data.code === 0) {
            that.status = 2;
          } else if (data.code === 2) {
            that.status = 2;
            that.msg = data.msg || '已是最新版本';
          } else {
            that.status = 3;
            that.msg = data.msg || '网络错误，请刷新后重试';
          }
        })
        .catch(function (error) {
          that.status = 3;
          that.msg = '网络错误，请刷新后重试';
        });
    }
  },
  mounted() {
    let that = this;
    this.$heshop
      .cloud('post', { action: 'update' })
      .then(function (res) {
        that.token = res;
        that.updateSystem(res);
      })
      .catch(function (err) {
        that.status = 3;
        that.msg = '网络错误，请刷新后重试';
      });
  }
};
</script>
<style scoped lang="scss">
.update-info {
  text-align: center;
  margin: 140px 0 200px 0;

  h3 {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #595959;
    line-height: 20px;
  }

  h4 {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #595959;
    line-height: 20px;
  }

  p {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #bfbfbf;
    line-height: 20px;
  }
}

.le-matter {
  min-width: 1200px;
}

.le-header {
  width: 100%;
  height: 64px;
  background-color: #ffffff;

  .le-header-log {
    width: 36px;
    height: 36px;
    margin: 0 0 0 118px;
  }

  .le-header-name {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #262626;
    margin-left: 20px;
  }
}

.le-body {
  height: calc(100vh - 64px);
  background-color: #f3f5f7;
  overflow: hidden;

  /deep/.el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .le-card {
    margin: 24px 120px 74px 120px;
    height: calc(100% - 98px);
    background: #ffffff;
    border-radius: 16px;
    padding-left: 200px;
    padding-top: 64px;
    padding-right: 80px;
    overflow: hidden;

    .le-pagination {
      margin-bottom: 64px;
    }

    .le-time-item {
      position: relative;

      .le-dot {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        position: absolute;
        left: -8px;
      }

      .le-dot-default {
        background: #dcdfe6;
      }

      .le-dot-last {
        background: #623ceb;
      }

      .le-left {
        position: absolute;
        left: -135px;
        text-align: right;
        width: 115px;

        .le-version {
          font-size: 20px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #222222;
          text-align: right;

          .le-version-new {
            display: inline-block;
            text-align: center;
            width: 42px;
            height: 20px;
            line-height: 20px;
            background: #623ceb;
            border-radius: 10px 10px 0 10px;
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #ffffff;
          }
        }

        .le-time {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #999999;
          text-align: right;
        }
      }

      .le-content {
        padding-left: 28px;
        padding-bottom: 48px;

        .le-content-header {
          margin-bottom: 10px;
        }

        .le-host-version {
          span {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #623ceb;
          }

          span:last-child {
            margin-left: 5px;
            line-height: 1;
          }
        }

        .le-button {
          width: 118px;
          height: 32px;
          background: #623ceb;
          border-radius: 4px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          outline: none;
          border: none;
          cursor: pointer;
          margin-right: 15px;
        }

        .le-prompt {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #595959;
        }
      }

      .le-content-info {
        width: 100%;
        background: #f7f7f7;
        border-radius: 0px 16px 16px 16px;
        padding: 24px;

        .le-more {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #623ceb;
          cursor: pointer;
          height: 16px;
          line-height: 16px;
        }

        .le-icon-arrow-top {
          font-size: 12px;
          margin-left: 4px;
        }

        .le-tag {
          display: inline-block;
          width: 54px;
          height: 18px;
          border-radius: 9px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #ffffff;
          padding: 0 7px;
        }

        .le-icon-add {
          background: #518df5;
        }

        .le-icon-youhua {
          background: #fbad15;
        }

        .le-icon-xiufu {
          background: #53c41a;
        }

        .le-content-info-item {
          margin-bottom: 10px;

          .le-content-info-item__text {
            font-size: 14px;
            font-family: Microsoft YaHei;
            font-weight: 400;
            color: #262626;
            margin-left: 8px;
            line-height: 18px;
          }
        }
      }
    }

    .le-time-item.le-border {
      border-left: 1px solid #dcdfe6;
    }
  }
}
</style>
