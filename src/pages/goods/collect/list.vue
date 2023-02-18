<template>
  <div class="le-master">
    <div class="le-header le-card">
      <el-form inline label-width="110px">
        <el-form-item label="商品搜索" class="le-goods-search">
          <el-input
            placeholder="输入商品名称搜索"
            v-model="form.name"
            clearable
            @clear="searchTabs"
            @keydown.enter.native="searchTabs"
          ></el-input>
        </el-form-item>
        <el-form-item label="来源平台" class="le-platform-search">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="采集时间" class="le-time-search">
          <el-date-picker type="datetime" value-format="timestamp" v-model="form.begin_time" placeholder="开始时间">
          </el-date-picker>
          <span class="le-timego-search">至</span>
          <el-date-picker type="datetime" value-format="timestamp" v-model="form.end_time" placeholder="结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="le-button-search">
        <el-button type="primary" @click="searchTabs">筛选</el-button>
        <el-button @click="empty">清空</el-button>
      </div>
    </div>
    <el-tabs type="card" v-model="form.status" class="le-tabs" @tab-click="searchTabs">
      <el-tab-pane label="全部" name="all">
        <listTable :list="list" :pagination="pagination" :loading="loading" @page="getList" />
      </el-tab-pane>
      <el-tab-pane label="采集成功" name="success">
        <listTable :list="list" :pagination="pagination" :loading="loading" @page="getList" />
      </el-tab-pane>
      <el-tab-pane label="采集失败" name="error">
        <listTable :list="list" :pagination="pagination" :loading="loading" @page="getList" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import listTable from './components/list-table.vue';

export default {
  components: {
    listTable
  },
  data() {
    return {
      options: [
        {
          label: '全部',
          value: null
        },
        {
          label: '阿里巴巴',
          value: 1
        },
        {
          label: '淘宝',
          value: 2
        },
        {
          label: '京东',
          value: 3
        },
        {
          label: '拼多多',
          value: 4
        },
        {
          label: '天猫',
          value: 5
        }
      ],
      value: 0,
      form: {
        begin_time: null,
        end_time: null,
        type: null,
        name: '',
        status: 'all'
      },
      pagination: {
        current: 1,
        count: 1
      },
      list: [],
      loading: true
    };
  },
  methods: {
    getList: function (current, form = {}) {
      let _this = this;
      this.loading = true;
      this.$heshop
        .collect('get', form)
        .page(current, 10)
        .then(function (response) {
          let { headers, data } = response;
          _this.pagination = {
            current: +headers['x-pagination-current-page'],
            count: +headers['x-pagination-page-count']
          };
          _this.list = data;
          _this.loading = false;
        })
        .catch(error => {
          _this.$message.error(error.data.message);
        });
    },
    empty: function () {
      this.form = {
        begin_time: null,
        end_time: null,
        type: null,
        name: '',
        status: 'all'
      };
      this.getList(1);
    },
    searchTabs: function () {
      let data = JSON.parse(JSON.stringify(this.form));
      if (data.begin_time) {
        data.begin_time = data.begin_time + '';
        data.begin_time = parseInt(data.begin_time.substring(0, data.begin_time.length - 3));
      }
      if (data.end_time) {
        data.end_time = data.end_time + '';
        data.end_time = parseInt(data.end_time.substring(0, data.end_time.length - 3));
      }
      if (data.status === 'all') {
        data.status = null;
      } else if (data.status === 'success') {
        data.status = 1;
      } else if (data.status === 'error') {
        data.status = 0;
      }
      for (let key in data) {
        if (!data[key] && data[key] !== 0) delete data[key];
      }
      this.getList(1, data);
    }
  },
  mounted() {
    this.getList(1);
  }
};
</script>

<style scoped lang="scss">
.le-card {
  background: #ffffff;
  border-radius: 16px;
}
.le-header {
  padding: 24px;
  .le-goods-search /deep/ {
    .el-input {
      width: 240px;
    }
  }
  .le-platform-search /deep/ {
    .el-select .el-input {
      width: 160px;
    }
  }
  .le-time-search /deep/ {
    .el-date-editor.el-input {
      width: 200px;
    }
    .el-input__inner {
      padding-left: 40px;
    }
    .le-timego-search {
      padding: 0 18px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
  }
  .le-button-search {
    padding-left: 110px;
  }
}

.le-tabs /deep/ {
  margin-top: 24px;
  .el-tabs__content {
    padding: 24px;
  }
}
</style>
