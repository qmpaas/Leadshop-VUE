<template>
  <div class="task-goodsList">
    <div>
      <el-checkbox v-model="checked">当页全选</el-checkbox>
      <el-button>上架</el-button>
      <el-button>下架</el-button>
      <el-button>删除</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" :default-sort="{ prop: 'date', order: 'descending' }">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column prop="name" label="商品描述" width="312">
        <template slot-scope="scope">
          <div class="__goods_cover">
            <img src="http://www.qmpaas.com/static/images/home.png" alt="" />
            <div class="__goods_title">
              <h3>{{ scope.row.name | capitalize }}</h3>
              <p>货号：askjdhjkasdh</p>
              <p>ID:kdasjdkl</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="积分价格" sortable width="180"> </el-table-column>
      <el-table-column prop="address" label="已兑换/剩余" sortable width="180"> </el-table-column>
      <el-table-column prop="address" label="创建时间" sortable width="180"> </el-table-column>
      <el-table-column prop="address" label="商品状态" width="180"> </el-table-column>
      <el-table-column prop="address" label="操作" :formatter="formatter"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      checked: false,
      tableData: [
        {
          date: '2016-05-02',
          name: '可盐可甜连衣裙女装秋装新款温柔风裙子秋季收可盐可甜连衣裙女装秋装新款温柔风裙子秋季收可盐可甜连衣裙女装秋装新款温柔风裙子秋季收',
          address: '上海市普陀区金沙江路 1518 弄'
        },
        {
          date: '2016-05-04',
          name: '可盐可甜连衣裙女装秋装新款温柔风裙子秋季收',
          address: '上海市普陀区金沙江路 1517 弄'
        },
        {
          date: '2016-05-01',
          name: '可盐可甜连衣裙女装秋装新款温柔风裙子秋季收',
          address: '上海市普陀区金沙江路 1519 弄'
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }
      ]
    };
  },
  filters: {
    capitalize: function (value) {
      if (value.length >= 32) {
        return value.slice(0, 29) + '...';
      } else {
        return value;
      }
    }
  },
  methods: {
    formatter(row, column) {
      return row.address;
    }
  }
};
</script>
<style lang="less" scoped="true">
@import '../../task.less';
</style>
