<!--
 * @Description:
 * @Author: fjt
 * @Date: 2021-05-24 14:09:07
 * @LastEditTime: 2021-06-05 17:06:06
 * @LastEditors: fjt
-->
<template>
  <div>
    <el-table :data="list" class="le-table" row-class-name="le-table-row" v-loading="loading">
      <el-table-column label="商品描述/商品分类" min-width="404">
        <template slot-scope="scope">
          <div class="flex">
            <el-image style="width: 64px; height: 64px; flex-shrink: 0" :src="scope.row.cover" fit="cover">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i></div
            ></el-image>
            <div class="le-table-goods flex-twice">
              <div class="le-table-goodsName he-line-2">
                {{ scope.row.name }}
              </div>
              <div class="le-table-goodsAttr he-line-1">分类：{{ scope.row.group_text | getGroup }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="来源平台" min-width="212">
        <template slot-scope="scope">
          {{ scope.row.type | platform }}
        </template>
      </el-table-column>
      <el-table-column label="采集状态" min-width="212">
        <template slot-scope="scope">
          <el-tag effect="plain" size="medium" type="success" v-if="scope.row.status === 1"> 采集成功 </el-tag>
          <el-tag effect="plain" size="medium" type="danger" v-else-if="scope.row.status === 0"> 采集失败 </el-tag>
          <el-tag effect="plain" size="medium" type="danger" v-else-if="scope.row.status === 2">
            兼容规格出错，采集失败
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="采集时间" min-width="264">
        <template slot-scope="scope">
          {{ scope.row.created_time | timeFormat('yyyy.mm.dd hh:MM:ss') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" min-width="160" class="">
        <template slot-scope="scope">
          <div class="flex align-center">
            <el-button class="le-table-operating" type="text" @click="delItem(scope.row.id, scope.$index)"
              >删除</el-button
            >
            <template v-if="scope.row.goods_id !== 0">
              <span class="he-btn__span"></span>
              <el-button class="le-table-operating" type="text" @click="router(scope.row)">编辑</el-button>
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="le-pagination flex justify-end">
      <el-pagination
        :disabled="loading"
        @current-change="pageChange"
        :current-page="pagination.current"
        :page-count="pagination.count"
        background
        layout="prev, pager, next, jumper"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array
    },
    pagination: {
      type: Object
    },
    loading: {
      type: Boolean
    }
  },
  methods: {
    pageChange: function (e) {
      this.$emit('page', e);
    },
    router: function (row) {
      const newRouter = this.$router.resolve({
        path: '/goods/create-goods',
        query: {
          id: row.goods_id
        }
      });
      window.open(newRouter.href, '_blank');
    },
    delItem: function (id, index) {
      let _this = this;
      this.$confirm('是否确认删除此条采集记录？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(function () {
          _this.$heshop
            .collect('delete', id)
            .then(function () {
              _this.$delete(_this.list, index);
              _this.$message.success('删除成功');
            })
            .catch(function (error) {
              _this.$message.error(error.data.message);
            });
        })
        .catch(function () {});
    }
  },
  filters: {
    platform: function (type) {
      switch (type) {
        case 1:
          return '阿里巴巴';
        case 2:
          return '淘宝';
        case 3:
          return '京东';
        case 4:
          return '拼多多';
        case 5:
          return '天猫';
      }
    },
    getGroup: function (group) {
      let str = '';
      if (!group) return '';
      group.forEach(item => {
        str += item + '  ';
      });
      str = str.slice(0, str.length - 2);
      return str;
    }
  }
};
</script>

<style lang="scss" scoped>
.le-table /deep/ {
  .le-table-row {
    height: 88px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
  }
  .le-table-goods {
    margin-left: 12px;
  }
  .le-table-goodsName {
    height: 36px;
    line-height: 18px;
  }
  .le-table-goodsAttr {
    height: 28px;
    color: #8c8c8c;
  }
  .le-table-operating.el-button--text {
    padding: 9px 5px;
  }
  .he-btn__span {
    display: inline-block;
    height: 12px;
    width: 1px;
    background-color: #623ceb;
    margin: 0 8px;
  }
}
.le-pagination {
  padding-top: 18px;
}
</style>
