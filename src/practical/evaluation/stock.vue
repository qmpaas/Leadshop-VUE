<template>
  <div class="le-main">
    <el-button type="primary" @click="showAddEvaluationLibrary = true">新建评价库</el-button>
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
        <el-table-column prop="name" label="评价库名称">
          <template slot-scope="scope">
            <div class="le-name">
              {{ scope.row.name }}
              <he-icon
                @click.native="openEditEvaluationLibraryName(scope.row)"
                type="le-icon-editor"
                class="le_goods__main-sortedit"
              ></he-icon>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="评价数">
          <template slot-scope="scope">
            <template v-if="scope.row.count">
              <el-button @click="routerGoList(scope.row)" type="text">{{ scope.row.count }}</el-button>
            </template>
            <template v-else> -- </template>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" sortable :sort-orders="['ascending', 'descending']" label="创建时间">
          <template slot-scope="scope">
            {{ $moment(new Date(scope.row.created_time)).format(`YYYY-MM-DD HH:mm:ss`) }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="routerGo(scope.row)">添加评价</el-button>
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
    <add-evaluation-library v-if="showAddEvaluationLibrary" @confirm="getList" v-model="showAddEvaluationLibrary"></add-evaluation-library>
    <edit-evaluation-library-name
      v-model="showEditEvaluationLibraryName"
      :info="editEvaluationLibraryNameInfo"
    ></edit-evaluation-library-name>
  </div>
</template>

<script>
import AddEvaluationLibrary from './components/add-evaluation-library';
import EditEvaluationLibraryName from './components/edit-evaluation-library-name.vue';

export default {
  name: 'stock',
  components: {
    AddEvaluationLibrary,
    EditEvaluationLibraryName
  },
  data() {
    return {
      showAddEvaluationLibrary: false,
      list: [],
      pagination: {
        current: 1,
        count: 1
      },
      sort: 1,
      showEditEvaluationLibraryName: false,
      editEvaluationLibraryNameInfo: {}
    };
  },
  methods: {
    getList() {
      this.$heshop
        .plugin('get', {
          include: 'evaluate',
          model: 'repository',
          sort: this.sort
        })
        .page(this.pagination.current, 10)
        .then(response => {
          const { headers, data } = response;
          this.list = data.map((item) => {
            return {
              ...item,
              created_time: item.created_time * 1000
            }
          });
          this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
        });
    },
    routerGo(item) {
      this.$router.push({
        path: '/practical/evaluation/add-evaluation',
        query: {
          id: item.id,
          name: item.name
        }
      });
    },
    routerGoList(item) {
      this.$router.push({
        path: '/practical/evaluation/evaluation-list',
        query: {
          id: item.id,
          name: item.name
        }
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
    openEditEvaluationLibraryName(item) {
      this.editEvaluationLibraryNameInfo = item;
      this.showEditEvaluationLibraryName = true;
    },
    del(item, index) {
      this.$confirm('删除评价库请谨慎操作，确定删除？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      })
        .then(() => {
          this.$heshop
            .plugin('delete', item.id, {
              include: 'evaluate',
              model: 'repository',
              behavior: 'repository'
            })
            .then(() => {
              this.$delete(this.list, index);
              this.$message({
                type: 'success',
                message: '删除评价库成功'
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

  /deep/ .le-cell-table {
    height: 52px;
    font-size: 14px;
    font-weight: 400;
    color: #262626;
    .cell {
      padding-left: 10px;
    }
  }
}

.le-line {
  color: #623ceb;
  display: inline-block;
  margin: 0 10px;
}

.el-button--text {
  padding: 0;
}

.le-name {
  cursor: pointer;

  &:hover {
    .le_goods__main-sortedit {
      opacity: 1;
    }
  }
}

.le_goods__main-sortedit {
  color: #bbbfc8;
  margin-left: 10px;
  opacity: 0;
}
</style>
