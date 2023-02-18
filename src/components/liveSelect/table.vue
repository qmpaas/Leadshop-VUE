<template>
  <div class="goods-selet__table">
    <el-radio-group v-model="select" @change="handleChange" v-if="self.type == 'radio'">
      <el-table ref="multipleTable" :data="list">
        <el-table-column>
          <template slot="header">
            <span style="padding-left: 30px">直播时间</span>
          </template>
          <template slot-scope="scope">
            <div class="goods-selet__table-item">
              <div class="goods-selet__table-radio">
                <el-radio :label="scope.row.roomid"><span></span></el-radio>
              </div>
              <div>
                {{ scope.row.start_time | getTime }} - <br />
                {{ scope.row.end_time | getTime }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="直播间信息" width="416">
          <div slot-scope="scope" class="flex">
            <el-image class="le-live--image" :src="scope.row.cover_img_base64"></el-image>
            <div>
              <div>{{ scope.row.name }}</div>
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
      </el-table>
    </el-radio-group>
    <div class="goods-selet__goodspage">
      <el-pagination
        @current-change="handleSizeChange"
        layout="prev, pager, next,jumper"
        background
        :page-size="5"
        :current-page.sync="page.current"
        :page-count="page.count"
      ></el-pagination>
    </div>
  </div>
</template>

<script type="text/javascript">
import Picture from '@/components/image.vue';
import { createNamespacedHelpers } from 'vuex';

const { mapState } = createNamespacedHelpers('goods');

export default {
  components: {
    Picture
  },
  inject: ['self'],
  data() {
    return {
      select: 0,
      list: [],
      page: {
        current: 1,
        count: 1
      }
    };
  },
  props: {},
  /**
   * 计算属性
   * @type {Object}
   */
  computed: {
    ...mapState(['goodsData', 'pageInfo'])
  },
  /**
   * 页面加载执行
   * @return {[type]} [description]
   */
  async mounted() {
    this.handleSizeChange(1);
  },
  methods: {
    getList() {
      return new Promise((resolve, reject) => {
        this.$heshop
          .live('get', {
            page: this.page.current,
            limit: 5
          })
          .then(response => {
            response.list.forEach(item => {
              item.start_time = new Date(item.start_time);
              item.end_time = new Date(item.end_time);
            });
            this.list = response.list;
            this.page.count = response.pageCount;
            resolve();
          })
          .catch(error => {
            this.$message.error(error.data.message);
            reject();
          });
      });
    },
    handleChange(arr) {
      for (let index in this.list) {
        let item = this.list[index];
        if (item.roomid == arr) {
          this.self.selectData = JSON.parse(JSON.stringify(item));
          break;
        }
      }
    },
    /**
     * 获取KEY
     * @param  {[type]} row [description]
     * @return {[type]}     [description]
     */
    getRowKeys(row) {
      return row.id;
    },
    /**
     * 分页
     * @return {[type]} [description]
     */
    handleSizeChange() {
      this.getList();
    },
    /**
     * 获取封面信息
     * @param  {[type]} cover [description]
     * @return {[type]}       [description]
     */
    getGoodsCover(cover) {
      if (cover && cover[0]) {
        if (typeof cover[0] == 'string') {
          return cover[0];
        }
      }
      return 'http://qmxq.oss-cn-hangzhou.aliyuncs.com/le-default-goods-bg.png';
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
@import './style.less';
.le-live--image {
  width: 64px;
  height: 64px;
  margin-right: 12px;
}
.le-assist {
  line-height: 16px;
  font-size: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #8c8c8c;
}
</style>
