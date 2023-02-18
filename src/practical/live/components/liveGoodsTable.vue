<template>
  <div class="le-main">
    <el-table class="le-table" :data="value" row-class-name="le-table--row">
      <el-table-column label="商品">
        <div slot-scope="scope" class="flex align-center">
          <el-image class="le-image" :src="scope.row.coverImgUrlBase64">
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline"></i>
            </div>
          </el-image>
          <div>
            {{ scope.row.name }}
          </div>
        </div>
      </el-table-column>
      <el-table-column label="商品价格">
        <template slot-scope="scope">
          <div class="le-price">
            {{
              scope.row.priceType === 1
                ? '一口价'
                : scope.row.priceType === 2
                ? '价格区间'
                : scope.row.priceType === 3
                ? '折扣价'
                : ''
            }}
          </div>
          <div>
            <span>
              {{
                scope.row.priceType === 2
                  ? `${scope.row.price}-￥${scope.row.price2}`
                  : scope.row.priceType === 1
                  ? scope.row.price
                  : scope.row.priceType === 3
                  ? scope.row.price2
                  : ''
              }}
            </span>
            <span v-if="scope.row.priceType === 3">￥{{ scope.row.price }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="小程序路径" prop="url"></el-table-column>
      <el-table-column label="操作">
        <div slot-scope="scope" class="le-operating flex align-center">
          <template v-if="parentComponentName === '3'">
            <el-button type="text" @click="submitReview(scope.row.goodsId, scope.$index)">提交审核</el-button>
            <span class="le-line"></span>
          </template>
          <template v-if="parentComponentName !== '1' && scope.row.is_show !== 0">
            <el-button type="text" @click="editLiveGood(scope.row)">编辑</el-button>
            <span class="le-line"></span>
          </template>
          <el-button type="text" @click="deleteGood(scope.row.goodsId, scope.$index)">删除</el-button>
        </div>
      </el-table-column>
    </el-table>
    <div class="flex le-pagination justify-end">
      <el-pagination background :current-page="page.page" :page-count="page.count" layout="prev, pager, next, jumper">
      </el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'liveGoodsTable',
  props: {
    value: {
      type: Array
    },
    page: {
      type: Object
    }
  },
  computed: {
    parentComponentName() {
      return this.$parent.name;
    }
  },
  methods: {
    // 提交审核
    submitReview(goodsId, index) {
      this.$confirm('是否确认提交审核', {
        customClass: 'le-submit-review'
      })
        .then(() => {
          this.$heshop
            .livegoods(
              'post',
              {
                behavior: 'submit'
              },
              {
                goods_id: goodsId
              }
            )
            .then(() => {
              this.$delete(this.value, index);
              this.$message.success('提交成功');
            })
            .catch(error => {
              this.$message.error(error.data.message);
            });
        })
        .catch(() => {
          // Don't do
        });
    },
    // 删除商品
    deleteGood(goodsId, index) {
      this.$confirm('直播商品删除请谨慎操作，确定删除？', {})
        .then(() => {
          this.$heshop
            .livegoods(
              'post',
              {
                behavior: 'delete'
              },
              {
                goods_id: goodsId
              }
            )
            .then(() => {
              this.$delete(this.value, index);
              this.$message.success('删除成功');
            })
            .catch(error => {
              this.$message.error(error.data.message);
            });
        })
        .catch(() => {
          // Don't do
        });
    },
    // 编辑商品
    editLiveGood(good) {
      localStorage.setItem(
        'editLiveGood',
        JSON.stringify({
          ...good
        })
      );
      this.$router.push({
        path: '/practical/live/addLiveGood',
        query: {
          goodsId: good.goodsId,
          status: this.parentComponentName
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.le-table ::v-deep {
  .le-table--row {
    height: 72px;
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #262626;
  }

  .le-image {
    width: 48px;
    height: 48px;
    margin-right: 12px;
  }

  .le-price {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #bfbfbf;
  }

  .le-operating {
    .el-button {
      padding: 9px 0;
    }

    .le-line {
      display: inline-block;
      background: #623ceb;
      width: 1px;
      height: 12px;
      margin: 0 10px;
    }
  }
}

.le-pagination {
  margin-top: 15px;
}
</style>

<style lang="less">
.le-submit-review /deep/ {
  .el-message-box__message {
    text-align: center;
  }
}
</style>
