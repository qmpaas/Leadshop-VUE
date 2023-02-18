<template>
  <el-dialog :visible.sync="showDialog" title="选择商品添加评价" width="759px" top="10vh" :modal-append-to-body="true">
    <el-input
      clearable @clear="getList"
      @keydown.enter.native="getList"
      v-model="search"
      placeholder="请输入商品名称搜索"
      class="le-input--380">
      <el-button slot="append" @click="getList" icon="el-icon-search"></el-button>
    </el-input>
    <el-table
      width="680px"
      height="408px"
      @selection-change="selectionChange"
      row-key="id"
      :data="list"
      cell-class-name="le-cell-table"
    >
      <el-table-column type="selection" :selectable="selecttable" :reserve-selection="true"
                       width="55"></el-table-column>
      <el-table-column label="商品">
        <div class="flex align-center" slot-scope="scope">
          <el-image class="le-image" :src="scope.row.slideshow | imageFilter"></el-image>
          <span class="flex-sub le-name">{{ scope.row.name }}</span>
        </div>
      </el-table-column>
      <el-table-column width="200px" label="商品价格">
        <template slot-scope="scope">
          <span class="le-price">￥{{ scope.row.price }}</span>
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
    <div slot="footer" class="le-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="submit"> 确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'choose-goods',
  props: {
    value: {
      type: Boolean
    },
    info: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      list: [],
      pagination: {
        current: 1,
        count: 1
      },
      selectList: [],
      select: [],
      search: ""
    };
  },
  computed: {
    showDialog: {
      get({value}) {
        return value;
      },
      set(value) {
        this.$emit('input', value);
      }
    }
  },
  methods: {
    submit() {
      const form = this.selectList.map(item => {
        return {
          goods_id: item.id
        };
      });
      this.$heshop
        .plugin(
          'post',
          {
            include: 'evaluate',
            model: 'goods'
          },
          {
            form: form
          }
        )
        .then(() => {
          this.showDialog = false;
          this.$emit('confirm');
        });
    },
    getList() {
      this.list = [];
      this.$heshop
        .search('post', {include: 'goods'}, {
          keyword: {
            search: this.search
          }
        })
        .page(this.pagination.current, 5)
        .then(response => {
          const {headers, data} = response;
          this.list = data;
          this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
        })
        .catch(() => {
        });
    },
    selectionChange(val) {
      this.selectList = val;
    },
    getSelect() {
      this.$heshop
        .plugin('get', {
          include: 'evaluate',
          model: 'goods',
          behavior: 'goods_list'
        }).then(response => {
        this.select = response;
      })
    },
    selecttable(row) {
      const item = this.select.findIndex((item) => {
        return item === row.id;
      });
      return item <= -1;
    }
  },
  async mounted() {
    await this.getSelect();
    this.getList();
  },
  filters: {
    imageFilter(img) {
      return img[0];
    }
  }
};
</script>

<style scoped lang="less">
@import './../../index.less';

.le-image {
  width: 48px;
  height: 48px;
}

.le-name {
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #262626;
  margin-left: 12px;
}

.le-pagination {
  margin-top: 24px;
}

/deep/ .le-cell-table {
  height: 72px;
}

.le-input--380 {
  width: 380px;
  margin-bottom: 24px;
  /deep/.el-input-group__append {
    padding: 0 10px;
  }
}
</style>
