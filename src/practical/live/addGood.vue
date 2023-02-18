<template>
  <div class="le-main">
    <el-form class="le-card" label-width="200px" v-loading="loading">
      <div class="le-card--header flex align-center">
        <span class="le-sign"></span>
        <span>直播商品</span>
      </div>
      <el-form-item label="直播间信息">
        <div class="le-goods flex">
          <img :src="form.feeds_img_base64" alt="" width="64px" height="64px" />
          <div class="le-goods--info flex-sub">
            <div class="le-goods--name">{{ form.name }}</div>
            <div class="le-goods-assist">
              房间号：{{ form.room_id }}<br />
              主播：{{ form.anchor_name }}
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="添加商品">
        <el-button @click="getGoods" type="primary" plain class="le-selectProduct--btn">选择商品</el-button>
        <goods-select ref="goodsSelect" :is-tips="false" :select-style="{ backgroundColor: '#ffffff' }" v-model="goods">
        </goods-select>
        <el-table class="le-table" :data="goods" max-height="368px" row-class-name="le-table-row">
          <el-table-column label="商品">
            <div slot-scope="scope" class="flex align-center">
              <el-image class="le-image" :src="scope.row.cover_img_base64">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div>
                {{ scope.row.name }}
              </div>
            </div>
          </el-table-column>
          <el-table-column label="操作" width="100px">
            <template slot-scope="scope">
              <el-button type="text" @click="removeGood(scope.$index)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <div class="le-cardpin">
      <el-button type="primary" :loading="loading" @click="submit">保存</el-button>
    </div>
  </div>
</template>

<script>
import goodsSelect from './components/goodsSelet/select.vue';

export default {
  name: 'addGood',
  components: {
    goodsSelect
  },
  data() {
    return {
      form: {
        feeds_img_base64: '',
        goods: []
      },
      goods: [],
      old_goods_list: [],
      loading: false
    };
  },
  mounted() {
    let storage = localStorage.getItem('addGoods');
    if (storage) {
      storage = JSON.parse(storage);
      this.form.feeds_img_base64 = storage.feeds_img_base64;
      this.form.anchor_name = storage.anchor_name;
      this.form.room_id = storage.room_id;
      this.form.name = storage.name;
      this.goods = storage.goods;
      this.old_goods_list = JSON.parse(JSON.stringify(storage.goods));
    }
  },
  methods: {
    // 打开商品表
    getGoods: function () {
      this.$refs.goodsSelect.open();
    },
    // 移除商品
    removeGood(index) {
      this.$delete(this.goods, index);
    },
    // 提交保存
    submit() {
      if (this.goods.length === 0) {
        this.$message.error('商品不能为空');
        return;
      }
      this.loading = true;
      this.$heshop
        .live(
          'post',
          {
            behavior: 'add'
          },
          {
            room_id: this.form.room_id,
            goods_list: this.goods,
            old_goods_list: this.old_goods_list
          }
        )
        .then(() => {
          this.loading = false;
          this.$router.back();
          localStorage.removeItem('addGoods');
        })
        .catch(error => {
          this.loading = false;
          this.$message.error(error.data.message);
        });
    }
  }
};
</script>

<style lang="less" scoped="true">
@import './../index.less';

.le-cardpin {
  z-index: 2001;
}

.le-goods {
  width: 373px;
  height: 80px;
  padding: 8px;
  border: 1px solid #dcdfe6;
  border-radius: 8px;
}

.le-goods--info {
  margin-left: 12px;
  font-family: Microsoft YaHei;
  font-weight: 400;
}

.le-goods--name {
  font-size: 14px;
  color: #262626;
  line-height: 20px;
  margin: 4px 0;
  font-weight: 400;
  font-family: Microsoft YaHei;
}

.le-goods-assist {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 16px;
  font-weight: 400;
  font-family: Microsoft YaHei;
}

.le-selectProduct--btn {
  background: #ffffff;
}

.goods-selet {
  display: none;
  opacity: 0;
}

.le-table ::v-deep {
  width: 580px;
  margin-top: 16px;
  border-radius: 4px;

  .le-table-row {
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

  .el-button {
    padding: 9px 0;
  }
}
</style>
