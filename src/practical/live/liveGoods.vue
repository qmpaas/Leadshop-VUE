<template>
  <div>
    <el-button type="primary" @click="routerAddLiveGood">添加直播商品</el-button>
    <el-tabs type="card" class="le-tabs" @tab-click="goodsTabSwitch" v-model="form.status">
      <el-tab-pane
        v-for="(item, index) in [
          { label: '审核中', status: '1' },
          { label: '审核通过', status: '2' },
          { label: '审核未通过', status: '3' }
        ]"
        :key="index"
        :label="item.label"
        :name="item.status"
      >
        <liveGoodsTable v-model="list" :page.sync="page" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import liveGoodsTable from './components/liveGoodsTable';

export default {
  name: 'liveGoods',
  components: {
    liveGoodsTable
  },
  data() {
    return {
      form: {
        limit: 10,
        status: '1'
      },
      list: [],
      page: {
        page: 1,
        count: 1
      }
    };
  },
  mounted() {
    this.getGoodsList();
  },
  methods: {
    getGoodsList() {
      const form = JSON.parse(JSON.stringify(this.form));
      form.status = +form.status;
      form.page = this.page.page;
      this.$heshop
        .livegoods('get', form)
        .then(response => {
          this.list = response.list;
        })
        .catch(error => {
          this.$message.error(error.data.message);
        });
    },
    // 切换商品tab
    goodsTabSwitch() {
      this.list = [];
      this.getGoodsList();
    },
    routerAddLiveGood() {
      this.$router.push('/practical/live/addLiveGood');
    }
  }
};
</script>

<style lang="less" scoped="true">
@import './../index.less';

.le-tabs {
  margin-top: 24px;
}

.le-main .le-tabs ::v-deep.el-tabs__content {
  padding-top: 24px;
}
</style>
