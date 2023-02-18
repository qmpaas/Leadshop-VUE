<template>
  <div class="le-main" v-loading="loading">
    <el-button type="primary" @click="routerCreateRoom">创建直播间</el-button>
    <div class="le-card">
      <el-table
        :data="list"
        class="le-table"
        row-class-name="le-table--row"
        :default-sort="{ prop: 'roomid', order: 'descending' }"
      >
        <el-table-column label="直播时间" min-width="320px">
          <template slot-scope="scope">
            {{ scope.row.start_time | getTime }} ~ {{ scope.row.end_time | getTime }}
          </template>
        </el-table-column>
        <el-table-column label="直播间信息" min-width="400px" sortable prop="roomid">
          <div slot-scope="scope" class="flex">
            <el-image class="le-image" :src="scope.row.feeds_img_base64">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="flex-sub le-info">
              <div class="le-name">{{ scope.row.name }}</div>
              <div class="le-assist">
                房间号：{{ scope.row.roomid }}<br />
                主播：{{ scope.row.anchor_name }}
              </div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="直播状态" width="156px">
          <template slot-scope="scope">
            <el-tag
              effect="plain"
              size="medium"
              :type="
                scope.row.live_status === 101
                  ? 'success'
                  : scope.row.live_status === 102
                  ? 'warning'
                  : scope.row.live_status === 103 || scope.row.live_status === 107
                  ? 'info'
                  : scope.row.live_status === 104 || scope.row.live_status === 106
                  ? 'danger'
                  : ''
              "
            >
              {{
                scope.row.live_status === 101
                  ? '直播中'
                  : scope.row.live_status === 102
                  ? '未开始'
                  : scope.row.live_status === 103
                  ? '已结束'
                  : scope.row.live_status === 104
                  ? '禁播'
                  : scope.row.live_status === 105
                  ? '暂停'
                  : scope.row.live_status === 106
                  ? '异常'
                  : scope.row.live_status === 107
                  ? '已过期'
                  : ''
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" min-width="350px">
          <div slot-scope="scope" class="le-operating flex align-center">
            <template
              v-if="scope.row.live_status === 101 || scope.row.live_status === 102 || scope.row.live_status === 105"
            >
              <el-button type="text" @click="routerAddGood(scope.row)">添加商品</el-button>
              <span class="le-line"></span>
            </template>
            <template v-if="scope.row.live_status !== 107">
              <el-button type="text" @click="shareLiveRoom(scope.row)">分享</el-button>
              <span class="le-line" v-if="scope.row.live_status !== 101"></span>
            </template>
            <template v-if="scope.row.live_status === 102">
              <el-button type="text" @click="editCreateRoom(scope.row)">编辑</el-button>
              <span class="le-line"></span>
            </template>
            <el-button
              type="text"
              @click="deleteRoom(scope.row.roomid, scope.$index)"
              v-if="scope.row.live_status !== 106 && scope.row.live_status !== 101"
              >删除
            </el-button>
          </div>
        </el-table-column>
      </el-table>
      <div class="flex le-pagination justify-end">
        <el-pagination
          background
          @current-change="currentChange"
          :current-page.sync="page.current"
          :page-count="page.count"
          layout="prev, pager, next, jumper"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script type="text/javascript">
import copy from '@/lib/function/copy.js';

export default {
  components: {},
  data() {
    return {
      list: [],
      page: {
        count: 1,
        current: 1
      },
      loading: false
    };
  },
  async mounted() {
    this.getLiveList();
  },
  methods: {
    // 获取直播列表
    getLiveList() {
      this.$heshop
        .live('get', {
          page: this.page.current,
          limit: 10
        })
        .then(response => {
          response.list.forEach(item => {
            item.start_time = new Date(item.start_time);
            item.end_time = new Date(item.end_time);
          });
          this.list = response.list;
          this.page.count = response.pageCount;
        })
        .catch(error => {
          this.$message.error(error.data.message);
        });
    },
    // 路由到创建直播页面
    routerCreateRoom() {
      this.$router.push('/practical/live/createRoom');
    },
    // 路由到编辑直播页面
    editCreateRoom(item) {
      localStorage.setItem('editRoom', JSON.stringify(item));
      this.$router.push({
        path: '/practical/live/createRoom',
        query: {
          roomid: item.roomid
        }
      });
    },
    // 路由到添加商品页面
    routerAddGood(item) {
      let data = {
        goods: item.goods,
        anchor_name: item.anchor_name,
        room_id: item.roomid,
        feeds_img_base64: item.feeds_img_base64,
        name: item.name
      };
      localStorage.setItem('addGoods', JSON.stringify(data));
      this.$router.push({
        path: '/practical/live/addGood',
        query: {
          room_id: item.roomid
        }
      });
    },
    currentChange() {
      this.getLiveList();
    },
    DownloadImgZP(imgPath, name) {
      const image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        const url = canvas.toDataURL('image/png'); // 得到图片的base64编码数据
        const a = document.createElement('a'); // 生成一个a元素
        const event = new MouseEvent('click'); // 创建一个单击事件
        a.download = name;
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgPath;
    },
    shareLiveRoom(item) {
      this.loading = true;
      this.$heshop
        .live('get', {
          behavior: 'qrcode',
          room_id: item.roomid
        })
        .then(response => {
          this.loading = false;
          this.$confirm('', {
            customClass: 'le-share-live-room',
            message: (
              <div>
                <div style="text-align: center;margin-bottom: 32px">分享</div>
                <div class="flex">
                  <img src={response.poster_url_img} width="240px" height="316px" alt="" />
                  <div class="le-right">
                    <div class="le-text">直播间页面路径</div>
                    <el-input class="le-copy" id="copy-input" disabled value={response.pagePath}>
                      <el-button slot="append" onClick={this.copy.bind(this, response.pagePath)}>
                        复制
                      </el-button>
                    </el-input>
                    <div class="le-btn">
                      <el-button onClick={this.DownloadImgZP.bind(this, response.poster_url_img, '海报')}>
                        下载海报
                      </el-button>
                      <el-button onClick={this.DownloadImgZP.bind(this, response.cdn_url_img, '小程序码')}>
                        仅下载小程序码
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            ),
            showCancelButton: false,
            showConfirmButton: false
          })
            .then(() => {})
            .catch(() => {});
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error.data.message);
        });
    },
    deleteRoom(roomId, index) {
      this.$confirm('直播间删除请谨慎操作，确定删除？', {})
        .then(() => {
          this.$heshop
            .live(
              'post',
              {
                behavior: 'delete'
              },
              {
                room_id: roomId
              }
            )
            .then(() => {
              this.$delete(this.list, index);
            })
            .catch(error => {
              this.$message.error(error.data.message);
            });
        })
        .catch(() => {
          // Don't do
        });
    },
    copy: function (content) {
      let _this = this;
      copy({
        content: content,
        success: function () {
          _this.$message.success('复制成功');
        }
      });
    }
  },
  filters: {
    getTime(date) {
      if (!(date instanceof Date)) return '';
      const month = date.getMonth() + 1;
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const hour = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
      const min = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      return `${month}月${day}日 ${hour}:${min}`;
    }
  }
};
</script>

<style lang="less" scoped>
@import './../index.less';

.le-card {
  margin-top: 24px;

  .le-image {
    width: 64px;
    height: 64px;
  }

  .le-info {
    margin-left: 12px;

    .le-assist {
      font-size: 12px;
      font-weight: 400;
      color: #8c8c8c;
      line-height: 16px;
    }
  }

  .le-name {
    line-height: 20px;
  }
}

.le-table ::v-deep {
  .le-table--row {
    height: 90px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
  }

  .le-operating {
    .el-button {
      padding: 9px 0px;
    }

    .le-line {
      display: inline-block;
      background: #623ceb;
      width: 1px;
      height: 12px;
      margin: 0 10px;
    }
  }
}

.le-pagination {
  margin-top: 15px;
}
</style>

<style lang="less">
.le-share-live-room {
  .el-message-box__content {
    padding: 10px 40px;

    .le-right {
      width: 316px;
      padding-left: 15px;

      .le-text {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #8c8c8c;
        margin: 15px 0;
      }
    }
  }

  .le-copy {
    .el-input-group__append {
      color: #fff;
      background: #623ceb;
    }
  }

  .le-btn {
    margin-top: 15px;

    .el-button {
      background: #ffffff;
      border: 1px solid #623ceb;
      border-radius: 4px;
      color: #623ceb;
    }
  }
}
</style>
