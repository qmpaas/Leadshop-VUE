<template>
  <el-dialog :visible.sync="showDialog" title="选择评价库" width="432px" top="20vh">
    <div class="le-box">
      <div class="le-box-search">
        <el-input
          v-model="name"
          @keydown.enter.native="getList"
          @clear="getList" clearable style="width: 100%;"
                  placeholder="输入评价库名称搜索">
          <el-button slot="append" icon="el-icon-search" @click="getList"></el-button>
        </el-input>
      </div>
      <el-scrollbar class="le-box-list">
        <el-radio-group v-model="group" class="le-group">
          <el-radio class="le-group-item" v-for="(item, index) in list" :key="index" :label="item">{{
              item.name
            }}
          </el-radio>
        </el-radio-group>
      </el-scrollbar>
    </div>
    <div slot="footer" class="le-footer">
      <el-button @click="showDialog = false">取消</el-button>
      <el-button type="primary" @click="submit"> 确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "choose-library",
  props: {
    value: {
      type: Boolean
    },
    info: {
      type: Object
    }
  },
  data() {
    return {
      list: [],
      group: "",
      name: ""
    }
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
      this.$emit("confirm", this.group);
      this.showDialog = false;
    },
    getList() {
      this.$heshop.plugin("get", {
        include: "evaluate",
        model: "repository",
        name: this.name
      }).page(1, 30).then((response) => {
        this.list = response.data;
      });
    }
  },
  mounted() {
    this.getList();
  }
}
</script>

<style scoped lang="less">
.le {
  &-box {
    width: 100%;
    height: 260px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;

    &-search {
      height: 63px;
      width: 100%;
      padding: 15px;
    }

    &-list {
      height: 197px;

      .le-group {
        .le-group-item {
          line-height: 40px;
          display: block;
          padding-left: 15px;
        }
      }
    }
  }
}
</style>
