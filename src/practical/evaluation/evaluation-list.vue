<template>
  <div class="le-marin">
    <div class="le-card">
      <div class="le-title">评价库名称：{{ $route.query.name }}</div>
    </div>
    <el-button type="primary" @click="routerGo">添加评价</el-button>
    <div class="le-card">
      <el-table :data="list" cell-class-name="le-cell-table">
        <el-table-column prop="star" label="评价等级">
          <template slot-scope="scope">
            <span>{{ scope.row.star >= 4 ? '好评' : scope.row.star > 2 ? '中评' : '差评' }}</span>
            <el-rate :colors="colors" :low-threshold="2" disabled v-model="scope.row.star"></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="评价内容"> </el-table-column>
        <el-table-column prop="images" label="图片">
          <div class="flex flex-wrap" slot-scope="scope">
            <el-image
              class="le-img"
              :preview-src-list="scope.row.images"
              v-for="(item, index) in scope.row.images"
              :src="item"
              :key="index"
            ></el-image>
          </div>
        </el-table-column>
        <el-table-column prop="name" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="edit(scope.row)">编辑</el-button>
            <span class="le-line">|</span>
            <el-button type="text" @click="del(scope.row, scope.$index)">删除</el-button>
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
    <edit-evaluation v-model="showEditEvaluation" :info="editEvaluationInfo"></edit-evaluation>
  </div>
</template>

<script>
import EditEvaluation from './components/edit-evaluation.vue';

export default {
  name: 'evaluation-list',
  components: {
    EditEvaluation
  },
  data() {
    return {
      list: [],
      colors: ['#99A9BF', '#F7BA2A', '#FF9900'],
      showEditEvaluation: false,
      editEvaluationInfo: {
        images: [],
        star: 0
      },
      pagination: {
        current: 1,
        count: 1
      }
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    getList() {
      this.$heshop
        .plugin('get', {
          include: 'evaluate',
          model: 'repository',
          repository_id: this.$route.query.id
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
    routerGo() {
      this.$router.push({
        path: '/practical/evaluation/add-evaluation',
        query: {
          id: this.$route.query.id,
          name: this.$route.query.name
        }
      });
    },
    edit(item) {
      this.showEditEvaluation = true;
      this.editEvaluationInfo = item;
    },
    del(item, index) {
      this.$confirm('删除评价请谨慎操作，确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      })
        .then(() => {
          this.$heshop
            .plugin('delete', item.id, {
              include: 'evaluate',
              model: 'repository',
              behavior: 'evaluate'
            })
            .then(() => {
              this.$delete(this.list, index);
              this.$message({
                type: 'success',
                message: '删除评价成功'
              });
              if (this.pagination.current < this.pagination.count) {
                this.getList();
              }
            });
        })
        .catch(() => {
          //  Don't do
        });
    }
  }
};
</script>

<style scoped lang="less">
@import './../index.less';

.el-button--primary {
  margin-bottom: 24px;
}

.le-card {
  &:first-child {
    margin-bottom: 24px;
  }

  /deep/ .le-cell-table {
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    vertical-align: top;
    padding: 16px 0;
    .cell {
      padding-left: 10px;
    }
  }

  .le-img {
    border-radius: 8px;
    margin-right: 8px;
    margin-bottom: 8px;
    width: 80px;
    height: 80px;
  }
}

.le-title {
  font-size: 14px;
  font-weight: 400;
  color: #262626;
  line-height: 18px;
}

.le-line {
  color: #623ceb;
  display: inline-block;
  margin: 0 10px;
}

.el-button--text {
  padding: 0;
}
</style>
