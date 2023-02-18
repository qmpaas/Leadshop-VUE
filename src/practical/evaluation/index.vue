<template>
  <div class="le-main" >
    <el-button type="primary" @click="showChooseGoods = true">选择商品添加评价</el-button>
    <el-form class="le-card" label-width="112px" inline>
      <el-form-item label="商品搜索">
        <el-input placeholder="输入商品名称搜索" @keydown.enter.native="getList" clearable @clear="getList" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item label="商品状态">
        <el-select v-model="status">
          <el-option label="全部" value=" "></el-option>
          <el-option label="销售中" value="onsale"></el-option>
          <el-option label="下架中" value="nosale"></el-option>
          <el-option label="售罄" value="soldout"></el-option>
        </el-select>
      </el-form-item>
      <div style="margin-left: 112px">
        <el-button type="primary" @click="getList">筛选</el-button>
        <el-button @click="empty">清空</el-button>
      </div>
    </el-form>
    <div class="le-card">
      <el-table
        :data="list"
        cell-class-name="le-cell-table"
        :default-sort="{
          prop: 'created_time',
          order: 'descending'
        }"
        @sort-change="sortChange"
      >
        <el-table-column min-width="312px" label="商品">
          <div class="flex align-center" slot-scope="scope">
            <el-image class="le-image" :src="scope.row.slideshow[0]"></el-image>
            <div style="margin-left: 12px" class="flex-sub">
              <div class="le-name he-line-2">{{ scope.row.name }}</div>
              <div class="le-assist-text">货号：{{ scope.row.goods_sn ? scope.row.goods_sn : '--' }}</div>
              <div class="le-assist-text">ID：{{ scope.row.goods_id }}</div>
            </div>
          </div>
        </el-table-column>
        <el-table-column label="商品状态" min-width="100px">
          <template slot-scope="scope">
            <template v-if="scope.row.stocks > 0">
              <el-tag size="medium" type="success" v-if="scope.row.is_sale == 1">销售中</el-tag>
              <el-tag size="medium" type="info" v-else-if="scope.row.is_sale == 0">下架中</el-tag>
            </template>
            <el-tag size="medium" type="warning" v-else>售罄</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="总评价数" :render-header="hintRender" min-width="100px" prop="all_evaluate_count"> </el-table-column>
        <el-table-column label="评价库抓取数" min-width="120px">
          <template slot-scope="scope">
            <template v-if="scope.row.repository_num">
              <el-button type="text" @click="viewReviews(scope.row, 'repository')">{{ scope.row.repository_num }}</el-button>
            </template>
            <template v-else> -- </template>
          </template>
        </el-table-column>
        <el-table-column label="API抓取数" min-width="100px">
          <template slot-scope="scope">
            <template v-if="scope.row.api_num">
              <el-button type="text" @click="viewReviews(scope.row, 'api')">{{ scope.row.api_num }}</el-button>
            </template>
            <template v-else> -- </template>
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          sortable
          prop="created_time"
          width="200px"
          :sort-orders="['ascending', 'descending']"
        >
          <template slot-scope="scope">
            {{ $moment(scope.row.created_time * 1000).format(`YYYY-MM-DD hh:mm:ss`) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="280px">
          <template slot-scope="scope">
            <el-button type="text" @click="libraryGrab(scope.row)">评价库抓取</el-button>
            <span class="le-line">|</span>
            <el-button type="text" @click="apiGrab(scope.row)">API抓取</el-button>
            <span class="le-line">|</span>
            <el-button type="text" @click="viewReviews(scope.row)">查看评价</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end le-pagination">
        <el-pagination
          @current-change="getList"
          layout="prev, pager, next, jumper"
          background
          :page-size="5"
          :current-page.sync="pagination.current"
          :page-count="pagination.count"
        ></el-pagination>
      </div>
    </div>
    <choose-goods v-if="showChooseGoods" @confirm="getList" v-model="showChooseGoods"></choose-goods>
  </div>
</template>

<script>
import ChooseGoods from './components/choose-goods.vue';
import HelpHint from '../../pages/goods/components/helpHint';

export default {
  name: 'index',
  components: {
    ChooseGoods,
    HelpHint
  },
  data() {
    return {
      showChooseGoods: false,
      list: [],
      status: ' ',
      keyword: '',
      pagination: {
        current: 1,
        count: 1
      },
      sort: 1
    };
  },
  methods: {
    getList() {
      this.$heshop
        .plugin('get', {
          include: 'evaluate',
          model: 'goods',
          status: this.status,
          keyword: this.keyword,
          sort: this.sort
        })
        .page(this.pagination.current, 10)
        .then(response => {
          const { headers, data } = response;
          this.list = data;
          this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
        });
    },
    sortChange(event) {
      if (event.order === 'ascending') {
        this.sort = 2;
      } else {
        this.sort = 1;
      }
      this.list = [];
      this.getList();
    },
    empty() {
      this.status = ' ';
      this.keyword = '';
      this.getList();
    },
    apiGrab(item) {
      this.$router.push({
        path: '/practical/evaluation/api-grab',
        query: {
          good: encodeURIComponent(
            JSON.stringify({
              image: item.slideshow[0],
              id: item.id,
              name: item.name,
              goods_id: item.goods_id
            })
          )
        }
      });
    },
    viewReviews(item, type) {
      this.$router.push({
        path: '/practical/evaluation/view-reviews',
        query: {
          good: encodeURIComponent(
            JSON.stringify({
              image: item.slideshow[0],
              id: item.goods_id,
              name: item.name
            })
          ),
          type: type ? type : null
        }
      });
    },
    libraryGrab(item) {
      this.$router.push({
        path: '/practical/evaluation/library-grab',
        query: {
          good: encodeURIComponent(
            JSON.stringify({
              image: item.slideshow[0],
              id: item.id,
              name: item.name,
              goods_id: item.goods_id
            })
          )
        }
      });
    },
    hintRender: function () {
      return this.$createElement(
        'HelpHint',
        {
          props: {
            content: '总评价数包含真实用户的评价'
          }
        },
        '总评价数'
      );
    },
  },
  mounted() {
    this.getList();
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.le-card {
  margin-top: 24px;

  .le-image {
    width: 64px;
    height: 64px;
  }

  .le-name {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
    line-height: 18px;
  }

  .el-select {
    width: 200px;

    /deep/ .el-input {
      width: 100%;
    }
  }

  /deep/ .le-cell-table {
    height: 90px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;

    .el-button--text {
      padding: 0;
      font-size: 14px;
      font-weight: 400;
    }

    .le-line {
      color: #623ceb;
      display: inline-block;
      margin: 0 10px;
    }

    .el-tag {
      background: #ffffff;
    }

    .le-assist-text {
      font-size: 12px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #8c8c8c;
    }
    .cell {
      padding-left: 10px;
    }
  }
}
</style>

<style lang="less">
.le-icon-zhushi1 {
  font-size: 13px !important;
}
.has-gutter th:nth-child(3) .cell >span {
  display: flex;
  align-items: center;
  flex-direction: row;
  >span:nth-child(2) {
    height: auto;
  }
}
</style>
