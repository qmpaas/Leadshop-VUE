<template>
  <div class="pk">
    <el-table class="pk-content__goods" :data="this.value.goods" style="width: 400px" max-height="326">
      <el-table-column label="商品" width="300">
        <template slot-scope="scope">
          <div class="flex align-center justify-center" style="margin-left: -5px !important">
            <el-image class="goods__pic flex-shrink-0" :src="scope.row.goods.goods_image"></el-image>
            <div class="goods__info flex-grow-1 flex justify-center flex-direction">
              <div class="goods__info__top">{{ scope.row.goods.goods_name }}</div>
              <div class="goods__info__down">这里没有数据</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :data="this.value.goods" label="发货数量">
        <template slot-scope="scope">
          <div>{{ scope.row.bag_goods_number }}</div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object
    }
  }
};
</script>

<style scoped lang="scss">
.pk-content__goods {
  max-height: 368px;
  // /deep/ .cell {
  //   padding-left: 0px !important;
  // }
  .goods__pic {
    width: 48px;
    height: 48px;
  }
  .goods__info {
    margin-left: 10px;
    &__top {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
    }
    &__down {
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #595959;
      opacity: 0.65;
    }
  }
}
</style>
